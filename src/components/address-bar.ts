import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js'
import { searchPeople } from '../services/contacts';

import '@shoelace-style/shoelace/dist/components/popup/popup.js';

@customElement('address-bar')
export class AddressBar extends LitElement {
    @state() address: string = "";
    @state() searchContacts: any[] = [];
    @state() dropped: boolean = false;

    @state() contacts: any[] = [];

    @state() addressString: string = "";

    static styles = [
        css`
            :host {
                z-index: 99;

                display: flex;
                flex-direction: row-reverse;
                align-items: center;
                gap: 10px;
                width: 100%;
                justify-content: flex-end;
                margin-left: 10px;
            }

            sl-popup::part(popup) {
                background: white;
            }

            ul {
                margin: 0;
                padding: 12px;
                list-style: none;
                display: flex;
                flex-direction: column;
                gap: 8px;

                background: white;
            }

            @media(prefers-color-scheme: dark) {
                ul, sl-popup::part(popup) {
                    background: #1e2026;
                }

                ul li {
                    background: #2e323e;
                }
            }

            ul li {
                background: #f5f5f5;
                padding: 10px;
                border-radius: 6px;

                cursor: pointer;
            }

            .contact {
                background: #f5f5f5;
                padding: 4px;
                border-radius: 6px;
                padding-left: 8px;
                padding-right: 8px;

                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 6px;
            }

            @media(prefers-color-scheme: dark) {
                .contact {
                    background: #393d4c;
                }

                ul li {
                    background: #2e323e;
                }
            }

            .contacts {
                display: flex;
                flex-direction: row;
                gap: 6px;
                align-items: center;

            }

            .box {
                min-width: 13em;
            }
        `
    ];

    async updateAddress(event: any) {
        console.log("event.target", event.target);
        if (event.target.value.length > 0 && event.target.value.includes("@") == false) {
            this.address = event.target.value;

            this.dropped = true;

            const peopleSearchData = await searchPeople(event.target.value);
            console.log("people", peopleSearchData);

            this.searchContacts = peopleSearchData;
        } else if (event.target.value.length > 0 && event.target.value.includes("@")) {
            this.dropped = false;

            this.addressString += event.target.value + ",";

            this.contacts = [...this.contacts, {
                displayName: event.target.value,
                emailAddresses: [{
                    address: event.target.value
                }]
            }];

            this.dispatchEvent(new CustomEvent('address-changed', {
                detail: {
                    address: this.addressString
                }
            }));
        } else {
           this.dropped = false;
        }
    }

    selectContact(contact: any) {
        this.contacts = [...this.contacts, contact];
        this.dropped = false;

        this.addressString = "";
        this.contacts.forEach((contact: any) => {
            this.addressString += contact.scoredEmailAddresses[0].address + ",";
        });

        // fire custom event
        this.dispatchEvent(new CustomEvent('address-changed', {
            detail: {
                address: this.addressString
            }
        }));
    }

    removeContact(contact: any) {
        console.log("remove", contact);

        this.contacts = this.contacts.filter((c: any) => c.displayName !== contact.displayName);

        this.addressString = "";
        this.contacts.forEach((contact: any) => {
            this.addressString += contact.scoredEmailAddresses[0].address + ",";
        });

        // fire custom event
        this.dispatchEvent(new CustomEvent('address-changed', {
            detail: {
                address: this.addressString
            }
        }));
    }

    render() {
        return html`
        <sl-popup ?active="${this.dropped}" placement="bottom">
          <sl-input slot="anchor" class="contacts" .value="${this.address}" @sl-change="${(event: CustomEvent) => this.updateAddress(event)}"
            type="text" id="recip" placeholder="test@email.com"></sl-input>

            <div class="box">
                <ul>
                    ${this.searchContacts && this.searchContacts.length > 0 ? this.searchContacts.map((contact: any) => html`
                        <li @click="${() => this.selectContact(contact)}">${contact.displayName}</li>
                    `) : html`<li>Loading...</li>`}
                </ul>
            </div>
         </sl-popup>

            <div class="contacts">
                ${this.contacts.map((contact: any) => html`
                    <span class="contact">
                        <sl-button @click="${() => this.removeContact(contact)}" circle size="small">
                          <ion-icon name="close-outline"></ion-icon>
                        </sl-button>
                      ${contact.displayName}
                    </span>
                `)}
            </div>
        `;
    }
}
