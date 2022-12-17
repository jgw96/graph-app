import { getToken } from "./auth";
import { getAnEmail } from "./mail";


export async function getConversation(id: string): Promise<any[]> {
  console.log("convo id", id);

  return new Promise(async (resolve) => {
    const graphEndpoint = `https://graph.microsoft.com/v1.0/me/messages?$filter= conversationId eq '${id}'`;

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
    const data = await response.json();

    // loop through data.value and get each email
    const emails = await Promise.all(data.value.map(async (email: any) => {
      return await getAnEmail(email.id);
    }));

    resolve(emails);
  });
}

