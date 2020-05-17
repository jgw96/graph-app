import { LitElement, css, html, customElement, property } from 'lit-element';
import { getAnEmail } from '../services/mail';


@customElement('app-about')
export class AppAbout extends LitElement {

  @property() email: any = null;

  static get styles() {
    return css`
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

  render() {
    return html`
      <div>
        <h2>${this.email?.subject}</h2>

        <div .innerHTML="${this.email?.body.content}"></div>
      </div>
    `;
  }
}