import { Router } from "@vaadin/router";
import { LitElement, css, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/button/button.js';

import { flagEmail } from "../services/mail";

@customElement("email-card")
export class EmailCard extends LitElement {
  @property({ type: Object }) email: any = null;

  @state() authed: boolean = false;

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
        transition: box-shadow 200ms;

        box-shadow: 0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132),
          0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108);

        height: 10em;
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

      .emailHeader h2 {
        view-transition-name: subject;
        contain: layout;
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
        max-width: 10em;
        display: flex;
      }

      .flagButton {
        margin-right: 6px;
      }

      .flagButton:hover {
        background: var(--neutral-fill-hover);
      }

      .readButton:hover {
        background: var(--accent-fill-hover);
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
          background: rgb(41 41 68 / 48%);
          color: white;
        }

        li #name {
          color: white;
        }

        sl-skeleton {
          --skeleton-fill-default: #131212;
        }
      }

      @media (min-width: 1000px) and (prefers-color-scheme: dark) {
        li {
          background: rgb(41 41 68 / 48%);

          content-visibility: auto;
          contain-intrinsic-size: 156px;
        }

        :host {
          content-visibility: auto;
          contain-intrinsic-size: 156px;
        }
      }

      @media (min-width: 1000px) and (prefers-color-scheme: light) {
        li {
          background: #ebebeb;

          content-visibility: auto;
          contain-intrinsic-size: 156px;
        }

        :host {
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

  async read(id: string, button: HTMLElement) {
    await Router.go(`/email?id=${id}`);
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
              <h3>${this.email.subject || "No Subject"}</h3>
              ${this.email.flag.flagStatus === "flagged"
                ? html`<sl-badge
                    @click="${($event: any) => this.read(this.email.id, $event.target)}"
                    appearance="lightweight"
                    >flagged
                    <ion-icon name="alert-circle-outline"></ion-icon>
                  </sl-badge>`
                : null}
            </div>

            <p class="preview">
              ${this.email.bodyPreview || "Preview not available"}
            </p>
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
                ? html`<sl-button
                    class="flagButton"
                    @click="${() => this.bookmark(this.email)}"
                  >
                    Flag
                    <ion-icon name="flag-outline"></ion-icon>
                  </sl-button>`
                : null}
              <sl-button
                class="readButton"
                id="readButton"
                @click="${($event: any) => this.read(this.email.id, $event.target)}"
                >Read</sl-button
              >
            </div>
          </div>
        </li>
      `;
    } else {
      return html`
        <li class="fakeCard">
          <div>
            <sl-skeleton
              style="margin-top: 10px; height: 21.5px; width: 60%;"
              shape="rect"
            ></sl-skeleton>

            <sl-skeleton
              style="margin-top: 20px; height: 18.5px; width: 80%;"
              shape="rect"
            ></sl-skeleton>
          </div>

          <div id="actions">
            <sl-skeleton
              style="height: 12px; width: 100px;"
              shape="rect"
            ></sl-skeleton>

            <div id="actionsButtons">
              <sl-skeleton
                style="margin-top: 20px; height: 40px; width: 51px; margin-right: 4px;"
                shape="rect"
              ></sl-skeleton>
              <sl-skeleton
                style="margin-top: 20px; height: 40px; width: 51px;"
                shape="rect"
              ></sl-skeleton>
            </div>
          </div>
        </li>
      `;
    }
  }
}
