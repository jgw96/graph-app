import { getToken } from "../services/auth";

export async function getContacts() {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = "https://graph.microsoft.com/beta/me/people/";

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log("contacts", data);

  return data.value;
}

// function to get single person from microsoft graph api
export async function getPerson(id: string) {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/people/${id}`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log("person", data);

  return data;
}

// function to search people from microsoft graph api
export async function searchPeople(term: string) {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = `https://graph.microsoft.com/v1.0/me/people/?$search=${term}`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log("people", data.value);

  return data.value;
}

