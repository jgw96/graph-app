
export async function getMail() {
  let provider = (window as any).mgt.Providers.globalProvider;

  if (provider) {
    let graphClient = provider.graph.client;
    let mail = await graphClient.api('/me/messages').middlewareOptions((window as any).mgt.prepScopes('mail.read')).get();
    console.log(mail.value);

    return mail.value;
  }
}

export async function getAnEmail(id: string) {
  let provider = (window as any).mgt.Providers.globalProvider;

  if (provider) {
    let graphClient = provider.graph.client;
    let mail = await graphClient.api(`/me/messages/${id}`).middlewareOptions((window as any).mgt.prepScopes('mail.read')).get();
    console.log(mail.value);

    return mail;
  }
}