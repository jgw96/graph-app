import * as msal from "@azure/msal-browser";
import { set } from "idb-keyval";

const msalConfig = {
    auth: {
        clientId: '2d508361-d68e-4da6-8ef1-e36bd3404d57',
        scopes: ['user.read', 'people.read', 'mail.read', 'mail.send']
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
(window as any).msalInstance = msalInstance;

msalInstance.handleRedirectPromise().then(async (tokenResponse: any) => {
    // Check if the tokenResponse is null
    // If the tokenResponse !== null, then you are coming back from a successful authentication redirect. 
    // If the tokenResponse === null, you are not coming back from an auth redirect.

    if (tokenResponse !== null) {
        console.log(tokenResponse);

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
        await msalInstance.loginRedirect({
            scopes: ['user.read', 'people.read', 'mail.read', 'mail.send']
        });
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
                scopes: ['user.read', 'people.read', 'mail.read', 'mail.send'],
                account: currentAccount,
                forceRefresh: false
            };

            let request: any = null;

            if (currentAccount) {
                request = {
                    scopes: ['user.read', 'people.read', 'mail.read', 'mail.send'],
                    loginHint: currentAccount.username, // For v1 endpoints, use upn from idToken claims
                };
            }

            if (silentRequest) {
                msalInstance.acquireTokenSilent(silentRequest).then((tokenResponse: any) => {
                    // Do something with the tokenResponse
                    console.log(tokenResponse);
                    resolve(tokenResponse.accessToken);
                }).catch(async (error: any) => {
                    console.error(error);
                    const tokenResponse: any = await msalInstance.acquireTokenRedirect(request)
                    resolve(tokenResponse.accessToken);
                });
            }
        }

    });
}