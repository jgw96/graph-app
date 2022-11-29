import { getToken } from "../services/auth";

import MiniSearch from 'minisearch';

let nextMail: any = null;
let folders: any[] | undefined = undefined;

let miniSearch = new MiniSearch({
  fields: ['subject', 'bodyPreview', 'from.emailAddress.name'], // fields to index for full-text search
  storeFields: ['subject', 'from.emailAddress.name'], // fields to return with search results
  extractField: (document, fieldName) => {
    // Access nested fields
    return fieldName.split('.').reduce((doc, key) => doc && doc[key], document)
  },
  searchOptions: {
    fuzzy: 0.2
  }
});

let potentialSearchOptions: any = {};

export async function setSearchFilterToTerm(term: string) {
  potentialSearchOptions.fields = [term];
}

// function to forward message
export async function forwardMessage(
  id: string,
  to: string,
  comment: string
) {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");
  const options = {
    method: "POST",
    headers: headers,

    body: JSON.stringify({
      message: {
        toRecipients: [
          {
            emailAddress: {
              address: to,
            },
          },
        ]
      },
      comment: comment
    }),
  }

  const graphEndpoint = `https://graph.microsoft.com/v1.0/me/messages/${id}/forward`;
  await fetch(graphEndpoint, options);


  return;
};


export async function unsub(id: number) {
  if (id) {
    const token = await getToken();

    const headers = new Headers();
    const bearer = "Bearer " + token;
    headers.append("Authorization", bearer);

    const options = {
      method: "POST",
      headers: headers,
    };
    const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${id}/unsubscribe`;

    try {
      await fetch(graphEndpoint, options);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  } else {
    return false;
  }
}

export async function doMailFetch() {
  const graphEndpoint = "https://graph.microsoft.com/beta/me/messages";

  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(graphEndpoint, options);
  const data = await response.body;

  // stream json with ReadableStream
  const reader = data!.getReader();
  const decoder = new TextDecoder("utf-8");
  let json = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (value) {
      json += decoder.decode(value, {stream: true});
    }
  }

  const parsed = JSON.parse(json);


  console.log("mail data", data);

  return parsed;
}

export async function getMail(initLoad?: boolean) {
  console.log("getMail");

  if (initLoad) {
    const data = await doMailFetch();
    nextMail = data["@odata.nextLink"];

    try {
      miniSearch.addAllAsync(data.value);
    }
    catch(err) {
      console.error(err);
    }

    return data.value;
  } else {
    const token = await getToken();
    console.log("token", token);

    const headers = new Headers();
    const bearer = "Bearer " + token;
    headers.append("Authorization", bearer);
    const options = {
      method: "GET",
      headers: headers,
    };

    const graphEndpoint =
      nextMail || "https://graph.microsoft.com/beta/me/messages";

    const response = await fetch(graphEndpoint, options);
    const data = await response.json();

    try {
      miniSearch.addAllAsync(data.value);
    }
    catch(err) {
      console.error(err);
    }

    console.log("mail data", data);

    nextMail = data["@odata.nextLink"];

    // nextMail = data.  + '.@' + odata.nextLink;

    return data.value;
  }
}

export async function getAnEmail(id: string) {
  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${id}`;

  try {
    const response = await fetch(graphEndpoint, options);
    const data = await response.json();

    console.log(data);

    return data;
  } catch (err) {
    throw new Error(`Could not load this email: ${err}`);
  }
}

export async function flagEmail(email: any) {
  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");

  const options = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({
      flag: {
        flagStatus: "flagged",
      },
    }),
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${email.id}`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log(data);

  return data;
}

export async function markAsRead(email: any) {
  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");

  const options = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({
      isRead: true,
    }),
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${email.id}`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log(data);

  return data;
}

export async function listAttach(id: string) {
  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${id}/attachments`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log(data);

  return data.value;
}

const processAttachments = async (attachments: any[]) => {
  return new Promise((resolve) => {
    let attachToSend: any[] = [];

    const attachment = attachments[0];

    console.log("attachment", attachment);

    if (
      (attachment && attachment.handle) ||
      (attachment && !attachment.sourceUrl)
    ) {
      console.log("in here");
      const reader = new FileReader();

      reader.readAsDataURL(attachments[0]);
      reader.onloadend = async () => {
        let base64String = (reader.result as string)?.replace(
          /^data:.+;base64,/,
          ""
        );

        let attachFile = {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: attachments[0].name || "attachment",
          contentType: attachments[0].type,
          contentBytes: base64String,
        };

        console.log("attachFile", attachFile);

        attachToSend.push(attachFile);

        resolve(attachToSend);
      };
    } else if (attachment && attachment.sourceUrl) {
      attachToSend.push(attachment);

      resolve(attachToSend);
    } else {
      resolve(null);
    }
  });
};

export async function reply(id: number, body: string, recipients: any[]) {
  let ourReply: any = null;

  ourReply = {
    message: {
      body: {
        contentType: "HTML",
        content: body,
      },
      toRecipients: recipients,
    },
  };

  if (ourReply) {
    const token = await getToken();

    const headers = new Headers();
    const bearer = "Bearer " + token;
    headers.append("Authorization", bearer);
    const options = {
      method: "POST",
      headers: {
        Authorization: bearer,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ourReply),
    };
    const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${id}/reply`;

    try {
      await fetch(graphEndpoint, options);
    } catch (err: any) {
      throw new Error(`error sending message: ${err.message}`);
    }
  }
}

export async function sendMail(
  subject: string,
  body: string,
  recipients: any[],
  attachments: File[]
) {
  let sendMail: any = null;

  if (attachments) {
    console.log("attachments", attachments);

    const stuffToSend = await processAttachments(attachments);

    console.log("stuffToSend", stuffToSend);

    if (stuffToSend) {
      sendMail = {
        message: {
          subject: subject,
          body: {
            contentType: "HTML",
            content: body,
          },
          toRecipients: recipients,
          attachments: stuffToSend,
        },
        saveToSentItems: "true",
      };
    } else {
      sendMail = {
        message: {
          subject: subject,
          body: {
            contentType: "HTML",
            content: body,
          },
          toRecipients: recipients,
        },
        saveToSentItems: "true",
      };
    }

    if (sendMail) {
      const token = await getToken();

      const headers = new Headers();
      const bearer = "Bearer " + token;
      headers.append("Authorization", bearer);
      const options = {
        method: "POST",
        headers: {
          Authorization: bearer,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendMail),
      };
      const graphEndpoint = "https://graph.microsoft.com/beta/me/sendMail";

      try {
        await fetch(graphEndpoint, options);
      } catch (err: any) {
        throw new Error(`error sending message: ${err.message}`);
      }
    }
  } else {
    sendMail = {
      message: {
        subject: subject,
        body: {
          contentType: "Text",
          content: body,
        },
        toRecipients: recipients,
      },
      saveToSentItems: "true",
    };

    if (sendMail) {
      const token = await getToken();

      const headers = new Headers();
      const bearer = "Bearer " + token;
      headers.append("Authorization", bearer);
      const options = {
        method: "POST",
        headers: {
          Authorization: bearer,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendMail),
      };
      const graphEndpoint = "https://graph.microsoft.com/beta/me/sendMail";

      try {
        await fetch(graphEndpoint, options);
      } catch (err) {
        console.error("error sending message", err);
      }
    }
  }
}

export async function saveDraft(
  subject: string,
  body: string,
  recipients: any[],
  attachments: File[]
) {
  let sendMail: any = null;

  if (attachments) {
    console.log("attachments", attachments);

    const stuffToSend = await processAttachments(attachments);

    console.log("stuffToSend", stuffToSend);

    if (stuffToSend) {
      sendMail = {
        subject: subject,
        body: {
          contentType: "HTML",
          content: body,
        },
        toRecipients: recipients,
        attachments: stuffToSend,
      };
    } else {
      sendMail = {
        subject: subject,
        body: {
          contentType: "HTML",
          content: body,
        },
        toRecipients: recipients,
      };
    }

    if (sendMail) {
      const token = await getToken();

      const headers = new Headers();
      const bearer = "Bearer " + token;
      headers.append("Authorization", bearer);
      const options = {
        method: "POST",
        headers: {
          Authorization: bearer,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendMail),
      };
      const graphEndpoint = "https://graph.microsoft.com/beta/me/messages";

      try {
        await fetch(graphEndpoint, options);
      } catch (err: any) {
        throw new Error(`error sending message: ${err.message}`);
      }
    }
  } else {
    sendMail = {
      subject: subject,
      body: {
        contentType: "HTML",
        content: body,
      },
      toRecipients: recipients,
    };

    if (sendMail) {
      const token = await getToken();

      const headers = new Headers();
      const bearer = "Bearer " + token;
      headers.append("Authorization", bearer);
      const options = {
        method: "POST",
        headers: {
          Authorization: bearer,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendMail),
      };
      const graphEndpoint = "https://graph.microsoft.com/beta/me/messages";

      try {
        await fetch(graphEndpoint, options);
      } catch (err) {
        console.error("error sending message", err);
      }
    }
  }
}

export async function downloadAttach(mail: any, attachment: any) {
  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);

  const fetchURL = `https://graph.microsoft.com/beta/me/messages/${mail.id}/attachments/${attachment.id}/$value`;

  const fetchRequest = new Request(fetchURL, {
    headers: headers,
  });

  const response = await fetch(fetchRequest);
  const blob = await response.blob();
  console.log(blob);

  if (blob) {
    return blob;
  } else {
    return null;
  }
}

export async function getMailFolders() {
  if (folders) {
    return folders;
  }

  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = "https://graph.microsoft.com/beta/me/mailFolders";

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  folders = data.value;

  return data.value;
}

export async function getMailFolder(id: string) {
  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/mailFolders/${id}/messages`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  return data.value;
}

export async function searchMailFullText(term: string) {
  return new Promise((resolve) => {
    let results = miniSearch.search(term);
    resolve(results)
  });
}
