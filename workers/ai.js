importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity");

let model = null;

tf.setBackend('cpu');

const test = {
    async load() {
        try {
            model = await toxicity.load(0.9);
            console.log('test');
        }
        catch(err) {
            console.error(err);
        }
    },

    async testInput(text) {
        if (model && text) {
            const preds = await model.classify([text]);
            if (preds) {
                let readyToReturn = [];

                preds.forEach((pred) => {
                    if (pred.results[0].match === true) {
                        readyToReturn.push({
                            label: pred.label
                        })
                    }
                })
                return readyToReturn;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}

Comlink.expose(test);