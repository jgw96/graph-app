import { getToken } from "../services/auth";
// import { miniSearch } from "./mail";
import { nextMail, currentMail, setNextMail, setCurrentMail } from "./nextMail";

export async function doMailFetch() {
  const graphEndpoint = "https://graph.microsoft.com/beta/me/messages?$top=20";

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

export async function findUnread() {
  const unread = currentMail.filter((mail: any) => mail.isRead === false);
  return unread;
}

export async function getMail(initLoad?: boolean) {
  console.log("getMail");

  if (initLoad) {
    const data = await doMailFetch();
    setNextMail(data["@odata.nextLink"]);

    setCurrentMail(data.value);

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

    const graphEndpoint = nextMail || "https://graph.microsoft.com/beta/me/messages";

    const response = await fetch(graphEndpoint, options);
    const data = await response.json();

    console.log("mail data", data);

    setNextMail(data["@odata.nextLink"]);

    setCurrentMail([...currentMail, ...data.value]);

    return data.value;
  }
}
