import { getToken } from "../services/auth";

export async function getRecentFiles() {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = "https://graph.microsoft.com/beta/me/drive/recent/";

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log("recent files", data);

  return data.value;
}

export async function downloadFile(id: string) {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/drive/items/${id}`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log("downloaded", data);

  return data;
}
