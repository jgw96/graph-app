import { getToken } from "../services/auth";
export let folders: any[] | undefined = undefined;

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
