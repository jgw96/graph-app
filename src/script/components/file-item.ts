import { LitElement, css, html, customElement, property } from "lit-element";

import { downloadFile } from "../services/files";

@customElement("file-item")
export class FileItem extends LitElement {
  @property({ type: Object }) file: any;

  static get styles() {
    return css`
      ul {
        padding: 0;
        margin: 0;
        overflow-y: scroll;
        height: 24em;
      }

      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 5px;
        padding: 0px;
      }

      fast-dialog::part(control) {
        padding-left: 1em;
        padding-right: 1em;
        padding-bottom: 1em;
        padding-top: 0em;
      }

      fast-dialog::part(overlay) {
        backdrop-filter: blur(10px);
      }

      div fast-button {
        height: 2em;
        border: solid 1px var(--app-color-primary);
        margin-bottom: 6px;
        background: var(--app-color-primary);
      }

      #filesHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1em;
      }

      #filesHeader #closeButton ion-icon {
        font-size: 2em;
      }
    `;
  }

  constructor() {
    super();
  }

  async download(id: string) {
    const file = await downloadFile(id);
    console.log(file);

    let event = new CustomEvent("got-file", {
      detail: {
        data: file,
      },
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div>
        <div id="fileInfo">
          <fast-anchor target="_blank" rel="noopener noreferrer" href="${this.file.webUrl}" appearance="hypertext">${this.file.name}</fast-anchor>
        </div>

        <fast-button
          @click="${() => this.download(this.file.id)}"
          >Attach</fast-button
        >
      </div>
    `;
  }
}
