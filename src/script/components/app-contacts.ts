import { LitElement, css, html, customElement } from 'lit-element';

@customElement('app-contacts')
export class AppContacts extends LitElement {

    static get styles() {
        return css`
      button {
        height: 2.6em;
        width: 2.6em;
        border-radius: 50%;
        border: solid 1px var(--app-color-secondary);
        margin-bottom: 6px;
        background: var(--app-color-secondary);
        color: white;
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
    }

    handleResults(contacts: any[]) {
        let addresses: any[] = [];

        contacts.forEach((contact) => {
            if (contact.email[0]) {
                addresses.push(contact.email[0]);
            }
        });

        let event = new CustomEvent('got-contacts', {
            detail: {
                data: addresses
            }
        });
        this.dispatchEvent(event);
    }

    render() {
      return html`
        ${'contacts' in navigator && 'ContactsManager' in window ? html`<button @click="${() => this.selectContacts()}">
          <ion-icon name="person-outline"></ion-icon>
        </button>` : null}
      `;
    }
}