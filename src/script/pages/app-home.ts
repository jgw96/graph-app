import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators";

import "@dile/dile-toast/dile-toast";
import { getMail } from "../services/mail";
import { Router } from "@vaadin/router";

import "../components/email-card";
import "../components/app-loading";
import "../components/mail-folders";
import "../components/home-info";

//@ts-ignore
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.min.mjs";
import { isOffline } from "../utils/network";

@customElement("app-home")
export class AppHome extends LitElement {
  @state() mail: any[] = [];
  @state() mailCopy: any[] | null = [];
  @state() activeCat: string = "all";
  @state() loading: boolean = false;
  @state() initLoad: boolean = false;
  @state() listMode: string = "grid";
  @state() enable_next: boolean = true;
  @state() offline: boolean = false;

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

      #homeToolbar {
        display: flex;
      }

      #mobileToolbar {
        display: none;
      }

      @media (max-width: 800px) {
        .listModeButton {
          display: none;
        }

        #searchInput {
          width: 100%;
        }

        #homeToolbar {
          display: none;
        }

        #mobileToolbar {
          display: initial;
        }
      }

      fast-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99;
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

        #mainListHeader {
          background: transparent !important;
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

      ul {
        list-style: none;
        padding: 0;
        margin-bottom: 4em;

        grid-gap: 10px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(364px, 1fr));
      }

      ul email-card:nth-child(-n + 14) {
        animation-name: slidein;
        animation-duration: 300ms;
      }

      #filterActions {
        animation-name: slidein;
        animation-duration: 300ms;
        animation-fill-mode: forwards;

        position: relative;
        bottom: env(keyboard-inset-height, 0);
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
        margin-top: 0;
      }

      #mainListHeader {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;

        background: #222222;
        border-radius: 6px;
        padding: 10px;

        position: sticky;
        top: 2em;
        z-index: 0;

        max-height: 4em;
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

      #homeToolbar #newEmailButton:hover {
        background: var(--accent-fill-hover);
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
        #homeToolbar {
          background: rgb(29 29 29 / 78%);
        }

        #mainListHeader {
          background: rgb(34, 34, 49);
        }

        fast-menu-item {
          background: rgb(40 41 57);
        }
      }

      .advInner ul li {
        box-shadow: none;
      }

      @media (min-width: 1000px) {
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

        #desktopNew:hover {
          background: var(--accent-fill-hover);
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

        #mainListHeader {
          z-index: 3;
        }
      }

      @media (max-width: 340px) {
        ul {
          display: inherit;
        }
      }

      @media (prefers-color-scheme: light) {
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

        #menuActions {
          margin-bottom: 1em;
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
    });
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
    } else {
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
          : this.initLoad && this.mail && this.mail.length <= 0
          ? html` <home-info></home-info> `
          : null}

        <dile-toast id="myToast" duration="3000"></dile-toast>
      </div>
    `;
  }
}
