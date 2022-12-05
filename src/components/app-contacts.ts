import { LitElement, css, html } from "lit";
import { getPeople } from "../services/contacts";

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';

import { customElement, state } from "lit/decorators.js";

@customElement("app-contacts")
export class AppContacts extends LitElement {
  @state() graphContacts: any[] | null = null;

  static get styles() {
    return css`
      .contactInfo {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .contactInfo .displayName {
        font-weight: bold;
      }

      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      sl-drawer ul {
        margin: 0;
        padding: 0;
      }

      .contactInfo .displayEmail {
        color: #6d6d6d;
      }

      #contactsHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1em;
      }

      #contactsHeader h3 {
        font-size: 1.5em;
        margin-top: 0;
        margin-bottom: 0;
      }

      #contactsBlock {
        background: #181818e8;
        backdrop-filter: blur(10px);
        position: absolute;
        z-index: 9999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        animation-name: fadeIn;
        animation-duration: 280ms;
      }

      #contactsList {
        background: #303030;
        position: absolute;
        top: 8em;
        z-index: 9999;
        bottom: 8em;
        left: 8em;
        right: 8em;
        border-radius: 4px;

        padding: 1em 2em;
        overflow: hidden;
      }

      #contactsList ul {
        margin: 0;
        padding: 0;
        list-style: none;

        overflow: auto;
        max-height: 52vh;
      }

      #contactsList ul::-webkit-scrollbar {
        width: 8px;
        background: #222222;
        border-radius: 4px;
      }

      @media (prefers-color-scheme: light) {
        #contactsList ul::-webkit-scrollbar {
          background: #ffffff;
        }
      }

      #contactsList sl-menu-item {
        margin-top: 10px;
        background: transparent;
      }

      #contactsList sl-menu-item::part(content) {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      #contactsList ul sl-button {
        height: 2em;
        margin-bottom: 6px;
      }

      #contactsButton {
        margin-bottom: 6px;
      }

      @media (screen-spanning: single-fold-vertical) {
        #contactsBlock {
          width: 50vw;
          left: initial;
          right: 0;
        }

        #contactsList {
          inset: 0;
          margin-left: 10px;
        }

        #contactsList ul {
          max-height: 80vh;
        }
      }

      @media (prefers-color-scheme: light) {
        #contactsBlock {
          background: #ffffff4d;
        }

        #contactsList {
          background: #f5f5f5;
        }

        ##contactsBlock sl-switch::part(label) {
          color: black;
        }

        .contactInfo .displayName {
          color: black;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0.2;
        }

        to {
          opacity: 1;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async selectContacts() {
    const supported = "contacts" in navigator && "ContactsManager" in window;

    if (supported) {
      const props = ["name", "email"];
      const opts = { multiple: false };

      try {
        const contacts = await (navigator as any).contacts.select(props, opts);
        this.handleResults(contacts);
      } catch (err) {
        // Handle any errors here.

        console.error(err);
      }
    } else {
      const drawer: any = this.shadowRoot?.querySelector("sl-drawer");
      drawer?.show();

      this.graphContacts = await getPeople();
    }
  }

  handleResults(contacts: any[]) {
    let addresses: any[] = [];

    contacts.forEach((contact) => {
      if (
        (contact.email && contact.email[0]) ||
        (contact.emailAddresses && contact.emailAddresses[0].address)
      ) {
        if (contact.email && contact.email[0]) {
          addresses.push(contact.email[0]);
        } else {
          addresses.push(contact.emailAddresses[0].address);
        }
      }
    });

    let event = new CustomEvent("got-contacts", {
      detail: {
        data: addresses,
      },
    });
    this.dispatchEvent(event);

    if (this.graphContacts) {
      this.graphContacts = null;
    }
  }

  close() {
    this.graphContacts = null;
  }

  render() {
    return html`
      <sl-button id="contactsButton" @click="${() => this.selectContacts()}">
        <ion-icon name="person-outline"></ion-icon>
      </sl-button>

      <sl-drawer label="Frequent Contacts">
      <ul>
                ${this.graphContacts ? this.graphContacts.map((contact) => {
                  return html`
                    <li>
                      <div class="contactInfo">
                        <span class="displayName">${contact.displayName}</span>
                        <span class="displayEmail"
                          >Address: ${contact.emailAddresses[0].address}</span
                        >
                      </div>

                      <sl-button
                        @click="${() => this.handleResults([contact])}"
                        >Select</sl-button
                      >
                </li>
                  `;
                }) : null}
              </ul>
      </sl-drawer>

     <!--  ${this.graphContacts
        ? html`<div id="contactsBlock">
            <div id="contactsList">
              <div id="contactsHeader">
                <h3>Frequent Contacts</h3>

                <sl-button @click="${() => this.close()}">
                  <ion-icon name="close-outline"></ion-icon>
                </sl-button>
              </div>
              <ul>
                ${this.graphContacts.map((contact) => {
                  return html`
                    <li>
                      <div class="contactInfo">
                        <span class="displayName">${contact.displayName}</span>
                        <span class="displayEmail"
                          >Address: ${contact.emailAddresses[0].address}</span
                        >
                      </div>

                      <sl-button
                        @click="${() => this.handleResults([contact])}"
                        >Select</sl-button
                      >
                </li>
                  `;
                })}
              </ul>
            </div>
          </div>`
        : null} -->
    `;
  }
}
