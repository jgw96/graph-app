import { fileSave } from "browser-nativefs";
import { LitElement, css, html } from "lit";

import { customElement, property, state } from "lit/decorators";
import { downloadAttach } from "../services/mail";

@customElement("app-attachments")
export class AppAttachments extends LitElement {
  @state() attachments: any[] | null = null;
  @state() loading: boolean = false;

  @property() mail: any | null;

  closeAni: Animation | null = null;

  static get styles() {
    return css`
      #attachments {
        display: flex;
        flex-direction: column;
        width: 30vw;
        background: rgb(34, 34, 34);
        padding: 10px;
        border-radius: 8px;
      }

      @media (prefers-color-scheme: light) {
        #attachments {
          background: var(--neutral-fill-input-active);
        }

        #attachments fast-button {
          color: var(--app-color-primary);
        }
      }

      h3 {
        margin-top: 0;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;

        max-height: 500px;
        overflow-y: auto;
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

      li {
        background: var(--background-color);
        padding: 10px;
        border-radius: 6px;
        font-weight: bold;
        margin-bottom: 8px;

        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      li ion-icon {
        font-size: 22px;
      }

      #attachmentsHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      @media (max-width: 800px) {
        #attachments {
          width: auto;
        }
      }

      #attachments {
        position: fixed;
        right: 0;
        top: 3.3em;
        z-index: 999;
        bottom: 0;
      }

      #attachments ul {
        max-height: initial;
      }

      h3 {
        margin-bottom: initial;
      }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    console.log("attach", this.attachments);

    const animatedEl = this.shadowRoot?.querySelector("#attachments");
    if (animatedEl) {
      this.closeAni = animatedEl.animate(
        [
          { transform: "translateX(100px)", opacity: 0 },
          {
            transform: "translateX(0)",
            opacity: 1,
          },
        ],
        {
          duration: 280,
          easing: "ease-in-out",
          fill: "both",
        }
      );
    }
  }

  b64toBlob = (b64Data: any, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  async download(attachment: any) {
    this.loading = true;

    try {
      const blob = await downloadAttach(this.mail, attachment);

      if (blob) {
        await fileSave(blob, {
          fileName: attachment.name,
          extensions: [`.${attachment.contentType}`],
        });

        this.loading = false;

        return;
      }
    } catch (err) {
      this.loading = false;
    }
  }

  async close() {
    let event = new CustomEvent("close", {
      detail: {
        close: true,
      },
    });

    this.closeAni?.reverse();

    await this.closeAni?.finished;

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div id="attachments">
        <div id="attachmentsHeader">
          <h3>Attachments</h3>

          <fast-button appearance="stealth" @click="${() => this.close()}">
            <ion-icon name="close"></ion-icon>
          </fast-button>
        </div>
        <ul>
          ${this.attachments
            ? this.attachments.map((attachment) => {
                return html`
                  <li>
                    <span id="name">${attachment.name}</span>

                    <fast-button
                      appearance="stealth"
                      @click="${() => this.download(attachment)}"
                      ><ion-icon name="download-outline"></ion-icon
                    ></fast-button>
                  </li>
                `;
              })
            : null}
        </ul>

        ${this.loading ? html`<fast-progress></fast-progress>` : null}
      </div>
    `;
  }
}
