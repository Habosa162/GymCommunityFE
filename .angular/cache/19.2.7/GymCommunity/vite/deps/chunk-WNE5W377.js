import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleRenderer,
  defaultRippleAnimationConfig
<<<<<<<< Updated upstream:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-Y2HKOCYN.js
} from "./chunk-TPVZ25RS.js";
import {
  _getEventTarget
} from "./chunk-2NE43QZO.js";
========
<<<<<<<< HEAD:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-WNE5W377.js
} from "./chunk-OBCHRGP3.js";
import {
  _getEventTarget
} from "./chunk-6HCHJRUV.js";
========
} from "./chunk-TPVZ25RS.js";
import {
  _getEventTarget
} from "./chunk-2NE43QZO.js";
>>>>>>>> df8fb4d01c87985d7eb8c019e80c5c78cde16e16:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-Y2HKOCYN.js
>>>>>>>> Stashed changes:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-WNE5W377.js
import {
  _bindEventWithOptions
} from "./chunk-VC3ERYFJ.js";
import {
  Platform
<<<<<<<< Updated upstream:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-Y2HKOCYN.js
} from "./chunk-TBPBL5EG.js";
========
<<<<<<<< HEAD:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-WNE5W377.js
} from "./chunk-YBP6BAAT.js";
========
} from "./chunk-TBPBL5EG.js";
>>>>>>>> df8fb4d01c87985d7eb8c019e80c5c78cde16e16:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-Y2HKOCYN.js
>>>>>>>> Stashed changes:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-WNE5W377.js
import {
  DOCUMENT
} from "./chunk-4VAIYRI4.js";
import {
  ANIMATION_MODULE_TYPE,
  Injectable,
  Injector,
  NgZone,
  RendererFactory2,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-EFOSVCYK.js";

// node_modules/@angular/material/fesm2022/ripple-loader-77b972ac.mjs
var eventListenerOptions = {
  capture: true
};
var rippleInteractionEvents = ["focus", "mousedown", "mouseenter", "touchstart"];
var matRippleUninitialized = "mat-ripple-loader-uninitialized";
var matRippleClassName = "mat-ripple-loader-class-name";
var matRippleCentered = "mat-ripple-loader-centered";
var matRippleDisabled = "mat-ripple-loader-disabled";
var MatRippleLoader = class _MatRippleLoader {
  _document = inject(DOCUMENT);
  _animationMode = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  _globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, {
    optional: true
  });
  _platform = inject(Platform);
  _ngZone = inject(NgZone);
  _injector = inject(Injector);
  _eventCleanups;
  _hosts = /* @__PURE__ */ new Map();
  constructor() {
    const renderer = inject(RendererFactory2).createRenderer(null, null);
    this._eventCleanups = this._ngZone.runOutsideAngular(() => {
      return rippleInteractionEvents.map((name) => _bindEventWithOptions(renderer, this._document, name, this._onInteraction, eventListenerOptions));
    });
  }
  ngOnDestroy() {
    const hosts = this._hosts.keys();
    for (const host of hosts) {
      this.destroyRipple(host);
    }
    this._eventCleanups.forEach((cleanup) => cleanup());
  }
  /**
   * Configures the ripple that will be rendered by the ripple loader.
   *
   * Stores the given information about how the ripple should be configured on the host
   * element so that it can later be retrived & used when the ripple is actually created.
   */
  configureRipple(host, config) {
    host.setAttribute(matRippleUninitialized, this._globalRippleOptions?.namespace ?? "");
    if (config.className || !host.hasAttribute(matRippleClassName)) {
      host.setAttribute(matRippleClassName, config.className || "");
    }
    if (config.centered) {
      host.setAttribute(matRippleCentered, "");
    }
    if (config.disabled) {
      host.setAttribute(matRippleDisabled, "");
    }
  }
  /** Sets the disabled state on the ripple instance corresponding to the given host element. */
  setDisabled(host, disabled) {
    const ripple = this._hosts.get(host);
    if (ripple) {
      ripple.target.rippleDisabled = disabled;
      if (!disabled && !ripple.hasSetUpEvents) {
        ripple.hasSetUpEvents = true;
        ripple.renderer.setupTriggerEvents(host);
      }
    } else if (disabled) {
      host.setAttribute(matRippleDisabled, "");
    } else {
      host.removeAttribute(matRippleDisabled);
    }
  }
  /**
   * Handles creating and attaching component internals
   * when a component is initially interacted with.
   */
  _onInteraction = (event) => {
    const eventTarget = _getEventTarget(event);
    if (eventTarget instanceof HTMLElement) {
      const element = eventTarget.closest(`[${matRippleUninitialized}="${this._globalRippleOptions?.namespace ?? ""}"]`);
      if (element) {
        this._createRipple(element);
      }
    }
  };
  /** Creates a MatRipple and appends it to the given element. */
  _createRipple(host) {
    if (!this._document || this._hosts.has(host)) {
      return;
    }
    host.querySelector(".mat-ripple")?.remove();
    const rippleEl = this._document.createElement("span");
    rippleEl.classList.add("mat-ripple", host.getAttribute(matRippleClassName));
    host.append(rippleEl);
    const isNoopAnimations = this._animationMode === "NoopAnimations";
    const globalOptions = this._globalRippleOptions;
    const enterDuration = isNoopAnimations ? 0 : globalOptions?.animation?.enterDuration ?? defaultRippleAnimationConfig.enterDuration;
    const exitDuration = isNoopAnimations ? 0 : globalOptions?.animation?.exitDuration ?? defaultRippleAnimationConfig.exitDuration;
    const target = {
      rippleDisabled: isNoopAnimations || globalOptions?.disabled || host.hasAttribute(matRippleDisabled),
      rippleConfig: {
        centered: host.hasAttribute(matRippleCentered),
        terminateOnPointerUp: globalOptions?.terminateOnPointerUp,
        animation: {
          enterDuration,
          exitDuration
        }
      }
    };
    const renderer = new RippleRenderer(target, this._ngZone, rippleEl, this._platform, this._injector);
    const hasSetUpEvents = !target.rippleDisabled;
    if (hasSetUpEvents) {
      renderer.setupTriggerEvents(host);
    }
    this._hosts.set(host, {
      target,
      renderer,
      hasSetUpEvents
    });
    host.removeAttribute(matRippleUninitialized);
  }
  destroyRipple(host) {
    const ripple = this._hosts.get(host);
    if (ripple) {
      ripple.renderer._removeTriggerEvents();
      this._hosts.delete(host);
    }
  }
  static ɵfac = function MatRippleLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRippleLoader)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MatRippleLoader,
    factory: _MatRippleLoader.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRippleLoader, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  MatRippleLoader
};
<<<<<<<< Updated upstream:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-Y2HKOCYN.js
//# sourceMappingURL=chunk-Y2HKOCYN.js.map
========
<<<<<<<< HEAD:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-WNE5W377.js
//# sourceMappingURL=chunk-WNE5W377.js.map
========
//# sourceMappingURL=chunk-Y2HKOCYN.js.map
>>>>>>>> df8fb4d01c87985d7eb8c019e80c5c78cde16e16:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-Y2HKOCYN.js
>>>>>>>> Stashed changes:.angular/cache/19.2.7/GymCommunity/vite/deps/chunk-WNE5W377.js
