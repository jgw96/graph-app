import { LitElement, css, html, customElement, internalProperty } from 'lit-element';
import { getContacts } from '../services/contacts';

@customElement('app-contacts')
export class AppContacts extends LitElement {

  @internalProperty() graphContacts: any[] | null = null;

  static get styles() {
    return css`
      fast-button {
        border: solid 1px var(--app-color-secondary);
        margin-bottom: 6px;
        background: var(--app-color-secondary);
      }

      #contactsHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1em;
      }

      #contactsBlock {
        background: #181818e8;
        backdrop-filter: blur(10px);
        position: absolute;
        z-index: 999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        animation-name: fadeIn;
        animation-duration: 280ms;
      }

      #contactsList {
        background: var(--background-color);
        position: absolute;
        top: 8em;
        z-index: 9999;
        bottom: 8em;
        left: 8em;
        right: 8em;
        border-radius: 4px;

        padding: 1em 2em;
      }

      #contactsList ul {
        margin: 0;
        padding: 0;
        list-style: none;

        overflow: auto;
        max-height: 25em;
      }

      #contactsList fast-menu-item {
        margin-top: 10px;
        background: transparent;
      }

      #contactsList fast-menu-item::part(content) {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    const supported = ('contacts' in navigator && 'ContactsManager' in window);

    if (supported) {
      const props = ['name', 'email'];
      const opts = { multiple: false };

      try {
        const contacts = await (navigator as any).contacts.select(props, opts);
        this.handleResults(contacts);
      } catch (err) {
        // Handle any errors here.

        console.error(err);
      }
    }
    else {
      this.graphContacts = await getContacts();
    }
  }

  handleResults(contacts: any[]) {
    let addresses: any[] = [];

    contacts.forEach((contact) => {
      if ((contact.email && contact.email[0]) || ( contact.emailAddresses && contact.emailAddresses[0].address )) {
        if (contact.email && contact.email[0]) {
          addresses.push(contact.email[0]);
        }
        else {
          addresses.push(contact.emailAddresses[0].address);
        }
      }
    });

    let event = new CustomEvent('got-contacts', {
      detail: {
        data: addresses
      }
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
        <fast-button @click="${() => this.selectContacts()}">
          <ion-icon name="person-outline"></ion-icon>
        </fast-button>

        ${this.graphContacts ? html`<div id="contactsBlock"><div id="contactsList">
          <div id="contactsHeader">
            <h3>Frequent Contacts</h3>

            <fast-button @click="${() => this.close()}">
              <ion-icon name="close-outline"></ion-icon>
            </fast-button>
          </div>
            <ul>
              ${this.graphContacts.map((contact) => {
      return html`
                    <fast-menu-item>
                      ${contact.displayName}

                      <fast-button @click="${() => this.handleResults([contact])}">Select</fast-button>
                    </fast-menu-item>
                  `
    })
        }
            </ul>
          </div></div>` : null
      }
      `;
  }
}