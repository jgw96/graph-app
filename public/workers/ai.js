importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity");

let model = null;

tf.setBackend("cpu");

const test = {
  async load() {
    try {
      model = await toxicity.load(0.9);
      console.log("test");
    } catch (err) {
      console.error(err);
    }
  },

  async testInput(text) {
    console.log("text", text);
    if (model && text) {
      const preds = await model.classify([text]);
      if (preds) {
        let readyToReturn = [];

        preds.forEach((pred) => {
          if (pred.results[0].match === true) {
            let message = this.figureOutMessage(pred);
            readyToReturn.push({
              label: pred.label,
              message
            })
          }
        });
        return readyToReturn;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },

  figureOutMessage(pred) {
    let message = null;
    switch (pred.label) {
      case "identity_attack":
        message = "Your email may contain identity insults. An identity identity insult is a comment that attacks a person's identity, rather than their actions or statements. Please review your email.";
        break;
      case "insult":
        message = "Your email may contain insults. Please be respectful.";
        break;
      case "obscene":
        message = "Your email may contain obscenities. Please use language that is appropriate for the context.";
        break;
      case "severe_toxicity":
        message = "Your email may contain severe toxicity. Please be respectful.";
        break;
      case "sexual_explicit":
        message = "Your email may contain sexually explicit content.";
        break;
      case "threat":
        message = "Your email may contain threats. Threats are almost never ok. Please review your email.";
        break;
      case "toxicity":
        message = "Your email may contain toxicity. Please be respectful. Toxicity is the rude, disrespectful, or unreasonable behavior that is likely to make people leave a discussion.";
        break;
      default:
        break;
    }
    return message;
  }
};

Comlink.expose(test);

