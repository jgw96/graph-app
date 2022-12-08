import { LitElement, css, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';

import {classMap} from 'lit/directives/class-map.js';

@customElement("email-card")
export class EmailCard extends LitElement {
  @property({ type: Object }) email: any = null;

  @state() authed: boolean = false;

  static get styles() {
    return css`

    :host {
      content-visibility: auto;
      contain-intrinsic-size: 123px;

      cursor: pointer;
    }

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

        height: 7em;
      }

      li:hover {
        background: #4041b44d;
      }

      li.read {
        background: rgb(71 74 210 / 41%);
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
        margin-top: 6px;
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

      #nameBlock, #dateBlock {
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
        height: 123px;
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
          background: #5a5a5a3b;
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
          background: #5a5a5a3b;
        }
      }

      @media (min-width: 1000px) and (prefers-color-scheme: light) {
        li {
          background: #ebebeb;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {}

  async read(id: string, element: HTMLElement) {
    let event = new CustomEvent("read-email", {
      detail: {
        id: id,
      },
    });
    this.dispatchEvent(event);

    // remove read class
    element.classList.remove("read");
  }

  async bookmark(email: any) {
    try {
      const { flagEmail } = await import("../services/mail");
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
        <li  @click="${($event: any) => this.read(this.email.id, $event.target)}" class=${classMap({ read: this.email.isRead === false})}>
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

            <span id="dateBlock">
              <!-- convert to readable date -->
              ${new Date(this.email.receivedDateTime).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>

            <!-- <div id="actionsButtons">
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
                >Read</sl-button
              >
            </div> -->
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
