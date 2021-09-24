import {
  LitElement,
  css,
  html
} from 'lit';
import { customElement, state } from 'lit/decorators';

import { getMailFolder, getMailFolders } from "../services/mail";

@customElement("mail-folders")
export class MailFolders extends LitElement {
  @state() folders: any[] | undefined;

  static get styles() {
    return css`
      #folder-list {
        max-height: 47vh;
        display: block;
        overflow-y: auto;
      }

      #folder-list::-webkit-scrollbar {
        width: 8px;
        background: #222222;
        border-radius: 4px;
      }

      fast-menu-item {
        background: rgb(34, 34, 34);
        margin-bottom: 8px;

        animation-name: slidein;
        animation-duration: 280ms;
      }

      fast-menu-item:active {
        background: var(--accent-fill-active);
      }

      fast-menu-item:hover {
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

      @media(prefers-color-scheme: dark) {
        fast-menu-item {
          background: rgba(75, 75, 75, 0.47);
        }
      }

      @media(prefers-color-scheme: light) {
        fast-menu-item {
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
    const folders = await getMailFolders();

    console.log("folders", folders);

    if (folders) {
      this.folders = folders;
    }
  }

  async openFolder(id: string) {
    console.log("folder", id);
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
                  <fast-menu-item @click="${() => this.openFolder(folder.id)}">
                    ${folder.displayName}
                  </fast-menu-item>
                `;
              })}
            `
          : html`<div id="loader">
            <fast-progress-ring></fast-progress-ring>
          </div>`}
      </div>
    `;
  }
}
