await import("https://unpkg.com/comlink/dist/umd/comlink.js");

const graphEndpoint = "https://graph.microsoft.com/beta/me/messages";

export const test2 = {
  async search(query) {
    const cache = await caches.open("offline-mail");
    const response = await cache.match(graphEndpoint);

    const data = await response.json();
    const mailToSearch = data.value;

    const result = mailToSearch.filter(
      (mail) =>
        mail.subject.toLowerCase().includes(query.toLowerCase()) ||
        mail.from.emailAddress.name
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        mail.bodyPreview.toLowerCase().includes(query.toLowerCase())
    );
    console.log("searchResult", result);

    if (result && result.length > 0) {
      return result;
    } else {
      return mailToSearch;
    }
  },
};

Comlink.expose(test2);
