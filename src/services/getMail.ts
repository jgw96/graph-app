import { getToken } from "../services/auth";
import { doMailFetch, nextMail, currentMail, miniSearch, setNextMail, setCurrentMail } from "./mail";

export async function getMail(initLoad?: boolean) {
  console.log("getMail");

  if (initLoad) {
    const data = await doMailFetch();
    setNextMail(data["@odata.nextLink"]);

    setCurrentMail(data.value);

    try {
      miniSearch.addAllAsync(data.value);
    }
    catch (err) {
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

    const graphEndpoint = nextMail || "https://graph.microsoft.com/beta/me/messages";

    const response = await fetch(graphEndpoint, options);
    const data = await response.json();

    try {
      miniSearch.addAllAsync(data.value);
    }
    catch (err) {
      console.error(err);
    }

    console.log("mail data", data);

    setNextMail(data["@odata.nextLink"]);

    setCurrentMail([...currentMail, ...data.value]);

    // nextMail = data.  + '.@' + odata.nextLink;
    return data.value;
  }
}
