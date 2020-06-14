
export async function getMail() {
  /*let provider = (window as any).mgt.Providers.globalProvider;

  if (provider) {
    let graphClient = provider.graph.client;
    let mail = await graphClient.api('/me/messages').middlewareOptions((window as any).mgt.prepScopes('mail.read')).get();
    console.log(mail.value);

    return mail.value;
  }*/

  const token = localStorage.getItem('token');

  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers
  };
  const graphEndpoint = "https://graph.microsoft.com/beta/me/messages";
  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  return data.value;
}

export async function getAnEmail(id: string) {
  /*let provider = (window as any).mgt.Providers.globalProvider;

  if (provider) {
    let graphClient = provider.graph.client;
    let mail = await graphClient.api(`/me/messages/${id}`).middlewareOptions((window as any).mgt.prepScopes('mail.read')).get();
    console.log(mail.value);

    return mail;
  }*/

  const token = localStorage.getItem('token');

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