import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { addContact, getContacts, getPeople, searchContacts } from '../services/contacts';

import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';

@customElement('contacts-page')
export class ContactsPage extends LitElement {
    @state() recentContacts: any[] | null = null;
    @state() contacts: any[] | null = null;

    @state() chosenContact: any = null;
    @state() chosenContactPhoto: any = null;

    static styles = [
        css`
            :host {
                display: block;

            }

            h1 {
                font-size: 1.5rem;
            }

            #add::part(base){
                color: white;
            }

            #contactBar {
                position: fixed;
                bottom: env(keyboard-inset-height, 12px);
                backdrop-filter: blur(10px);
                padding: 12px;
                display: flex;

                left: 12px;
                right: 12px;
                bottom: 12px;
                border-radius: 8px;

                justify-content: space-between;
                align-items: center;
                background: #ffffff69;
            }

            @media(prefers-color-scheme: dark) {
                #contactBar {
                    background: rgba(41, 41, 68, 0.48);
                }
            }

            #searchBlock {
                width: 20em;
                margin-bottom: 1em;
                margin-top: 2em;

                background: rgba(90, 90, 90, 0.23);
                padding: 8px;
                border-radius: 8px;
            }

            #allContacts {
                list-style: none;
                padding: 0px;
                margin: 0px;
                height: 72vh;
                overflow-y: auto;
                gap: 10px;

                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
            }


            #allContacts::-webkit-scrollbar {
                display: none;
            }

            #allContacts li {
                background: rgba(90, 90, 90, 0.23);
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 0px;
                cursor: pointer;
                height: 85px;
            }

            #allContacts li:hover {
                background: #4041b44d;
            }

            .contactInfo {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 16em;
            }

            .emailInfo, .phoneInfo {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 14px;
                margin-top: 6px;
            }

            .contactInfo, .emailInfo, .phoneInfo {
                max-width: 300px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .contactActions {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .card-header {
                width: 100%;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
              }

              .card-header [slot='header'] {
                display: flex;
                align-items: center;
                justify-content: space-between;
              }

              .card-header [slot="footer"] {
                display: flex;
                align-items: center;
                justify-content: flex-end;
              }

              .card-header h3 {
                margin: 0;
              }

              #addContact form {
                flex-direction: column;
                display: flex;
                gap: 10px;
              }

              .card-header sl-icon-button {
                font-size: var(--sl-font-size-medium);
              }

              @media(min-width: 1000px) {
                :host {
                  padding-left: 16px;
                  padding-right: 16px;
                }
              }
        `
    ];

    async firstUpdated() {
        this.recentContacts = await getPeople();
        this.contacts = await getContacts();
    }

    async moreInfo(contact: any) {
        this.chosenContact = contact;
        const drawer = this.shadowRoot?.getElementById('contactsBlock') as any;
        drawer.show();
    }

    async addContactDrawer() {
        const drawer = this.shadowRoot?.getElementById('addContact') as any;
        drawer.show();
    }

    async addContact() {
        const displayName = `${(this.shadowRoot?.querySelector("#firstNameInput") as HTMLInputElement).value} ${(this.shadowRoot?.querySelector("#lastNameInput") as HTMLInputElement).value}`;
        const email = (this.shadowRoot?.querySelector("#emailAddressInput") as HTMLInputElement).value;
        const phone = (this.shadowRoot?.querySelector("#phoneNumberInput") as HTMLInputElement).value;

        const contact = {
            displayName,
            givenName: displayName,
            emailAddresses: [
                {
                    address: email,
                    name: displayName
                }
            ],
            mobilePhone: phone
        };

        await addContact(contact);

        const drawer = this.shadowRoot?.getElementById('addContact') as any;
        drawer.hide();

        this.contacts = await getContacts();

        window.requestIdleCallback(() => {
            (this.shadowRoot?.querySelector("#firstNameInput") as HTMLInputElement).value = "";
            (this.shadowRoot?.querySelector("#lastNameInput") as HTMLInputElement).value = "";
            (this.shadowRoot?.querySelector("#emailAddressInput") as HTMLInputElement).value = "";
            (this.shadowRoot?.querySelector("#phoneNumberInput") as HTMLInputElement).value = "";
        }, {
            timeout: 1000
        })

    }

    async handleContactSearch(query: string) {
        if (query) {
            const searchValue = await searchContacts(query);

            this.contacts = null;

            if (searchValue && searchValue.length > 0) {
                this.contacts = searchValue;
            }
            else {
                this.contacts = await getContacts();
            }
        }
        else {
            this.contacts = await getContacts();
        }
    }

    doCall() {
        window.location.href = `tel: ${this.chosenContact.phones[0].number}`;
    }

    render() {
        return html`
         <h1>Contacts Book</h1>

         <div id="searchBlock">
           <sl-input @sl-change="${($event: any) => this.handleContactSearch($event.target.value)}" type="search" placeholder="Search contacts" clearable></sl-input>
         </div>

         <!-- <h2>Recent Contacts</h2> -->
<!--
         <ul>
            ${
                this.recentContacts && this.recentContacts.length > 0 ? this.recentContacts.map(contact => html`
                    <li>
                        <div class="contactInfo">
                            <span class="displayName">${contact.displayName}</span>
                        </div>

                        <div class="emailInfo">
                            <span class="displayEmail"></span>
                        </div>
                    </li>
                `)
            : null}
         </ul> -->

         <sl-drawer id="addContact" placement="end" label="Add Contact">
            <form>
                <sl-input id="firstNameInput" type="text" label="First Name" placeholder="First Name"></sl-input>
                <sl-input id="lastNameInput" type="text" label="Last Name" placeholder="Last Name"></sl-input>
                <sl-input id="phoneNumberInput" type="tel" label="Phone Number" placeholder="xxx-xxx-xxxx"></sl-input>
                <sl-input id="emailAddressInput" type="email" label="Email Address" placeholder="example@example.com"></sl-input>
            </form>

            <div slot="footer">
                <sl-button @click="${() => this.addContact()}" variant="primary">
                    Add

                    <ion-icon slot="suffix" name="add-outline"></ion-icon>
                </sl-button>
            </div>
         </sl-drawer>

         <sl-drawer id="contactsBlock" placement="end" label="${this.chosenContact?.displayName}">

           ${this.chosenContact && this.chosenContact.emailAddresses && this.chosenContact.emailAddresses.length > 0 ? html`<h3>Email Info</h3>` : null}
           <div class="contact-info">
            ${
                this.chosenContact && this.chosenContact.emailAddresses && this.chosenContact.emailAddresses.length > 0 ? this.chosenContact.emailAddresses.map((email: any) => html`
                    <div class="card-header">
                        ${email.address}

                        <div slot="footer">
                            <sl-button size="small" variant="primary">
                                Send Email
                                <ion-icon name="mail-outline"></ion-icon>
                            </sl-button>
                        </div>
            </div>
                `)
            : null}
           </div>

           ${this.chosenContact && this.chosenContact.phones && this.chosenContact.phones.length > 0 ? html`<h3>Phone Info</h3>` : null}
              <div class="contact-info">
            ${
                this.chosenContact && this.chosenContact.phones && this.chosenContact.phones.length > 0 ? this.chosenContact.phones.map((phone: any) => html`
                    <div class="card-header">

                        ${phone.number}

                        <div slot="footer">
                            <sl-button @click="${() => this.doCall()}" size="small" variant="primary">
                                Call
                                <ion-icon name="call-outline"></ion-icon>
                            </sl-button>
                        </div>
            </div>
                `)
            : null}
              </div>
         </sl-drawer>

        <ul id="allContacts">
            ${
                this.contacts && this.contacts.length > 0 ? this.contacts.map(contact => html`
                    <li @click="${() => this.moreInfo(contact)}">
                        <div class="contactInfo">
                            <span class="displayName">${contact.displayName}</span>
                        </div>

                        <div class="emailInfo">
                            <span class="displayEmail">${contact.emailAddresses[0] ? contact.emailAddresses[0].address : null}</span>
                        </div>

                        <div class="phoneInfo">
                            <span class="displayPhone">${contact.phones[0] ? contact.phones[0].number : null}</span>
                        </div>
                    </li>
                `)
            : null}
        </ul>

        <div id="contactBar">
            <sl-button href="/">
                Back

                <ion-icon name="chevron-back-outline"></ion-icon>
            </sl-button>

            <div>
                <sl-button id="add" variant="primary" @click="${() => this.addContactDrawer()}">
                    Add Contact
                    <ion-icon name="add-outline"></ion-icon>
                </sl-button>
            </div>
        </div>
        `;
    }
}
