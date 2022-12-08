export function askPermission(): Promise<any> {
    return new Promise((resolve, reject) => {
        const permissionResult = Notification.requestPermission((
            result
        ) => {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    }).then((permissionResult) => {
        if (permissionResult !== "granted") {
            throw new Error("We weren't granted permission.");
        }
    });
}

export async function subscribeToPush(): Promise<any> {
    const swRegistration = await navigator.serviceWorker.getRegistration();
    try {
        if (swRegistration) {
            const keyResponse = await fetch("https://mailgo-push-server.azurewebsites.net/vapidPublicKey");
            const keyData = await keyResponse.json();

            const sub = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(keyData.vapidPublicKey),
            });

            return sub;
        }
    }
    catch (err) {
        console.error(err);
    }
}

export async function unsubscribeFromPush(): Promise<any> {
    const swRegistration = await navigator.serviceWorker.getRegistration();
    try {
        if (swRegistration) {
            const subscription = await swRegistration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();

                // send unsubscribe request to the server
                await fetch("https://mailgo-push-server.azurewebsites.net/unsubscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(subscription),
                });

                return subscription;
            }
        }

        return swRegistration;
    }
    catch (err) {
        console.error(err);
    }
}

// send subscription to the server
export async function sendSubscriptionToServer(subscription: PushSubscription): Promise<any> {
    const response = await fetch("https://mailgo-push-server.azurewebsites.net/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
    });

    return response.json();
}

export async function getPushSubscription() {
    const swRegistration = await navigator.serviceWorker.getRegistration();
    try {
        if (swRegistration) {
            const subscription = await swRegistration.pushManager.getSubscription();
            return subscription;
        }
        else {
            return null;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

function urlBase64ToUint8Array(key: string) {
    const padding = "=".repeat((4 - key.length % 4) % 4);
    const base64 = (key + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}