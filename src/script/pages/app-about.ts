import {
  LitElement,
  css,
  html,
  customElement,
  property,
  internalProperty,
} from "lit-element";
import {
  getAnEmail,
  flagEmail,
  markAsRead,
  listAttach,
  unsub,
} from "../services/mail";

import "../components/app-attachments";

import { Router } from "@vaadin/router";

//@ts-ignore
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.min.mjs";

declare var TimestampTrigger: any;

@customElement("app-about")
export class AppAbout extends LitElement {
  @property() email: any = null;
  @property({ type: String }) reminderTime: string = "";
  @property({ type: Boolean }) showReminder: boolean = false;
  @property({ type: Boolean }) emailLoaded: boolean = false;
  @property({ type: Array }) attachments: any[] | null = null;

  @internalProperty() openAttachments: boolean = false;

  static get styles() {
    return css`
      fast-button::part(content) {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      fast-button ion-icon {
        margin-left: 4px;
      }

      #actual-email {
        border: solid 1px var(--app-color-primary);
        margin-top: 1em;
        min-height: 70vh;

        animation-name: fadeIn;
        animation-duration: 280ms;
      }

      #mail-loader {
        height: 70vh;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      #openWindow ion-icon {
        color: var(--app-color-primary);
        font-size: 18px;
      }

      .loading {
        display: none;
      }

      #detailActions button.back {
        background-color: var(--app-color-secondary);
      }

      .detailActionButton {
        margin-right: 8px;
      }

      #detailAction {
        flex: 1;
      }

      #detailAction h2 {
        margin-top: 1em;
        margin-right: 4em;
        color: white !important;
      }

      #detailActions {
        display: flex;
        justify-content: space-between;
        animation-name: slidein;
        animation-duration: 380ms;
      }

      #detailMoreActions {
        display: flex;
        justify-content: flex-end;
        padding-right: 1em;
        position: fixed;
        bottom: 14px;
        right: 14px;
        background: rgb(33 33 33 / 79%);
        backdrop-filter: blur(10px);
        padding: 10px;
        border-radius: 8px;

        animation-name: slidein;
        animation-duration: 280ms;
      }

      @media (prefers-color-scheme: light) {
        #detailMoreActions {
          background: rgb(226, 226, 226);
        }
      }

      #detailActions div {
        display: flex;
      }

      #detailActions button {
        margin-right: 6px;
        cursor: pointer;

        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: var(--app-color-primary);
        color: white;
        border: none;
        font-weight: bold;
        font-size: 1em;
        padding: 8px;
        border-radius: 6px;
        height: initial;
        cursor: pointer;
      }

      #detailActions button ion-icon {
        margin-left: 6px;
      }

      #content {
        width: 99%;
        height: 100%;

        background: transparent;
        flex: 2;
      }

      #content iframe {
        height: 100%;
        width: 100%;

        border: solid 2px var(--app-color-primary);
        border-radius: 6px;
        background: white;
      }

      #reminder {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1c1b1bde;
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        /* width: 92%; */
        padding-bottom: 2em;
        padding-top: 2em;
        padding-left: 2em;
        padding-right: 2em;
        height: 12em;
        animation-name: slidein;
        animation-duration: 300ms;
      }

      #reminder fast-button {
        margin-top: 2em;
        background: var(--app-color-primary);
      }

      #reminder fast-button#cancelButton {
        margin-top: 12px;
        background: red;
      }

      #reminder input {
        width: 98%;
      }

      #loading:empty {
        margin: auto;
        width: 90&;
        height: 500px; /* change height to see repeat-y behavior */

        background-image: radial-gradient(
            circle 50px at 50px 50px,
            lightgray 99%,
            transparent 0
          ),
          linear-gradient(
            100deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 80%
          ),
          linear-gradient(lightgray 20px, transparent 0),
          linear-gradient(lightgray 20px, transparent 0),
          linear-gradient(lightgray 20px, transparent 0),
          linear-gradient(lightgray 20px, transparent 0);

        background-repeat: repeat-y;

        background-size: 100px 200px, /* circle */ 50px 200px,
          /* highlight */ 150px 200px, 350px 200px, 300px 200px, 250px 200px;

        background-position: 0 0, /* circle */ 0 0, /* highlight */ 120px 0,
          120px 40px, 120px 80px, 120px 120px;

        animation: shine 1s infinite;
      }

      @keyframes fadeIn {
        from {
          opacity: 0.2;
        }

        to {
          opacity: 1;
        }
      }

      @keyframes shine {
        to {
          background-position: 0 0, 100% 0,
            /* move highlight to right */ 120px 0, 120px 40px, 120px 80px,
            120px 120px;
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

      #detailBlock {
        height: 88.8vh;
      }

      #replyButton {
        margin-left: 8px;
        background: var(--app-color-primary);
      }

      #unsubButton {
        margin-left: 8px;
      }

      @media (min-width: 900px) {
        #detailBlock {
          overflow-y: scroll;
        }

        #detailBlock::-webkit-scrollbar {
          width: 8px;
          background: #222222;
          border-radius: 4px;
        }

        @media (prefers-color-scheme: light) {
          #detailBlock::-webkit-scrollbar {
            background: #ffffff;
          }
        }

        #detailActions {
          margin-right: 1em;
        }

        #reminder {
          left: 6em;
          right: 6em;
          position: absolute;
        }
      }

      @media (min-width: 1200px) {
        #reminder {
          left: 22em;
          right: 22em;
          position: absolute;
        }
      }

      @media (min-width: 1300px) {
        #reminder {
          left: 28em;
          right: 28em;
        }
      }

      @media (prefers-color-scheme: light) {
        #reminder {
          background: white;
        }
      }

      @media (max-width: 800px) {
        #detailActions {
          position: fixed;
          bottom: -3px;
          backdrop-filter: blur(10px);
          left: 0;
          right: 0;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          background: #ffffff69;
        }

        #reminderInitButton {
          display: none;
        }

        #openWindow,
        #flagButtonAbout {
          display: none;
        }

        #content {
          height: 70vh;
        }

        #detailActions div {
          display: flex;
        }

        #detailMoreActions {
          left: initial;
          right: 4px;
          bottom: -1px;
          background: transparent;
          width: 18em;

          animation-name: slidein;
          animation-duration: 280ms;
        }
      }

      @media (max-width: 340px) {
        #detailMoreActions {
          backdrop-filter: none;
          width: initial;
        }
      }

      @media (screen-spanning: single-fold-vertical) {
        #detailBlock {
          display: grid;
          grid-gap: 36px;
          grid-template-columns: minmax(240px, 48.8%) 1fr;
        }

        #detailMoreActions {
          width: 44.4vw;

          right: initial;
          display: flex;
          flex-direction: column;
        }

        #replyButton,
        #share-button,
        .detailActionButton {
          margin-top: 10px;
          margin-right: 0;
          margin-left: 0;
        }
      }

      @media (prefers-color-scheme: light) {
        #detailAction h2 {
          color: black !important;
        }
      }

      @media (prefers-color-scheme: dark) {
        #detailBlock {
          color: white;
        }

        @media (max-width: 800px) {
          #detailActions {
            background: #1c1b1be8;
          }
        }
      }

      @media (prefers-color-scheme: dark) {
        fast-skeleton {
          --skeleton-fill-default: #131212;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const search = new URLSearchParams(location.search);
    const id = search.get("id");

    if (id) {
      try {
        const email = await getAnEmail(id);
        console.log(email);
        this.email = email;
  
        this.attachments = await listAttach(id);
        console.log(this.attachments);
      }
      catch (err) {
        let toastElement: any = this.shadowRoot?.getElementById("myToast");
        toastElement?.open("We could not load this email, try again later...", "error");
      }
    }
  }

  back() {
    Router.go("/");
  }

  async share() {
    if ((navigator as any).share) {
      await (navigator as any).share({
        title: "Shared Email",
        text: "Check out this email",
        url: location.href,
      });
    }
  }

  handleDate(event: any) {
    console.log(event.target.value);
    this.reminderTime = event.target.value;
  }

  askPermission() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== "granted") {
        throw new Error("We weren't granted permission.");
      }
    });
  }

  async setReminder(reminderTime: string) {
    try {
      await this.askPermission();

      const r: any = await navigator.serviceWorker.getRegistration();
      console.log(r);

      if (r) {
        r.showNotification("Mail Reminder", {
          tag: Math.random(),
          body: `Your reminder from Mail: ${location.href}`,
          showTrigger: new TimestampTrigger(
            Date.now() + (new Date(reminderTime).getTime() - Date.now())
          ),
          icon: "/assets/icons/icon_512.png",
        });
      }
    } catch {
      console.log("couldnt set reminder");
    }
  }

  async disconnectedCallback() {
    super.disconnectedCallback();

    markAsRead(this.email);
  }

  async setupReminder() {
    // this.showReminder = true;
    const reminderAlert: any = document.createElement("ion-alert");

    console.log(reminderAlert);

    reminderAlert.header = "Set Reminder";
    reminderAlert.backdropDismiss = false;
    reminderAlert.inputs = [
      {
        name: "date",
        type: "datetime-local",
        id: "date",
      },
    ];
    reminderAlert.buttons = [
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "secondary",
        handler: () => {
          console.log("Confirm Cancel");
        },
      },
      {
        text: "Confirm",
        icon: "clock-outline",
        handler: async (data: any) => {
          console.log(data);
          await reminderAlert.dismiss();

          await this.setReminder(data.date);
          // await this.attachFile();
        },
      },
    ];

    this.shadowRoot?.appendChild(reminderAlert);
    await reminderAlert.present();
  }

  async reader() {
    // @ts-ignore
    const reader = await import("/workers/reader.js");

    const content = {
      title: "Immersive Reader",
      chunks: [
        {
          content: "Hello, world!",
        },
      ],
    };
    (window as any).ImmersiveReader.launchAsync("7c1759c1b0094400a2ef50a582dbaecf", "mailgo-reader", content);
  }

  cancel() {
    this.showReminder = false;
  }

  reply() {
    const id = this.email.id;

    Router.go(`/newEmail?id=${id}`);
  }

  async bookmark(email: any) {
    console.log(email);

    try {
      await flagEmail(email);
    } catch (err) {
      console.error(err);
    }
  }

  openInNew() {
    window.open(
      location.href,
      Math.random().toString(),
      "left=50,top=50,width=1000,height=800"
    );
  }

  async unsubscribe(id: number) {
    const returnValue = await unsub(id);

    if (returnValue === true) {
      console.log("success");

      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      toastElement?.open("Unsubscribed...", "success");
    } else {
      console.log("failure");

      let toastElement: any = this.shadowRoot?.getElementById("myToast");
      toastElement?.open("Could not unsubscribe...", "error");
    }
  }

  openAttach() {
    this.openAttachments = true;
  }

  closeAttach() {
    this.openAttachments = false;
  }

  render() {
    return html`
      <div id="detailBlock">
        <section id="detailAction">
          <div id="detailActions">
            <fast-button
              @click="${() => this.back()}"
              class="back"
              aria-label="back button"
            >
              Back

              <ion-icon name="chevron-back-outline"></ion-icon>
            </fast-button>

            <fast-button
              appearance="outline"
              id="openWindow"
              appearance="stealth"
              @click="${() => this.openInNew()}"
            >
              <ion-icon name="open"></ion-icon>
            </fast-button>
          </div>

          ${this.email
            ? html`<h2>${this.email?.subject}</h2>`
            : html`<fast-skeleton
                style="
                margin-top: 1em;
                width: 300px;
                height: 32px;
            "
                shape="rect"
                shimmer
              ></fast-skeleton>`}
          ${this.openAttachments &&
          this.attachments &&
          this.attachments.length > 0
            ? html`<app-attachments
                @close="${() => this.closeAttach()}"
                .attachments=${this.attachments}
                .mail="${this.email}"
              ></app-attachments>`
            : null}

          <div id="detailMoreActions">
            ${this.email?.flag.flagStatus !== "flagged"
              ? html`<fast-button
                  id="flagButtonAbout"
                  class="detailActionButton"
                  @click="${() => this.bookmark(this.email)}"
                >
                  Flag

                  <ion-icon name="flag-outline"></ion-icon>
                </fast-button>`
              : null}
            ${"showTrigger" in Notification.prototype
              ? html`<fast-button
                  class="detailActionButton"
                  id="reminderInitButton"
                  @click="${() => this.setupReminder()}"
                >
                  Reminder

                  <ion-icon name="notifications-circle-outline"></ion-icon>
                </fast-button>`
              : null}

            <fast-button
              @click="${() => this.share()}"
              aria-label="share button"
              id="share-button"
            >
              Share

              <ion-icon name="share-outline"></ion-icon>
            </fast-button>

            <!--<fast-button @click="${() => this.reader()}" id="reader-button">
              Reader View
            </fast-button>-->

            ${this.email?.unsubscribeEnabled
              ? html`<fast-button
                  id="unsubButton"
                  @click="${() => this.unsubscribe(this.email.id)}"
                >
                  Unsubscribe

                  <ion-icon name="close-outline"></ion-icon>
                </fast-button>`
              : null}
            ${this.attachments && this.attachments.length > 0
              ? html`
                  <fast-button
                    id="unsubButton"
                    @click="${() => this.openAttach()}"
                  >
                    Attachments

                    <ion-icon name="folder-outline"></ion-icon>
                  </fast-button>
                `
              : null}

            <fast-button id="replyButton" @click="${() => this.reply()}">
              Reply

              <ion-icon name="mail-outline"></ion-icon>
            </fast-button>
          </div>
        </section>

        <div id="content">
          <!--<iframe
            sandbox="allow-top-navigation"
            .srcdoc="${this.email?.body.content}"
          >
            <a target="_blank"></a>
          </iframe>-->
          ${this.email ? html`<div id="actual-email" .innerHTML="${this.email?.body.content}">` : 
            html`<div id="mail-loader">
              <fast-progress-ring></fast-progress-ring>
            </div>`
          }
          </div>
        </div>

        <dile-toast id="myToast" duration="3000"></dile-toast>
      </div>
    `;
  }
}
