import * as msal from "@azure/msal-browser";
import { set } from "idb-keyval";

const scopes = ['user.read', 'people.read', "Mail.ReadWrite", 'mail.send', "files.read"]

const msalConfig = {
  auth: {
    clientId: '2d508361-d68e-4da6-8ef1-e36bd3404d57',
    scopes,
    redirect_uri: "https://memosapp.app"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
(window as any).msalInstance = msalInstance;

msalInstance.handleRedirectPromise().then(async (tokenResponse: any) => {
  // Check if the tokenResponse is null
  // If the tokenResponse !== null, then you are coming back from a successful authentication redirect. 
  // If the tokenResponse === null, you are not coming back from an auth redirect.

  if (tokenResponse !== null) {
    console.log('redirect promise handled', tokenResponse);

    await set('graphToken', tokenResponse.accessToken);
    localStorage.setItem('graphToken', tokenResponse.accessToken);
  }
}).catch((error: Error) => {
  // handle error, either in the library or coming back from the server
  console.error(error);
});

export function getAccount() {
  const myAccounts = msalInstance.getAllAccounts();

  if (myAccounts && myAccounts[0]) {
    return myAccounts[0];
  }
  else {
    return null;
  }
}

export async function login() {
  try {
    const username = await getAccount()?.username;

    if (username) {
      const silentRequest: any = {
        scopes,
        loginHint: username,
        forceRefresh: false
      };

      console.log('init silent auth');

      await msalInstance.ssoSilent(silentRequest);
    }
    else {
      console.log("init login redirect")
      await msalInstance.loginRedirect({
        scopes
      });
    }
  } catch (err) {
    // handle error
    return err;
  }
}

export async function logout() {
  try {
    await msalInstance.logout();
  }
  catch (err) {
    console.error(err);
  }
}

export async function getToken() {
  return new Promise(async (resolve) => {
    const username = await getAccount()?.username;

    if (username) {
      const currentAccount = msalInstance.getAccountByUsername(username);
      console.log('current', currentAccount);
      const silentRequest: any = {
        scopes,
        account: currentAccount,
        forceRefresh: false
      };

      let request: any = null;

      if (currentAccount) {
        request = {
          scopes,
          loginHint: currentAccount.username, // For v1 endpoints, use upn from idToken claims
        };
      }

      if (silentRequest) {
        msalInstance.acquireTokenSilent(silentRequest).then((tokenResponse: any) => {
          console.log('did the silent request');
          // Do something with the tokenResponse
          console.log(tokenResponse);
          resolve(tokenResponse.accessToken);
        }).catch(async (error: any) => {
          console.error(error);
          console.log('could not do silent request');
          const tokenResponse: any = await msalInstance.acquireTokenRedirect(request)
          resolve(tokenResponse.accessToken);
        });
      }
    }

  });
}

export async function getPhoto() {
  const graphEndpoint = "https://graph.microsoft.com/beta/me/photo/$value";

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
  const data = await response.blob();
  console.log(data);

  return data;
}