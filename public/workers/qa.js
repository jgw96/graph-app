importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/qna");

let model = null;

tf.setBackend("cpu");

const test = {
  async load() {
    try {
      model = await qna.load();
      console.log("test", model);
    } catch (err) {
      console.error(err);
    }
  },

  async ask(question, content) {
    if (model && question && content) {
      const answers = await model.findAnswers(question, content);
      if (answers) {
        /*let readyToReturn = [];

        preds.forEach((pred) => {
          if (pred.results[0].match === true) {
            readyToReturn.push({
              label: pred.label
            })
          }
        })
        return readyToReturn;*/
        return answers;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
};

Comlink.expose(test);
