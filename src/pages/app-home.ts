import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

// import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

import "@dile/dile-toast/dile-toast";
import { getMail, searchMailFullText } from "../services/mail";
import { Router } from "@vaadin/router";

import "../components/email-card";
import "../components/app-loading";
import "../components/mail-folders";
import "../components/home-info";
import "../components/header";

//@ts-ignore
// import "../workers/search.js";

//@ts-ignore
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.min.mjs";
import { isOffline } from "../utils/network";

@customElement("app-home")
export class AppHome extends LitElement {
  @state() mail: any[] = [];
  @state() searchResults: any[] = [];
  @state() mailCopy: any[] | null = [];
  @state() activeCat: string = "all";
  @state() loading: boolean = false;
  @state() initLoad: boolean = false;
  @state() listMode: string = "grid";
  @state() enable_next: boolean = true;
  @state() offline: boolean = false;
  @state() searchActive: boolean = false;

  @state() openEmailID: string | undefined = undefined;

  worker: any | null = null;

  static get styles() {
    return css`
      sl-button::part(content) {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      sl-popup::part(popup) {
        background: #1e2026;
      }

      sl-button[variant="primary"] {
        --sl-color-neutral-0: white;
      }

      #filtersBlock {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      #mailFolders {
        margin-top: 2em;
      }

      #extra-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

      sl-button ion-icon {
        margin-left: 4px;
      }

      sl-buttons::part(content) ion-icon {
        margin-left: 4px;
      }

      #pagerButtons {
        display: flex;
        justify-content: center;
        margin-right: 10px;
        margin-bottom: 10px;
      }

      #pagerButtons sl-button::part(control) {
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
          position: fixed;
          bottom: 0px;
          left: 0px;
          right: 0px;
          padding: 10px;
          background: rgb(37 40 50);
          backdrop-filter: blur(40px);
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }

      sl-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99;
      }

      sl-menu-item {
        background: #222222;
        margin-bottom: 8px;
      }

      sl-menu-item:active {
        background: var(--accent-fill-active);
      }

      sl-menu-item:hover {
        background: var(--accent-fill-active);
      }

      @media (prefers-color-scheme: light) {
        sl-menu-item {
          background: white;
          color: black;
        }

        #mainListHeader {
          background: transparent !important;
        }

        sl-input::part(label) {
          color: black;
        }

        sl-input::part(control) {
          color: black;
          background: white;
        }

        sl-input::part(root) {
          background: white;
        }
      }

      ul {
        list-style: none;
        padding: 0;
        margin-bottom: 4em;

        grid-gap: 10px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
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

      #searchResults li {
        background: var(--app-color-primary);
        padding: 8px;
        border-radius: 4px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }

      #searchResults li .from {
        font-weight: normal;
        display: block;
        margin-top: 6px;
      }

      #mainListHeader {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;

        background: #222222;
        border-radius: 6px;
        padding: 10px;
        z-index: 9;

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
          background: rgb(41 41 68 / 48%);
        }

        #mainListHeader {
          background: rgb(41 41 68 / 48%);
        }

        sl-menu-item {
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
          margin-bottom: 1em;
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

          border-radius: 8px;
          padding: 8px;

          justify-content: space-between;
          height: 88vh;

          border-radius: 8px;
          background: rgb(41 41 68 / 48%);
          padding: 8px;
        }

        #desktopNew {
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
        ul { display: flex; flex-direction: column; }
      }

      @media (prefers-color-scheme: light) {
        ul::-webkit-scrollbar {
          background: #ffffff;
        }

        #filterActions {
          background: #80808029;
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

      @media (horizontal-viewport-segments: 2) {
        #mainSection {
          grid-template-columns: 47.4vw 50vw;
          column-gap: 36px;
        }

        #menuActions {
          margin-bottom: 1em;
        }

        #mainListBlock {
          width: 96%;
        }

        .listModeButton {
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

    const worker = new Worker(new URL('/workers/search.js', import.meta.url), {
      type: 'module'
    });
    this.worker = Comlink.wrap(worker);

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
    this.searchActive = true;

    const results: any = await searchMailFullText(query);
    console.log("full text search results", results);

    this.searchResults = [...results];

    // const searchResults = await this.worker.search(query);
    // console.log("searchResults", searchResults);
    // this.searchResults = [...searchResults];
    // this.mail = this.searchResults;

    if (this.mail.length === 0) {
      this.searchActive = false;
    }
    else if (query.length === 0) {
      this.searchActive = false;
    }
  }

  async read(id: string) {
    // await Router.go(`/email?id=${id}`);

    const emailDrawer: any = this.shadowRoot?.querySelector("#email-drawer");
    if (emailDrawer) {
      this.openEmailID = id;
      await emailDrawer.show();
    }
  }

  public async getSavedAndUpdate() {
    if (this.initLoad === false) {
      this.loading = true;
    }

    this.enable_next = true;

    // const mailCheck = sessionStorage.getItem("latestMail");
    const mailCheck = false;

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

      await sheet.replace("ul { display: flex; flex-direction: column; }");

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
                    <div id="filtersBlock">
                      <h3>Filters</h3>
                      <sl-button @click="${() => this.setCat("all")}"
                        >All</sl-button
                      >
                      <sl-button @click="${() => this.setCat("focused")}"
                        >Focused</sl-button
                      >
                      <sl-button @click="${() => this.setCat("other")}"
                        >Other</sl-button
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
                    <sl-button
                      id="desktopNew"
                      @click="${() => this.newEmail()}"
                      variant="primary"
                    >
                      New Email
                      <ion-icon name="add"></ion-icon>
                    </sl-button>
                  </div>
                </div>

                <div id="mainListBlock">
                  <div id="mainListHeader">
                    <sl-popup fixed ?active="${this.searchActive}" placement="bottom" sync="width">
                      <sl-input
                        slot="anchor"
                        id="searchInput"
                        placeholder="Search..."
                        @sl-change="${(event: any) =>
                          this.searchMail(event.target.value)}"
                        type="search"
                        >Search Mail</sl-input
                      >

                      <div id="searchResults">
                        <ul>
                          ${this.searchResults?.map(
                            (mail: any) => html`

                              <li @click="${() => this.read(mail.id)}">
                                <div class="searchResult">
                                  <span>${mail.subject}</span>

                                  <span class="from">from ${mail['from.emailAddress.name']}</span>
                                </div>
                              </li>
                            `
                          )}
                        </ul>
                      </div>
                    </sl-popup>

                    <div id="extra-controls">
                      ${this.listMode === "grid"
                        ? html`<sl-button
                            class="listModeButton"
                            @click="${() => this.updateList("list")}"
                            id="gridOrList"
                          >
                            List Layout
                            <ion-icon name="list-outline"></ion-icon>
                          </sl-button>`
                        : html`<sl-button
                            class="listModeButton"
                            id="gridOrList"
                            @click="${() => this.updateList("grid")}"
                          >
                            Grid Layout
                            <ion-icon name="grid-outline"></ion-icon>
                          </sl-button>`}

                      <sl-button
                        id="mainListRefresh"
                        @click="${() => this.refresh()}"
                      >
                        Refresh
                      </sl-button>
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
                          <sl-button
                            appearance="stealth"
                            @click="${() => this.loadMore()}"
                          >
                            More

                            <ion-icon name="chevron-forward-outline"></ion-icon>
                          </sl-button>
                        </div>`
                      : null}
                  </ul>
                </div>

                <div id="emailPreview">
                  <h3>Hello world</h3>
                </div>
              </section>

              <div id="homeToolbar">
                <sl-button @click="${() => this.refresh()}">
                  Refresh
                  <ion-icon name="reload"></ion-icon>
                </sl-button>

                <sl-button
                  id="newEmailButton"
                  @click="${() => this.newEmail()}"
                  pill
                >
                  New Email
                  <ion-icon name="add"></ion-icon>
                </sl-button>
              </div>

              <div id="mobileToolbar">
                <sl-button variant="primary" pill @click="${() => this.newEmail()}">
                  New Email
                </sl-button>
              </div>
            `
          : this.initLoad && this.mail && this.mail.length <= 0
          ? html` <home-info></home-info> `
          : null}

          <sl-drawer id="email-drawer">
            <app-about></app-about>
          </sl-drawer>

        <dile-toast id="myToast" duration="3000"></dile-toast>
      </div>
    `;
  }
}
