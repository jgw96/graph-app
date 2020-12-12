import { LitElement, css, html, customElement, property } from 'lit-element';
import { getAnEmail, flagEmail, markAsRead, listAttach } from '../services/mail';

import { classMap } from 'lit-html/directives/class-map';

import '../components/app-attachments';


import { Router } from '@vaadin/router';

declare var TimestampTrigger: any;


@customElement('app-about')
export class AppAbout extends LitElement {

  @property() email: any = null;
  @property({ type: String }) reminderTime: string = "";
  @property({ type: Boolean }) showReminder: boolean = false;
  @property({ type: Boolean }) emailLoaded: boolean = false;

  @property() attachments: any[] | null = null;

  static get styles() {
    return css`

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
        left: 14px;
        width: 32vw;
        background: #222222;
        padding: 10px;
        border-radius: 8px;

        animation-name: slidein;
        animation-duration: 280ms;
      }

      @media(prefers-color-scheme: light) {
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
        width: 100%;
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
        
        background-image:
          radial-gradient( circle 50px at 50px 50px, lightgray 99%, transparent 0 ),
          linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ),
          linear-gradient( lightgray 20px, transparent 0 ),
          linear-gradient( lightgray 20px, transparent 0 ),
          linear-gradient( lightgray 20px, transparent 0 ),
          linear-gradient( lightgray 20px, transparent 0 );
    
        background-repeat: repeat-y;
    
        background-size:
          100px 200px, /* circle */
          50px 200px, /* highlight */
          150px 200px,
          350px 200px,
          300px 200px,
          250px 200px;
    
        background-position:
          0 0, /* circle */
          0 0, /* highlight */
          120px 0,
          120px 40px,
          120px 80px,
          120px 120px;
    
        animation: shine 1s infinite;
      }

    
      @keyframes shine {
        to {
          background-position:
            0 0,
            100% 0, /* move highlight to right */
            120px 0,
            120px 40px,
            120px 80px,
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

      @media (min-width: 900px) {
        #detailBlock {
          display: grid;
          grid-template-columns: minmax(150px, 40%) 1fr;
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

      @media(min-width: 1300px) {
        #reminder {
          left: 28em;
          right: 28em;
        }
      }

      @media(prefers-color-scheme: light) {
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

        #openWindow, #flagButtonAbout {
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

      @media(screen-spanning: single-fold-vertical) {
        #detailBlock {
          grid-gap: 36px;
          grid-template-columns: minmax(240px, 48.8%) 1fr;
        }

        #detailMoreActions {
          width: 44.4vw;
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
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const search = new URLSearchParams(location.search);
    const id = search.get('id');

    if (id) {
      const email = await getAnEmail(id);
      console.log(email);
      this.email = email;

      const iframeEl = this.shadowRoot?.querySelector('iframe');
      console.log('iframeEl', iframeEl);
      iframeEl?.addEventListener('load', () => {
        console.log('loaded');
        this.emailLoaded = true;
      })

      this.attachments = await listAttach(id);
      console.log(this.attachments);
    }
  }

  back() {
    Router.go("/");
  }

  async share() {
    if ((navigator as any).share) {
      await (navigator as any).share({
        title: 'Shared Email',
        text: 'Check out this email',
        url: location.href,
      })
    }
  }

  handleDate(event: any) {
    console.log(event.target.value);
    this.reminderTime = event.target.value;
  }

  askPermission() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
      .then(function (permissionResult) {
        if (permissionResult !== 'granted') {
          throw new Error('We weren\'t granted permission.');
        }
      });
  }

  async setReminder() {
    try {
      await this.askPermission();

      const r: any = await navigator.serviceWorker.getRegistration();
      console.log(r);

      if (r) {
        r.showNotification("Mail Reminder", {
          tag: Math.random(),
          body: `Your reminder from Mail: ${location.href}`,
          showTrigger: new TimestampTrigger(Date.now() + (new Date(this.reminderTime).getTime() - Date.now())),
          icon: "/assets/icons/icon_512.png"
        });

      };

      this.showReminder = false;
    }
    catch {
      console.log("couldnt set reminder");
      this.showReminder = false;
    }
  }

  async disconnectedCallback() {
    super.disconnectedCallback();

    await markAsRead(this.email);
  }

  setupReminder() {
    this.showReminder = true;
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
    }
    catch (err) {
      console.error(err);
    }
  }

  openInNew() {
    window.open(
      location.href,
      "My Popup",
      "left=50,top=50,width=1000,height=800"
    );
  }

  render() {
    return html`
      <div id="detailBlock">
      
        <section id="detailAction">
          <div id="detailActions">
            <fast-button @click="${() => this.back()}" class="back" aria-label="back button">
              Back
      
              <ion-icon name="chevron-back-outline"></ion-icon>
            </fast-button>

            <fast-button appearance="outline" id="openWindow" appearance="stealth" @click="${() => this.openInNew()}">
              <ion-icon name="open"></ion-icon>
            </fast-button>
          </div>
      
          ${this.email ? html`<h2>${this.email?.subject}</h2>` : html`<fast-skeleton
            style="
                margin-top: 2em;
                width: 300px;
                height: 54px;
            "
            shape="rect"
            shimmer
        ></fast-skeleton>`}

        ${this.attachments && this.attachments.length > 0 ? html`<app-attachments .attachments=${this.attachments} .mail="${this.email}"></app-attachments>` : null}
      
          <div id="detailMoreActions">

          ${this.email?.flag.flagStatus !== "flagged" ? html`<fast-button id="flagButtonAbout" class="detailActionButton" @click="${() => this.bookmark(this.email)}">
             Flag

                      <ion-icon name="flag-outline"></ion-icon>
                    </fast-button>` : null}
      
            ${"showTrigger" in Notification.prototype ? html`<fast-button class="detailActionButton"
              @click="${() => this.setupReminder()}">
              Reminder
      
              <ion-icon name="notifications-circle-outline"></ion-icon>
            </fast-button>` : null}
      
            <fast-button @click="${() => this.share()}" aria-label="share button">
              Share
      
              <ion-icon name="share-outline"></ion-icon>
            </fast-button>

            <fast-button id="replyButton" @click="${() => this.reply()}">
              Reply

              <ion-icon name="mail-outline"></ion-icon>
            </fast-button>
          </div>
        </section>
      
        <div id="content">
          <iframe class=${classMap({ loading: !this.emailLoaded })} sandbox="allow-popups" .srcdoc="${this.email?.body.content}"></iframe>

        <fast-skeleton class=${classMap({ loading: this.emailLoaded })}
            style="
                width: 100%;
                height: 100%;
            "
            shape="rect"
            shimmer
        ></fast-skeleton>
        </div> 
      
      
        ${this.showReminder ? html`<div id="reminder">
          <label for="reminder-time">Set a Reminder:</label>
          <input type="datetime-local" id="reminder-time" name="reminder-time" @change="${this.handleDate}"
            .value="${this.reminderTime}">
          <fast-button @click="${() => this.setReminder()}">Set</fast-button>
          <fast-button id="cancelButton" @click="${() => this.cancel()}">Cancel</fast-button>
        </div>` : null}
      
      </div>
    `;
  }
}