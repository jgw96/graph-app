import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators";

@customElement("install-button")
export class InstallButton extends LitElement {
  @state() caughtPrompt: boolean = false;
  @state() caughtEvent: Event | undefined;
  @state() supportingBrowser: boolean = false;
  @state() installed: boolean = false;

  // to-do: special handling for Windows
  @state() isWindows: boolean = false;

  @state() openInstallModal: boolean = false;

  static get styles() {
    return css`
      :host {
        height: 33px;
      }

      #install-info {
        position: absolute;
        z-index: 9999;
        left: -9em;
      }

      #install-info a {
        text-decoration: none;
        color: white;

        font-size: 14px;
        padding-left: 1.1em;

        height: 40px;
        display: flex;
        align-items: center;
        border-radius: calc(var(--control-corner-radius) * 1px);
      }

      #install-info a:hover {
        background: var(--neutral-layer-3);
      }

      #install-button {
        background: var(--app-color-primary);
        height: 22px;
        color: white;
        margin: 0;
        padding: 0;
        -webkit-app-region: no-drag;
        app-region: no-drag;
      }

      @media all and (display-mode: standalone) {
        #install-button {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    this.supportingBrowser = window.hasOwnProperty("BeforeInstallPromptEvent");
    console.log("this.supportingBrowser", this.supportingBrowser);

    // grab an install event
    window.addEventListener("beforeinstallprompt", (event: Event) => {
      console.log("event", event);
      this.handleInstallPromptEvent(event);
    });

    this.checkPlatform();
  }

  checkPlatform() {
    console.log("checking platform");
    if (navigator.userAgent.includes("Windows")) {
      this.isWindows = true;
    } else {
      this.isWindows = false;
    }
  }

  handleInstallPromptEvent(event: Event) {
    this.caughtPrompt = true;

    this.caughtEvent = event;

    event.preventDefault();
  }

  public async install() {
    if (this.isWindows) {
      if (this.caughtPrompt && this.caughtEvent) {
        this.openInstallModal = true;
      }
    } else if (this.caughtPrompt && this.caughtEvent) {
      await this.browserInstall();
    }
  }

  public async browserInstall() {
    if (this.openInstallModal === true) {
      this.openInstallModal = false;
    }

    if (this.caughtPrompt && this.caughtEvent) {
      (this.caughtEvent as any).prompt();

      const choiceResult = await (this.caughtEvent as any).userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("Your app has been installed");
        this.installed = true;
      } else {
        console.log("User chose to not install app");
        this.installed = false;
      }
    }
  }

  cancel() {
    this.openInstallModal = false;
  }

  render() {
    return html`
      ${("standalone" in navigator &&
        (navigator as any).standalone === false) ||
      (this.installed === false &&
        this.supportingBrowser &&
        this.caughtPrompt &&
        this.caughtEvent)
        ? html`
            <fast-button id="install-button" @click="${() => this.install()}"
              >Install Mail GO</fast-button
            >
          `
        : null}
      ${this.openInstallModal
        ? html`<div id="install-info">
            <fast-menu>
              <a
                href="https://www.microsoft.com/store/productId/9N33F2BF60H5"
                target="_blank"
                rel="noreferrer"
                >Install from the Microsoft Store</a
              >
              <fast-menu-item @click="${() => this.browserInstall()}"
                >Install from your Browser</fast-menu-item
              >
              <fast-divider></fast-divider>
              <fast-menu-item @click="${() => this.cancel()}"
                >Cancel</fast-menu-item
              >
            </fast-menu>
          </div>`
        : null}
    `;
  }
}
