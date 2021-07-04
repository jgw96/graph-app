import {
  LitElement,
  css,
  html,
  customElement,
  internalProperty,
} from "lit-element";
import { getMailFolder, getMailFolders } from "../services/mail";

@customElement("mail-folders")
export class MailFolders extends LitElement {
  @internalProperty() folders: any[] | undefined;

  static get styles() {
    return css`
      :host {
        max-height: 57vh;
        display: block;
        overflow-y: scroll;
      }
      
      fast-menu-item {
        background: rgb(34, 34, 34);
        margin-bottom: 8px;
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
        : null}
    `;
  }
}
