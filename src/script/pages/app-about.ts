import { LitElement, css, html, customElement, property } from 'lit-element';
import { getAnEmail } from '../services/mail';


import { Router } from '@vaadin/router';

declare var TimestampTrigger: any;


@customElement('app-about')
export class AppAbout extends LitElement {

  @property() email: any = null;
  @property({ type: String }) reminderTime: string = "";
  @property({ type: Boolean }) showReminder: boolean = false;

  static get styles() {
    return css`
      .back {
        background: var(--app-color-primary);
        color: white;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        font-size: 1.4em;
        border-radius: 50%;
      }

      #detailAction {
        flex: 1;
      }

      #detailAction h2 {
        margin-right: 4em;
      }

      #detailActions {
        display: flex;
        justify-content: space-between;
        animation-name: slidein;
        animation-duration: 380ms;
      }

      #detailActions div {
        display: flex;
      }

      #detailActions button {
        margin-right: 6px;
        cursor: pointer;
      }

      #content {
        width: 100%;

        overflow-y: auto;
        border-radius: 10px;
        background: white;
        height: 90vh;
        flex: 2;
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

      #reminder button {
        margin-top: 2em;
        padding: 8px;
        background: white;
        border: none;
        color: var(--app-color-primary);
        font-weight: bold;
        border-radius: 6px;
        font-size: 18px;
      }

      #reminder button#cancelButton {
        margin-top: 12px;
        color: red;
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

      @media (min-width: 800px) {
        #detailBlock {
          display: flex;
          justify-content: space-between;
          background: #ffffff8f;
          backdrop-filter: blur(10px);
        }
      }

      @media (max-width: 800px) {
        #detailActions {
          position: fixed;
          bottom: 0;
          backdrop-filter: blur(10px);
          left: 0;
          right: 0;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          background: #ffffff69;
        }

        #detailActions div {
          display: flex;
        }
      }

      @media (prefers-color-scheme: dark) {
        #detailBlock {
          background: #29292987;
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

  setupReminder() {
    this.showReminder = true;
  }

  cancel() {
    this.showReminder = false;
  }

  render() {
    return html`
      <div id="detailBlock">

        <section id="detailAction">
          <div id="detailActions">
            <button @click="${() => this.back()}" class="back" aria-label="back button">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </button>

            <div>

              <button @click="${() => this.setupReminder()}" class="back" aria-label="alarm button">
                <ion-icon name="alarm-outline"></ion-icon>
              </button>

              <button @click="${() => this.share()}" class="back" aria-label="share button">
                <ion-icon name="share-outline"></ion-icon>
              </button>
            </div>
          </div>

          <h2>${this.email?.subject}</h2>
        </section>

        ${this.email ? html`<div id="content" .innerHTML="${this.email?.body.content}"></div>` : html`<div id="loading"></div>`}

        ${this.showReminder ? html`<div id="reminder">
            <label for="reminder-time">Set a Reminder:</label>
            <input type="datetime-local" id="reminder-time"
                  name="reminder-time" @change="${this.handleDate}" .value="${this.reminderTime}">
                  <button @click="${() => this.setReminder()}">Set</button>
                  <button id="cancelButton" @click="${() => this.cancel()}">Cancel</button>
        </div>` : null}

      </div>
    `;
  }
}