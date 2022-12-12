await import("https://unpkg.com/comlink/dist/umd/comlink.js");
const { get } = await import ("https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm");

const graphEndpoint = "https://graph.microsoft.com/beta/me/messages";

export const test2 = {
  async search(query) {
    const cache = await caches.open("offline-mail");
    //const response = await cache.match(graphEndpoint);

    //const data = await response.json();
    // const keys = await cache.keys();
    // const key = keys[0];
    // const response = await cache.match(key);

    // // local cached email
    // const mailToSearch = await response.json();

    const token = await get("graphToken");

    // https://graph.microsoft.com/v1.0/me/messages?search="dave"
    const response2 = await fetch(`${graphEndpoint}?search="${query}"`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data2 = await response2.json();
    console.log("data2", data2);
    const result = data2.value;
    console.log("searchResult", result);

    if (result && result.length > 0) {
      return result;
    } else {
      return mailToSearch;
    }
  },
};

Comlink.expose(test2);
