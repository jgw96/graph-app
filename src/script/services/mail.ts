import { getToken } from '../services/auth';

let nextMail: any = null;

export async function getMail() {
  console.log('getMail')

  const token = await getToken();
  console.log('token', token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers
  };

  const graphEndpoint = nextMail || "https://graph.microsoft.com/beta/me/messages";

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log('mail', data);

  // nextMail = data.  + '.@' + odata.nextLink;
  nextMail = data['@odata.nextLink'];

  return data.value;

}

export async function getAnEmail(id: string) {
  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${id}`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log(data);

  return data;

}

export async function flagEmail(email: any) {
  const token = await getToken();

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');

  const options = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({
      flag: {
        flagStatus: "flagged"
      }
    })
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${email.id}`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log(data);

  return data;
}

const processAttachments = async (attachments: any[]) => {

  return new Promise((resolve) => {
    let attachToSend: any[] = [];

    const attachment = attachments[0];

    if (attachment) {
      const reader = new FileReader();

      reader.readAsDataURL(attachments[0]);
      reader.onloadend = async () => {
        let base64String = (reader.result as string)?.replace(/^data:.+;base64,/, '');

        let attachFile = {
          "@odata.type": "#microsoft.graph.fileAttachment",
          "name": attachments[0].name || "attachment",
          "contentType": attachments[0].type,
          "contentBytes": base64String
        };

        attachToSend.push(attachFile);

        resolve(attachToSend);

      }
    }
    else {
      resolve(null)
    }
  });
}

export async function reply(id: number, body: string, recipients: any[]) {
  let ourReply: any = null;

  ourReply = {
    "message": {
      "body": {
        "contentType": "HTML",
        "content": body
      },
      "toRecipients": recipients
    }
  }

  if (ourReply) {
    const token = await getToken();

    const headers = new Headers();
    const bearer = "Bearer " + token;
    headers.append("Authorization", bearer);
    const options = {
      method: "POST",
      headers: {
        'Authorization': bearer,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ourReply)
    };
    const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/${id}/reply`;

    try {
      await fetch(graphEndpoint, options);

    }
    catch (err) {
      throw new Error(`error sending message: ${err.message}`);
    }
  }


}

export async function sendMail(subject: string, body: string, recipients: any[], attachments: File[]) {
  let sendMail: any = null;

  if (attachments) {
    console.log('attachments', attachments);

    const stuffToSend = await processAttachments(attachments);

    console.log('stuffToSend', stuffToSend);

    if (stuffToSend) {
      sendMail = {
        "message": {
          "subject": subject,
          "body": {
            "contentType": "HTML",
            "content": body
          },
          "toRecipients": recipients,
          "attachments": stuffToSend
        },
        "saveToSentItems": "true"
      };
    }
    else {
      sendMail = {
        "message": {
          "subject": subject,
          "body": {
            "contentType": "Text",
            "content": body
          },
          "toRecipients": recipients
        },
        "saveToSentItems": "true"
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
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendMail)
      };
      const graphEndpoint = "https://graph.microsoft.com/beta/me/sendMail";

      try {
        await fetch(graphEndpoint, options);

      }
      catch (err) {
        throw new Error(`error sending message: ${err.message}`);
      }


    }
  }
  else {
    sendMail = {
      "message": {
        "subject": subject,
        "body": {
          "contentType": "Text",
          "content": body
        },
        "toRecipients":
          recipients
      },
      "saveToSentItems": "true"
    };

    if (sendMail) {
      const token = await getToken();

      const headers = new Headers();
      const bearer = "Bearer " + token;
      headers.append("Authorization", bearer);
      const options = {
        method: "POST",
        headers: {
          'Authorization': bearer,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendMail)
      };
      const graphEndpoint = "https://graph.microsoft.com/beta/me/sendMail";

      try {
        await fetch(graphEndpoint, options);
      }
      catch (err) {
        console.error("error sending message", err);
      }
    }
  }
}