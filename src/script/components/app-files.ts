import { LitElement, css, html } from "lit";

import { customElement, state } from "lit/decorators";

import { getRecentFiles } from "../services/files";

import "./file-item";

@customElement("app-files")
export class AppFiles extends LitElement {
  @state() recents: any | null = null;

  static get styles() {
    return css`
      ul {
        padding: 0;
        margin: 0;
        overflow-y: scroll;
        height: 24em;
      }

      ul fast-skeleton {
        margin-top: 6px;
        border-radius: 4px;
        height: 36px;
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

      fast-menu-item::part(content) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      fast-menu-item fast-button {
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

      #filesHeader h2 {
        font-size: 1.17em;
      }

      ul::-webkit-scrollbar {
        width: 8px;
        background: #222222;
        border-radius: 4px;
      }

      @media (prefers-color-scheme: light) {
        ul::-webkit-scrollbar {
          background: #ffffff;
        }
      }

      @media (prefers-color-scheme: dark) {
        fast-skeleton {
          --skeleton-fill-default: #131212;
        }
      }

      @keyframes fadein {
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const files = await getRecentFiles();

    if (files && files.length > 0) {
      console.log(files);
      this.recents = [...files];
    }
  }

  gotAttachFile(data: any) {
    console.log(data);

    let event = new CustomEvent("attach-file", {
      detail: {
        data,
      },
    });
    this.dispatchEvent(event);

    this.close();
  }

  close() {
    let event = new CustomEvent("close-attach", {
      detail: {
        data: null,
      },
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div>
        <fast-dialog aria-label="Recent Files from OneDrive" modal="true">
          <div id="filesHeader">
            <h2>Recent Files from OneDrive</h2>

            <fast-button
              @click="${() => this.close()}"
              appearance="stealth"
              id="closeButton"
            >
              <ion-icon name="close-outline"></ion-icon>
            </fast-button>
          </div>

          ${this.recents
            ? html`<ul>
                ${this.recents.map((file: any) => {
                  return html`
                    <file-item
                      @got-file="${(ev: any) =>
                        this.gotAttachFile(ev.detail.data)}"
                      .file="${file}"
                    ></file-item>
                  `;
                })}
              </ul>`
            : html`
                <ul>
                  <div>
                    <fast-skeleton shape="rect"></fast-skeleton>
                  </div>

                  <div>
                    <fast-skeleton shape="rect"></fast-skeleton>
                  </div>

                  <div>
                    <fast-skeleton shape="rect"></fast-skeleton>
                  </div>

                  <div>
                    <fast-skeleton shape="rect"></fast-skeleton>
                  </div>

                  <div>
                    <fast-skeleton shape="rect"></fast-skeleton>
                  </div>

                  <div>
                    <fast-skeleton shape="rect"></fast-skeleton>
                  </div>

                  <div>
                    <fast-skeleton shape="rect"></fast-skeleton>
                  </div>

                  <div>
                    <fast-skeleton shape="rect"></fast-skeleton>
                  </div>
                </ul>
              `}
        </fast-dialog>
      </div>
    `;
  }
}
