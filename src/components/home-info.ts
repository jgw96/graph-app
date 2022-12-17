import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import "../components/app-login";

@customElement("home-info")
export class HomeInfo extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        overflow-x: hidden;

        margin-top: 60px;

        overflow-y: scroll;
        height: 90vh;
      }

      :host::-webkit-scrollbar {
        display: none;
      }

      #introBlock {
        font-weight: bold;
        text-align: center;
        background: white;
        border-radius: 6px;
        padding: 2em;
        background: rgb(39 42 53 / 84%);
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: space-between;
        backdrop-filter: blur(10px);

        animation-name: slidein;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
      }

      #introBlock h2 {
        margin-top: 0;
        margin-bottom: 0;
      }

      #introBlock app-login {
        margin-top: 1em;
      }

      #introBlock app-login::part(loginButton) {
        height: 32px;
      }

      #introBlock img {
        height: 24em;
      }

      #introSpan {
        font-weight: normal;
        font-size: 12px;
        margin-top: 8px;
        color: white;
      }

      #intro-actions {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        margin-bottom: -1em;
      }

      #advBlock {
        animation-name: slidein;
        animation-duration: 300ms;
        animation-fill-mode: forwards;

        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;
      }

      #advBlock::-webkit-scrollbar {
        display: none;
      }

      #advBlock .advOuter {
        flex-direction: column;
        align-items: center;
        display: inline-flex;
      }

      #advBlock .advInner {
        background: rgb(39 42 53 / 84%);
        color: white;
        padding: 1em;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 8px;
        width: 74vw;
        height: 100%;

        gap: 12px;
      }

      #advBlock .advInner li {
        font-weight: bold;
      }

      #advBlock .advInner img {
        content-visibility: auto;
      }

      @media (prefers-color-scheme: light) {
        #advBlock .advInner {
          background: white;
          color: black;
        }
      }

      #advBlock .advInner#firstBlock {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      #advBlock .advInner#firstBlock img {
        width: 20em;
        margin-right: 4vw;
      }

      #advBlock .advInner#firstBlock ul {
        height: initial;
        overflow: initial;
      }

      #advBlock div img {
        object-fit: contain;
        height: 120px;
        width: 136px;
      }

      #advBlock div p {
        font-weight: bold;
      }

      @media (prefers-color-scheme: dark) {
        #introBlock {
          color: white;
        }
      }

      @media (screen-spanning: single-fold-vertical) {
        #introBlock {
          margin-right: 0em;
          margin-left: calc(env(fold-left) + 2em);
        }

        #advBlock {
          display: none;
        }

        #introBlock {
          margin-right: 0em;
          margin-left: calc(env(fold-left) + 2em);
        }
      }



      @media (min-width: 1200px) {
        #introBlock {
          margin-left: 11em;
          margin-right: 11em;
        }
      }

      @media (min-width: 1000px) {
        #introBlock {
          margin-left: 12em;
          margin-right: 12em;
          align-items: flex-start;
          text-align: start;
        }
      }

      @media (max-width: 800px) {
        #advBlock {
          white-space: initial;
        }

        #intro-actions {
          justify-content: center;
        }

        #advBlock div img {
          height: 8em;
          margin-right: 0;
        }

        #advBlock .advInner {
          text-align: center;
          width: initial;
        }

        #advBlock .advOuter {
          display: initial;
          width: initial;
        }

        #advBlock .advInner#firstBlock {
          flex-direction: column;
        }

        #advBlock .advInner#firstBlock ul {
          margin-bottom: 0;
        }

        #advBlock .advInner#firstBlock ul li {
          margin-bottom: 0;
          font-weight: bold;
        }
      }

      @media (prefers-color-scheme: light) {
        #introSpan {
          color: black;
        }

        #introBlock {
          background: white;
        }
      }

      @media(horizontal-viewport-segments: 2) {
        #introBlock {
          margin: 0;
          margin: 12px;
          margin-left: 12px;
          margin-right: 0px;
          margin-bottom: 23px;
          height: fit-content;
          align-self: center;
        }

        #advBlock .advInner {
          width: initial;
        }

        :host {
          display: grid;
          grid-template-columns: 48vw 47vw;
          margin: 0;
          padding: 0;
          gap: 45px;
          height: 100vh;
        }
      }
    `,
  ];

  render() {
    return html`
      <div id="introBlock">
        <h2>
          MailGO is the most lightweight, fast and beautiful email client for Outlook. Sign in below to get started.
        </h2>

        <span id="introSpan">Powered by the Microsoft Graph.</span>

        <div id="intro-actions">
          <app-login></app-login>
        </div>
      </div>

      <div id="advBlock">
        <div class="advOuter">
          <div class="advInner">
            <img src="/assets/home_one.svg" alt="app icon" />

            <p>
              Simplify your inbox and save time with the sleek and intuitive design of MailGO.
            </p>
          </div>
        </div>

        <div class="advOuter">
          <div class="advInner">
            <img src="/assets/home_two.svg" />
            <p>
              Ever feel overwhelmed using your current email client? MailGO is here to help!
              MailGO lets you focus on what matters most, getting through your inbox and moving on with the day.
            </p>
          </div>
        </div>

        <div class="advOuter">
          <div class="advInner">
            <img src="/assets/super-woman.svg" />
            <p>
              No app to install, no waiting on a billion emails to sync before you can start. Just sign in and start using MailGO!
            </p>
          </div>
        </div>

        <div class="advOuter">
          <div class="advInner">
            <img src="/assets/pwa.svg" />
            <p>
              MailGO is a Progressive Web App, which means you can install it on your desktop or mobile device and use it offline. Just tap install in your browser
              to add MailGO to your home screen.
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
