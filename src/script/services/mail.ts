
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

export async function sendMail(subject: string, body: string, recipients: any[]) {
  const sendMail = {
    message: {
      subject: subject,
      body: {
        contentType: "Text",
        content: body
      },
      toRecipients:
        recipients
      /*[
        {
          emailAddress: {
            address: "fannyd@contoso.onmicrosoft.com"
          }
        }
      ],
      ccRecipients: [
        {
          emailAddress: {
            address: "danas@contoso.onmicrosoft.com"
          }
        }
      ]*/
    },
    saveToSentItems: "true"
  };

  let provider = (window as any).mgt.Providers.globalProvider;

  if (provider) {
    let graphClient = provider.graph.client;

    let res = await graphClient.api('/me/sendMail').middlewareOptions((window as any).mgt.prepScopes('mail.send')).post(sendMail);

    return res;
  }
}