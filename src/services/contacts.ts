import { getToken } from "../services/auth";

export async function getPeople() {
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
  const graphEndpoint = "https://graph.microsoft.com/beta/me/contacts?$top=100";

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

// get profile photo of a contact
export async function getPhoto(id: string) {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/contacts/${id}/profilePhoto/$value`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.blob();

  console.log("photo", data);

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

// function to search contacts from microsoft graph api
export async function searchContacts(term: string) {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };
  const graphEndpoint = `https://graph.microsoft.com/beta/me/contacts?$search=${term}`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log("contacts", data.value);

  return data.value;
}

// function to add contact to microsoft graph api
export async function addContact(contact: any) {
  const token = await getToken();
  console.log("token", token);

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(contact),
  };
  const graphEndpoint = `https://graph.microsoft.com/v1.0/me/contacts`;

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  console.log("contact", data);

  return data;
}