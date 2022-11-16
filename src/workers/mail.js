// @ts-check

let nextMail = null;
let mailCopy = null;
let mail = null;
let initLoad = null;

async function getSavedAndUpdate(token) {
  const mailCheck = sessionStorage.getItem("latestMail");

  if (mailCheck) {
    mailCopy = JSON.parse(mailCheck);
  } else {
    mailCopy = await getMail(true, token);
  }

  if (mailCopy && mailCopy.length > 0) {
    const mail = [...mailCopy];

    initLoad = false;

    console.log("mail", mail);

    sessionStorage.setItem("latestMail", JSON.stringify(mail));
  }

  return mail;
}

async function doMailFetch(token) {
  const graphEndpoint = "https://graph.microsoft.com/beta/me/messages";

  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  return data;
}

async function getMail(initLoad, token) {
  console.log("getMail");

  if (initLoad) {
    const data = await doMailFetch(token);
    return data.value;
  } else {
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

    // nextMail = data.  + '.@' + odata.nextLink;
    nextMail = data["@odata.nextLink"];

    return data.value;
  }
}
