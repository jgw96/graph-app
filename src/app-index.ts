import { LitElement, css, html } from "lit";

import { customElement, state } from "lit/decorators.js";

import '@shoelace-style/shoelace/dist/components/button/button.js';

import "./pages/app-home";

import { Router } from "@vaadin/router";

import "./components/header";
import "./components/app-settings";
import "./components/cookie-banner";

@customElement("app-index")
export class AppIndex extends LitElement {
  @state() doSettings: boolean = false;

  static get styles() {
    return css`
      main {
        padding: 16px;
        margin-top: 33px;
      }

      #routerOutlet app-home,
      #routerOutlet app-about,
      #routerOutlet app-index,
      #routerOutlet app-new {
        display: block;
      }

      #routerOutlet > .leaving {
        animation: 160ms fadeOut ease-in-out;
      }

      #routerOutlet > .entering {
        animation: 160ms fadeIn linear;
      }

      @media (min-width: 800px) {
        main {
          --colors: #686bd2, #ff0076;
          --min-radius: 20;
          --max-radius: 100;
          --num-circles: 30;
          --min-opacity: 10;
          --max-opacity: 50;

          --voronoi-cell-colors: #686bd2, #ff0076;
          --voronoi-number-of-cells: 25;

          height: 88vh;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }

        to {
          opacity: 0;
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

    const ref = document.referrer;
    if (ref.includes("microsoft-store")) {
      // gtag('event', 'msstore', {'fullstring': document.referrer.toString()});
    }
  }

  firstUpdated() {
    // For more info on using the @vaadin/router check here https://vaadin.com/router
    const router = new Router(this.shadowRoot?.querySelector("#routerOutlet"));
    router.setRoutes([
      {
        path: "",
        children: [
          { path: "/", component: "app-home" } as any,
          {
            path: "/email",
            animate: true,
            component: "app-about",
            action: async () => {
              if ((document as any).startViewTransition) {
                await (document as any).startViewTransition();
                await import("./pages/app-about.js");
              }
              else {
                await import("./pages/app-about.js");
              }
            },
          } as any,
          {
            path: "/newEmail",
            animate: true,
            component: "app-new",
            action: async () => {
              if ((document as any).startViewTransition) {
                await (document as any).startViewTransition();
                await import("./pages/app-new.js");
              }
              else {
                await import("./pages/app-new.js");
              }
            },
          } as any,
        ],
      },
    ]);

    if ("virtualKeyboard" in navigator) {
      // The VirtualKeyboard API is supported!
      console.log("virtualKeyboard API supported");
      (navigator as any).virtualKeyboard.overlaysContent = true;
    }

    window.addEventListener('vaadin-router-location-changed', (ev: any) => {
      console.log(ev.detail.location.pathname);
      // gtag('set', 'page_path', ev.detail.location.pathname);
     // gtag('event', 'page_view');
    });

  }

  authed() {
    (
      (this.shadowRoot?.querySelector("#routerOutlet app-home") as any) || null
    )?.getSavedAndUpdate(true);
  }

  openSettings() {
    // this.doSettings = !this.doSettings;
    if (this.doSettings) {
      this.doSettings = false;
    }
    else {
      this.doSettings = true;
    }
  }

  render() {
    return html`
      <div>
        <cookie-banner></cookie-banner>

        <app-header
          @open-settings="${() => this.openSettings()}"
          @user-authed="${() => this.authed()}"
        ></app-header>

        <app-settings ?openSettings="${this.doSettings}"></app-settings>

        <main>
          <div id="routerOutlet"></div>
        </main>
      </div>
    `;
  }
}
