import { Router } from "@vaadin/router";
import {
  LitElement,
  css,
  html,
  customElement,
  property,
  internalProperty,
} from "lit-element";
import { flagEmail } from "../services/mail";

@customElement("email-card")
export class EmailCard extends LitElement {
  @property({ type: Object }) email: any = null;

  @internalProperty() authed: boolean = false;

  static get styles() {
    return css`
      li {
        background: white;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 1px;
        padding-bottom: 10px;
        border-radius: 6px;
        content-visibility: auto;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        margin-bottom: 10px;
        transition: box-shadow 200ms;

        box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132),
          0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);
      }

      li:hover {
        box-shadow: 0 6.4px 14.4px 0 rgba(0, 0, 0, 0.132),
          0 1.2px 3.6px 0 rgba(0, 0, 0, 0.108);
      }

      .emailHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .preview {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
      }

      #actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 22px;
      }

      #actions button,
      #homeToolbar button {
        background-color: var(--app-color-primary);
      }

      #actions button ion-icon,
      #homeToolbar button ion-icon {
        margin-left: 6px;
      }

      #nameBlock {
        font-size: 12px;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      li #name {
        color: var(--app-color-primary);
        display: inline-block;
        max-width: 14em;
      }

      li h3 {
        margin-bottom: 5px;
        font-size: 16px;
        margin-top: 10px;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 16em;
      }

      #actionsButtons {
        max-width: 7em;
        display: flex;
      }

      .flagButton {
        margin-right: 6px;
      }

      .readButton {
        background: var(--app-color-primary);
      }

      .fakeCard {
        height: 156px;
      }

      @media (min-width: 1200px) {
        li {
          display: flex;
          flex-direction: column;
        }

        li #nameBlock {
          flex-grow: 1;
        }
      }

      @media (prefers-color-scheme: dark) {
        li {
          background: #212121;
          color: white;
        }

        li #name {
          color: white;
        }

        fast-skeleton {
          --skeleton-fill-default: #131212;
        }
      }

      @media (min-width: 1000px) and (prefers-color-scheme: dark) {
        li {
          background: rgb(34 34 34);

          content-visibility: auto;
          contain-intrinsic-size: 156px;
        }
      }

      @media (min-width: 1000px) and (prefers-color-scheme: light) {
        li {
          background: #ffffff;

          content-visibility: auto;
          contain-intrinsic-size: 156px;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {}

  async read(id: string) {
    Router.go(`/email?id=${id}`);
  }

  async bookmark(email: any) {
    try {
      await flagEmail(email);

      let event = new CustomEvent("flag-email", {
        detail: {
          message: "",
        },
      });
      this.dispatchEvent(event);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    if (this.email) {
      return html`
        <li>
          <div>
            <div class="emailHeader">
              <h3>${this.email.subject}</h3>
              ${this.email.flag.flagStatus === "flagged"
                ? html`<fast-badge
                    @click="${() => this.read(this.email.id)}"
                    appearance="lightweight"
                    >flagged
                    <ion-icon name="alert-circle-outline"></ion-icon>
                  </fast-badge>`
                : null}
            </div>

            <p class="preview">${this.email.bodyPreview}</p>
          </div>

          <div id="actions">
            <span id="nameBlock"
              >from
              <span id="name"
                >${this.email.from?.emailAddress.name || `No sender name`}</span
              ></span
            >

            <div id="actionsButtons">
              ${this.email.flag.flagStatus !== "flagged"
                ? html`<fast-button
                    class="flagButton"
                    @click="${() => this.bookmark(this.email)}"
                  >
                    <ion-icon name="flag-outline"></ion-icon>
                  </fast-button>`
                : null}
              <fast-button
                class="readButton"
                id="readButton"
                @click="${() => this.read(this.email.id)}"
                >Read</fast-button
              >
            </div>
          </div>
        </li>
      `;
    } else {
      return html`
        <li class="fakeCard">
          <div>
            <fast-skeleton
              style="margin-top: 10px; height: 21.5px; width: 60%;"
              shape="rect"
            ></fast-skeleton>

            <fast-skeleton
              style="margin-top: 20px; height: 18.5px; width: 80%;"
              shape="rect"
            ></fast-skeleton>
          </div>

          <div id="actions">
            <fast-skeleton style="height: 12px; width: 100px;" shape="rect"></fast-skeleton>

            <div id="actionsButtons">
              <fast-skeleton
                style="margin-top: 20px; height: 40px; width: 51px; margin-right: 4px;"
                shape="rect"
              ></fast-skeleton>
              <fast-skeleton
                style="margin-top: 20px; height: 40px; width: 51px;"
                shape="rect"
              ></fast-skeleton>
            </div>
          </div>
        </li>
      `;
    }
  }
}
