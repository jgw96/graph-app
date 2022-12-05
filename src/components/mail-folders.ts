import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement("mail-folders")
export class MailFolders extends LitElement {
  @state() folders: any[] | undefined;

  static get styles() {
    return css`
      #folder-list {
        max-height: 47vh;
        display: block;
        overflow-y: auto;

        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      #folder-list::-webkit-scrollbar {
        width: 8px;
        background: #222222;
        border-radius: 4px;

      }

      sl-menu-item {
        background: rgb(34, 34, 34);
        margin-bottom: 8px;

        animation-name: slidein;
        animation-duration: 280ms;
      }

      sl-menu-item:active {
        background: var(--accent-fill-active);
      }

      sl-menu-item:hover {
        background: var(--accent-fill-active);
      }

      h3 {
        margin-top: 0;
      }

      #loader {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @media (prefers-color-scheme: dark) {
        sl-menu-item {
          background: rgba(75, 75, 75, 0.47);
        }
      }

      @media (prefers-color-scheme: light) {
        sl-menu-item {
          background: rgb(254 254 254);
          color: black;
        }
      }

      @keyframes slidein {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    window.requestIdleCallback(async () => {
      const { getMailFolders } = await import("../services/getMailFolders");
      const folders = await getMailFolders();

      console.log("folders", folders);

      if (folders) {
        this.folders = folders;
      }
    }, {
      timeout: 3000
    })
  }

  async openFolder(id: string) {
    console.log("folder", id);
    const { getMailFolder } = await import("../services/getMailFolders");
    const mail = await getMailFolder(id);
    console.log("mail", mail);

    let event = new CustomEvent("folder-mail", {
      detail: {
        mail: mail,
      },
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <h3>Folders</h3>

      <div id="folder-list">
        ${this.folders && this.folders.length > 0
          ? html`
              ${this.folders.map((folder) => {
                return html`
                  <sl-button @click="${() => this.openFolder(folder.id)}">
                    ${folder.displayName}
                  </sl-button>
                `;
              })}
            `
          : html`<div id="loader">
              <sl-progress-ring></sl-progress-ring>
            </div>`}
      </div>
    `;
  }
}
