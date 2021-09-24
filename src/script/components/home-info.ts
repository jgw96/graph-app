import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators";

@customElement("home-info")
export class HomeInfo extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html``;
  }
}
