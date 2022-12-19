import { LitElement, css, html } from "lit";

import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { set, get } from "idb-keyval";

@customElement("cookie-banner")
export class AppSettings extends LitElement {
  @state() showBanner = false;

  static get styles() {
    return css`
      #banner.hidden {
        display: none;
      }

      @media(prefers-color-scheme: dark) {
        sl-button[variant="default"]::part(base), sl-input::part(base) {
          background-color: #181818;
          color: white;
          border: none;
        }
      }

      #banner {
        background: var(--app-color-primary);
        justify-content: space-between;
        z-index: 9;
        align-items: center;
        display: flex;
        padding: 12px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
      }
      #banner a {
        color: white;
      }

      #banner p {
        max-width: 36em;
        margin: 6px;
      }

      #banner button {
        border: none;
        font-size: 16px;
        padding: 6px;
        width: 5em;
        border-radius: 4px;
        cursor: pointer;
      }

      #banner button:hover {
        background: rgb(179, 179, 179);
      }

      @media (max-width: 800px) {
        #banner {
          flex-direction: column;
          align-items: initial;
        }

        #banner button {
          margin-top: 1em;
          height: 2.5em;
          border-radius: 6px;
          width: 100%;
        }
      }
    `;
  }

  async firstUpdated() {
    const check = await get("cookie-banner-shown");
    if (!check) {
      this.showBanner = true;
    }
    else {
        this.showBanner = false;
    }
  }

  async handleAccept() {
    await set("cookie-banner-shown", true);
    this.showBanner = false;

    this.dispatchEvent(
      new CustomEvent("cookie-consent-changed", {
        detail: true,
      })
    );
  }

  render() {
    return html`
      <div
        class=${classMap({ hidden: !this.showBanner })}
        id="banner"
        role="banner"
      >
        <div>
          <p>Dont worry, this is the only banner you will get 😊.</p>
          <p>
            This
            <a href="https://en.wikipedia.org/wiki/Progressive_web_application"
              >Progressive Web App</a
            >
            uses cookies to ensure you get the best experience on this app. We
            do not collect nor use any personal data.
          </p>
          <p>
            <a href="https://www.cookieconsent.com/what-are-cookies/"
              >Learn more</a
            >
          </p>
        </div>

        <button class="btn btn-primary" @click="${() => this.handleAccept()}">
          Accept
        </button>
      </div>
    `;
  }
}
