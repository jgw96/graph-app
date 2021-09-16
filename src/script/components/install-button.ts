import {
  LitElement,
  css,
  html,
  customElement,
  internalProperty,
} from "lit-element";

@customElement("install-button")
export class InstallButton extends LitElement {
  @internalProperty() caughtPrompt: boolean = false;
  @internalProperty() caughtEvent: Event | undefined;
  @internalProperty() supportingBrowser: boolean = false;
  @internalProperty() installed: boolean = false;

  // to-do: special handling for Windows
  @internalProperty() isWindows: boolean = true;

  @internalProperty() openInstallModal: boolean = false;

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
  }

  handleInstallPromptEvent(event: Event) {
    this.caughtPrompt = true;

    this.caughtEvent = event;

    event.preventDefault();
  }

  public async install() {
    if (this.isWindows) {
      if (this.caughtPrompt && this.caughtEvent){
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
              <fast-menu-item>Install from the Microsoft Store</fast-menu-item>
              <fast-divider></fast-divider>
              <fast-menu-item @click="${() => this.browserInstall()}">Install from your Browser</fast-menu-item>
              <fast-divider></fast-divider>
              <fast-menu-item @click="${() => this.cancel()}">Cancel</fast-menu-item>
            </fast-menu>
          </div>`
        : null}
    `;
  }
}
