import {
  LitElement,
  css,
  html,
  customElement,
  property,
  internalProperty,
} from "lit-element";

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import "@pwabuilder/pwainstall";
import "@dile/dile-toast/dile-toast";
import { getMail } from "../services/mail";
import { Router } from "@vaadin/router";

import "../components/email-card";
import "../components/app-loading";
import "../components/mail-folders";

//@ts-ignore
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.min.mjs";
import { isOffline } from "../utils/network";

@customElement("app-home")
export class AppHome extends LitElement {
  @property({ type: Array }) mail: any[] = [];
  @property({ type: Array }) mailCopy: any[] | null = [];

  @property({ type: String }) activeCat: string = "all";
  @property({ type: Boolean }) loading: boolean = false;

  @property({ type: Boolean }) initLoad: boolean = false;

  @internalProperty() listMode: string = "grid";
  @internalProperty() enable_next: boolean = true;
  @internalProperty() offline: boolean = false;

  worker: any | null = null;

  static get styles() {
    return css`
      fast-button::part(content) {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      #mailFolders {
        margin-top: 2em;
      }

      ion-fab {
        position: fixed;
        z-index: 0;
      }

      ion-fab-button {
        --background: var(--app-color-primary);
      }

      #intro-actions {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        margin-bottom: -1em;
      }

      .listModeButton {
        display: inline-flex;
        width: 108px;
        margin-right: 6px;
      }

      fast-button ion-icon {
        margin-left: 4px;
      }

      fast-buttons::part(content) ion-icon {
        margin-left: 4px;
      }

      #pagerButtons {
        display: flex;
        justify-content: center;
        margin-right: 10px;
        margin-bottom: 10px;
      }

      #pagerButtons fast-button::part(control) {
        color: var(--app-color-primary);
      }

      #advBlock {
        overflow: scroll hidden;
        height: 100%;
        white-space: nowrap;
        scroll-snap-type: x mandatory;
        margin-top: 1em;

        animation-name: slidein;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
      }

      #advBlock::-webkit-scrollbar {
        display: none;
      }

      #advBlock .advOuter {
        flex-direction: column;
        align-items: center;
        display: inline-flex;
        scroll-snap-align: start;
        width: 96.5%;
        padding: 1.4em;
      }

      #advBlock .advInner {
        background: rgba(29, 29, 29, 0.78);
        backdrop-filter: blur(10px);
        padding: 1em;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 4px;
        width: 50em;
      }

      #advBlock .advInner li {
        font-weight: bold;
      }

      #advBlock .advInner img {
        content-visibility: auto;
      }

      @media (prefers-color-scheme: light) {
        #advBlock .advInner {
          background: white;
        }
      }

      #advBlock .advInner#firstBlock {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      #advBlock .advInner#firstBlock img {
        width: 20em;
        margin-right: 4vw;
      }

      #advBlock .advInner#firstBlock ul {
        height: initial;
        overflow: initial;
      }

      #advBlock div img {
        object-fit: contain;
        height: 22em;
      }

      #homeToolbar {
        display: flex;
      }

      #mobileToolbar {
        display: none;
      }

      @media (max-width: 800px) {
        #advBlock {
          white-space: initial;
        }

        #intro-actions {
          justify-content: center;
        }

        .listModeButton {
          display: none;
        }

        #searchInput {
          width: 100%;
        }

        #advBlock div img {
          height: 8em;
          margin-right: 0;
        }

        #advBlock .advInner {
          text-align: center;
          width: initial;
        }

        #advBlock .advOuter {
          display: initial;
          width: initial;
        }

        #advBlock .advInner#firstBlock {
          flex-direction: column;
        }

        #advBlock .advInner#firstBlock ul {
          margin-bottom: 0;
        }

        #advBlock .advInner#firstBlock ul li {
          margin-bottom: 0;
          font-weight: bold;
        }

        #homeToolbar {
          display: none;
        }

        #mobileToolbar {
          display: initial;
        }
      }

      #advBlock div p {
        font-weight: bold;
      }

      fast-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99;
      }

      #introSpan {
        font-weight: normal;
        font-size: 12px;
        margin-top: 8px;
        color: #6d6d6d;
      }

      fast-menu-item {
        background: #222222;
        margin-bottom: 8px;
      }

      fast-menu-item:active {
        background: var(--accent-fill-active);
      }

      fast-menu-item:hover {
        background: var(--accent-fill-active);
      }

      @media (prefers-color-scheme: light) {
        fast-menu-item {
          background: white;
          color: black;
        }

        fast-text-field::part(label) {
          color: black;
        }

        fast-text-field::part(control) {
          color: black;
          background: white;
        }

        fast-text-field::part(root) {
          background: white;
        }
      }

      pwa-install {
        position: fixed;
        bottom: 12px;
        left: 16px;
        --install-button-color: var(--app-color-primary) !important;
        display: none;
      }

      #introBlock {
        font-weight: bold;
        text-align: center;
        background: white;
        border-radius: 6px;
        padding: 2em;
        background: rgba(29, 29, 29, 0.78);
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: space-between;
        backdrop-filter: blur(10px);

        animation-name: slidein;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
      }

      #introBlock h2 {
        margin-top: 0;
        margin-bottom: 0;
      }

      #introBlock app-login {
        margin-top: 1em;
      }

      #introBlock app-login::part(loginButton) {
        height: 32px;
      }

      #introBlock img {
        height: 24em;
      }

      ul {
        list-style: none;
        padding: 0;
        margin-bottom: 4em;

        grid-gap: 10px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(328px, 1fr));
      }

      ul email-card:nth-child(-n + 14) {
        animation-name: slidein;
        animation-duration: 300ms;
      }

      #filterActions {
        animation-name: slidein;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
      }

      #filterActions button {
        background-color: transparent;
        border-radius: 0;
        color: grey;
        font-weight: bold;
        font-size: 1em;
        width: 5em;
        cursor: pointer;
        align-items: center;
        border-width: initial;
        border-style: none;
        border-color: initial;
        border-image: initial;
        padding: 6px;
      }

      #filterActions button.selected {
        border-bottom: solid 2px var(--app-color-primary);
        color: var(--app-color-primary);
      }

      #filterActions h3 {
        text-transform: uppercase;
      }

      #mainListHeader {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }

      #mainListRefresh ion-icon {
        margin-left: initial;
      }

      #nameBlock {
        font-size: 12px;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #homeToolbar {
        position: fixed;
        bottom: 0;
        backdrop-filter: blur(10px);
        left: 0;
        right: 0;
        padding: 8px;
        justify-content: flex-end;
        background: #ffffff69;
      }

      #homeToolbar button {
        display: flex;
        width: initial;
        justify-content: space-around;
        align-items: center;
        background-color: var(--app-color-secondary);
      }

      #homeToolbar #newEmailButton {
        background: var(--app-color-primary);
        margin-left: 12px;
      }

      #homeToolbar button:hover {
        background: var(--app-color-primary);
      }

      #myToast {
        --dile-toast-success-color: var(--app-color-primary);
        --dile-toast-border-radius: 6px;
      }

      ul::-webkit-scrollbar {
        width: 8px;
        background: #222222;
        border-radius: 4px;
      }

      @media (prefers-color-scheme: dark) {
        #introBlock {
          color: white;
        }

        #homeToolbar {
          background: rgb(29 29 29 / 78%);
        }
      }

      .advInner ul li {
        box-shadow: none;
      }

      @media (min-width: 1000px) {
        #introBlock {
          margin-left: 5em;
          margin-right: 5em;
          align-items: flex-start;
          text-align: start;
        }

        #mainListBlock {
          display: grid;
        }

        #searchInput {
          width: 20em;
        }

        #menuActions {
          display: flex;
          flex-direction: column;
        }

        ul {
          overflow-x: hidden;
          overflow-y: scroll;
          max-height: 84vh;
        }

        #homeToolbar {
          display: none;
        }

        #mainSection {
          display: grid;
          grid-template-columns: minmax(240px, 22%) 1fr;
        }

        #filterActions {
          display: flex;
          flex-direction: column;
          margin-right: 10px;

          justify-content: space-between;
          height: 93vh;
        }

        #desktopNew {
          background: #686bd2;
          margin-top: 8px;
        }
      }

      @media (min-width: 1200px) {
        #introBlock {
          margin-left: 13em;
          margin-right: 13em;
        }
      }

      @media (min-width: 1300px) {
        #mainSection {
          grid-template-columns: minmax(240px, 18%) 1fr;
        }

        ul {
          max-height: 84vh;
        }
      }

      @media (max-width: 1000px) {
        #filterActions {
          display: none;
        }

        #mainListRefresh {
          display: none;
        }
      }

      @media (max-width: 340px) {
        ul {
          display: inherit;
        }
      }

      @media (prefers-color-scheme: light) {
        #introBlock {
          background: white;
        }

        ul::-webkit-scrollbar {
          background: #ffffff;
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

      @media (screen-spanning: single-fold-vertical) {
        #mainSection {
          grid-template-columns: minmax(47vw, 22%) 1fr;
          grid-gap: 47px;
        }

        #introBlock {
          margin-right: 0em;
          margin-left: calc(env(fold-left) + 2em);
        }

        #advBlock {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const loadCheck = sessionStorage.getItem("latestMail");

    if (loadCheck) {
      this.initLoad = false;
      await this.getSavedAndUpdate();
    } else {
      this.initLoad = true;
      await this.getSavedAndUpdate();
    }

    (window as any).requestIdleCallback(async () => {
      const underlying = new Worker("/workers/search.js");
      this.worker = Comlink.wrap(underlying);
    });

    (window as any).requestIdleCallback(async () => {
      if (
        "connection" in navigator &&
        (navigator as any).connection.effectiveType === "4g"
      ) {
        this.setupInfinite();
      } else if ("connection" in navigator === false) {
        this.setupInfinite();
      }
    });

    (window as any).requestIdleCallback(() => {
      this.offline = isOffline();
      
      if (this.offline === true) {
        this.enable_next = false;
      }
    })
  }

  async setupInfinite() {
    let options = null;

    if (window.matchMedia("(max-width: 1000px)").matches) {
      options = {
        rootMargin: "0px",
        threshold: 0,
      };
    } else {
      options = {
        root: this.shadowRoot?.querySelector("ul"),
        rootMargin: "0px",
        threshold: 0,
      };
    }

    let observer = new IntersectionObserver(async (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await this.loadMore();
        }
      });
    }, options);

    const observedEl = this.shadowRoot?.querySelector("#pagerButtons");

    if (observedEl) {
      observer.observe(observedEl);
    }
  }

  async searchMail(query: string) {
    const searchResults = await this.worker.search(query);
    console.log(searchResults);
    this.mail = [...searchResults];
  }

  public async getSavedAndUpdate() {
    if (this.initLoad === false) {
      this.loading = true;
    }

    this.enable_next = true;

    const mailCheck = sessionStorage.getItem("latestMail");

    if (mailCheck) {
      this.mailCopy = JSON.parse(mailCheck);
    } else {
      this.mailCopy = await getMail(true);
    }

    if (this.mailCopy && this.mailCopy.length > 0) {
      this.mail = [...this.mailCopy];

      if (this.initLoad === false) {
        this.loading = false;
      }

      this.initLoad = false;

      sessionStorage.setItem("latestMail", JSON.stringify(this.mail));
    }
  }

  async loadMore() {
    const test = this.handleOffline();
    if (test === true) {
      return;
    }

    this.loading = true;

    const newMail = await getMail();
    const oldMail = this.mail;

    if (oldMail && newMail) {
      this.mail = [...oldMail, ...newMail];

      (window as any).requestIdleCallback(
        () => {
          sessionStorage.setItem("latestMail", JSON.stringify(this.mail));
        },
        {
          timeout: 300,
        }
      );
    }

    this.loading = false;
  }

  getFocused() {
    this.loading = true;

    let focused: any[] = [];

    this.mailCopy?.forEach((mail) => {
      if (mail.inferenceClassification === "focused") {
        focused.push(mail);
      }
    });

    if (focused.length > 1) {
      this.mail = [...focused];
    }

    this.loading = false;
  }

  getOther() {
    this.loading = true;

    let other: any[] = [];

    this.mailCopy?.forEach((mail) => {
      if (mail.inferenceClassification === "other") {
        other.push(mail);
      }
    });

    if (other.length > 1) {
      this.mail = [...other];
    }

    this.loading = false;
  }

  async newEmail() {
    Router.go("/newEmail");
  }

  handleOffline() {
    const offlineTest = isOffline();

    if (this.offline === true || offlineTest === true) {
      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      toastElement?.open("This action cannot be completed offline...", "error");
      return true;
    }
    else {
      return false;
    }
  }

  async refresh() {
    const test = this.handleOffline();
    if (test === true) {
      return;
    }

    this.loading = true;
    this.enable_next = true;

    const newMail = await getMail(true);

    this.loading = false;

    this.mail = [...newMail];

    let toastElement: any = this.shadowRoot?.getElementById("myToast");
    toastElement?.open("Inbox Refreshed...", "success");
  }

  setCat(cat: string) {
    this.activeCat = cat;

    if (cat === "focused") {
      this.getFocused();
    } else if (cat === "other") {
      this.getOther();
    } else if (cat === "all") {
      this.getSavedAndUpdate();
    }
  }

  async bookmark() {
    const test = this.handleOffline();
    if (test === true) {
      return;
    }

    try {
      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      toastElement?.open("Email Flagged", "success");

      setTimeout(async () => {
        await this.refresh();
      }, 200);
    } catch (err) {
      console.error(err);
    }
  }

  async updateList(mode: string) {
    const sheet: any = new CSSStyleSheet();

    if (mode === "grid") {
      this.listMode = "grid";

      await sheet.replace(
        " ul {display: grid; grid-template-columns: repeat(auto-fit, minmax(328px, 1fr));}"
      );

      (this.shadowRoot as any).adoptedStyleSheets = [
        ...(this.shadowRoot as any).adoptedStyleSheets,
        sheet,
      ];
    } else {
      this.listMode = "list";

      await sheet.replace("ul { display: initial }");

      (this.shadowRoot as any).adoptedStyleSheets = [
        ...(this.shadowRoot as any).adoptedStyleSheets,
        sheet,
      ];
    }
  }

  mailFolder(ev: CustomEvent) {
    this.enable_next = false;

    this.loading = true;

    if (ev.detail.mail && ev.detail.mail.length > 0) {
      this.mail = [...ev.detail.mail];
    }

    this.loading = false;
  }

  render() {
    return html`
      <div>
        ${this.loading ? html`<app-loading></app-loading>` : null}
        ${this.initLoad === false
          ? html`
              <section id="mainSection">
                <div id="filterActions">
                  <div>
                    <div>
                      <h3>Filters</h3>
                      <fast-menu-item @click="${() => this.setCat("all")}"
                        >All</fast-menu-item
                      >
                      <fast-menu-item @click="${() => this.setCat("focused")}"
                        >Focused</fast-menu-item
                      >
                      <fast-menu-item @click="${() => this.setCat("other")}"
                        >Other</fast-menu-item
                      >
                    </div>

                    <div id="mailFolders">
                      <mail-folders
                        @folder-mail="${(ev: CustomEvent) =>
                          this.mailFolder(ev)}"
                      ></mail-folders>
                    </div>
                  </div>

                  <div id="menuActions">
                    <fast-button
                      id="desktopNew"
                      @click="${() => this.newEmail()}"
                    >
                      New Email
                      <ion-icon name="add"></ion-icon>
                    </fast-button>
                  </div>
                </div>

                <div id="mainListBlock">
                  <div id="mainListHeader">
                    <fast-text-field
                      id="searchInput"
                      placeholder="..."
                      @change="${(event: any) =>
                        this.searchMail(event.target.value)}"
                      type="search"
                      >Search Mail</fast-text-field
                    >

                    <div>
                      ${this.listMode === "grid"
                        ? html`<fast-button
                            class="listModeButton"
                            @click="${() => this.updateList("list")}"
                            id="gridOrList"
                          >
                            List Layout
                            <ion-icon name="list-outline"></ion-icon>
                          </fast-button>`
                        : html`<fast-button
                            class="listModeButton"
                            id="gridOrList"
                            @click="${() => this.updateList("grid")}"
                          >
                            Grid Layout
                            <ion-icon name="grid-outline"></ion-icon>
                          </fast-button>`}

                      <fast-button
                        id="mainListRefresh"
                        @click="${() => this.refresh()}"
                      >
                        <ion-icon name="reload"></ion-icon>
                      </fast-button>
                    </div>
                  </div>

                  <ul>
                    ${this.mail.length > 0
                      ? this.mail?.map((email) => {
                          return html`
                            <email-card
                              @flag-email="${() => this.bookmark()}"
                              .email="${email}"
                            ></email-card>
                          `;
                        })
                      : html`
                          <email-card></email-card>
                          <email-card></email-card>
                          <email-card></email-card>
                          <email-card></email-card>
                          <email-card></email-card>
                          <email-card></email-card>
                          <email-card></email-card>
                          <email-card></email-card>
                        `}
                    ${this.enable_next
                      ? html`<div id="pagerButtons">
                          <fast-button
                            appearance="stealth"
                            @click="${() => this.loadMore()}"
                          >
                            More

                            <ion-icon name="chevron-forward-outline"></ion-icon>
                          </fast-button>
                        </div>`
                      : null}
                  </ul>
                </div>
              </section>

              <div id="homeToolbar">
                <fast-button @click="${() => this.refresh()}">
                  Refresh
                  <ion-icon name="reload"></ion-icon>
                </fast-button>

                <fast-button
                  id="newEmailButton"
                  @click="${() => this.newEmail()}"
                >
                  New Email
                  <ion-icon name="add"></ion-icon>
                </fast-button>
              </div>

              <div id="mobileToolbar">
                <ion-fab vertical="bottom" horizontal="end">
                  <ion-fab-button @click="${() => this.newEmail()}">
                    <ion-icon name="add"></ion-icon>
                  </ion-fab-button>
                </ion-fab>
              </div>
            `
          : this.initLoad
          ? html`<div id="introBlock">
              <h2>
                Sign in to quickly access your latest email and save them for
                offline use!
              </h2>

              <span id="introSpan">Powered by the Microsoft Graph.</span>

              <div id="intro-actions">
                <app-login></app-login>
              </div>
            </div>`
          : null}
        ${this.initLoad && this.mail && this.mail.length <= 0
          ? html`
              <div id="advBlock">
                <div class="advOuter">
                  <div class="advInner" id="firstBlock">
                    <img src="/assets/icons/mailbox.svg" alt="app icon" />

                    <ul>
                      <li>Easily access your mail, even when offline!</li>
                      <li>
                        Set reminders for your mail that also work offline!
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="advOuter">
                  <div class="advInner">
                    <img src="/assets/screenshots/offline_screen_mobile.webp" />
                    <p>
                      Even send mail while offline and let us automatically send
                      it once you are back online!
                    </p>
                  </div>
                </div>
              </div>
            `
          : null}

        <pwa-install>Install Mail GO</pwa-install>

        <dile-toast id="myToast" duration="3000"></dile-toast>
      </div>
    `;
  }
}
