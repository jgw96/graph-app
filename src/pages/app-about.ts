import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js';

import {
  getAnEmail,
  flagEmail,
  markAsRead,
  listAttach,
  unsub,
  forwardMessage,
} from "../services/mail";

import "../components/app-attachments";

import { Router } from "@vaadin/router";

//@ts-ignore
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.min.mjs";

declare var TimestampTrigger: any;

@customElement("app-about")
export class AppAbout extends LitElement {
  @state() email: any = null;
  @state() reminderTime: string = "";
  @state() showReminder: boolean = false;
  @state() emailLoaded: boolean = false;
  @state() attachments: any[] | null = null;
  @state() openAttachments: boolean = false;

  @property() emailID: string = "";

  static get styles() {
    return css`
      sl-button::part(content) {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      #emailHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(41, 41, 68, 0.48);
        backdrop-filter: blur(40px);
        width: 94.4vw;
        border-radius: 8px;
        animation-name: slidein;
        animation-duration: 280ms;
        margin-top: 1em;
        padding-left: 12px;
      }

      sl-drawer sl-textarea {
        margin-top: 8px;
        margin-bottom: 8px;
      }

      sl-button[circle] ion-icon {
        width: 20px;
        height: 20px;
        margin-top: 9px;
      }

      #actual-email {
        border: solid 1px var(--app-color-primary);
        margin-top: 1em;
        min-height: 70vh;
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

      #subject {
        font-size: 1.6em;
        padding-top: 1em;

        view-transition-name: subject;
        contain: layout;

        margin: 0;
        padding: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 50vw;
        overflow: hidden;
      }

      #detailActions button.back {
        background-color: var(--app-color-secondary);
      }

      .detailActionButton {
        margin-right: 8px;
      }

      #detailAction {
        flex: 1;
        width: 95.5vw;
      }

      #detailAction h2 {
        color: white !important;
      }

      #detailActions {
        display: flex;
        justify-content: space-between;
        animation-name: slidein;
        animation-duration: 380ms;
      }

      #scrolledDetailActions {
        display: none;
        justify-content: space-between;
        animation-name: slidedown;
        animation-duration: 380ms;

        background: rgb(36 36 40 / 83%);
        backdrop-filter: blur(40px);
        padding: 0;
        padding-left: 10px;
        top: 3.2em;
        right: 2.4em;

        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        position: fixed;
        gap: 8px;
      }

      #scrolledDetailActions.scrolled {
        display: flex;
      }

      #detailMoreActions {
        display: flex;
        justify-content: flex-end;
        padding-right: 1em;
        padding: 10px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;

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
        height: 93%;

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

      #content iframe::-webkit-scrollbar {
        display: none;
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

      #reminder sl-button {
        margin-top: 2em;
        background: var(--app-color-primary);
      }

      #reminder sl-button#cancelButton {
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

      @keyframes slidedown {
        from {
          transform: translateY(-20px);
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
      }

      #replyButton, #forwardButton {
      }

      @media (min-width: 900px) {
        #detailBlock {
          overflow-y: scroll;
          overflow-x: hidden;
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

        sl-progress-bar {
          width: 30%;
          position: fixed;
          bottom: 36vh;
        }
      }

      @media (prefers-color-scheme: light) {
        #reminder {
          background: white;
        }
      }

      @media (max-width: 840px) {
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

        #scrolledDetailActions.scrolled {
          bottom: 10px;
          right: 10px;
          justify-content: flex-end;
          border-radius: 6px;

          gap: 0px;
          width: 90vw;
          padding-right: 10px;

          top: initial;
          justify-content: flex-start;
          width: fit-content;
          overflow-y: scroll;
          padding-right: 14px;
        }

        #reminderInitButton {
          display: none;
        }

        #openWindow,
        #flagButtonAbout {
          display: none;
        }

        #content {
          height: 84vh;
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

      @media(max-width: 600px) {
        #subject {
          display: none;
        }

        #emailHeader {
          display: none;
        }

        #detailMoreActions {
          width: initial;
        }
      }

      @media (max-width: 420px) {
        #share-button {
          display: none;
        }

        #detailMoreActions {
          backdrop-filter: none;
          width: initial;
        }

        #emailHeader {
          width: initial;
        }

        #emailHeader h2 {
          font-size: 1.2em;
        }
      }

      @media (max-width: 340px) {
        #detailMoreActions {
          backdrop-filter: none;
          width: initial;
        }
      }

      @media(horizontal-viewport-segments: 2) {
        #detailBlock {
          width: 47vw;
        }

        #detailMoreActions {
          position: fixed;
          bottom: 0;
          right: 0px;

          flex-direction: column;
          width: 47vw;
          gap: 8px;
          height: 32vh;
          justify-content: space-between;
        }

        #detailMoreActions sl-button {
          margin: 0;
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
        .detailActionButton,
        #unsubButton {
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

        #replyButton::part(base) {
          color: white;
        }

        sl-drawer::part(panel) {
          background: #24242866;
          backdrop-filter: blur(20px);
        }

        @media (max-width: 800px) {
          #detailActions {
            background: #1c1b1be8;
          }
        }
      }

      @media (prefers-color-scheme: dark) {
        sl-skeleton {
          --skeleton-fill-default: #131212;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    let id: string | null;
    if (this.emailID) {
      id = this.emailID;
    }
    else {
      const search = new URLSearchParams(location.search);
      id = search.get("id");
    }

    if (id) {
      try {
        const email = await getAnEmail(id);
        console.log(email);
        this.email = email;

        this.attachments = await listAttach(id);
        console.log(this.attachments);
      } catch (err) {
        let toastElement: any = this.shadowRoot?.getElementById("myToast");
        toastElement?.open(
          "We could not load this email, try again later...",
          "error"
        );
      }
    }

    const watchedElement = this.shadowRoot?.querySelector("#subject");
    const scrollerBar = this.shadowRoot?.querySelector(
      "#scrolledDetailActions"
    );

    const intersectionObserver = new IntersectionObserver((entries) => {
      // If intersectionRatio is 0, the target is out of view
      // and we do not need to do anything.
      if (entries[0].intersectionRatio <= 0) {
        scrollerBar?.classList.add("scrolled");
      } else {
        scrollerBar?.classList.remove("scrolled");
      }
    });

    if (watchedElement) {
      intersectionObserver.observe(watchedElement);
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

  }

  cancel() {
    this.showReminder = false;
  }

  reply() {
    const id = this.email.id;

    Router.go(`/newEmail?id=${id}`);
  }

  async forwardMail() {

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

  openForward() {
    const drawer: any = this.shadowRoot?.querySelector("sl-drawer");
    drawer?.show();
  }

  async doForward() {
    const id = this.email.id;
    const to = (this.shadowRoot?.querySelector("#to") as any)?.value;
    const comment = (this.shadowRoot?.querySelector("#comment") as any)?.value;

    await forwardMessage(id, to, comment);

    const drawer: any = this.shadowRoot?.querySelector("sl-drawer");
    drawer?.hide();
  }

  render() {
    return html`
      <sl-drawer label="Forward Email">
        <sl-input type="email" placeholder="To" id="to"></sl-input>

        <sl-textarea id="comment" label="Comment">

        </sl-textarea>

        <sl-button id="send" @click="${() => this.doForward()}">Send</sl-button>
      </sl-drawer>

      <div id="detailBlock">
        <section id="detailAction">
          <div id="detailActions" part="detailActions">
            <sl-button
              @click="${() => this.back()}"
              class="back"
              aria-label="back button"
            >
              Back

              <ion-icon name="chevron-back-outline"></ion-icon>
            </sl-button>

            <sl-button
              appearance="outline"
              id="openWindow"
              appearance="stealth"
              @click="${() => this.openInNew()}"
              circle
            >
              <ion-icon name="open"></ion-icon>
            </sl-button>
          </div>

          <div id="scrolledDetailActions" part="scrolledDetailActions">
          <sl-button
              @click="${() => this.back()}"
              class="back"
              aria-label="back button"
              part="back"
              circle

            >
              <ion-icon name="chevron-back-outline"></ion-icon>
            </sl-button>

            <div id="detailMoreActions">
              ${
                this.email?.flag.flagStatus !== "flagged"
                  ? html`<sl-button
                      id="flagButtonAbout"
                      class="detailActionButton"
                      @click="${() => this.bookmark(this.email)}"
                      circle
                    >
                      <ion-icon name="flag-outline"></ion-icon>
                    </sl-button>`
                  : null
              }

              <sl-button
                @click="${() => this.share()}"
                aria-label="share button"
                id="share-button"
                circle
              >

                <ion-icon name="share-outline"></ion-icon>
              </sl-button>

              <!--<sl-button @click="${() => this.reader()}" id="reader-button">
                Reader View
              </sl-button>-->

              ${
                this.email?.unsubscribeEnabled
                  ? html`<sl-button
                      id="unsubButton"
                      @click="${() => this.unsubscribe(this.email.id)}"
                    >
                      Unsubscribe

                      <ion-icon name="close-outline"></ion-icon>
                    </sl-button>`
                  : null
              }
              ${
                this.attachments && this.attachments.length > 0
                  ? html`
                      <sl-button
                        id="unsubButton"
                        @click="${() => this.openAttach()}"
                      >
                        Attachments

                        <ion-icon name="folder-outline"></ion-icon>
                      </sl-button>
                    `
                  : null
              }

              <sl-button id="forwardButton" @click="${() => this.openForward()}">
                Forward
                <ion-icon name="arrow-forward-circle-outline"></ion-icon>
              </sl-button>
            </div>

            <sl-button variant="primary" id="replyButton" @click="${() => this.reply()}">
                Reply

                <ion-icon name="mail-outline"></ion-icon>
              </sl-button>
          </div>

          <div id="emailHeader" part="emailHeader">
          ${
            this.email
              ? html`<h2 id="subject">${this.email?.subject}</h2>`
              : html`<sl-skeleton
                  style="
                margin-top: 1em;
                width: 300px;
                height: 32px;
            "
                  shape="rect"
                  shimmer
                ></sl-skeleton>`
          }

            <div id="detailMoreActions">

            <sl-button variant="primary" id="replyButton" @click="${() => this.reply()}">
                Reply

                <ion-icon name="mail-outline"></ion-icon>
              </sl-button>
              ${
                this.email?.flag.flagStatus !== "flagged"
                  ? html`<sl-button
                      id="flagButtonAbout"
                      class="detailActionButton"
                      @click="${() => this.bookmark(this.email)}"
                      circle
                    >
                      <ion-icon name="flag-outline"></ion-icon>
                    </sl-button>`
                  : null
              }
              <sl-button
                @click="${() => this.share()}"
                aria-label="share button"
                id="share-button"
                circle
              >
                <ion-icon name="share-outline"></ion-icon>
              </sl-button>

              <!--<sl-button @click="${() => this.reader()}" id="reader-button">
                Reader View
              </sl-button>-->

              ${
                this.email?.unsubscribeEnabled
                  ? html`<sl-button
                      id="unsubButton"
                      @click="${() => this.unsubscribe(this.email.id)}"
                    >
                      Unsubscribe

                      <ion-icon name="close-outline"></ion-icon>
                    </sl-button>`
                  : null
              }
              ${
                this.attachments && this.attachments.length > 0
                  ? html`
                      <sl-button
                        id="unsubButton"
                        @click="${() => this.openAttach()}"
                      >
                        Attachments

                        <ion-icon name="folder-outline"></ion-icon>
                      </sl-button>
                    `
                  : null
              }

              <sl-button circle id="forwardButton" @click="${() => this.openForward()}">
                <ion-icon name="arrow-forward-circle-outline"></ion-icon>
              </sl-button>
            </div>
          </div>
          ${
            this.openAttachments &&
            this.attachments &&
            this.attachments.length > 0
              ? html`<app-attachments
                  @close="${() => this.closeAttach()}"
                  .attachments=${this.attachments}
                  .mail="${this.email}"
                ></app-attachments>`
              : null
          }


        </section>

        <div id="content">

           ${
            // @ts-ignore
            this.email
              ? html`<div id="content"
              .innerHTML="${this.email?.body.content}"
            >
           </div>`
              : html`<div id="mail-loader">
                  <sl-progress-bar indeterminate></sl-progress-bar>
                </div>`
          }
          </div>
        </div>

        <dile-toast id="myToast" duration="3000"></dile-toast>
      </div>
    `;
  }
}
