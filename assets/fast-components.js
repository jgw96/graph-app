const t = (function () {
  if ("undefined" != typeof globalThis) return globalThis;
  if ("undefined" != typeof global) return global;
  if ("undefined" != typeof self) return self;
  if ("undefined" != typeof window) return window;
  try {
    return new Function("return this")();
  } catch (t) {
    return {};
  }
})();
void 0 === t.trustedTypes && (t.trustedTypes = { createPolicy: (t, e) => e });
const e = Object.freeze([]),
  i = [],
  o = t.trustedTypes.createPolicy("fast-html", { createHTML: (t) => t });
let s = o;
const n = [];
function r() {
  if (n.length) throw n.shift();
}
function a(t) {
  try {
    t.call();
  } catch (t) {
    n.push(t), setTimeout(r, 0);
  }
}
function l() {
  let t = 0;
  for (; t < i.length; )
    if ((a(i[t]), t++, t > 1024)) {
      for (let e = 0, o = i.length - t; e < o; e++) i[e] = i[e + t];
      (i.length -= t), (t = 0);
    }
  i.length = 0;
}
const c = "fast-" + Math.random().toString(36).substring(2, 8),
  h = c + "{",
  d = "}" + c,
  u = Object.freeze({
    supportsAdoptedStyleSheets:
      Array.isArray(document.adoptedStyleSheets) &&
      "replace" in CSSStyleSheet.prototype,
    setHTMLPolicy(t) {
      if (s !== o) throw new Error("The HTML policy can only be set once.");
      s = t;
    },
    createHTML: (t) => s.createHTML(t),
    isMarker: (t) => t && 8 === t.nodeType && t.data.startsWith(c),
    extractDirectiveIndexFromMarker: (t) =>
      parseInt(t.data.replace(c + ":", "")),
    createInterpolationPlaceholder: (t) => `${h}${t}${d}`,
    createCustomAttributePlaceholder(t, e) {
      return `${t}="${this.createInterpolationPlaceholder(e)}"`;
    },
    createBlockPlaceholder: (t) => `\x3c!--${c}:${t}--\x3e`,
    queueUpdate(t) {
      i.length < 1 && window.requestAnimationFrame(l), i.push(t);
    },
    nextUpdate: () =>
      new Promise((t) => {
        u.queueUpdate(t);
      }),
    setAttribute(t, e, i) {
      null == i ? t.removeAttribute(e) : t.setAttribute(e, i);
    },
    setBooleanAttribute(t, e, i) {
      i ? t.setAttribute(e, "") : t.removeAttribute(e);
    },
    removeChildNodes(t) {
      for (let e = t.firstChild; null !== e; e = t.firstChild) t.removeChild(e);
    },
    createTemplateWalker: (t) => document.createTreeWalker(t, 133, null, !1),
  });
function p(t) {
  const e = this.spillover;
  -1 === e.indexOf(t) && e.push(t);
}
function g(t) {
  const e = this.spillover,
    i = e.indexOf(t);
  -1 !== i && e.splice(i, 1);
}
function f(t) {
  const e = this.spillover,
    i = this.source;
  for (let o = 0, s = e.length; o < s; ++o) e[o].handleChange(i, t);
}
function b(t) {
  return -1 !== this.spillover.indexOf(t);
}
class m {
  constructor(t, e) {
    (this.sub1 = void 0),
      (this.sub2 = void 0),
      (this.spillover = void 0),
      (this.source = t),
      (this.sub1 = e);
  }
  has(t) {
    return this.sub1 === t || this.sub2 === t;
  }
  subscribe(t) {
    this.has(t) ||
      (void 0 !== this.sub1
        ? void 0 !== this.sub2
          ? ((this.spillover = [this.sub1, this.sub2, t]),
            (this.subscribe = p),
            (this.unsubscribe = g),
            (this.notify = f),
            (this.has = b),
            (this.sub1 = void 0),
            (this.sub2 = void 0))
          : (this.sub2 = t)
        : (this.sub1 = t));
  }
  unsubscribe(t) {
    this.sub1 === t
      ? (this.sub1 = void 0)
      : this.sub2 === t && (this.sub2 = void 0);
  }
  notify(t) {
    const e = this.sub1,
      i = this.sub2,
      o = this.source;
    void 0 !== e && e.handleChange(o, t), void 0 !== i && i.handleChange(o, t);
  }
}
class v {
  constructor(t) {
    (this.subscribers = {}), (this.sourceSubscribers = null), (this.source = t);
  }
  notify(t) {
    var e;
    const i = this.subscribers[t];
    void 0 !== i && i.notify(t),
      null === (e = this.sourceSubscribers) || void 0 === e || e.notify(t);
  }
  subscribe(t, e) {
    var i;
    if (e) {
      let i = this.subscribers[e];
      void 0 === i && (this.subscribers[e] = i = new m(this.source)),
        i.subscribe(t);
    } else
      (this.sourceSubscribers =
        null !== (i = this.sourceSubscribers) && void 0 !== i
          ? i
          : new m(this.source)),
        this.sourceSubscribers.subscribe(t);
  }
  unsubscribe(t, e) {
    var i;
    if (e) {
      const i = this.subscribers[e];
      void 0 !== i && i.unsubscribe(t);
    } else
      null === (i = this.sourceSubscribers) || void 0 === i || i.unsubscribe(t);
  }
}
const y = /(:|&&|\|\||if)/,
  x = new WeakMap(),
  $ = new WeakMap();
let w = void 0,
  k = (t) => {
    throw new Error(
      "Must call enableArrayObservation before observing arrays."
    );
  };
class C {
  constructor(t) {
    (this.name = t), (this.field = "_" + t), (this.callback = t + "Changed");
  }
  getValue(t) {
    return void 0 !== w && w.watch(t, this.name), t[this.field];
  }
  setValue(t, e) {
    const i = this.field,
      o = t[i];
    if (o !== e) {
      t[i] = e;
      const s = t[this.callback];
      "function" == typeof s && s.call(t, o, e), I(t).notify(this.name);
    }
  }
}
const T = Object.freeze({
    setArrayObserverFactory(t) {
      k = t;
    },
    getNotifier(t) {
      let e = t.$fastController || x.get(t);
      return (
        void 0 === e &&
          (Array.isArray(t) ? (e = k(t)) : x.set(t, (e = new v(t)))),
        e
      );
    },
    track(t, e) {
      void 0 !== w && w.watch(t, e);
    },
    trackVolatile() {
      void 0 !== w && (w.needsRefresh = !0);
    },
    notify(t, e) {
      I(t).notify(e);
    },
    defineProperty(t, e) {
      "string" == typeof e && (e = new C(e)),
        this.getAccessors(t).push(e),
        Reflect.defineProperty(t, e.name, {
          enumerable: !0,
          get: function () {
            return e.getValue(this);
          },
          set: function (t) {
            e.setValue(this, t);
          },
        });
    },
    getAccessors(t) {
      let e = $.get(t);
      if (void 0 === e) {
        let i = Reflect.getPrototypeOf(t);
        for (; void 0 === e && null !== i; )
          (e = $.get(i)), (i = Reflect.getPrototypeOf(i));
        (e = void 0 === e ? [] : e.slice(0)), $.set(t, e);
      }
      return e;
    },
    binding(t, e, i = this.isVolatileBinding(t)) {
      return new L(t, e, i);
    },
    isVolatileBinding: (t) => y.test(t.toString()),
  }),
  I = T.getNotifier;
T.trackVolatile;
const F = u.queueUpdate;
function S(t, e) {
  T.defineProperty(t, e);
}
let D = null;
function E(t) {
  D = t;
}
class O {
  constructor() {
    (this.index = 0),
      (this.length = 0),
      (this.parent = null),
      (this.parentContext = null);
  }
  get event() {
    return D;
  }
  get isEven() {
    return this.index % 2 == 0;
  }
  get isOdd() {
    return this.index % 2 != 0;
  }
  get isFirst() {
    return 0 === this.index;
  }
  get isInMiddle() {
    return !this.isFirst && !this.isLast;
  }
  get isLast() {
    return this.index === this.length - 1;
  }
}
T.defineProperty(O.prototype, "index"), T.defineProperty(O.prototype, "length");
const R = Object.seal(new O());
class L extends m {
  constructor(t, e, i = !1) {
    super(t, e),
      (this.binding = t),
      (this.isVolatileBinding = i),
      (this.needsRefresh = !0),
      (this.needsQueue = !0),
      (this.first = this),
      (this.last = null),
      (this.propertySource = void 0),
      (this.propertyName = void 0),
      (this.notifier = void 0),
      (this.next = void 0);
  }
  observe(t, e) {
    this.needsRefresh && null !== this.last && this.disconnect();
    const i = w;
    (w = this.needsRefresh ? this : void 0),
      (this.needsRefresh = this.isVolatileBinding);
    const o = this.binding(t, e);
    return (w = i), o;
  }
  disconnect() {
    if (null !== this.last) {
      let t = this.first;
      for (; void 0 !== t; )
        t.notifier.unsubscribe(this, t.propertyName), (t = t.next);
      (this.last = null), (this.needsRefresh = this.needsQueue = !0);
    }
  }
  watch(t, e) {
    const i = this.last,
      o = I(t),
      s = null === i ? this.first : {};
    if (
      ((s.propertySource = t),
      (s.propertyName = e),
      (s.notifier = o),
      o.subscribe(this, e),
      null !== i)
    ) {
      if (!this.needsRefresh) {
        let e;
        (w = void 0),
          (e = i.propertySource[i.propertyName]),
          (w = this),
          t === e && (this.needsRefresh = !0);
      }
      i.next = s;
    }
    this.last = s;
  }
  handleChange() {
    this.needsQueue && ((this.needsQueue = !1), F(this));
  }
  call() {
    null !== this.last && ((this.needsQueue = !0), this.notify(this));
  }
  records() {
    let t = this.first;
    return {
      next: () => {
        const e = t;
        return void 0 === e
          ? { value: void 0, done: !0 }
          : ((t = t.next), { value: e, done: !1 });
      },
      [Symbol.iterator]: function () {
        return this;
      },
    };
  }
}
class A {
  constructor() {
    this.targetIndex = 0;
  }
}
class V extends A {
  constructor() {
    super(...arguments),
      (this.createPlaceholder = u.createInterpolationPlaceholder);
  }
}
class P extends A {
  constructor(t, e, i) {
    super(), (this.name = t), (this.behavior = e), (this.options = i);
  }
  createPlaceholder(t) {
    return u.createCustomAttributePlaceholder(this.name, t);
  }
  createBehavior(t) {
    return new this.behavior(t, this.options);
  }
}
function H(t, e) {
  (this.source = t),
    (this.context = e),
    null === this.bindingObserver &&
      (this.bindingObserver = T.binding(
        this.binding,
        this,
        this.isBindingVolatile
      )),
    this.updateTarget(this.bindingObserver.observe(t, e));
}
function z(t, e) {
  (this.source = t),
    (this.context = e),
    this.target.addEventListener(this.targetName, this);
}
function M() {
  this.bindingObserver.disconnect(),
    (this.source = null),
    (this.context = null);
}
function N() {
  this.bindingObserver.disconnect(),
    (this.source = null),
    (this.context = null);
  const t = this.target.$fastView;
  void 0 !== t && t.isComposed && (t.unbind(), (t.needsBindOnly = !0));
}
function B() {
  this.target.removeEventListener(this.targetName, this),
    (this.source = null),
    (this.context = null);
}
function j(t) {
  u.setAttribute(this.target, this.targetName, t);
}
function q(t) {
  u.setBooleanAttribute(this.target, this.targetName, t);
}
function _(t) {
  if ((null == t && (t = ""), t.create)) {
    this.target.textContent = "";
    let e = this.target.$fastView;
    void 0 === e
      ? (e = t.create())
      : this.target.$fastTemplate !== t &&
        (e.isComposed && (e.remove(), e.unbind()), (e = t.create())),
      e.isComposed
        ? e.needsBindOnly &&
          ((e.needsBindOnly = !1), e.bind(this.source, this.context))
        : ((e.isComposed = !0),
          e.bind(this.source, this.context),
          e.insertBefore(this.target),
          (this.target.$fastView = e),
          (this.target.$fastTemplate = t));
  } else {
    const e = this.target.$fastView;
    void 0 !== e &&
      e.isComposed &&
      ((e.isComposed = !1),
      e.remove(),
      e.needsBindOnly ? (e.needsBindOnly = !1) : e.unbind()),
      (this.target.textContent = t);
  }
}
function U(t) {
  this.target[this.targetName] = t;
}
function G(t) {
  const e = this.classVersions || Object.create(null),
    i = this.target;
  let o = this.version || 0;
  if (null != t && t.length) {
    const s = t.split(/\s+/);
    for (let t = 0, n = s.length; t < n; ++t) {
      const n = s[t];
      "" !== n && ((e[n] = o), i.classList.add(n));
    }
  }
  if (((this.classVersions = e), (this.version = o + 1), 0 !== o)) {
    o -= 1;
    for (const t in e) e[t] === o && i.classList.remove(t);
  }
}
class K extends V {
  constructor(t) {
    super(),
      (this.binding = t),
      (this.bind = H),
      (this.unbind = M),
      (this.updateTarget = j),
      (this.isBindingVolatile = T.isVolatileBinding(this.binding));
  }
  get targetName() {
    return this.originalTargetName;
  }
  set targetName(t) {
    if (((this.originalTargetName = t), void 0 !== t))
      switch (t[0]) {
        case ":":
          if (
            ((this.cleanedTargetName = t.substr(1)),
            (this.updateTarget = U),
            "innerHTML" === this.cleanedTargetName)
          ) {
            const t = this.binding;
            this.binding = (e, i) => u.createHTML(t(e, i));
          }
          break;
        case "?":
          (this.cleanedTargetName = t.substr(1)), (this.updateTarget = q);
          break;
        case "@":
          (this.cleanedTargetName = t.substr(1)),
            (this.bind = z),
            (this.unbind = B);
          break;
        default:
          (this.cleanedTargetName = t),
            "class" === t && (this.updateTarget = G);
      }
  }
  targetAtContent() {
    (this.updateTarget = _), (this.unbind = N);
  }
  createBehavior(t) {
    return new W(
      t,
      this.binding,
      this.isBindingVolatile,
      this.bind,
      this.unbind,
      this.updateTarget,
      this.cleanedTargetName
    );
  }
}
class W {
  constructor(t, e, i, o, s, n, r) {
    (this.source = null),
      (this.context = null),
      (this.bindingObserver = null),
      (this.target = t),
      (this.binding = e),
      (this.isBindingVolatile = i),
      (this.bind = o),
      (this.unbind = s),
      (this.updateTarget = n),
      (this.targetName = r);
  }
  handleChange() {
    this.updateTarget(this.bindingObserver.observe(this.source, this.context));
  }
  handleEvent(t) {
    E(t);
    const e = this.binding(this.source, this.context);
    E(null), !0 !== e && t.preventDefault();
  }
}
let X = null;
class Y {
  addFactory(t) {
    (t.targetIndex = this.targetIndex), this.behaviorFactories.push(t);
  }
  captureContentBinding(t) {
    t.targetAtContent(), this.addFactory(t);
  }
  reset() {
    (this.behaviorFactories = []), (this.targetIndex = -1);
  }
  release() {
    X = this;
  }
  static borrow(t) {
    const e = X || new Y();
    return (e.directives = t), e.reset(), (X = null), e;
  }
}
function Q(t) {
  if (1 === t.length) return t[0];
  let e;
  const i = t.length,
    o = t.map((t) =>
      "string" == typeof t ? () => t : ((e = t.targetName || e), t.binding)
    ),
    s = new K((t, e) => {
      let s = "";
      for (let n = 0; n < i; ++n) s += o[n](t, e);
      return s;
    });
  return (s.targetName = e), s;
}
const Z = d.length;
function J(t, e) {
  const i = e.split(h);
  if (1 === i.length) return null;
  const o = [];
  for (let e = 0, s = i.length; e < s; ++e) {
    const s = i[e],
      n = s.indexOf(d);
    let r;
    if (-1 === n) r = s;
    else {
      const e = parseInt(s.substring(0, n));
      o.push(t.directives[e]), (r = s.substring(n + Z));
    }
    "" !== r && o.push(r);
  }
  return o;
}
function tt(t, e, i = !1) {
  const o = e.attributes;
  for (let s = 0, n = o.length; s < n; ++s) {
    const r = o[s],
      a = r.value,
      l = J(t, a);
    let c = null;
    null === l
      ? i && ((c = new K(() => a)), (c.targetName = r.name))
      : (c = Q(l)),
      null !== c && (e.removeAttributeNode(r), s--, n--, t.addFactory(c));
  }
}
function et(t, e, i) {
  const o = J(t, e.textContent);
  if (null !== o) {
    let s = e;
    for (let n = 0, r = o.length; n < r; ++n) {
      const r = o[n],
        a =
          0 === n
            ? e
            : s.parentNode.insertBefore(
                document.createTextNode(""),
                s.nextSibling
              );
      "string" == typeof r
        ? (a.textContent = r)
        : ((a.textContent = " "), t.captureContentBinding(r)),
        (s = a),
        t.targetIndex++,
        a !== e && i.nextNode();
    }
    t.targetIndex--;
  }
}
const it = document.createRange();
class ot {
  constructor(t, e) {
    (this.fragment = t),
      (this.behaviors = e),
      (this.source = null),
      (this.context = null),
      (this.firstChild = t.firstChild),
      (this.lastChild = t.lastChild);
  }
  appendTo(t) {
    t.appendChild(this.fragment);
  }
  insertBefore(t) {
    if (this.fragment.hasChildNodes())
      t.parentNode.insertBefore(this.fragment, t);
    else {
      const e = t.parentNode,
        i = this.lastChild;
      let o,
        s = this.firstChild;
      for (; s !== i; ) (o = s.nextSibling), e.insertBefore(s, t), (s = o);
      e.insertBefore(i, t);
    }
  }
  remove() {
    const t = this.fragment,
      e = this.lastChild;
    let i,
      o = this.firstChild;
    for (; o !== e; ) (i = o.nextSibling), t.appendChild(o), (o = i);
    t.appendChild(e);
  }
  dispose() {
    const t = this.firstChild.parentNode,
      e = this.lastChild;
    let i,
      o = this.firstChild;
    for (; o !== e; ) (i = o.nextSibling), t.removeChild(o), (o = i);
    t.removeChild(e);
    const s = this.behaviors,
      n = this.source;
    for (let t = 0, e = s.length; t < e; ++t) s[t].unbind(n);
  }
  bind(t, e) {
    const i = this.behaviors;
    if (this.source !== t)
      if (null !== this.source) {
        const o = this.source;
        (this.source = t), (this.context = e);
        for (let s = 0, n = i.length; s < n; ++s) {
          const n = i[s];
          n.unbind(o), n.bind(t, e);
        }
      } else {
        (this.source = t), (this.context = e);
        for (let o = 0, s = i.length; o < s; ++o) i[o].bind(t, e);
      }
  }
  unbind() {
    if (null === this.source) return;
    const t = this.behaviors,
      e = this.source;
    for (let i = 0, o = t.length; i < o; ++i) t[i].unbind(e);
    this.source = null;
  }
  static disposeContiguousBatch(t) {
    if (0 !== t.length) {
      it.setStartBefore(t[0].firstChild),
        it.setEndAfter(t[t.length - 1].lastChild),
        it.deleteContents();
      for (let e = 0, i = t.length; e < i; ++e) {
        const i = t[e],
          o = i.behaviors,
          s = i.source;
        for (let t = 0, e = o.length; t < e; ++t) o[t].unbind(s);
      }
    }
  }
}
class st {
  constructor(t, e) {
    (this.behaviorCount = 0),
      (this.hasHostBehaviors = !1),
      (this.fragment = null),
      (this.targetOffset = 0),
      (this.viewBehaviorFactories = null),
      (this.hostBehaviorFactories = null),
      (this.html = t),
      (this.directives = e);
  }
  create(t) {
    if (null === this.fragment) {
      let t;
      const e = this.html;
      if ("string" == typeof e) {
        (t = document.createElement("template")),
          (t.innerHTML = u.createHTML(e));
        const i = t.content.firstElementChild;
        null !== i && "TEMPLATE" === i.tagName && (t = i);
      } else t = e;
      const i = (function (t, e) {
        const i = t.content;
        document.adoptNode(i);
        const o = Y.borrow(e);
        tt(o, t, !0);
        const s = o.behaviorFactories;
        o.reset();
        const n = u.createTemplateWalker(i);
        let r;
        for (; (r = n.nextNode()); )
          switch ((o.targetIndex++, r.nodeType)) {
            case 1:
              tt(o, r);
              break;
            case 3:
              et(o, r, n);
              break;
            case 8:
              u.isMarker(r) &&
                o.addFactory(e[u.extractDirectiveIndexFromMarker(r)]);
          }
        let a = 0;
        (u.isMarker(i.firstChild) || (1 === i.childNodes.length && e.length)) &&
          (i.insertBefore(document.createComment(""), i.firstChild), (a = -1));
        const l = o.behaviorFactories;
        return (
          o.release(),
          {
            fragment: i,
            viewBehaviorFactories: l,
            hostBehaviorFactories: s,
            targetOffset: a,
          }
        );
      })(t, this.directives);
      (this.fragment = i.fragment),
        (this.viewBehaviorFactories = i.viewBehaviorFactories),
        (this.hostBehaviorFactories = i.hostBehaviorFactories),
        (this.targetOffset = i.targetOffset),
        (this.behaviorCount =
          this.viewBehaviorFactories.length +
          this.hostBehaviorFactories.length),
        (this.hasHostBehaviors = this.hostBehaviorFactories.length > 0);
    }
    const e = this.fragment.cloneNode(!0),
      i = this.viewBehaviorFactories,
      o = new Array(this.behaviorCount),
      s = u.createTemplateWalker(e);
    let n = 0,
      r = this.targetOffset,
      a = s.nextNode();
    for (let t = i.length; n < t; ++n) {
      const t = i[n],
        e = t.targetIndex;
      for (; null !== a; ) {
        if (r === e) {
          o[n] = t.createBehavior(a);
          break;
        }
        (a = s.nextNode()), r++;
      }
    }
    if (this.hasHostBehaviors) {
      const e = this.hostBehaviorFactories;
      for (let i = 0, s = e.length; i < s; ++i, ++n)
        o[n] = e[i].createBehavior(t);
    }
    return new ot(e, o);
  }
  render(t, e, i) {
    "string" == typeof e && (e = document.getElementById(e)),
      void 0 === i && (i = e);
    const o = this.create(i);
    return o.bind(t, R), o.appendTo(e), o;
  }
}
const nt =
  /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function rt(t, ...e) {
  const i = [];
  let o = "";
  for (let s = 0, n = t.length - 1; s < n; ++s) {
    const n = t[s];
    let r = e[s];
    if (((o += n), r instanceof st)) {
      const t = r;
      r = () => t;
    }
    if (("function" == typeof r && (r = new K(r)), r instanceof V)) {
      const t = nt.exec(n);
      null !== t && (r.targetName = t[2]);
    }
    r instanceof A
      ? ((o += r.createPlaceholder(i.length)), i.push(r))
      : (o += r);
  }
  return (o += t[t.length - 1]), new st(o, i);
}
class at {
  constructor() {
    (this.targets = new WeakSet()), (this.behaviors = null);
  }
  addStylesTo(t) {
    this.targets.add(t);
  }
  removeStylesFrom(t) {
    this.targets.delete(t);
  }
  isAttachedTo(t) {
    return this.targets.has(t);
  }
  withBehaviors(...t) {
    return (
      (this.behaviors = null === this.behaviors ? t : this.behaviors.concat(t)),
      this
    );
  }
}
function lt(t) {
  return t
    .map((t) => (t instanceof at ? lt(t.styles) : [t]))
    .reduce((t, e) => t.concat(e), []);
}
function ct(t) {
  return t
    .map((t) => (t instanceof at ? t.behaviors : null))
    .reduce(
      (t, e) => (null === e ? t : (null === t && (t = []), t.concat(e))),
      null
    );
}
at.create = (() => {
  if (u.supportsAdoptedStyleSheets) {
    const t = new Map();
    return (e) => new ht(e, t);
  }
  return (t) => new ut(t);
})();
class ht extends at {
  constructor(t, e) {
    super(),
      (this.styles = t),
      (this.styleSheetCache = e),
      (this._styleSheets = void 0),
      (this.behaviors = ct(t));
  }
  get styleSheets() {
    if (void 0 === this._styleSheets) {
      const t = this.styles,
        e = this.styleSheetCache;
      this._styleSheets = lt(t).map((t) => {
        if (t instanceof CSSStyleSheet) return t;
        let i = e.get(t);
        return (
          void 0 === i &&
            ((i = new CSSStyleSheet()), i.replaceSync(t), e.set(t, i)),
          i
        );
      });
    }
    return this._styleSheets;
  }
  addStylesTo(t) {
    (t.adoptedStyleSheets = [...t.adoptedStyleSheets, ...this.styleSheets]),
      super.addStylesTo(t);
  }
  removeStylesFrom(t) {
    const e = this.styleSheets;
    (t.adoptedStyleSheets = t.adoptedStyleSheets.filter(
      (t) => -1 === e.indexOf(t)
    )),
      super.removeStylesFrom(t);
  }
}
let dt = 0;
class ut extends at {
  constructor(t) {
    super(),
      (this.styles = t),
      (this.behaviors = null),
      (this.behaviors = ct(t)),
      (this.styleSheets = lt(t)),
      (this.styleClass = "fast-style-class-" + ++dt);
  }
  addStylesTo(t) {
    const e = this.styleSheets,
      i = this.styleClass;
    t = this.normalizeTarget(t);
    for (let o = 0; o < e.length; o++) {
      const s = document.createElement("style");
      (s.innerHTML = e[o]), (s.className = i), t.append(s);
    }
    super.addStylesTo(t);
  }
  removeStylesFrom(t) {
    const e = (t = this.normalizeTarget(t)).querySelectorAll(
      "." + this.styleClass
    );
    for (let i = 0, o = e.length; i < o; ++i) t.removeChild(e[i]);
    super.removeStylesFrom(t);
  }
  isAttachedTo(t) {
    return super.isAttachedTo(this.normalizeTarget(t));
  }
  normalizeTarget(t) {
    return t === document ? document.body : t;
  }
}
const pt = {
    toView: (t) => (t ? "true" : "false"),
    fromView: (t) => null != t && "false" !== t && !1 !== t && 0 !== t,
  },
  gt = {
    toView(t) {
      if (null == t) return null;
      const e = 1 * t;
      return isNaN(e) ? null : e.toString();
    },
    fromView(t) {
      if (null == t) return null;
      const e = 1 * t;
      return isNaN(e) ? null : e;
    },
  };
class ft {
  constructor(t, e, i = e.toLowerCase(), o = "reflect", s) {
    (this.guards = new Set()),
      (this.Owner = t),
      (this.name = e),
      (this.attribute = i),
      (this.mode = o),
      (this.converter = s),
      (this.fieldName = "_" + e),
      (this.callbackName = e + "Changed"),
      (this.hasCallback = this.callbackName in t.prototype),
      "boolean" === o && void 0 === s && (this.converter = pt);
  }
  setValue(t, e) {
    const i = t[this.fieldName],
      o = this.converter;
    void 0 !== o && (e = o.fromView(e)),
      i !== e &&
        ((t[this.fieldName] = e),
        this.tryReflectToAttribute(t),
        this.hasCallback && t[this.callbackName](i, e),
        t.$fastController.notify(this.name));
  }
  getValue(t) {
    return T.track(t, this.name), t[this.fieldName];
  }
  onAttributeChangedCallback(t, e) {
    this.guards.has(t) ||
      (this.guards.add(t), this.setValue(t, e), this.guards.delete(t));
  }
  tryReflectToAttribute(t) {
    const e = this.mode,
      i = this.guards;
    i.has(t) ||
      "fromView" === e ||
      u.queueUpdate(() => {
        i.add(t);
        const o = t[this.fieldName];
        switch (e) {
          case "reflect":
            const e = this.converter;
            u.setAttribute(t, this.attribute, void 0 !== e ? e.toView(o) : o);
            break;
          case "boolean":
            u.setBooleanAttribute(t, this.attribute, o);
        }
        i.delete(t);
      });
  }
  static collect(t, ...e) {
    const i = [];
    e.push(t.attributes);
    for (let o = 0, s = e.length; o < s; ++o) {
      const s = e[o];
      if (void 0 !== s)
        for (let e = 0, o = s.length; e < o; ++e) {
          const o = s[e];
          "string" == typeof o
            ? i.push(new ft(t, o))
            : i.push(new ft(t, o.property, o.attribute, o.mode, o.converter));
        }
    }
    return i;
  }
}
function bt(t, e) {
  let i;
  function o(t, e) {
    arguments.length > 1 && (i.property = e);
    const o = t.constructor.attributes || (t.constructor.attributes = []);
    o.push(i);
  }
  return arguments.length > 1
    ? ((i = {}), void o(t, e))
    : ((i = void 0 === t ? {} : t), o);
}
const mt = { mode: "open" },
  vt = {},
  yt = new Map();
class xt {
  constructor(t, e = t.definition) {
    "string" == typeof e && (e = { name: e }),
      (this.type = t),
      (this.name = e.name),
      (this.template = e.template);
    const i = ft.collect(t, e.attributes),
      o = new Array(i.length),
      s = {},
      n = {};
    for (let t = 0, e = i.length; t < e; ++t) {
      const e = i[t];
      (o[t] = e.attribute), (s[e.name] = e), (n[e.attribute] = e);
    }
    (this.attributes = i),
      (this.observedAttributes = o),
      (this.propertyLookup = s),
      (this.attributeLookup = n),
      (this.shadowOptions =
        void 0 === e.shadowOptions
          ? mt
          : null === e.shadowOptions
          ? void 0
          : Object.assign(Object.assign({}, mt), e.shadowOptions)),
      (this.elementOptions =
        void 0 === e.elementOptions
          ? vt
          : Object.assign(Object.assign({}, vt), e.elementOptions)),
      (this.styles =
        void 0 === e.styles
          ? void 0
          : Array.isArray(e.styles)
          ? at.create(e.styles)
          : e.styles instanceof at
          ? e.styles
          : at.create([e.styles]));
  }
  define(t = customElements) {
    const e = this.type;
    if (!this.isDefined) {
      const t = this.attributes,
        i = e.prototype;
      for (let e = 0, o = t.length; e < o; ++e) T.defineProperty(i, t[e]);
      Reflect.defineProperty(e, "observedAttributes", {
        value: this.observedAttributes,
        enumerable: !0,
      }),
        yt.set(e, this),
        (this.isDefined = !0);
    }
    return (
      t.get(this.name) || t.define(this.name, e, this.elementOptions), this
    );
  }
  static forType(t) {
    return yt.get(t);
  }
}
const $t = new WeakMap(),
  wt = { bubbles: !0, composed: !0, cancelable: !0 };
function kt(t) {
  return t.shadowRoot || $t.get(t) || null;
}
class Ct extends v {
  constructor(t, e) {
    super(t),
      (this.boundObservables = null),
      (this.behaviors = null),
      (this.needsInitialization = !0),
      (this._template = null),
      (this._styles = null),
      (this._isConnected = !1),
      (this.view = null),
      (this.element = t),
      (this.definition = e);
    const i = e.shadowOptions;
    if (void 0 !== i) {
      const e = t.attachShadow(i);
      "closed" === i.mode && $t.set(t, e);
    }
    const o = T.getAccessors(t);
    if (o.length > 0) {
      const e = (this.boundObservables = Object.create(null));
      for (let i = 0, s = o.length; i < s; ++i) {
        const s = o[i].name,
          n = t[s];
        void 0 !== n && (delete t[s], (e[s] = n));
      }
    }
  }
  get isConnected() {
    return T.track(this, "isConnected"), this._isConnected;
  }
  setIsConnected(t) {
    (this._isConnected = t), T.notify(this, "isConnected");
  }
  get template() {
    return this._template;
  }
  set template(t) {
    this._template !== t &&
      ((this._template = t),
      this.needsInitialization || this.renderTemplate(t));
  }
  get styles() {
    return this._styles;
  }
  set styles(t) {
    this._styles !== t &&
      (null !== this._styles && this.removeStyles(this._styles),
      (this._styles = t),
      this.needsInitialization || null === t || this.addStyles(t));
  }
  addStyles(t) {
    const e = kt(this.element) || this.element.getRootNode();
    if (t instanceof HTMLStyleElement) e.append(t);
    else if (!t.isAttachedTo(e)) {
      const i = t.behaviors;
      t.addStylesTo(e), null !== i && this.addBehaviors(i);
    }
  }
  removeStyles(t) {
    const e = kt(this.element) || this.element.getRootNode();
    if (t instanceof HTMLStyleElement) e.removeChild(t);
    else if (t.isAttachedTo(e)) {
      const i = t.behaviors;
      t.removeStylesFrom(e), null !== i && this.removeBehaviors(i);
    }
  }
  addBehaviors(t) {
    const e = this.behaviors || (this.behaviors = new Map()),
      i = t.length,
      o = [];
    for (let s = 0; s < i; ++s) {
      const i = t[s];
      e.has(i) ? e.set(i, e.get(i) + 1) : (e.set(i, 1), o.push(i));
    }
    if (this._isConnected) {
      const t = this.element;
      for (let e = 0; e < o.length; ++e) o[e].bind(t, R);
    }
  }
  removeBehaviors(t, e = !1) {
    const i = this.behaviors;
    if (null === i) return;
    const o = t.length,
      s = [];
    for (let n = 0; n < o; ++n) {
      const o = t[n];
      if (i.has(o)) {
        const t = i.get(o) - 1;
        0 === t || e ? i.delete(o) && s.push(o) : i.set(o, t);
      }
    }
    if (this._isConnected) {
      const t = this.element;
      for (let e = 0; e < s.length; ++e) s[e].unbind(t);
    }
  }
  onConnectedCallback() {
    if (this._isConnected) return;
    const t = this.element;
    this.needsInitialization
      ? this.finishInitialization()
      : null !== this.view && this.view.bind(t, R);
    const e = this.behaviors;
    if (null !== e) for (const [i] of e) i.bind(t, R);
    this.setIsConnected(!0);
  }
  onDisconnectedCallback() {
    if (!this._isConnected) return;
    this.setIsConnected(!1);
    const t = this.view;
    null !== t && t.unbind();
    const e = this.behaviors;
    if (null !== e) {
      const t = this.element;
      for (const [i] of e) i.unbind(t);
    }
  }
  onAttributeChangedCallback(t, e, i) {
    const o = this.definition.attributeLookup[t];
    void 0 !== o && o.onAttributeChangedCallback(this.element, i);
  }
  emit(t, e, i) {
    return (
      !!this._isConnected &&
      this.element.dispatchEvent(
        new CustomEvent(t, Object.assign(Object.assign({ detail: e }, wt), i))
      )
    );
  }
  finishInitialization() {
    const t = this.element,
      e = this.boundObservables;
    if (null !== e) {
      const i = Object.keys(e);
      for (let o = 0, s = i.length; o < s; ++o) {
        const s = i[o];
        t[s] = e[s];
      }
      this.boundObservables = null;
    }
    const i = this.definition;
    null === this._template &&
      (this.element.resolveTemplate
        ? (this._template = this.element.resolveTemplate())
        : i.template && (this._template = i.template || null)),
      null !== this._template && this.renderTemplate(this._template),
      null === this._styles &&
        (this.element.resolveStyles
          ? (this._styles = this.element.resolveStyles())
          : i.styles && (this._styles = i.styles || null)),
      null !== this._styles && this.addStyles(this._styles),
      (this.needsInitialization = !1);
  }
  renderTemplate(t) {
    const e = this.element,
      i = kt(e) || e;
    null !== this.view
      ? (this.view.dispose(), (this.view = null))
      : this.needsInitialization || u.removeChildNodes(i),
      t && (this.view = t.render(e, i, e));
  }
  static forCustomElement(t) {
    const e = t.$fastController;
    if (void 0 !== e) return e;
    const i = xt.forType(t.constructor);
    if (void 0 === i) throw new Error("Missing FASTElement definition.");
    return (t.$fastController = new Ct(t, i));
  }
}
function Tt(t) {
  return class extends t {
    constructor() {
      super(), Ct.forCustomElement(this);
    }
    $emit(t, e, i) {
      return this.$fastController.emit(t, e, i);
    }
    connectedCallback() {
      this.$fastController.onConnectedCallback();
    }
    disconnectedCallback() {
      this.$fastController.onDisconnectedCallback();
    }
    attributeChangedCallback(t, e, i) {
      this.$fastController.onAttributeChangedCallback(t, e, i);
    }
  };
}
const It = Object.assign(Tt(HTMLElement), {
  from: (t) => Tt(t),
  define: (t, e) => new xt(t, e).define().type,
});
class Ft {
  createCSS() {
    return "";
  }
  createBehavior() {}
}
function St(t, e) {
  const i = [];
  let o = "";
  const s = [];
  for (let n = 0, r = t.length - 1; n < r; ++n) {
    o += t[n];
    let r = e[n];
    if (r instanceof Ft) {
      const t = r.createBehavior();
      (r = r.createCSS()), t && s.push(t);
    }
    r instanceof at || r instanceof CSSStyleSheet
      ? ("" !== o.trim() && (i.push(o), (o = "")), i.push(r))
      : (o += r);
  }
  return (
    (o += t[t.length - 1]),
    "" !== o.trim() && i.push(o),
    { styles: i, behaviors: s }
  );
}
function Dt(t, ...e) {
  const { styles: i, behaviors: o } = St(t, e),
    s = at.create(i);
  return o.length && s.withBehaviors(...o), s;
}
class Et extends Ft {
  constructor(t, e) {
    super(), (this.behaviors = e), (this.css = "");
    const i = t.reduce(
      (t, e) => ("string" == typeof e ? (this.css += e) : t.push(e), t),
      []
    );
    i.length && (this.styles = at.create(i));
  }
  createBehavior() {
    return this;
  }
  createCSS() {
    return this.css;
  }
  bind(t) {
    this.styles && t.$fastController.addStyles(this.styles),
      this.behaviors.length && t.$fastController.addBehaviors(this.behaviors);
  }
  unbind(t) {
    this.styles && t.$fastController.removeStyles(this.styles),
      this.behaviors.length &&
        t.$fastController.removeBehaviors(this.behaviors);
  }
}
function Ot(t, ...e) {
  const { styles: i, behaviors: o } = St(t, e);
  return new Et(i, o);
}
function Rt(t, e, i) {
  return { index: t, removed: e, addedCount: i };
}
function Lt(t, i, o, s, n, r) {
  let a = 0,
    l = 0;
  const c = Math.min(o - i, r - n);
  if (
    (0 === i &&
      0 === n &&
      (a = (function (t, e, i) {
        for (let o = 0; o < i; ++o) if (t[o] !== e[o]) return o;
        return i;
      })(t, s, c)),
    o === t.length &&
      r === s.length &&
      (l = (function (t, e, i) {
        let o = t.length,
          s = e.length,
          n = 0;
        for (; n < i && t[--o] === e[--s]; ) n++;
        return n;
      })(t, s, c - a)),
    (n += a),
    (r -= l),
    (o -= l) - (i += a) == 0 && r - n == 0)
  )
    return e;
  if (i === o) {
    const t = Rt(i, [], 0);
    for (; n < r; ) t.removed.push(s[n++]);
    return [t];
  }
  if (n === r) return [Rt(i, [], o - i)];
  const h = (function (t) {
      let e = t.length - 1,
        i = t[0].length - 1,
        o = t[e][i];
      const s = [];
      for (; e > 0 || i > 0; ) {
        if (0 === e) {
          s.push(2), i--;
          continue;
        }
        if (0 === i) {
          s.push(3), e--;
          continue;
        }
        const n = t[e - 1][i - 1],
          r = t[e - 1][i],
          a = t[e][i - 1];
        let l;
        (l = r < a ? (r < n ? r : n) : a < n ? a : n),
          l === n
            ? (n === o ? s.push(0) : (s.push(1), (o = n)), e--, i--)
            : l === r
            ? (s.push(3), e--, (o = r))
            : (s.push(2), i--, (o = a));
      }
      return s.reverse(), s;
    })(
      (function (t, e, i, o, s, n) {
        const r = n - s + 1,
          a = i - e + 1,
          l = new Array(r);
        let c, h;
        for (let t = 0; t < r; ++t) (l[t] = new Array(a)), (l[t][0] = t);
        for (let t = 0; t < a; ++t) l[0][t] = t;
        for (let i = 1; i < r; ++i)
          for (let n = 1; n < a; ++n)
            t[e + n - 1] === o[s + i - 1]
              ? (l[i][n] = l[i - 1][n - 1])
              : ((c = l[i - 1][n] + 1),
                (h = l[i][n - 1] + 1),
                (l[i][n] = c < h ? c : h));
        return l;
      })(t, i, o, s, n, r)
    ),
    d = [];
  let u = void 0,
    p = i,
    g = n;
  for (let t = 0; t < h.length; ++t)
    switch (h[t]) {
      case 0:
        void 0 !== u && (d.push(u), (u = void 0)), p++, g++;
        break;
      case 1:
        void 0 === u && (u = Rt(p, [], 0)),
          u.addedCount++,
          p++,
          u.removed.push(s[g]),
          g++;
        break;
      case 2:
        void 0 === u && (u = Rt(p, [], 0)), u.addedCount++, p++;
        break;
      case 3:
        void 0 === u && (u = Rt(p, [], 0)), u.removed.push(s[g]), g++;
    }
  return void 0 !== u && d.push(u), d;
}
const At = Array.prototype.push;
function Vt(t, e, i, o) {
  const s = Rt(e, i, o);
  let n = !1,
    r = 0;
  for (let e = 0; e < t.length; e++) {
    const i = t[e];
    if (((i.index += r), n)) continue;
    const o =
      ((a = s.index),
      (l = s.index + s.removed.length),
      (c = i.index),
      (h = i.index + i.addedCount),
      l < c || h < a
        ? -1
        : l === c || h === a
        ? 0
        : a < c
        ? l < h
          ? l - c
          : h - c
        : h < l
        ? h - a
        : l - a);
    if (o >= 0) {
      t.splice(e, 1),
        e--,
        (r -= i.addedCount - i.removed.length),
        (s.addedCount += i.addedCount - o);
      const a = s.removed.length + i.removed.length - o;
      if (s.addedCount || a) {
        let t = i.removed;
        if (s.index < i.index) {
          const e = s.removed.slice(0, i.index - s.index);
          At.apply(e, t), (t = e);
        }
        if (s.index + s.removed.length > i.index + i.addedCount) {
          const e = s.removed.slice(i.index + i.addedCount - s.index);
          At.apply(t, e);
        }
        (s.removed = t), i.index < s.index && (s.index = i.index);
      } else n = !0;
    } else if (s.index < i.index) {
      (n = !0), t.splice(e, 0, s), e++;
      const o = s.addedCount - s.removed.length;
      (i.index += o), (r += o);
    }
  }
  var a, l, c, h;
  n || t.push(s);
}
function Pt(t, e) {
  let i = [];
  const o = (function (t) {
    const e = [];
    for (let i = 0, o = t.length; i < o; i++) {
      const o = t[i];
      Vt(e, o.index, o.removed, o.addedCount);
    }
    return e;
  })(e);
  for (let e = 0, s = o.length; e < s; ++e) {
    const s = o[e];
    1 !== s.addedCount || 1 !== s.removed.length
      ? (i = i.concat(
          Lt(t, s.index, s.index + s.addedCount, s.removed, 0, s.removed.length)
        ))
      : s.removed[0] !== t[s.index] && i.push(s);
  }
  return i;
}
let Ht = !1;
function zt(t, e) {
  let i = t.index;
  const o = e.length;
  return (
    i > o
      ? (i = o - t.addedCount)
      : i < 0 && (i = o + t.removed.length + i - t.addedCount),
    i < 0 && (i = 0),
    (t.index = i),
    t
  );
}
class Mt extends m {
  constructor(t) {
    super(t),
      (this.oldCollection = void 0),
      (this.splices = void 0),
      (this.needsQueue = !0),
      (this.call = this.flush),
      (t.$fastController = this);
  }
  addSplice(t) {
    void 0 === this.splices ? (this.splices = [t]) : this.splices.push(t),
      this.needsQueue && ((this.needsQueue = !1), u.queueUpdate(this));
  }
  reset(t) {
    (this.oldCollection = t),
      this.needsQueue && ((this.needsQueue = !1), u.queueUpdate(this));
  }
  flush() {
    const t = this.splices,
      e = this.oldCollection;
    if (void 0 === t && void 0 === e) return;
    (this.needsQueue = !0),
      (this.splices = void 0),
      (this.oldCollection = void 0);
    const i =
      void 0 === e
        ? Pt(this.source, t)
        : Lt(this.source, 0, this.source.length, e, 0, e.length);
    this.notify(i);
  }
}
class Nt {
  constructor(t, e) {
    (this.target = t), (this.propertyName = e);
  }
  bind(t) {
    t[this.propertyName] = this.target;
  }
  unbind() {}
}
function Bt(t) {
  return new P("fast-ref", Nt, t);
}
function jt(t, e) {
  const i = "function" == typeof e ? e : () => e;
  return (e, o) => (t(e, o) ? i(e, o) : null);
}
function qt(t, e, i, o) {
  t.bind(e[i], o);
}
function _t(t, e, i, o) {
  const s = Object.create(o);
  (s.index = i), (s.length = e.length), t.bind(e[i], s);
}
Object.freeze({ positioning: !1 });
class Ut {
  constructor(t, e, i, o, s, n) {
    (this.location = t),
      (this.itemsBinding = e),
      (this.templateBinding = o),
      (this.options = n),
      (this.source = null),
      (this.views = []),
      (this.items = null),
      (this.itemsObserver = null),
      (this.originalContext = void 0),
      (this.childContext = void 0),
      (this.bindView = qt),
      (this.itemsBindingObserver = T.binding(e, this, i)),
      (this.templateBindingObserver = T.binding(o, this, s)),
      n.positioning && (this.bindView = _t);
  }
  bind(t, e) {
    (this.source = t),
      (this.originalContext = e),
      (this.childContext = Object.create(e)),
      (this.childContext.parent = t),
      (this.childContext.parentContext = this.originalContext),
      (this.items = this.itemsBindingObserver.observe(t, this.originalContext)),
      (this.template = this.templateBindingObserver.observe(
        t,
        this.originalContext
      )),
      this.observeItems(!0),
      this.refreshAllViews();
  }
  unbind() {
    (this.source = null),
      (this.items = null),
      null !== this.itemsObserver && this.itemsObserver.unsubscribe(this),
      this.unbindAllViews(),
      this.itemsBindingObserver.disconnect(),
      this.templateBindingObserver.disconnect();
  }
  handleChange(t, e) {
    t === this.itemsBinding
      ? ((this.items = this.itemsBindingObserver.observe(
          this.source,
          this.originalContext
        )),
        this.observeItems(),
        this.refreshAllViews())
      : t === this.templateBinding
      ? ((this.template = this.templateBindingObserver.observe(
          this.source,
          this.originalContext
        )),
        this.refreshAllViews(!0))
      : this.updateViews(e);
  }
  observeItems(t = !1) {
    if (!this.items) return void (this.items = e);
    const i = this.itemsObserver,
      o = (this.itemsObserver = T.getNotifier(this.items)),
      s = i !== o;
    s && null !== i && i.unsubscribe(this), (s || t) && o.subscribe(this);
  }
  updateViews(t) {
    const e = this.childContext,
      i = this.views,
      o = [],
      s = this.bindView;
    let n = 0;
    for (let e = 0, s = t.length; e < s; ++e) {
      const s = t[e],
        r = s.removed;
      o.push(...i.splice(s.index + n, r.length)), (n -= s.addedCount);
    }
    const r = this.items,
      a = this.template;
    for (let n = 0, l = t.length; n < l; ++n) {
      const l = t[n];
      let c = l.index;
      const h = c + l.addedCount;
      for (; c < h; ++c) {
        const t = i[c],
          n = t ? t.firstChild : this.location,
          l = o.length > 0 ? o.shift() : a.create();
        i.splice(c, 0, l), s(l, r, c, e), l.insertBefore(n);
      }
    }
    for (let t = 0, e = o.length; t < e; ++t) o[t].dispose();
    if (this.options.positioning)
      for (let t = 0, e = i.length; t < e; ++t) {
        const o = i[t].context;
        (o.length = e), (o.index = t);
      }
  }
  refreshAllViews(t = !1) {
    const e = this.items,
      i = this.childContext,
      o = this.template,
      s = this.location,
      n = this.bindView;
    let r = e.length,
      a = this.views,
      l = a.length;
    if (((0 === r || t) && (ot.disposeContiguousBatch(a), (l = 0)), 0 === l)) {
      this.views = a = new Array(r);
      for (let t = 0; t < r; ++t) {
        const r = o.create();
        n(r, e, t, i), (a[t] = r), r.insertBefore(s);
      }
    } else {
      let t = 0;
      for (; t < r; ++t)
        if (t < l) {
          n(a[t], e, t, i);
        } else {
          const r = o.create();
          n(r, e, t, i), a.push(r), r.insertBefore(s);
        }
      const c = a.splice(t, l - t);
      for (t = 0, r = c.length; t < r; ++t) c[t].dispose();
    }
  }
  unbindAllViews() {
    const t = this.views;
    for (let e = 0, i = t.length; e < i; ++e) t[e].unbind();
  }
}
class Gt extends A {
  constructor(t, e, i) {
    super(),
      (this.itemsBinding = t),
      (this.templateBinding = e),
      (this.options = i),
      (this.createPlaceholder = u.createBlockPlaceholder),
      (function () {
        if (Ht) return;
        (Ht = !0), T.setArrayObserverFactory((t) => new Mt(t));
        const t = Array.prototype,
          e = t.pop,
          i = t.push,
          o = t.reverse,
          s = t.shift,
          n = t.sort,
          r = t.splice,
          a = t.unshift;
        (t.pop = function () {
          const t = this.length > 0,
            i = e.apply(this, arguments),
            o = this.$fastController;
          return void 0 !== o && t && o.addSplice(Rt(this.length, [i], 0)), i;
        }),
          (t.push = function () {
            const t = i.apply(this, arguments),
              e = this.$fastController;
            return (
              void 0 !== e &&
                e.addSplice(
                  zt(
                    Rt(this.length - arguments.length, [], arguments.length),
                    this
                  )
                ),
              t
            );
          }),
          (t.reverse = function () {
            let t;
            const e = this.$fastController;
            void 0 !== e && (e.flush(), (t = this.slice()));
            const i = o.apply(this, arguments);
            return void 0 !== e && e.reset(t), i;
          }),
          (t.shift = function () {
            const t = this.length > 0,
              e = s.apply(this, arguments),
              i = this.$fastController;
            return void 0 !== i && t && i.addSplice(Rt(0, [e], 0)), e;
          }),
          (t.sort = function () {
            let t;
            const e = this.$fastController;
            void 0 !== e && (e.flush(), (t = this.slice()));
            const i = n.apply(this, arguments);
            return void 0 !== e && e.reset(t), i;
          }),
          (t.splice = function () {
            const t = r.apply(this, arguments),
              e = this.$fastController;
            return (
              void 0 !== e &&
                e.addSplice(
                  zt(
                    Rt(
                      +arguments[0],
                      t,
                      arguments.length > 2 ? arguments.length - 2 : 0
                    ),
                    this
                  )
                ),
              t
            );
          }),
          (t.unshift = function () {
            const t = a.apply(this, arguments),
              e = this.$fastController;
            return (
              void 0 !== e &&
                e.addSplice(zt(Rt(0, [], arguments.length), this)),
              t
            );
          });
      })(),
      (this.isItemsBindingVolatile = T.isVolatileBinding(t)),
      (this.isTemplateBindingVolatile = T.isVolatileBinding(e));
  }
  createBehavior(t) {
    return new Ut(
      t,
      this.itemsBinding,
      this.isItemsBindingVolatile,
      this.templateBinding,
      this.isTemplateBindingVolatile,
      this.options
    );
  }
}
function Kt(t) {
  return t
    ? function (e, i, o) {
        return 1 === e.nodeType && e.matches(t);
      }
    : function (t, e, i) {
        return 1 === t.nodeType;
      };
}
class Wt {
  constructor(t, e) {
    (this.target = t), (this.options = e), (this.source = null);
  }
  bind(t) {
    const e = this.options.property;
    (this.shouldUpdate = T.getAccessors(t).some((t) => t.name === e)),
      (this.source = t),
      this.updateTarget(this.computeNodes()),
      this.shouldUpdate && this.observe();
  }
  unbind() {
    this.updateTarget(e),
      (this.source = null),
      this.shouldUpdate && this.disconnect();
  }
  handleEvent() {
    this.updateTarget(this.computeNodes());
  }
  computeNodes() {
    let t = this.getNodes();
    return (
      void 0 !== this.options.filter && (t = t.filter(this.options.filter)), t
    );
  }
  updateTarget(t) {
    this.source[this.options.property] = t;
  }
}
class Xt extends Wt {
  constructor(t, e) {
    super(t, e);
  }
  observe() {
    this.target.addEventListener("slotchange", this);
  }
  disconnect() {
    this.target.removeEventListener("slotchange", this);
  }
  getNodes() {
    return this.target.assignedNodes(this.options);
  }
}
function Yt(t) {
  return (
    "string" == typeof t && (t = { property: t }), new P("fast-slotted", Xt, t)
  );
}
class Qt extends Wt {
  constructor(t, e) {
    super(t, e), (this.observer = null), (e.childList = !0);
  }
  observe() {
    null === this.observer &&
      (this.observer = new MutationObserver(this.handleEvent.bind(this))),
      this.observer.observe(this.target, this.options);
  }
  disconnect() {
    this.observer.disconnect();
  }
  getNodes() {
    return "subtree" in this.options
      ? Array.from(this.target.querySelectorAll(this.options.selector))
      : Array.from(this.target.childNodes);
  }
}
function Zt(t) {
  return (
    "string" == typeof t && (t = { property: t }), new P("fast-children", Qt, t)
  );
}
class Jt {
  handleStartContentChange() {
    this.startContainer.classList.toggle(
      "start",
      this.start.assignedNodes().length > 0
    );
  }
  handleEndContentChange() {
    this.endContainer.classList.toggle(
      "end",
      this.end.assignedNodes().length > 0
    );
  }
}
const te = rt`<span part="end" ${Bt("endContainer")}><slot name="end" ${Bt(
    "end"
  )} @slotchange="${(t) => t.handleEndContentChange()}"></slot></span>`,
  ee = rt`<span part="start" ${Bt("startContainer")}><slot name="start" ${Bt(
    "start"
  )} @slotchange="${(t) => t.handleStartContentChange()}"></slot></span>`;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function ie(t, e, i, o) {
  var s,
    n = arguments.length,
    r =
      n < 3 ? e : null === o ? (o = Object.getOwnPropertyDescriptor(e, i)) : o;
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
    r = Reflect.decorate(t, e, i, o);
  else
    for (var a = t.length - 1; a >= 0; a--)
      (s = t[a]) && (r = (n < 3 ? s(r) : n > 3 ? s(e, i, r) : s(e, i)) || r);
  return n > 3 && r && Object.defineProperty(e, i, r), r;
}
const oe = new Map();
"metadata" in Reflect ||
  ((Reflect.metadata = function (t, e) {
    return function (i) {
      Reflect.defineMetadata(t, e, i);
    };
  }),
  (Reflect.defineMetadata = function (t, e, i) {
    let o = oe.get(i);
    void 0 === o && oe.set(i, (o = new Map())), o.set(t, e);
  }),
  (Reflect.getOwnMetadata = function (t, e) {
    const i = oe.get(e);
    if (void 0 !== i) return i.get(t);
  }));
class se {
  constructor(t, e) {
    (this.container = t), (this.key = e);
  }
  instance(t) {
    return this.registerResolver(0, t);
  }
  singleton(t) {
    return this.registerResolver(1, t);
  }
  transient(t) {
    return this.registerResolver(2, t);
  }
  callback(t) {
    return this.registerResolver(3, t);
  }
  cachedCallback(t) {
    return this.registerResolver(3, Te(t));
  }
  aliasTo(t) {
    return this.registerResolver(5, t);
  }
  registerResolver(t, e) {
    const { container: i, key: o } = this;
    return (
      (this.container = this.key = void 0),
      i.registerResolver(o, new pe(o, t, e))
    );
  }
}
function ne(t) {
  const e = t.slice(),
    i = Object.keys(t),
    o = i.length;
  let s;
  for (let n = 0; n < o; ++n) (s = i[n]), Le(s) || (e[s] = t[s]);
  return e;
}
const re = Object.freeze({
    none(t) {
      throw Error(
        t.toString() + " not registered, did you forget to add @singleton()?"
      );
    },
    singleton: (t) => new pe(t, 1, t),
    transient: (t) => new pe(t, 2, t),
  }),
  ae = Object.freeze({
    default: Object.freeze({
      parentLocator: () => null,
      responsibleForOwnerRequests: !1,
      defaultResolver: re.singleton,
    }),
  }),
  le = new Map();
function ce(t) {
  return (e) => Reflect.getOwnMetadata(t, e);
}
const he = Object.freeze({
    createContainer: (t) => new ke(null, Object.assign({}, ae.default, t)),
    findResponsibleContainer(t) {
      const e = t.$$container$$;
      return e && e.responsibleForOwnerRequests ? e : he.findParentContainer(t);
    },
    findParentContainer(t) {
      const e = new CustomEvent($e, {
        bubbles: !0,
        composed: !0,
        cancelable: !0,
        detail: { container: void 0 },
      });
      return (
        t.dispatchEvent(e), e.detail.container || he.getOrCreateDOMContainer()
      );
    },
    getOrCreateDOMContainer: (t = document.body, e) =>
      t.$$container$$ ||
      new ke(
        t,
        Object.assign({}, ae.default, e, {
          parentLocator:
            t === document.body ? () => null : he.findParentContainer,
        })
      ),
    getDesignParamtypes: ce("design:paramtypes"),
    getAnnotationParamtypes: ce("di:paramtypes"),
    getOrCreateAnnotationParamTypes(t) {
      let e = this.getAnnotationParamtypes(t);
      return (
        void 0 === e && Reflect.defineMetadata("di:paramtypes", (e = []), t), e
      );
    },
    getDependencies(t) {
      let e = le.get(t);
      if (void 0 === e) {
        const i = t.inject;
        if (void 0 === i) {
          const i = he.getDesignParamtypes(t),
            o = he.getAnnotationParamtypes(t);
          if (void 0 === i)
            if (void 0 === o) {
              const i = Object.getPrototypeOf(t);
              e =
                "function" == typeof i && i !== Function.prototype
                  ? ne(he.getDependencies(i))
                  : [];
            } else e = ne(o);
          else if (void 0 === o) e = ne(i);
          else {
            e = ne(i);
            let t,
              s = o.length;
            for (let i = 0; i < s; ++i) (t = o[i]), void 0 !== t && (e[i] = t);
            const n = Object.keys(o);
            let r;
            s = n.length;
            for (let t = 0; t < s; ++t) (r = n[t]), Le(r) || (e[r] = o[r]);
          }
        } else e = ne(i);
        le.set(t, e);
      }
      return e;
    },
    defineProperty(t, e, i, o = !1) {
      const s = "$di_" + e;
      Reflect.defineProperty(t, e, {
        get: function () {
          let t = this[s];
          if (void 0 === t) {
            const n =
              this instanceof HTMLElement
                ? he.findResponsibleContainer(this)
                : he.getOrCreateDOMContainer();
            if (((t = n.get(i)), (this[s] = t), o && this instanceof It)) {
              const o = this.$fastController,
                n = () => {
                  he.findResponsibleContainer(this).get(i) !== this[s] &&
                    ((this[s] = t), o.notify(e));
                };
              o.subscribe({ handleChange: n }, "isConnected");
            }
          }
          return t;
        },
      });
    },
    createInterface(t, e) {
      const i = "function" == typeof t ? t : e,
        o =
          "string" == typeof t
            ? t
            : (t && "friendlyName" in t && t.friendlyName) || De,
        s =
          "string" != typeof t &&
          ((t && "respectConnection" in t && t.respectConnection) || !1),
        n = function (t, e, i) {
          if (null == t || void 0 !== new.target)
            throw new Error(
              `No registration for interface: '${n.friendlyName}'`
            );
          if (e) he.defineProperty(t, e, n, s);
          else {
            he.getOrCreateAnnotationParamTypes(t)[i] = n;
          }
        };
      return (
        (n.$isInterface = !0),
        (n.friendlyName = null == o ? "(anonymous)" : o),
        null != i &&
          (n.register = function (t, e) {
            return i(new se(t, null != e ? e : n));
          }),
        (n.toString = function () {
          return `InterfaceSymbol<${n.friendlyName}>`;
        }),
        n
      );
    },
    inject: (...t) =>
      function (e, i, o) {
        if ("number" == typeof o) {
          const i = he.getOrCreateAnnotationParamTypes(e),
            s = t[0];
          void 0 !== s && (i[o] = s);
        } else if (i) he.defineProperty(e, i, t[0]);
        else {
          const i = o
            ? he.getOrCreateAnnotationParamTypes(o.value)
            : he.getOrCreateAnnotationParamTypes(e);
          let s;
          for (let e = 0; e < t.length; ++e)
            (s = t[e]), void 0 !== s && (i[e] = s);
        }
      },
    transient: (t) => (
      (t.register = function (e) {
        return Ie.transient(t, t).register(e, t);
      }),
      (t.registerInRequestor = !1),
      t
    ),
    singleton: (t, e = ue) => (
      (t.register = function (e) {
        return Ie.singleton(t, t).register(e, t);
      }),
      (t.registerInRequestor = e.scoped),
      t
    ),
  }),
  de = he.createInterface("Container");
he.inject;
const ue = { scoped: !1 };
class pe {
  constructor(t, e, i) {
    (this.key = t),
      (this.strategy = e),
      (this.state = i),
      (this.resolving = !1);
  }
  get $isResolver() {
    return !0;
  }
  register(t, e) {
    return t.registerResolver(e || this.key, this);
  }
  resolve(t, e) {
    switch (this.strategy) {
      case 0:
        return this.state;
      case 1:
        if (this.resolving)
          throw new Error("Cyclic dependency found: " + this.state.name);
        return (
          (this.resolving = !0),
          (this.state = t.getFactory(this.state).construct(e)),
          (this.strategy = 0),
          (this.resolving = !1),
          this.state
        );
      case 2: {
        const i = t.getFactory(this.state);
        if (null === i)
          throw new Error(
            `Resolver for ${String(this.key)} returned a null factory`
          );
        return i.construct(e);
      }
      case 3:
        return this.state(t, e, this);
      case 4:
        return this.state[0].resolve(t, e);
      case 5:
        return e.get(this.state);
      default:
        throw new Error(
          `Invalid resolver strategy specified: ${this.strategy}.`
        );
    }
  }
  getFactory(t) {
    var e, i, o;
    switch (this.strategy) {
      case 1:
      case 2:
        return t.getFactory(this.state);
      case 5:
        return null !==
          (o =
            null ===
              (i =
                null === (e = t.getResolver(this.state)) || void 0 === e
                  ? void 0
                  : e.getFactory) || void 0 === i
              ? void 0
              : i.call(e, t)) && void 0 !== o
          ? o
          : null;
      default:
        return null;
    }
  }
}
function ge(t) {
  return this.get(t);
}
function fe(t, e) {
  return e(t);
}
class be {
  constructor(t, e) {
    (this.Type = t), (this.dependencies = e), (this.transformers = null);
  }
  construct(t, e) {
    let i;
    return (
      (i =
        void 0 === e
          ? new this.Type(...this.dependencies.map(ge, t))
          : new this.Type(...this.dependencies.map(ge, t), ...e)),
      null == this.transformers ? i : this.transformers.reduce(fe, i)
    );
  }
  registerTransformer(t) {
    (this.transformers || (this.transformers = [])).push(t);
  }
}
const me = { $isResolver: !0, resolve: (t, e) => e };
function ve(t) {
  return "function" == typeof t.register;
}
function ye(t) {
  return (
    (function (t) {
      return ve(t) && "boolean" == typeof t.registerInRequestor;
    })(t) && t.registerInRequestor
  );
}
const xe = new Set([
    "Array",
    "ArrayBuffer",
    "Boolean",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "Float32Array",
    "Float64Array",
    "Function",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Map",
    "Number",
    "Object",
    "Promise",
    "RangeError",
    "ReferenceError",
    "RegExp",
    "Set",
    "SharedArrayBuffer",
    "String",
    "SyntaxError",
    "TypeError",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "URIError",
    "WeakMap",
    "WeakSet",
  ]),
  $e = "__DI_LOCATE_PARENT__",
  we = new Map();
class ke {
  constructor(t, e) {
    (this.owner = t),
      (this.config = e),
      (this._parent = void 0),
      (this.registerDepth = 0),
      null !== t && (t.$$container$$ = this),
      (this.resolvers = new Map()),
      this.resolvers.set(de, me),
      t instanceof Node &&
        t.addEventListener($e, (t) => {
          t.composedPath()[0] !== this.owner &&
            ((t.detail.container = this), t.stopImmediatePropagation());
        });
  }
  get parent() {
    return (
      void 0 === this._parent &&
        (this._parent = this.config.parentLocator(this.owner)),
      this._parent
    );
  }
  get depth() {
    return null === this.parent ? 0 : this.parent.depth + 1;
  }
  get responsibleForOwnerRequests() {
    return this.config.responsibleForOwnerRequests;
  }
  register(...t) {
    if (100 == ++this.registerDepth)
      throw new Error("Unable to autoregister dependency");
    let e, i, o, s, n;
    for (let r = 0, a = t.length; r < a; ++r)
      if (((e = t[r]), Ee(e)))
        if (ve(e)) e.register(this);
        else if (void 0 !== e.prototype) Ie.singleton(e, e).register(this);
        else
          for (i = Object.keys(e), s = 0, n = i.length; s < n; ++s)
            (o = e[i[s]]),
              Ee(o) && (ve(o) ? o.register(this) : this.register(o));
    return --this.registerDepth, this;
  }
  registerResolver(t, e) {
    Fe(t);
    const i = this.resolvers,
      o = i.get(t);
    return (
      null == o
        ? i.set(t, e)
        : o instanceof pe && 4 === o.strategy
        ? o.state.push(e)
        : i.set(t, new pe(t, 4, [o, e])),
      e
    );
  }
  registerTransformer(t, e) {
    const i = this.getResolver(t);
    if (null == i) return !1;
    if (i.getFactory) {
      const t = i.getFactory(this);
      return null != t && (t.registerTransformer(e), !0);
    }
    return !1;
  }
  getResolver(t, e = !0) {
    if ((Fe(t), void 0 !== t.resolve)) return t;
    let i,
      o = this;
    for (; null != o; ) {
      if (((i = o.resolvers.get(t)), null != i)) return i;
      if (null == o.parent) {
        const i = ye(t) ? this : o;
        return e ? this.jitRegister(t, i) : null;
      }
      o = o.parent;
    }
    return null;
  }
  has(t, e = !1) {
    return (
      !!this.resolvers.has(t) ||
      (!(!e || null == this.parent) && this.parent.has(t, !0))
    );
  }
  get(t) {
    if ((Fe(t), t.$isResolver)) return t.resolve(this, this);
    let e,
      i = this;
    for (; null != i; ) {
      if (((e = i.resolvers.get(t)), null != e)) return e.resolve(i, this);
      if (null == i.parent) {
        const o = ye(t) ? this : i;
        return (e = this.jitRegister(t, o)), e.resolve(i, this);
      }
      i = i.parent;
    }
    throw new Error("Unable to resolve key: " + t);
  }
  getAll(t, i = !1) {
    Fe(t);
    const o = this;
    let s,
      n = o;
    if (i) {
      let i = e;
      for (; null != n; )
        (s = n.resolvers.get(t)),
          null != s && (i = i.concat(Se(s, n, o))),
          (n = n.parent);
      return i;
    }
    for (; null != n; ) {
      if (((s = n.resolvers.get(t)), null != s)) return Se(s, n, o);
      if (((n = n.parent), null == n)) return e;
    }
    return e;
  }
  getFactory(t) {
    let e = we.get(t);
    if (void 0 === e) {
      if (Oe(t))
        throw new Error(
          t.name +
            " is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver."
        );
      we.set(t, (e = new be(t, he.getDependencies(t))));
    }
    return e;
  }
  registerFactory(t, e) {
    we.set(t, e);
  }
  createChild(t) {
    return new ke(
      null,
      Object.assign({}, this.config, t, { parentLocator: () => this })
    );
  }
  jitRegister(t, e) {
    if ("function" != typeof t)
      throw new Error(
        `Attempted to jitRegister something that is not a constructor: '${t}'. Did you forget to register this dependency?`
      );
    if (xe.has(t.name))
      throw new Error(
        `Attempted to jitRegister an intrinsic type: ${t.name}. Did you forget to add @inject(Key)`
      );
    if (ve(t)) {
      const i = t.register(e, t);
      if (!(i instanceof Object) || null == i.resolve) {
        const i = e.resolvers.get(t);
        if (null != i) return i;
        throw new Error(
          "A valid resolver was not returned from the static register method"
        );
      }
      return i;
    }
    if (t.$isInterface)
      throw new Error(
        "Attempted to jitRegister an interface: " + t.friendlyName
      );
    {
      const i = this.config.defaultResolver(t, e);
      return e.resolvers.set(t, i), i;
    }
  }
}
const Ce = new WeakMap();
function Te(t) {
  return function (e, i, o) {
    if (Ce.has(o)) return Ce.get(o);
    const s = t(e, i, o);
    return Ce.set(o, s), s;
  };
}
const Ie = Object.freeze({
  instance: (t, e) => new pe(t, 0, e),
  singleton: (t, e) => new pe(t, 1, e),
  transient: (t, e) => new pe(t, 2, e),
  callback: (t, e) => new pe(t, 3, e),
  cachedCallback: (t, e) => new pe(t, 3, Te(e)),
  aliasTo: (t, e) => new pe(e, 5, t),
});
function Fe(t) {
  if (null == t)
    throw new Error(
      "key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?"
    );
}
function Se(t, e, i) {
  if (t instanceof pe && 4 === t.strategy) {
    const o = t.state;
    let s = o.length;
    const n = new Array(s);
    for (; s--; ) n[s] = o[s].resolve(e, i);
    return n;
  }
  return [t.resolve(e, i)];
}
const De = "(anonymous)";
function Ee(t) {
  return ("object" == typeof t && null !== t) || "function" == typeof t;
}
const Oe = (function () {
    const t = new WeakMap();
    let e = !1,
      i = "",
      o = 0;
    return function (s) {
      return (
        (e = t.get(s)),
        void 0 === e &&
          ((i = s.toString()),
          (o = i.length),
          (e =
            o >= 29 &&
            o <= 100 &&
            125 === i.charCodeAt(o - 1) &&
            i.charCodeAt(o - 2) <= 32 &&
            93 === i.charCodeAt(o - 3) &&
            101 === i.charCodeAt(o - 4) &&
            100 === i.charCodeAt(o - 5) &&
            111 === i.charCodeAt(o - 6) &&
            99 === i.charCodeAt(o - 7) &&
            32 === i.charCodeAt(o - 8) &&
            101 === i.charCodeAt(o - 9) &&
            118 === i.charCodeAt(o - 10) &&
            105 === i.charCodeAt(o - 11) &&
            116 === i.charCodeAt(o - 12) &&
            97 === i.charCodeAt(o - 13) &&
            110 === i.charCodeAt(o - 14) &&
            88 === i.charCodeAt(o - 15)),
          t.set(s, e)),
        e
      );
    };
  })(),
  Re = {};
function Le(t) {
  switch (typeof t) {
    case "number":
      return t >= 0 && (0 | t) === t;
    case "string": {
      const e = Re[t];
      if (void 0 !== e) return e;
      const i = t.length;
      if (0 === i) return (Re[t] = !1);
      let o = 0;
      for (let e = 0; e < i; ++e)
        if (
          ((o = t.charCodeAt(e)),
          (0 === e && 48 === o && i > 1) || o < 48 || o > 57)
        )
          return (Re[t] = !1);
      return (Re[t] = !0);
    }
    default:
      return !1;
  }
}
function Ae(t) {
  return t.toLowerCase() + ":presentation";
}
const Ve = new Map(),
  Pe = Object.freeze({
    define(t, e, i) {
      const o = Ae(t);
      void 0 === Ve.get(o) ? Ve.set(o, e) : Ve.set(o, !1),
        i.register(Ie.instance(o, e));
    },
    forTag(t, e) {
      const i = Ae(t),
        o = Ve.get(i);
      if (!1 === o) {
        return he.findResponsibleContainer(e).get(i);
      }
      return o || null;
    },
  });
class He {
  constructor(t, e) {
    (this.template = t || null),
      (this.styles =
        void 0 === e
          ? null
          : Array.isArray(e)
          ? at.create(e)
          : e instanceof at
          ? e
          : at.create([e]));
  }
  applyTo(t) {
    const e = t.$fastController;
    null === e.template && (e.template = this.template),
      null === e.styles && (e.styles = this.styles);
  }
}
const ze = he.createInterface(),
  Me = new Map(),
  Ne = new Map(),
  Be = he.createInterface((t) =>
    t.cachedCallback((t) => {
      const e = document.body,
        i = e.$$designSystem$$;
      return i || new qe(e, t);
    })
  ),
  je = Object.freeze({
    tagFor: (t) => Ne.get(t),
    responsibleFor(t) {
      const e = t.$$designSystem$$;
      if (e) return e;
      return he.findResponsibleContainer(t).get(Be);
    },
    getOrCreate(t = document.body) {
      const e = t.$$designSystem$$;
      if (e) return e;
      const i = he.getOrCreateDOMContainer(t);
      return (
        i.has(Be, !1) || i.register(Ie.instance(Be, new qe(t, i))), i.get(Be)
      );
    },
  });
class qe {
  constructor(t, e) {
    (this.host = t),
      (this.container = e),
      (this.prefix = "fast"),
      (this.shadowRootMode = void 0),
      (this.disambiguate = () => null),
      (t.$$designSystem$$ = this),
      e.register(Ie.callback(ze, () => this.context));
  }
  withPrefix(t) {
    return (this.prefix = t), this;
  }
  withShadowRootMode(t) {
    return (this.shadowRootMode = t), this;
  }
  withElementDisambiguation(t) {
    return (this.disambiguate = t), this;
  }
  register(...t) {
    const e = this.container,
      i = [],
      o = this.disambiguate,
      s = this.shadowRootMode;
    (this.context = {
      elementPrefix: this.prefix,
      tryDefineElement(t, n, r) {
        let a = t,
          l = Me.get(a);
        for (; l && a; ) (a = o(a, n, l)), a && (l = Me.get(a));
        const c = !!a;
        c &&
          (Ne.has(n) && (n = class extends n {}), Me.set(a, n), Ne.set(n, a)),
          i.push(new _e(e, a || t, n, s, r, c));
      },
    }),
      e.register(...t);
    for (const t of i)
      t.callback(t),
        t.willDefine && null !== t.definition && t.definition.define();
    return this;
  }
}
class _e {
  constructor(t, e, i, o, s, n) {
    (this.container = t),
      (this.name = e),
      (this.type = i),
      (this.shadowRootMode = o),
      (this.callback = s),
      (this.willDefine = n),
      (this.definition = null);
  }
  definePresentation(t) {
    Pe.define(this.name, t, this.container);
  }
  defineElement(t) {
    this.definition = new xt(
      this.type,
      Object.assign(Object.assign({}, t), { name: this.name })
    );
  }
  tagFor(t) {
    return je.tagFor(t);
  }
}
class Ue extends It {
  constructor() {
    super(...arguments), (this._presentation = void 0);
  }
  get $presentation() {
    return (
      void 0 === this._presentation &&
        (this._presentation = Pe.forTag(this.tagName, this)),
      this._presentation
    );
  }
  templateChanged() {
    void 0 !== this.template && (this.$fastController.template = this.template);
  }
  stylesChanged() {
    void 0 !== this.styles && (this.$fastController.styles = this.styles);
  }
  connectedCallback() {
    null !== this.$presentation && this.$presentation.applyTo(this),
      super.connectedCallback();
  }
  static compose(t) {
    return (e = {}) => new Ke(this === Ue ? class extends Ue {} : this, t, e);
  }
}
function Ge(t, e, i) {
  return "function" == typeof t ? t(e, i) : t;
}
ie([S], Ue.prototype, "template", void 0),
  ie([S], Ue.prototype, "styles", void 0);
class Ke {
  constructor(t, e, i) {
    (this.type = t),
      (this.elementDefinition = e),
      (this.overrideDefinition = i),
      (this.definition = Object.assign(
        Object.assign({}, this.elementDefinition),
        this.overrideDefinition
      ));
  }
  register(t) {
    const e = this.definition,
      i = this.overrideDefinition,
      o = t.get(ze),
      s = `${e.prefix || o.elementPrefix}-${e.baseName}`;
    o.tryDefineElement(s, this.type, (t) => {
      const o = new He(Ge(e.template, t, e), Ge(e.styles, t, e));
      t.definePresentation(o);
      let s = Ge(e.shadowOptions, t, e);
      t.shadowRootMode &&
        (s
          ? i.shadowOptions || (s.mode = t.shadowRootMode)
          : null !== s && (s = { mode: t.shadowRootMode })),
        t.defineElement({
          elementOptions: Ge(e.elementOptions, t, e),
          shadowOptions: s,
          attributes: Ge(e.attributes, t, e),
        });
    });
  }
}
function We(t, ...e) {
  e.forEach((e) => {
    if (
      (Object.getOwnPropertyNames(e.prototype).forEach((i) => {
        "constructor" !== i &&
          Object.defineProperty(
            t.prototype,
            i,
            Object.getOwnPropertyDescriptor(e.prototype, i)
          );
      }),
      e.attributes)
    ) {
      const i = t.attributes || [];
      t.attributes = i.concat(e.attributes);
    }
  });
}
class Xe extends Ue {
  constructor() {
    super(...arguments),
      (this.headinglevel = 2),
      (this.expanded = !1),
      (this.clickHandler = (t) => {
        (this.expanded = !this.expanded), this.change();
      }),
      (this.change = () => {
        this.$emit("change");
      });
  }
}
ie(
  [bt({ attribute: "heading-level", mode: "fromView", converter: gt })],
  Xe.prototype,
  "headinglevel",
  void 0
),
  ie([bt({ mode: "boolean" })], Xe.prototype, "expanded", void 0),
  ie([bt], Xe.prototype, "id", void 0),
  We(Xe, Jt);
var Ye;
!(function (t) {
  (t.horizontal = "horizontal"), (t.vertical = "vertical");
})(Ye || (Ye = {}));
var Qe =
    "object" == typeof global && global && global.Object === Object && global,
  Ze = "object" == typeof self && self && self.Object === Object && self,
  Je = Qe || Ze || Function("return this")(),
  ti = Je.Symbol,
  ei = Object.prototype,
  ii = ei.hasOwnProperty,
  oi = ei.toString,
  si = ti ? ti.toStringTag : void 0;
var ni = Object.prototype.toString;
var ri = ti ? ti.toStringTag : void 0;
function ai(t) {
  return null == t
    ? void 0 === t
      ? "[object Undefined]"
      : "[object Null]"
    : ri && ri in Object(t)
    ? (function (t) {
        var e = ii.call(t, si),
          i = t[si];
        try {
          t[si] = void 0;
          var o = !0;
        } catch (t) {}
        var s = oi.call(t);
        return o && (e ? (t[si] = i) : delete t[si]), s;
      })(t)
    : (function (t) {
        return ni.call(t);
      })(t);
}
function li(t) {
  return null != t && "object" == typeof t;
}
function ci(t) {
  return "symbol" == typeof t || (li(t) && "[object Symbol]" == ai(t));
}
var hi = Array.isArray,
  di = ti ? ti.prototype : void 0,
  ui = di ? di.toString : void 0;
function pi(t) {
  if ("string" == typeof t) return t;
  if (hi(t))
    return (
      (function (t, e) {
        for (var i = -1, o = null == t ? 0 : t.length, s = Array(o); ++i < o; )
          s[i] = e(t[i], i, t);
        return s;
      })(t, pi) + ""
    );
  if (ci(t)) return ui ? ui.call(t) : "";
  var e = t + "";
  return "0" == e && 1 / t == -1 / 0 ? "-0" : e;
}
function gi(t) {
  var e = typeof t;
  return null != t && ("object" == e || "function" == e);
}
var fi = /^\s+|\s+$/g,
  bi = /^[-+]0x[0-9a-f]+$/i,
  mi = /^0b[01]+$/i,
  vi = /^0o[0-7]+$/i,
  yi = parseInt;
function xi(t) {
  if ("number" == typeof t) return t;
  if (ci(t)) return NaN;
  if (gi(t)) {
    var e = "function" == typeof t.valueOf ? t.valueOf() : t;
    t = gi(e) ? e + "" : e;
  }
  if ("string" != typeof t) return 0 === t ? t : +t;
  t = t.replace(fi, "");
  var i = mi.test(t);
  return i || vi.test(t) ? yi(t.slice(2), i ? 2 : 8) : bi.test(t) ? NaN : +t;
}
function $i(t) {
  return t
    ? (t = xi(t)) === 1 / 0 || t === -1 / 0
      ? 17976931348623157e292 * (t < 0 ? -1 : 1)
      : t == t
      ? t
      : 0
    : 0 === t
    ? t
    : 0;
}
var wi = /^(?:0|[1-9]\d*)$/;
function ki(t, e) {
  var i = typeof t;
  return (
    !!(e = null == e ? 9007199254740991 : e) &&
    ("number" == i || ("symbol" != i && wi.test(t))) &&
    t > -1 &&
    t % 1 == 0 &&
    t < e
  );
}
function Ci(t) {
  return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991;
}
function Ti(t) {
  return (
    null != t &&
    Ci(t.length) &&
    !(function (t) {
      if (!gi(t)) return !1;
      var e = ai(t);
      return (
        "[object Function]" == e ||
        "[object GeneratorFunction]" == e ||
        "[object AsyncFunction]" == e ||
        "[object Proxy]" == e
      );
    })(t)
  );
}
var Ii = Object.prototype;
function Fi(t) {
  return li(t) && "[object Arguments]" == ai(t);
}
var Si = Object.prototype,
  Di = Si.hasOwnProperty,
  Ei = Si.propertyIsEnumerable,
  Oi = Fi(
    (function () {
      return arguments;
    })()
  )
    ? Fi
    : function (t) {
        return li(t) && Di.call(t, "callee") && !Ei.call(t, "callee");
      };
var Ri = "object" == typeof exports && exports && !exports.nodeType && exports,
  Li = Ri && "object" == typeof module && module && !module.nodeType && module,
  Ai = Li && Li.exports === Ri ? Je.Buffer : void 0,
  Vi =
    (Ai ? Ai.isBuffer : void 0) ||
    function () {
      return !1;
    },
  Pi = {};
(Pi["[object Float32Array]"] =
  Pi["[object Float64Array]"] =
  Pi["[object Int8Array]"] =
  Pi["[object Int16Array]"] =
  Pi["[object Int32Array]"] =
  Pi["[object Uint8Array]"] =
  Pi["[object Uint8ClampedArray]"] =
  Pi["[object Uint16Array]"] =
  Pi["[object Uint32Array]"] =
    !0),
  (Pi["[object Arguments]"] =
    Pi["[object Array]"] =
    Pi["[object ArrayBuffer]"] =
    Pi["[object Boolean]"] =
    Pi["[object DataView]"] =
    Pi["[object Date]"] =
    Pi["[object Error]"] =
    Pi["[object Function]"] =
    Pi["[object Map]"] =
    Pi["[object Number]"] =
    Pi["[object Object]"] =
    Pi["[object RegExp]"] =
    Pi["[object Set]"] =
    Pi["[object String]"] =
    Pi["[object WeakMap]"] =
      !1);
var Hi,
  zi = "object" == typeof exports && exports && !exports.nodeType && exports,
  Mi = zi && "object" == typeof module && module && !module.nodeType && module,
  Ni = Mi && Mi.exports === zi && Qe.process,
  Bi = (function () {
    try {
      var t = Mi && Mi.require && Mi.require("util").types;
      return t || (Ni && Ni.binding && Ni.binding("util"));
    } catch (t) {}
  })(),
  ji = Bi && Bi.isTypedArray,
  qi = ji
    ? ((Hi = ji),
      function (t) {
        return Hi(t);
      })
    : function (t) {
        return li(t) && Ci(t.length) && !!Pi[ai(t)];
      },
  _i = Object.prototype.hasOwnProperty;
function Ui(t, e) {
  var i = hi(t),
    o = !i && Oi(t),
    s = !i && !o && Vi(t),
    n = !i && !o && !s && qi(t),
    r = i || o || s || n,
    a = r
      ? (function (t, e) {
          for (var i = -1, o = Array(t); ++i < t; ) o[i] = e(i);
          return o;
        })(t.length, String)
      : [],
    l = a.length;
  for (var c in t)
    (!e && !_i.call(t, c)) ||
      (r &&
        ("length" == c ||
          (s && ("offset" == c || "parent" == c)) ||
          (n && ("buffer" == c || "byteLength" == c || "byteOffset" == c)) ||
          ki(c, l))) ||
      a.push(c);
  return a;
}
var Gi = (function (t, e) {
    return function (i) {
      return t(e(i));
    };
  })(Object.keys, Object),
  Ki = Object.prototype.hasOwnProperty;
function Wi(t) {
  if (
    ((i = (e = t) && e.constructor),
    e !== (("function" == typeof i && i.prototype) || Ii))
  )
    return Gi(t);
  var e,
    i,
    o = [];
  for (var s in Object(t)) Ki.call(t, s) && "constructor" != s && o.push(s);
  return o;
}
function Xi(t) {
  return Ti(t) ? Ui(t) : Wi(t);
}
var Yi,
  Qi = function (t, e, i) {
    for (var o = -1, s = Object(t), n = i(t), r = n.length; r--; ) {
      var a = n[Yi ? r : ++o];
      if (!1 === e(s[a], a, s)) break;
    }
    return t;
  };
var Zi = Math.max,
  Ji = Math.min;
function to(t, e, i) {
  return (
    (e = $i(e)),
    void 0 === i ? ((i = e), (e = 0)) : (i = $i(i)),
    (function (t, e, i) {
      return t >= Ji(e, i) && t < Zi(e, i);
    })((t = xi(t)), e, i)
  );
}
function eo(t, e, i, o) {
  return (
    (function (t, e) {
      t && Qi(t, e, Xi);
    })(t, function (t, s, n) {
      e(o, i(t), s, n);
    }),
    o
  );
}
var io,
  oo,
  so = Object.prototype.toString,
  no =
    ((io = function (t, e, i) {
      null != e && "function" != typeof e.toString && (e = so.call(e)),
        (t[e] = i);
    }),
    (oo = (function (t) {
      return function () {
        return t;
      };
    })(function (t) {
      return t;
    })),
    function (t, e) {
      return eo(t, io, oo(e), {});
    });
var ro = 0;
function ao(t) {
  var e,
    i = ++ro;
  return (null == (e = t) ? "" : pi(e)) + i;
}
function lo(...t) {
  return t.every((t) => t instanceof HTMLElement);
}
let co;
var ho;
!(function (t) {
  (t[(t.alt = 18)] = "alt"),
    (t[(t.arrowDown = 40)] = "arrowDown"),
    (t[(t.arrowLeft = 37)] = "arrowLeft"),
    (t[(t.arrowRight = 39)] = "arrowRight"),
    (t[(t.arrowUp = 38)] = "arrowUp"),
    (t[(t.back = 8)] = "back"),
    (t[(t.backSlash = 220)] = "backSlash"),
    (t[(t.break = 19)] = "break"),
    (t[(t.capsLock = 20)] = "capsLock"),
    (t[(t.closeBracket = 221)] = "closeBracket"),
    (t[(t.colon = 186)] = "colon"),
    (t[(t.colon2 = 59)] = "colon2"),
    (t[(t.comma = 188)] = "comma"),
    (t[(t.ctrl = 17)] = "ctrl"),
    (t[(t.delete = 46)] = "delete"),
    (t[(t.end = 35)] = "end"),
    (t[(t.enter = 13)] = "enter"),
    (t[(t.equals = 187)] = "equals"),
    (t[(t.equals2 = 61)] = "equals2"),
    (t[(t.equals3 = 107)] = "equals3"),
    (t[(t.escape = 27)] = "escape"),
    (t[(t.forwardSlash = 191)] = "forwardSlash"),
    (t[(t.function1 = 112)] = "function1"),
    (t[(t.function10 = 121)] = "function10"),
    (t[(t.function11 = 122)] = "function11"),
    (t[(t.function12 = 123)] = "function12"),
    (t[(t.function2 = 113)] = "function2"),
    (t[(t.function3 = 114)] = "function3"),
    (t[(t.function4 = 115)] = "function4"),
    (t[(t.function5 = 116)] = "function5"),
    (t[(t.function6 = 117)] = "function6"),
    (t[(t.function7 = 118)] = "function7"),
    (t[(t.function8 = 119)] = "function8"),
    (t[(t.function9 = 120)] = "function9"),
    (t[(t.home = 36)] = "home"),
    (t[(t.insert = 45)] = "insert"),
    (t[(t.menu = 93)] = "menu"),
    (t[(t.minus = 189)] = "minus"),
    (t[(t.minus2 = 109)] = "minus2"),
    (t[(t.numLock = 144)] = "numLock"),
    (t[(t.numPad0 = 96)] = "numPad0"),
    (t[(t.numPad1 = 97)] = "numPad1"),
    (t[(t.numPad2 = 98)] = "numPad2"),
    (t[(t.numPad3 = 99)] = "numPad3"),
    (t[(t.numPad4 = 100)] = "numPad4"),
    (t[(t.numPad5 = 101)] = "numPad5"),
    (t[(t.numPad6 = 102)] = "numPad6"),
    (t[(t.numPad7 = 103)] = "numPad7"),
    (t[(t.numPad8 = 104)] = "numPad8"),
    (t[(t.numPad9 = 105)] = "numPad9"),
    (t[(t.numPadDivide = 111)] = "numPadDivide"),
    (t[(t.numPadDot = 110)] = "numPadDot"),
    (t[(t.numPadMinus = 109)] = "numPadMinus"),
    (t[(t.numPadMultiply = 106)] = "numPadMultiply"),
    (t[(t.numPadPlus = 107)] = "numPadPlus"),
    (t[(t.openBracket = 219)] = "openBracket"),
    (t[(t.pageDown = 34)] = "pageDown"),
    (t[(t.pageUp = 33)] = "pageUp"),
    (t[(t.period = 190)] = "period"),
    (t[(t.print = 44)] = "print"),
    (t[(t.quote = 222)] = "quote"),
    (t[(t.scrollLock = 145)] = "scrollLock"),
    (t[(t.shift = 16)] = "shift"),
    (t[(t.space = 32)] = "space"),
    (t[(t.tab = 9)] = "tab"),
    (t[(t.tilde = 192)] = "tilde"),
    (t[(t.windowsLeft = 91)] = "windowsLeft"),
    (t[(t.windowsOpera = 219)] = "windowsOpera"),
    (t[(t.windowsRight = 92)] = "windowsRight");
})(ho || (ho = {}));
const uo = {
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  ArrowUp: "ArrowUp",
};
var po, go, fo;
function bo(t, e, i) {
  return i < t ? e : i > e ? t : i;
}
function mo(t, e, i) {
  return Math.min(Math.max(i, t), e);
}
!(function (t) {
  (t.ltr = "ltr"), (t.rtl = "rtl");
})(po || (po = {})),
  (function (t) {
    (t.Canvas = "Canvas"),
      (t.CanvasText = "CanvasText"),
      (t.LinkText = "LinkText"),
      (t.VisitedText = "VisitedText"),
      (t.ActiveText = "ActiveText"),
      (t.ButtonFace = "ButtonFace"),
      (t.ButtonText = "ButtonText"),
      (t.Field = "Field"),
      (t.FieldText = "FieldText"),
      (t.Highlight = "Highlight"),
      (t.HighlightText = "HighlightText"),
      (t.GrayText = "GrayText");
  })(go || (go = {})),
  (function (t) {
    (t.single = "single"), (t.multi = "multi");
  })(fo || (fo = {}));
class vo extends Ue {
  constructor() {
    super(...arguments),
      (this.expandmode = fo.multi),
      (this.activeItemIndex = 0),
      (this.change = () => {
        this.$emit("change");
      }),
      (this.setItems = () => {
        (this.accordionIds = this.getItemIds()),
          this.accordionItems.forEach((t, e) => {
            t instanceof Xe &&
              (t.addEventListener("change", this.activeItemChange),
              this.isSingleExpandMode() &&
                (this.activeItemIndex !== e
                  ? (t.expanded = !1)
                  : (t.expanded = !0)));
            const i = this.accordionIds[e];
            t.setAttribute(
              "id",
              "string" != typeof i ? "accordion-" + (e + 1) : i
            ),
              (this.activeid = this.accordionIds[this.activeItemIndex]),
              t.addEventListener("keydown", this.handleItemKeyDown),
              t.addEventListener("focus", this.handleItemFocus);
          });
      }),
      (this.removeItemListeners = (t) => {
        t.forEach((t, e) => {
          t.removeEventListener("change", this.activeItemChange),
            t.removeEventListener("keydown", this.handleItemKeyDown),
            t.removeEventListener("focus", this.handleItemFocus);
        });
      }),
      (this.activeItemChange = (t) => {
        const e = t.target;
        this.isSingleExpandMode() &&
          (this.resetItems(), (t.target.expanded = !0)),
          (this.activeid = t.target.getAttribute("id")),
          (this.activeItemIndex = Array.from(this.accordionItems).indexOf(e)),
          this.change();
      }),
      (this.handleItemKeyDown = (t) => {
        if (t.target !== t.currentTarget) return;
        const e = t.keyCode;
        switch (((this.accordionIds = this.getItemIds()), e)) {
          case 38:
            t.preventDefault(), this.adjust(-1);
            break;
          case 40:
            t.preventDefault(), this.adjust(1);
            break;
          case 36:
            (this.activeItemIndex = 0), this.focusItem();
            break;
          case 35:
            (this.activeItemIndex = this.accordionItems.length - 1),
              this.focusItem();
        }
      }),
      (this.handleItemFocus = (t) => {
        if (t.target === t.currentTarget) {
          const e = t.target,
            i = (this.activeItemIndex = Array.from(this.accordionItems).indexOf(
              e
            ));
          this.activeItemIndex !== i &&
            -1 !== i &&
            ((this.activeItemIndex = i),
            (this.activeid = this.accordionIds[this.activeItemIndex]));
        }
      });
  }
  accordionItemsChanged(t, e) {
    this.$fastController.isConnected &&
      (this.removeItemListeners(t),
      (this.accordionIds = this.getItemIds()),
      this.setItems());
  }
  resetItems() {
    this.accordionItems.forEach((t, e) => {
      t.expanded = !1;
    });
  }
  getItemIds() {
    return this.accordionItems.map((t) => t.getAttribute("id"));
  }
  isSingleExpandMode() {
    return this.expandmode === fo.single;
  }
  adjust(t) {
    (this.activeItemIndex = bo(
      0,
      this.accordionItems.length - 1,
      this.activeItemIndex + t
    )),
      this.focusItem();
  }
  focusItem() {
    const t = this.accordionItems[this.activeItemIndex];
    t instanceof Xe && t.expandbutton.focus();
  }
}
ie([bt({ attribute: "expand-mode" })], vo.prototype, "expandmode", void 0),
  ie([S], vo.prototype, "accordionItems", void 0);
const yo = (t, e) =>
  rt`<a class="control" part="control" download="${(t) => t.download}" href="${(
    t
  ) => t.href}" hreflang="${(t) => t.hreflang}" ping="${(t) =>
    t.ping}" referrerpolicy="${(t) => t.referrerpolicy}" rel="${(t) =>
    t.rel}" target="${(t) => t.target}" type="${(t) => t.type}" aria-atomic="${(
    t
  ) => t.ariaAtomic}" aria-busy="${(t) => t.ariaBusy}" aria-controls="${(t) =>
    t.ariaControls}" aria-current="${(t) =>
    t.ariaCurrent}" aria-describedBy="${(t) =>
    t.ariaDescribedby}" aria-details="${(t) =>
    t.ariaDetails}" aria-disabled="${(t) =>
    t.ariaDisabled}" aria-errormessage="${(t) =>
    t.ariaErrormessage}" aria-expanded="${(t) =>
    t.ariaExpanded}" aria-flowto="${(t) => t.ariaFlowto}" aria-haspopup="${(
    t
  ) => t.ariaHaspopup}" aria-hidden="${(t) => t.ariaHidden}" aria-invalid="${(
    t
  ) => t.ariaInvalid}" aria-keyshortcuts="${(t) =>
    t.ariaKeyshortcuts}" aria-label="${(t) => t.ariaLabel}" aria-labelledby="${(
    t
  ) => t.ariaLabelledby}" aria-live="${(t) => t.ariaLive}" aria-owns="${(t) =>
    t.ariaOwns}" aria-relevant="${(t) =>
    t.ariaRelevant}" aria-roledescription="${(t) =>
    t.ariaRoledescription}" ${Bt(
    "control"
  )}>${ee}<span class="content" part="content"><slot ${Yt(
    "defaultSlottedContent"
  )}></slot></span>${te}</a>`;
class xo {}
ie(
  [bt({ attribute: "aria-atomic", mode: "fromView" })],
  xo.prototype,
  "ariaAtomic",
  void 0
),
  ie(
    [bt({ attribute: "aria-busy", mode: "fromView" })],
    xo.prototype,
    "ariaBusy",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-controls", mode: "fromView" })],
    xo.prototype,
    "ariaControls",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-current", mode: "fromView" })],
    xo.prototype,
    "ariaCurrent",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-describedby", mode: "fromView" })],
    xo.prototype,
    "ariaDescribedby",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-details", mode: "fromView" })],
    xo.prototype,
    "ariaDetails",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-disabled", mode: "fromView" })],
    xo.prototype,
    "ariaDisabled",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-errormessage", mode: "fromView" })],
    xo.prototype,
    "ariaErrormessage",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-flowto", mode: "fromView" })],
    xo.prototype,
    "ariaFlowto",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-haspopup", mode: "fromView" })],
    xo.prototype,
    "ariaHaspopup",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-hidden", mode: "fromView" })],
    xo.prototype,
    "ariaHidden",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-invalid", mode: "fromView" })],
    xo.prototype,
    "ariaInvalid",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-keyshortcuts", mode: "fromView" })],
    xo.prototype,
    "ariaKeyshortcuts",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-label", mode: "fromView" })],
    xo.prototype,
    "ariaLabel",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-labelledby", mode: "fromView" })],
    xo.prototype,
    "ariaLabelledby",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-live", mode: "fromView" })],
    xo.prototype,
    "ariaLive",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-owns", mode: "fromView" })],
    xo.prototype,
    "ariaOwns",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-relevant", mode: "fromView" })],
    xo.prototype,
    "ariaRelevant",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-roledescription", mode: "fromView" })],
    xo.prototype,
    "ariaRoledescription",
    void 0
  );
class $o extends Ue {}
ie([bt], $o.prototype, "download", void 0),
  ie([bt], $o.prototype, "href", void 0),
  ie([bt], $o.prototype, "hreflang", void 0),
  ie([bt], $o.prototype, "ping", void 0),
  ie([bt], $o.prototype, "referrerpolicy", void 0),
  ie([bt], $o.prototype, "rel", void 0),
  ie([bt], $o.prototype, "target", void 0),
  ie([bt], $o.prototype, "type", void 0),
  ie([S], $o.prototype, "defaultSlottedContent", void 0);
class wo {}
ie(
  [bt({ attribute: "aria-expanded", mode: "fromView" })],
  wo.prototype,
  "ariaExpanded",
  void 0
),
  We(wo, xo),
  We($o, Jt, wo);
function ko(t) {
  const e = t.parentElement;
  if (e) return e;
  {
    const e = t.getRootNode();
    if (e.host instanceof HTMLElement) return e.host;
  }
  return null;
}
class Co extends class {
  constructor(t) {
    (this.listenerCache = new WeakMap()), (this.query = t);
  }
  bind(t) {
    const { query: e } = this,
      i = this.constructListener(t);
    i.bind(e)(), e.addListener(i), this.listenerCache.set(t, i);
  }
  unbind(t) {
    const e = this.listenerCache.get(t);
    e && (this.query.removeListener(e), this.listenerCache.delete(t));
  }
} {
  constructor(t, e) {
    super(t), (this.styles = e);
  }
  static with(t) {
    return (e) => new Co(t, e);
  }
  constructListener(t) {
    let e = !1;
    const i = this.styles;
    return function () {
      const { matches: o } = this;
      o && !e
        ? (t.$fastController.addStyles(i), (e = o))
        : !o && e && (t.$fastController.removeStyles(i), (e = o));
    };
  }
  unbind(t) {
    super.unbind(t), t.$fastController.removeStyles(this.styles);
  }
}
const To = Co.with(window.matchMedia("(forced-colors)"));
Co.with(window.matchMedia("(prefers-color-scheme: dark)")),
  Co.with(window.matchMedia("(prefers-color-scheme: light)"));
class Io {
  constructor(t, e, i) {
    (this.propertyName = t), (this.value = e), (this.styles = i);
  }
  bind(t) {
    T.getNotifier(t).subscribe(this, this.propertyName),
      this.handleChange(t, this.propertyName);
  }
  unbind(t) {
    T.getNotifier(t).unsubscribe(this, this.propertyName),
      t.$fastController.removeStyles(this.styles);
  }
  handleChange(t, e) {
    t[e] === this.value
      ? t.$fastController.addStyles(this.styles)
      : t.$fastController.removeStyles(this.styles);
  }
}
function Fo(t) {
  return `:host([hidden]){display:none}:host{display:${t}}`;
}
const So = (function () {
    if (!0 === (t = co) || !1 === t || (li(t) && "[object Boolean]" == ai(t)))
      return co;
    var t;
    if (
      "undefined" == typeof window ||
      !window.document ||
      !window.document.createElement
    )
      return (co = !1), co;
    const e = document.createElement("style"),
      i = (function () {
        const t = document.querySelector('meta[property="csp-nonce"]');
        return t ? t.getAttribute("content") : null;
      })();
    null !== i && e.setAttribute("nonce", i), document.head.appendChild(e);
    try {
      e.sheet.insertRule("foo:focus-visible {color:inherit}", 0), (co = !0);
    } catch (t) {
      co = !1;
    } finally {
      document.head.removeChild(e);
    }
    return co;
  })()
    ? "focus-visible"
    : "focus",
  Do = (t) => {
    const e = t.closest("[dir]");
    return null !== e && "rtl" === e.dir ? po.rtl : po.ltr;
  };
function Eo(t, e, i) {
  return (
    t.nodeType !== Node.TEXT_NODE ||
    ("string" == typeof t.nodeValue && !!t.nodeValue.trim().length)
  );
}
class Oo extends Ue {
  constructor() {
    super(...arguments),
      (this.anchor = ""),
      (this.viewport = ""),
      (this.horizontalPositioningMode = "uncontrolled"),
      (this.horizontalDefaultPosition = "unset"),
      (this.horizontalViewportLock = !1),
      (this.horizontalInset = !1),
      (this.horizontalScaling = "content"),
      (this.verticalPositioningMode = "uncontrolled"),
      (this.verticalDefaultPosition = "unset"),
      (this.verticalViewportLock = !1),
      (this.verticalInset = !1),
      (this.verticalScaling = "content"),
      (this.fixedPlacement = !1),
      (this.autoUpdateMode = "anchor"),
      (this.anchorElement = null),
      (this.viewportElement = null),
      (this.initialLayoutComplete = !1),
      (this.resizeDetector = null),
      (this.baseHorizontalOffset = 0),
      (this.baseVerticalOffset = 0),
      (this.pendingPositioningUpdate = !1),
      (this.pendingReset = !1),
      (this.currentDirection = po.ltr),
      (this.regionVisible = !1),
      (this.updateThreshold = 0.5),
      (this.update = () => {
        this.pendingPositioningUpdate || this.requestPositionUpdates();
      }),
      (this.startObservers = () => {
        this.stopObservers(),
          null !== this.anchorElement &&
            (this.requestPositionUpdates(),
            null !== this.resizeDetector &&
              (this.resizeDetector.observe(this.anchorElement),
              this.resizeDetector.observe(this)));
      }),
      (this.requestPositionUpdates = () => {
        null === this.anchorElement ||
          this.pendingPositioningUpdate ||
          (Oo.intersectionService.requestPosition(
            this,
            this.handleIntersection
          ),
          Oo.intersectionService.requestPosition(
            this.anchorElement,
            this.handleIntersection
          ),
          null !== this.viewportElement &&
            Oo.intersectionService.requestPosition(
              this.viewportElement,
              this.handleIntersection
            ),
          (this.pendingPositioningUpdate = !0));
      }),
      (this.stopObservers = () => {
        this.pendingPositioningUpdate &&
          ((this.pendingPositioningUpdate = !1),
          Oo.intersectionService.cancelRequestPosition(
            this,
            this.handleIntersection
          ),
          null !== this.anchorElement &&
            Oo.intersectionService.cancelRequestPosition(
              this.anchorElement,
              this.handleIntersection
            ),
          null !== this.viewportElement &&
            Oo.intersectionService.cancelRequestPosition(
              this.viewportElement,
              this.handleIntersection
            )),
          null !== this.resizeDetector && this.resizeDetector.disconnect();
      }),
      (this.getViewport = () =>
        "string" != typeof this.viewport || "" === this.viewport
          ? document.documentElement
          : document.getElementById(this.viewport)),
      (this.getAnchor = () => document.getElementById(this.anchor)),
      (this.handleIntersection = (t) => {
        this.pendingPositioningUpdate &&
          ((this.pendingPositioningUpdate = !1),
          this.applyIntersectionEntries(t) && this.updateLayout());
      }),
      (this.applyIntersectionEntries = (t) => {
        const e = t.find((t) => t.target === this),
          i = t.find((t) => t.target === this.anchorElement),
          o = t.find((t) => t.target === this.viewportElement);
        return (
          void 0 !== e &&
          void 0 !== o &&
          void 0 !== i &&
          !(
            this.regionVisible &&
            void 0 !== this.regionRect &&
            void 0 !== this.anchorRect &&
            void 0 !== this.viewportRect &&
            !this.isRectDifferent(this.anchorRect, i.boundingClientRect) &&
            !this.isRectDifferent(this.viewportRect, o.boundingClientRect) &&
            !this.isRectDifferent(this.regionRect, e.boundingClientRect)
          ) &&
          ((this.regionRect = e.boundingClientRect),
          (this.anchorRect = i.boundingClientRect),
          this.viewportElement === document.documentElement
            ? (this.viewportRect = new DOMRectReadOnly(
                o.boundingClientRect.x + document.documentElement.scrollLeft,
                o.boundingClientRect.y + document.documentElement.scrollTop,
                o.boundingClientRect.width,
                o.boundingClientRect.height
              ))
            : (this.viewportRect = o.boundingClientRect),
          this.updateRegionOffset(),
          !0)
        );
      }),
      (this.updateRegionOffset = () => {
        this.anchorRect &&
          this.regionRect &&
          ((this.baseHorizontalOffset =
            this.baseHorizontalOffset +
            (this.anchorRect.left - this.regionRect.left) +
            (this.translateX - this.baseHorizontalOffset)),
          (this.baseVerticalOffset =
            this.baseVerticalOffset +
            (this.anchorRect.top - this.regionRect.top) +
            (this.translateY - this.baseVerticalOffset)));
      }),
      (this.isRectDifferent = (t, e) =>
        Math.abs(t.top - e.top) > this.updateThreshold ||
        Math.abs(t.right - e.right) > this.updateThreshold ||
        Math.abs(t.bottom - e.bottom) > this.updateThreshold ||
        Math.abs(t.left - e.left) > this.updateThreshold),
      (this.handleResize = (t) => {
        this.update();
      }),
      (this.reset = () => {
        this.pendingReset &&
          ((this.pendingReset = !1),
          null === this.anchorElement &&
            (this.anchorElement = this.getAnchor()),
          null === this.viewportElement &&
            (this.viewportElement = this.getViewport()),
          (this.currentDirection = Do(this)),
          this.startObservers());
      }),
      (this.updateLayout = () => {
        let t = void 0,
          e = void 0;
        if ("uncontrolled" !== this.horizontalPositioningMode) {
          const t = this.getPositioningOptions(this.horizontalInset);
          if ("unset" !== this.horizontalDefaultPosition) {
            let t = this.horizontalDefaultPosition;
            if ("start" === t || "end" === t) {
              const e = Do(this);
              if (e !== this.currentDirection)
                return (this.currentDirection = e), void this.initialize();
              t =
                this.currentDirection === po.ltr
                  ? "start" === t
                    ? "left"
                    : "right"
                  : "start" === t
                  ? "right"
                  : "left";
            }
            switch (t) {
              case "left":
                e = this.horizontalInset ? "insetStart" : "start";
                break;
              case "right":
                e = this.horizontalInset ? "insetEnd" : "end";
            }
          }
          const i =
              void 0 !== this.horizontalThreshold
                ? this.horizontalThreshold
                : void 0 !== this.regionRect
                ? this.regionRect.width
                : 0,
            o = void 0 !== this.anchorRect ? this.anchorRect.left : 0,
            s = void 0 !== this.anchorRect ? this.anchorRect.right : 0,
            n = void 0 !== this.anchorRect ? this.anchorRect.width : 0,
            r = void 0 !== this.viewportRect ? this.viewportRect.left : 0,
            a = void 0 !== this.viewportRect ? this.viewportRect.right : 0;
          (void 0 === e ||
            ("locktodefault" !== this.horizontalPositioningMode &&
              this.getAvailableSpace(e, o, s, n, r, a) < i)) &&
            (e =
              this.getAvailableSpace(t[0], o, s, n, r, a) >
              this.getAvailableSpace(t[1], o, s, n, r, a)
                ? t[0]
                : t[1]);
        }
        if ("uncontrolled" !== this.verticalPositioningMode) {
          const e = this.getPositioningOptions(this.verticalInset);
          if ("unset" !== this.verticalDefaultPosition)
            switch (this.verticalDefaultPosition) {
              case "top":
                t = this.verticalInset ? "insetStart" : "start";
                break;
              case "bottom":
                t = this.verticalInset ? "insetEnd" : "end";
            }
          const i =
              void 0 !== this.verticalThreshold
                ? this.verticalThreshold
                : void 0 !== this.regionRect
                ? this.regionRect.height
                : 0,
            o = void 0 !== this.anchorRect ? this.anchorRect.top : 0,
            s = void 0 !== this.anchorRect ? this.anchorRect.bottom : 0,
            n = void 0 !== this.anchorRect ? this.anchorRect.height : 0,
            r = void 0 !== this.viewportRect ? this.viewportRect.top : 0,
            a = void 0 !== this.viewportRect ? this.viewportRect.bottom : 0;
          (void 0 === t ||
            ("locktodefault" !== this.verticalPositioningMode &&
              this.getAvailableSpace(t, o, s, n, r, a) < i)) &&
            (t =
              this.getAvailableSpace(e[0], o, s, n, r, a) >
              this.getAvailableSpace(e[1], o, s, n, r, a)
                ? e[0]
                : e[1]);
        }
        const i = this.getNextRegionDimension(e, t),
          o = this.horizontalPosition !== e || this.verticalPosition !== t;
        if (
          (this.setHorizontalPosition(e, i),
          this.setVerticalPosition(t, i),
          this.updateRegionStyle(),
          !this.initialLayoutComplete)
        )
          return (
            (this.initialLayoutComplete = !0),
            void this.requestPositionUpdates()
          );
        this.regionVisible ||
          ((this.regionVisible = !0),
          this.style.removeProperty("pointer-events"),
          this.style.removeProperty("opacity"),
          this.classList.toggle("loaded", !0),
          this.$emit("loaded", this, { bubbles: !1 })),
          this.updatePositionClasses(),
          o && this.$emit("positionchange", this, { bubbles: !1 });
      }),
      (this.updateRegionStyle = () => {
        (this.style.width = this.regionWidth),
          (this.style.height = this.regionHeight),
          (this.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`);
      }),
      (this.updatePositionClasses = () => {
        this.classList.toggle("top", "start" === this.verticalPosition),
          this.classList.toggle("bottom", "end" === this.verticalPosition),
          this.classList.toggle(
            "inset-top",
            "insetStart" === this.verticalPosition
          ),
          this.classList.toggle(
            "inset-bottom",
            "insetEnd" === this.verticalPosition
          ),
          this.classList.toggle("left", "start" === this.horizontalPosition),
          this.classList.toggle("right", "end" === this.horizontalPosition),
          this.classList.toggle(
            "inset-left",
            "insetStart" === this.horizontalPosition
          ),
          this.classList.toggle(
            "inset-right",
            "insetEnd" === this.horizontalPosition
          );
      }),
      (this.setHorizontalPosition = (t, e) => {
        if (
          void 0 === t ||
          void 0 === this.regionRect ||
          void 0 === this.anchorRect ||
          void 0 === this.viewportRect
        )
          return;
        let i = 0;
        switch (this.horizontalScaling) {
          case "anchor":
          case "fill":
            (i = e.width), (this.regionWidth = i + "px");
            break;
          case "content":
            (i = this.regionRect.width), (this.regionWidth = "unset");
        }
        switch (t) {
          case "start":
            (this.translateX = this.baseHorizontalOffset - i),
              this.horizontalViewportLock &&
                this.anchorRect.left > this.viewportRect.right &&
                (this.translateX =
                  this.translateX -
                  (this.anchorRect.left - this.viewportRect.right));
            break;
          case "insetStart":
            (this.translateX =
              this.baseHorizontalOffset - i + this.anchorRect.width),
              this.horizontalViewportLock &&
                this.anchorRect.right > this.viewportRect.right &&
                (this.translateX =
                  this.translateX -
                  (this.anchorRect.right - this.viewportRect.right));
            break;
          case "insetEnd":
            (this.translateX = this.baseHorizontalOffset),
              this.horizontalViewportLock &&
                this.anchorRect.left < this.viewportRect.left &&
                (this.translateX =
                  this.translateX -
                  (this.anchorRect.left - this.viewportRect.left));
            break;
          case "end":
            (this.translateX =
              this.baseHorizontalOffset + this.anchorRect.width),
              this.horizontalViewportLock &&
                this.anchorRect.right < this.viewportRect.left &&
                (this.translateX =
                  this.translateX -
                  (this.anchorRect.right - this.viewportRect.left));
        }
        this.horizontalPosition = t;
      }),
      (this.setVerticalPosition = (t, e) => {
        if (
          void 0 === t ||
          void 0 === this.regionRect ||
          void 0 === this.anchorRect ||
          void 0 === this.viewportRect
        )
          return;
        let i = 0;
        switch (this.verticalScaling) {
          case "anchor":
          case "fill":
            (i = e.height), (this.regionHeight = i + "px");
            break;
          case "content":
            (i = this.regionRect.height), (this.regionHeight = "unset");
        }
        switch (t) {
          case "start":
            (this.translateY = this.baseVerticalOffset - i),
              this.verticalViewportLock &&
                this.anchorRect.top > this.viewportRect.bottom &&
                (this.translateY =
                  this.translateY -
                  (this.anchorRect.top - this.viewportRect.bottom));
            break;
          case "insetStart":
            (this.translateY =
              this.baseVerticalOffset - i + this.anchorRect.height),
              this.verticalViewportLock &&
                this.anchorRect.bottom > this.viewportRect.bottom &&
                (this.translateY =
                  this.translateY -
                  (this.anchorRect.bottom - this.viewportRect.bottom));
            break;
          case "insetEnd":
            (this.translateY = this.baseVerticalOffset),
              this.verticalViewportLock &&
                this.anchorRect.top < this.viewportRect.top &&
                (this.translateY =
                  this.translateY -
                  (this.anchorRect.top - this.viewportRect.top));
            break;
          case "end":
            (this.translateY =
              this.baseVerticalOffset + this.anchorRect.height),
              this.verticalViewportLock &&
                this.anchorRect.bottom < this.viewportRect.top &&
                (this.translateY =
                  this.translateY -
                  (this.anchorRect.bottom - this.viewportRect.top));
        }
        this.verticalPosition = t;
      }),
      (this.getPositioningOptions = (t) =>
        t ? ["insetStart", "insetEnd"] : ["start", "end"]),
      (this.getAvailableSpace = (t, e, i, o, s, n) => {
        const r = e - s,
          a = n - (e + o);
        switch (t) {
          case "start":
            return r;
          case "insetStart":
            return r + o;
          case "insetEnd":
            return a + o;
          case "end":
            return a;
        }
      }),
      (this.getNextRegionDimension = (t, e) => {
        const i = {
          height: void 0 !== this.regionRect ? this.regionRect.height : 0,
          width: void 0 !== this.regionRect ? this.regionRect.width : 0,
        };
        return (
          void 0 !== t && "fill" === this.horizontalScaling
            ? (i.width = this.getAvailableSpace(
                t,
                void 0 !== this.anchorRect ? this.anchorRect.left : 0,
                void 0 !== this.anchorRect ? this.anchorRect.right : 0,
                void 0 !== this.anchorRect ? this.anchorRect.width : 0,
                void 0 !== this.viewportRect ? this.viewportRect.left : 0,
                void 0 !== this.viewportRect ? this.viewportRect.right : 0
              ))
            : "anchor" === this.horizontalScaling &&
              (i.width =
                void 0 !== this.anchorRect ? this.anchorRect.width : 0),
          void 0 !== e && "fill" === this.verticalScaling
            ? (i.height = this.getAvailableSpace(
                e,
                void 0 !== this.anchorRect ? this.anchorRect.top : 0,
                void 0 !== this.anchorRect ? this.anchorRect.bottom : 0,
                void 0 !== this.anchorRect ? this.anchorRect.height : 0,
                void 0 !== this.viewportRect ? this.viewportRect.top : 0,
                void 0 !== this.viewportRect ? this.viewportRect.bottom : 0
              ))
            : "anchor" === this.verticalScaling &&
              (i.height =
                void 0 !== this.anchorRect ? this.anchorRect.height : 0),
          i
        );
      }),
      (this.startAutoUpdateEventListeners = () => {
        window.addEventListener("resize", this.update, { passive: !0 }),
          window.addEventListener("scroll", this.update, {
            passive: !0,
            capture: !0,
          }),
          null !== this.resizeDetector &&
            null !== this.viewportElement &&
            this.resizeDetector.observe(this.viewportElement);
      }),
      (this.stopAutoUpdateEventListeners = () => {
        window.removeEventListener("resize", this.update),
          window.removeEventListener("scroll", this.update),
          null !== this.resizeDetector &&
            null !== this.viewportElement &&
            this.resizeDetector.unobserve(this.viewportElement);
      });
  }
  anchorChanged() {
    this.initialLayoutComplete && (this.anchorElement = this.getAnchor());
  }
  viewportChanged() {
    this.initialLayoutComplete && (this.viewportElement = this.getViewport());
  }
  horizontalPositioningModeChanged() {
    this.requestReset();
  }
  horizontalDefaultPositionChanged() {
    this.updateForAttributeChange();
  }
  horizontalViewportLockChanged() {
    this.updateForAttributeChange();
  }
  horizontalInsetChanged() {
    this.updateForAttributeChange();
  }
  horizontalThresholdChanged() {
    this.updateForAttributeChange();
  }
  horizontalScalingChanged() {
    this.updateForAttributeChange();
  }
  verticalPositioningModeChanged() {
    this.requestReset();
  }
  verticalDefaultPositionChanged() {
    this.updateForAttributeChange();
  }
  verticalViewportLockChanged() {
    this.updateForAttributeChange();
  }
  verticalInsetChanged() {
    this.updateForAttributeChange();
  }
  verticalThresholdChanged() {
    this.updateForAttributeChange();
  }
  verticalScalingChanged() {
    this.updateForAttributeChange();
  }
  fixedPlacementChanged() {
    this.$fastController.isConnected &&
      this.initialLayoutComplete &&
      this.initialize();
  }
  autoUpdateModeChanged(t, e) {
    this.$fastController.isConnected &&
      this.initialLayoutComplete &&
      ("auto" === t && this.stopAutoUpdateEventListeners(),
      "auto" === e && this.startAutoUpdateEventListeners());
  }
  anchorElementChanged() {
    this.requestReset();
  }
  viewportElementChanged() {
    this.$fastController.isConnected &&
      this.initialLayoutComplete &&
      this.initialize();
  }
  connectedCallback() {
    super.connectedCallback(),
      "auto" === this.autoUpdateMode && this.startAutoUpdateEventListeners(),
      this.initialize();
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      "auto" === this.autoUpdateMode && this.stopAutoUpdateEventListeners(),
      this.stopObservers(),
      this.disconnectResizeDetector();
  }
  adoptedCallback() {
    this.initialize();
  }
  disconnectResizeDetector() {
    null !== this.resizeDetector &&
      (this.resizeDetector.disconnect(), (this.resizeDetector = null));
  }
  initializeResizeDetector() {
    this.disconnectResizeDetector(),
      (this.resizeDetector = new window.ResizeObserver(this.handleResize));
  }
  updateForAttributeChange() {
    this.$fastController.isConnected &&
      this.initialLayoutComplete &&
      this.update();
  }
  initialize() {
    this.initializeResizeDetector(),
      null === this.anchorElement && (this.anchorElement = this.getAnchor()),
      this.requestReset();
  }
  requestReset() {
    this.$fastController.isConnected &&
      !1 === this.pendingReset &&
      (this.setInitialState(),
      u.queueUpdate(() => this.reset()),
      (this.pendingReset = !0));
  }
  setInitialState() {
    (this.initialLayoutComplete = !1),
      (this.regionVisible = !1),
      (this.translateX = 0),
      (this.translateY = 0),
      (this.baseHorizontalOffset = 0),
      (this.baseVerticalOffset = 0),
      (this.viewportRect = void 0),
      (this.regionRect = void 0),
      (this.anchorRect = void 0),
      (this.verticalPosition = void 0),
      (this.horizontalPosition = void 0),
      (this.style.opacity = "0"),
      (this.style.pointerEvents = "none"),
      (this.style.position = this.fixedPlacement ? "fixed" : "absolute"),
      this.updatePositionClasses(),
      this.updateRegionStyle();
  }
}
(Oo.intersectionService = new (class {
  constructor() {
    (this.intersectionDetector = null),
      (this.observedElements = new Map()),
      (this.requestPosition = (t, e) => {
        var i;
        null !== this.intersectionDetector &&
          (this.observedElements.has(t)
            ? null === (i = this.observedElements.get(t)) ||
              void 0 === i ||
              i.push(e)
            : (this.observedElements.set(t, [e]),
              this.intersectionDetector.observe(t)));
      }),
      (this.cancelRequestPosition = (t, e) => {
        const i = this.observedElements.get(t);
        if (void 0 !== i) {
          const t = i.indexOf(e);
          -1 !== t && i.splice(t, 1);
        }
      }),
      (this.initializeIntersectionDetector = () => {
        t.IntersectionObserver &&
          (this.intersectionDetector = new IntersectionObserver(
            this.handleIntersection,
            { root: null, rootMargin: "0px", threshold: [0, 1] }
          ));
      }),
      (this.handleIntersection = (t) => {
        if (null === this.intersectionDetector) return;
        const e = [],
          i = [];
        t.forEach((t) => {
          var o;
          null === (o = this.intersectionDetector) ||
            void 0 === o ||
            o.unobserve(t.target);
          const s = this.observedElements.get(t.target);
          void 0 !== s &&
            (s.forEach((o) => {
              let s = e.indexOf(o);
              -1 === s && ((s = e.length), e.push(o), i.push([])), i[s].push(t);
            }),
            this.observedElements.delete(t.target));
        }),
          e.forEach((t, e) => {
            t(i[e]);
          });
      }),
      this.initializeIntersectionDetector();
  }
})()),
  ie([bt], Oo.prototype, "anchor", void 0),
  ie([bt], Oo.prototype, "viewport", void 0),
  ie(
    [bt({ attribute: "horizontal-positioning-mode" })],
    Oo.prototype,
    "horizontalPositioningMode",
    void 0
  ),
  ie(
    [bt({ attribute: "horizontal-default-position" })],
    Oo.prototype,
    "horizontalDefaultPosition",
    void 0
  ),
  ie(
    [bt({ attribute: "horizontal-viewport-lock", mode: "boolean" })],
    Oo.prototype,
    "horizontalViewportLock",
    void 0
  ),
  ie(
    [bt({ attribute: "horizontal-inset", mode: "boolean" })],
    Oo.prototype,
    "horizontalInset",
    void 0
  ),
  ie(
    [bt({ attribute: "horizontal-threshold" })],
    Oo.prototype,
    "horizontalThreshold",
    void 0
  ),
  ie(
    [bt({ attribute: "horizontal-scaling" })],
    Oo.prototype,
    "horizontalScaling",
    void 0
  ),
  ie(
    [bt({ attribute: "vertical-positioning-mode" })],
    Oo.prototype,
    "verticalPositioningMode",
    void 0
  ),
  ie(
    [bt({ attribute: "vertical-default-position" })],
    Oo.prototype,
    "verticalDefaultPosition",
    void 0
  ),
  ie(
    [bt({ attribute: "vertical-viewport-lock", mode: "boolean" })],
    Oo.prototype,
    "verticalViewportLock",
    void 0
  ),
  ie(
    [bt({ attribute: "vertical-inset", mode: "boolean" })],
    Oo.prototype,
    "verticalInset",
    void 0
  ),
  ie(
    [bt({ attribute: "vertical-threshold" })],
    Oo.prototype,
    "verticalThreshold",
    void 0
  ),
  ie(
    [bt({ attribute: "vertical-scaling" })],
    Oo.prototype,
    "verticalScaling",
    void 0
  ),
  ie(
    [bt({ attribute: "fixed-placement", mode: "boolean" })],
    Oo.prototype,
    "fixedPlacement",
    void 0
  ),
  ie(
    [bt({ attribute: "auto-update-mode" })],
    Oo.prototype,
    "autoUpdateMode",
    void 0
  ),
  ie([S], Oo.prototype, "anchorElement", void 0),
  ie([S], Oo.prototype, "viewportElement", void 0),
  ie([S], Oo.prototype, "initialLayoutComplete", void 0);
class Ro extends Ue {
  connectedCallback() {
    super.connectedCallback(), this.shape || (this.shape = "circle");
  }
}
ie([bt], Ro.prototype, "fill", void 0),
  ie([bt], Ro.prototype, "color", void 0),
  ie([bt], Ro.prototype, "link", void 0),
  ie([bt], Ro.prototype, "shape", void 0);
class Lo extends Ue {
  constructor() {
    super(...arguments),
      (this.generateBadgeStyle = () => {
        if (!this.fill && !this.color) return;
        const t = `background-color: var(--badge-fill-${this.fill});`,
          e = `color: var(--badge-color-${this.color});`;
        return this.fill && !this.color
          ? t
          : this.color && !this.fill
          ? e
          : `${e} ${t}`;
      });
  }
}
ie([bt({ attribute: "fill" })], Lo.prototype, "fill", void 0),
  ie([bt({ attribute: "color" })], Lo.prototype, "color", void 0),
  ie([bt({ mode: "boolean" })], Lo.prototype, "circular", void 0);
class Ao extends $o {
  constructor() {
    super(...arguments), (this.separator = !0);
  }
}
ie([S], Ao.prototype, "separator", void 0), We(Ao, Jt, wo);
class Vo extends Ue {
  slottedBreadcrumbItemsChanged() {
    if (this.$fastController.isConnected) {
      if (
        void 0 === this.slottedBreadcrumbItems ||
        0 === this.slottedBreadcrumbItems.length
      )
        return;
      const t =
        this.slottedBreadcrumbItems[this.slottedBreadcrumbItems.length - 1];
      this.setItemSeparator(t), this.setLastItemAriaCurrent(t);
    }
  }
  setItemSeparator(t) {
    this.slottedBreadcrumbItems.forEach((t) => {
      t instanceof Ao && (t.separator = !0);
    }),
      t instanceof Ao && (t.separator = !1);
  }
  findChildWithHref(t) {
    var e, i;
    return t.childElementCount > 0
      ? t.querySelector("a[href]")
      : (
          null === (e = t.shadowRoot) || void 0 === e
            ? void 0
            : e.childElementCount
        )
      ? null === (i = t.shadowRoot) || void 0 === i
        ? void 0
        : i.querySelector("a[href]")
      : null;
  }
  setLastItemAriaCurrent(t) {
    const e = this.findChildWithHref(t);
    null === e && t.hasAttribute("href") && t instanceof Ao
      ? (t.ariaCurrent = "page")
      : null !== e && e.setAttribute("aria-current", "page");
  }
}
ie([S], Vo.prototype, "slottedBreadcrumbItems", void 0);
const Po =
    "ElementInternals" in window &&
    "setFormValue" in window.ElementInternals.prototype,
  Ho = new Map();
function zo(t) {
  const i = class extends t {
    constructor(...t) {
      super(...t),
        (this.dirtyValue = !1),
        (this.disabled = !1),
        (this.proxyEventsToBlock = ["change", "click"]),
        (this.formDisabledCallback = (t) => {
          this.disabled = t;
        }),
        (this.formResetCallback = () => {
          (this.value = this.initialValue), (this.dirtyValue = !1);
        }),
        (this.proxyInitialized = !1),
        (this.required = !1),
        (this.initialValue = this.initialValue || "");
    }
    static get formAssociated() {
      return Po;
    }
    get validity() {
      return this.elementInternals
        ? this.elementInternals.validity
        : this.proxy.validity;
    }
    get form() {
      return this.elementInternals
        ? this.elementInternals.form
        : this.proxy.form;
    }
    get validationMessage() {
      return this.elementInternals
        ? this.elementInternals.validationMessage
        : this.proxy.validationMessage;
    }
    get willValidate() {
      return this.elementInternals
        ? this.elementInternals.willValidate
        : this.proxy.willValidate;
    }
    get labels() {
      if (this.elementInternals)
        return Object.freeze(Array.from(this.elementInternals.labels));
      if (
        this.proxy instanceof HTMLElement &&
        this.proxy.ownerDocument &&
        this.id
      ) {
        const t = this.proxy.labels,
          e = Array.from(
            this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)
          ),
          i = t ? e.concat(Array.from(t)) : e;
        return Object.freeze(i);
      }
      return e;
    }
    valueChanged(t, e) {
      (this.dirtyValue = !0),
        this.proxy instanceof HTMLElement && (this.proxy.value = this.value),
        this.setFormValue(this.value),
        this.validate();
    }
    initialValueChanged(t, e) {
      this.dirtyValue ||
        ((this.value = this.initialValue), (this.dirtyValue = !1));
    }
    disabledChanged(t, e) {
      this.proxy instanceof HTMLElement &&
        (this.proxy.disabled = this.disabled),
        u.queueUpdate(() => this.classList.toggle("disabled", this.disabled));
    }
    nameChanged(t, e) {
      this.proxy instanceof HTMLElement && (this.proxy.name = this.name);
    }
    requiredChanged(t, e) {
      this.proxy instanceof HTMLElement &&
        (this.proxy.required = this.required),
        u.queueUpdate(() => this.classList.toggle("required", this.required)),
        this.validate();
    }
    get elementInternals() {
      if (!Po) return null;
      let t = Ho.get(this);
      return t || ((t = this.attachInternals()), Ho.set(this, t)), t;
    }
    connectedCallback() {
      super.connectedCallback(),
        this.addEventListener("keypress", this._keypressHandler),
        this.value ||
          ((this.value = this.initialValue), (this.dirtyValue = !1)),
        this.elementInternals || this.attachProxy(),
        this.form &&
          this.form.addEventListener("reset", this.formResetCallback);
    }
    disconnectedCallback() {
      this.proxyEventsToBlock.forEach((t) =>
        this.proxy.removeEventListener(t, this.stopPropagation)
      ),
        this.form &&
          this.form.removeEventListener("reset", this.formResetCallback);
    }
    checkValidity() {
      return this.elementInternals
        ? this.elementInternals.checkValidity()
        : this.proxy.checkValidity();
    }
    reportValidity() {
      return this.elementInternals
        ? this.elementInternals.reportValidity()
        : this.proxy.reportValidity();
    }
    setValidity(t, e, i) {
      this.elementInternals
        ? this.elementInternals.setValidity(t, e, i)
        : "string" == typeof e && this.proxy.setCustomValidity(e);
    }
    attachProxy() {
      var t;
      this.proxyInitialized ||
        ((this.proxyInitialized = !0),
        (this.proxy.style.display = "none"),
        this.proxyEventsToBlock.forEach((t) =>
          this.proxy.addEventListener(t, this.stopPropagation)
        ),
        (this.proxy.disabled = this.disabled),
        (this.proxy.required = this.required),
        "string" == typeof this.name && (this.proxy.name = this.name),
        "string" == typeof this.value && (this.proxy.value = this.value),
        this.proxy.setAttribute("slot", "form-associated-proxy"),
        (this.proxySlot = document.createElement("slot")),
        this.proxySlot.setAttribute("name", "form-associated-proxy")),
        null === (t = this.shadowRoot) ||
          void 0 === t ||
          t.appendChild(this.proxySlot),
        this.appendChild(this.proxy);
    }
    detachProxy() {
      var t;
      this.removeChild(this.proxy),
        null === (t = this.shadowRoot) ||
          void 0 === t ||
          t.removeChild(this.proxySlot);
    }
    validate() {
      this.proxy instanceof HTMLElement &&
        this.setValidity(this.proxy.validity, this.proxy.validationMessage);
    }
    setFormValue(t, e) {
      this.elementInternals && this.elementInternals.setFormValue(t, e || t);
    }
    _keypressHandler(t) {
      switch (t.keyCode) {
        case 13:
          if (this.form instanceof HTMLFormElement) {
            const t = this.form.querySelector("[type=submit]");
            null == t || t.click();
          }
      }
    }
    stopPropagation(t) {
      t.stopPropagation();
    }
  };
  return (
    bt({ mode: "boolean" })(i.prototype, "disabled"),
    bt({ mode: "fromView", attribute: "value" })(i.prototype, "initialValue"),
    bt(i.prototype, "name"),
    bt({ mode: "boolean" })(i.prototype, "required"),
    S(i.prototype, "value"),
    i
  );
}
class Mo extends Ue {}
class No extends zo(Mo) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("input"));
  }
}
class Bo extends No {
  constructor() {
    super(...arguments),
      (this.handleSubmission = () => {
        if (!this.form) return;
        const t = this.proxy.isConnected;
        t || this.attachProxy(),
          "function" == typeof this.form.requestSubmit
            ? this.form.requestSubmit(this.proxy)
            : this.proxy.click(),
          t || this.detachProxy();
      }),
      (this.handleFormReset = () => {
        var t;
        null === (t = this.form) || void 0 === t || t.reset();
      });
  }
  formactionChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.formAction = this.formaction);
  }
  formenctypeChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.formEnctype = this.formenctype);
  }
  formmethodChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.formMethod = this.formmethod);
  }
  formnovalidateChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.formNoValidate = this.formnovalidate);
  }
  formtargetChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.formTarget = this.formtarget);
  }
  typeChanged(t, e) {
    this.proxy instanceof HTMLInputElement && (this.proxy.type = this.type),
      "submit" === e && this.addEventListener("click", this.handleSubmission),
      "submit" === t &&
        this.removeEventListener("click", this.handleSubmission),
      "reset" === e && this.addEventListener("click", this.handleFormReset),
      "reset" === t && this.removeEventListener("click", this.handleFormReset);
  }
  connectedCallback() {
    super.connectedCallback(), this.proxy.setAttribute("type", this.type);
  }
}
ie([bt({ mode: "boolean" })], Bo.prototype, "autofocus", void 0),
  ie([bt({ attribute: "form" })], Bo.prototype, "formId", void 0),
  ie([bt], Bo.prototype, "formaction", void 0),
  ie([bt], Bo.prototype, "formenctype", void 0),
  ie([bt], Bo.prototype, "formmethod", void 0),
  ie([bt({ mode: "boolean" })], Bo.prototype, "formnovalidate", void 0),
  ie([bt], Bo.prototype, "formtarget", void 0),
  ie([bt], Bo.prototype, "type", void 0),
  ie([S], Bo.prototype, "defaultSlottedContent", void 0);
class jo {}
ie(
  [bt({ attribute: "aria-expanded", mode: "fromView" })],
  jo.prototype,
  "ariaExpanded",
  void 0
),
  ie(
    [bt({ attribute: "aria-pressed", mode: "fromView" })],
    jo.prototype,
    "ariaPressed",
    void 0
  ),
  We(jo, xo),
  We(Bo, Jt, jo);
class qo extends Ue {}
class _o extends Ue {}
class Uo extends zo(_o) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("input"));
  }
}
class Go extends Uo {
  constructor() {
    super(),
      (this.initialValue = "on"),
      (this.indeterminate = !1),
      (this.dirtyChecked = !1),
      (this.constructed = !1),
      (this.formResetCallback = () => {
        (this.checked = this.checkedAttribute), (this.dirtyChecked = !1);
      }),
      (this.keypressHandler = (t) => {
        switch (t.keyCode) {
          case 32:
            this.checked = !this.checked;
        }
      }),
      (this.clickHandler = (t) => {
        this.disabled || this.readOnly || (this.checked = !this.checked);
      }),
      (this.defaultChecked = !!this.checkedAttribute),
      (this.checked = this.defaultChecked),
      (this.constructed = !0);
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.readOnly = this.readOnly);
  }
  checkedAttributeChanged() {
    this.defaultChecked = this.checkedAttribute;
  }
  defaultCheckedChanged() {
    this.dirtyChecked ||
      ((this.checked = this.defaultChecked), (this.dirtyChecked = !1));
  }
  checkedChanged() {
    this.dirtyChecked || (this.dirtyChecked = !0),
      this.updateForm(),
      this.proxy instanceof HTMLInputElement &&
        (this.proxy.checked = this.checked),
      this.constructed && this.$emit("change"),
      this.validate();
  }
  connectedCallback() {
    super.connectedCallback(),
      this.proxy.setAttribute("type", "checkbox"),
      this.updateForm();
  }
  updateForm() {
    const t = this.checked ? this.value : null;
    this.setFormValue(t, t);
  }
}
var Ko, Wo, Xo, Yo;
function Qo(t) {
  return (
    lo(t) &&
    ("option" === t.getAttribute("role") || t instanceof HTMLOptionElement)
  );
}
ie(
  [bt({ attribute: "readonly", mode: "boolean" })],
  Go.prototype,
  "readOnly",
  void 0
),
  ie(
    [bt({ attribute: "checked", mode: "boolean" })],
    Go.prototype,
    "checkedAttribute",
    void 0
  ),
  ie([S], Go.prototype, "defaultSlottedNodes", void 0),
  ie([S], Go.prototype, "defaultChecked", void 0),
  ie([S], Go.prototype, "checked", void 0),
  ie([S], Go.prototype, "indeterminate", void 0),
  (function (t) {
    (t.above = "above"), (t.below = "below");
  })(Ko || (Ko = {})),
  (function (t) {
    t.combobox = "combobox";
  })(Wo || (Wo = {}));
class Zo extends Ue {
  constructor(t, e, i, o) {
    super(),
      (this.defaultSelected = !1),
      (this.dirtySelected = !1),
      (this.selected = this.defaultSelected),
      (this.dirtyValue = !1),
      (this.initialValue = this.initialValue || ""),
      t && (this.textContent = t),
      e && (this.initialValue = e),
      i && (this.defaultSelected = i),
      o && (this.selected = o),
      (this.proxy = new Option(
        "" + this.textContent,
        this.initialValue,
        this.defaultSelected,
        this.selected
      )),
      (this.proxy.disabled = this.disabled);
  }
  defaultSelectedChanged() {
    this.dirtySelected ||
      ((this.selected = this.defaultSelected),
      this.proxy instanceof HTMLOptionElement &&
        (this.proxy.selected = this.defaultSelected));
  }
  disabledChanged(t, e) {
    this.proxy instanceof HTMLOptionElement &&
      (this.proxy.disabled = this.disabled);
  }
  selectedAttributeChanged() {
    (this.defaultSelected = this.selectedAttribute),
      this.proxy instanceof HTMLOptionElement &&
        (this.proxy.defaultSelected = this.defaultSelected);
  }
  selectedChanged() {
    this.$fastController.isConnected &&
      (this.dirtySelected || (this.dirtySelected = !0),
      this.proxy instanceof HTMLOptionElement &&
        (this.proxy.selected = this.selected));
  }
  initialValueChanged(t, e) {
    this.dirtyValue ||
      ((this.value = this.initialValue), (this.dirtyValue = !1));
  }
  get label() {
    return this.value ? this.value : this.textContent ? this.textContent : "";
  }
  get text() {
    return this.textContent;
  }
  set value(t) {
    (this._value = t),
      (this.dirtyValue = !0),
      this.proxy instanceof HTMLElement && (this.proxy.value = t),
      T.notify(this, "value");
  }
  get value() {
    return T.track(this, "value"), this._value ? this._value : this.text;
  }
  get form() {
    return this.proxy ? this.proxy.form : null;
  }
}
ie([S], Zo.prototype, "defaultSelected", void 0),
  ie([bt({ mode: "boolean" })], Zo.prototype, "disabled", void 0),
  ie(
    [bt({ attribute: "selected", mode: "boolean" })],
    Zo.prototype,
    "selectedAttribute",
    void 0
  ),
  ie([S], Zo.prototype, "selected", void 0),
  ie(
    [bt({ attribute: "value", mode: "fromView" })],
    Zo.prototype,
    "initialValue",
    void 0
  ),
  We(Zo, Jt),
  (function (t) {
    t.listbox = "listbox";
  })(Xo || (Xo = {}));
class Jo extends Ue {
  constructor() {
    super(...arguments),
      (this.selectedIndex = -1),
      (this.typeaheadBuffer = ""),
      (this.typeaheadTimeout = -1),
      (this.typeAheadExpired = !0),
      (this.role = Xo.listbox),
      (this._options = []),
      (this.selectedOptions = []),
      (this.shouldSkipFocus = !1),
      (this.handleTypeAhead = (t) => {
        this.typeaheadTimeout && window.clearTimeout(this.typeaheadTimeout),
          (this.typeaheadTimeout = window.setTimeout(
            () => (this.typeAheadExpired = !0),
            Jo.TYPE_AHEAD_TIMEOUT_MS
          )),
          t.length > 1 ||
            (this.typeaheadBuffer = `${
              this.typeAheadExpired ? "" : this.typeaheadBuffer
            }${t}`);
      });
  }
  selectedIndexChanged(t, e) {
    this.setSelectedOptions();
  }
  typeaheadBufferChanged(t, e) {
    if (this.$fastController.isConnected) {
      const t = this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"),
        e = new RegExp("^" + t, "gi"),
        i = this.options.filter((t) => t.text.trim().match(e));
      if (i.length) {
        const t = this.options.indexOf(i[0]);
        t > -1 && (this.selectedIndex = t);
      }
      this.typeAheadExpired = !1;
    }
  }
  slottedOptionsChanged(t, e) {
    this.$fastController.isConnected &&
      ((this.options = e.reduce((t, e) => (Qo(e) && t.push(e), t), [])),
      this.options.forEach((t) => {
        t.id = t.id || ao("option-");
      }),
      this.setSelectedOptions(),
      this.setDefaultSelectedOption());
  }
  get options() {
    return T.track(this, "options"), this._options;
  }
  set options(t) {
    (this._options = t), T.notify(this, "options");
  }
  selectedOptionsChanged(t, e) {
    this.$fastController.isConnected &&
      this.options.forEach((t) => {
        t.selected = e.includes(t);
      });
  }
  get firstSelectedOption() {
    return this.selectedOptions[0];
  }
  focusAndScrollOptionIntoView() {
    this.contains(document.activeElement) &&
      this.firstSelectedOption &&
      (this.firstSelectedOption.focus(),
      requestAnimationFrame(() => {
        this.firstSelectedOption.scrollIntoView({ block: "nearest" });
      }));
  }
  focusinHandler(t) {
    this.shouldSkipFocus ||
      t.target !== t.currentTarget ||
      (this.setSelectedOptions(), this.focusAndScrollOptionIntoView()),
      (this.shouldSkipFocus = !1);
  }
  mousedownHandler(t) {
    return (this.shouldSkipFocus = !this.contains(document.activeElement)), !0;
  }
  setDefaultSelectedOption() {
    if (this.options && this.$fastController.isConnected) {
      const t = this.options.findIndex(
        (t) => null !== t.getAttribute("selected")
      );
      if (-1 !== t) return void (this.selectedIndex = t);
      this.selectedIndex = 0;
    }
  }
  setSelectedOptions() {
    if (this.$fastController.isConnected && this.options) {
      const t = this.options[this.selectedIndex] || null;
      (this.selectedOptions = this.options.filter((e) => e.isSameNode(t))),
        (this.ariaActiveDescendant = this.firstSelectedOption
          ? this.firstSelectedOption.id
          : ""),
        this.focusAndScrollOptionIntoView();
    }
  }
  selectFirstOption() {
    this.disabled || (this.selectedIndex = 0);
  }
  selectLastOption() {
    this.disabled || (this.selectedIndex = this.options.length - 1);
  }
  selectNextOption() {
    !this.disabled &&
      this.options &&
      this.selectedIndex < this.options.length - 1 &&
      (this.selectedIndex += 1);
  }
  get length() {
    return this.options ? this.options.length : 0;
  }
  selectPreviousOption() {
    !this.disabled &&
      this.selectedIndex > 0 &&
      (this.selectedIndex = this.selectedIndex - 1);
  }
  clickHandler(t) {
    const e = t.target.closest("option,[role=option]");
    if (e && !e.disabled)
      return (this.selectedIndex = this.options.indexOf(e)), !0;
  }
  keydownHandler(t) {
    if (this.disabled) return !0;
    this.shouldSkipFocus = !1;
    const e = t.key;
    switch (e) {
      case "Home":
        t.shiftKey || (t.preventDefault(), this.selectFirstOption());
        break;
      case "ArrowDown":
        t.shiftKey || (t.preventDefault(), this.selectNextOption());
        break;
      case "ArrowUp":
        t.shiftKey || (t.preventDefault(), this.selectPreviousOption());
        break;
      case "End":
        t.preventDefault(), this.selectLastOption();
        break;
      case "Tab":
        return this.focusAndScrollOptionIntoView(), !0;
      case "Enter":
      case "Escape":
        return !0;
      case " ":
        if (this.typeAheadExpired) return !0;
      default:
        return 1 === e.length && this.handleTypeAhead("" + e), !0;
    }
  }
}
(Jo.TYPE_AHEAD_TIMEOUT_MS = 1e3),
  (Jo.slottedOptionFilter = (t) => Qo(t) && !t.disabled && !t.hidden),
  ie([S], Jo.prototype, "selectedIndex", void 0),
  ie([S], Jo.prototype, "typeaheadBuffer", void 0),
  ie([bt], Jo.prototype, "role", void 0),
  ie([bt({ mode: "boolean" })], Jo.prototype, "disabled", void 0),
  ie([S], Jo.prototype, "slottedOptions", void 0),
  ie([S], Jo.prototype, "selectedOptions", void 0);
class ts {
  constructor() {
    this.ariaActiveDescendant = "";
  }
}
ie([S], ts.prototype, "ariaActiveDescendant", void 0),
  ie([S], ts.prototype, "ariaDisabled", void 0),
  ie([S], ts.prototype, "ariaExpanded", void 0),
  We(ts, xo),
  We(Jo, ts);
class es extends Jo {}
class is extends zo(es) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("input"));
  }
}
!(function (t) {
  (t.inline = "inline"),
    (t.list = "list"),
    (t.both = "both"),
    (t.none = "none");
})(Yo || (Yo = {}));
class os extends is {
  constructor() {
    super(...arguments),
      (this._value = ""),
      (this.filteredOptions = []),
      (this.filter = ""),
      (this.forcedPosition = !1),
      (this.formResetCallback = () => {
        (this.value = this.initialValue),
          (this.dirtyValue = !1),
          this.setDefaultSelectedOption(),
          this.updateValue();
      }),
      (this.listboxId = ao("listbox-")),
      (this.maxHeight = 0),
      (this.open = !1),
      (this.position = Ko.below),
      (this.role = Wo.combobox);
  }
  get isAutocompleteInline() {
    return this.autocomplete === Yo.inline || this.isAutocompleteBoth;
  }
  get isAutocompleteList() {
    return this.autocomplete === Yo.list || this.isAutocompleteBoth;
  }
  get isAutocompleteBoth() {
    return this.autocomplete === Yo.both;
  }
  openChanged() {
    (this.ariaExpanded = this.open ? "true" : "false"),
      this.open && (this.setPositioning(), this.focusAndScrollOptionIntoView());
  }
  get options() {
    return (
      T.track(this, "options"),
      this.filteredOptions.length ? this.filteredOptions : this._options
    );
  }
  set options(t) {
    (this._options = t), T.notify(this, "options");
  }
  placeholderChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.placeholder = this.placeholder);
  }
  get value() {
    return T.track(this, "value"), this._value;
  }
  set value(t) {
    var e, i, o;
    const s = "" + this._value;
    if (this.$fastController.isConnected && this.options) {
      const s = this.options.findIndex(
          (e) => e.text.toLowerCase() === t.toLowerCase()
        ),
        n =
          null === (e = this.options[this.selectedIndex]) || void 0 === e
            ? void 0
            : e.text,
        r = null === (i = this.options[s]) || void 0 === i ? void 0 : i.text;
      (this.selectedIndex = n !== r ? s : this.selectedIndex),
        (t =
          (null === (o = this.firstSelectedOption) || void 0 === o
            ? void 0
            : o.text) || t);
    }
    s !== t &&
      ((this._value = t), super.valueChanged(s, t), T.notify(this, "value"));
  }
  clickHandler(t) {
    if (!this.disabled) {
      if (this.open) {
        const e = t.target.closest("option,[role=option]");
        if (!e || e.disabled) return;
        (this.selectedOptions = [e]), (this.control.value = e.text);
      }
      return (this.open = !this.open), this.open || this.updateValue(!0), !0;
    }
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.forcedPosition = !!this.positionAttribute),
      this.value && (this.initialValue = this.value);
  }
  disabledChanged(t, e) {
    super.disabledChanged && super.disabledChanged(t, e),
      (this.ariaDisabled = this.disabled ? "true" : "false");
  }
  filterOptions() {
    (this.autocomplete && this.autocomplete !== Yo.none) || (this.filter = "");
    const t = this.filter.toLowerCase();
    (this.filteredOptions = this._options.filter((t) =>
      t.text.toLowerCase().startsWith(this.filter.toLowerCase())
    )),
      this.isAutocompleteList &&
        (this.filteredOptions.length ||
          t ||
          (this.filteredOptions = this._options),
        this._options.forEach((t) => {
          t.hidden = !this.filteredOptions.includes(t);
        }));
  }
  focusoutHandler(t) {
    if ((this.updateValue(), !this.open)) return !0;
    const e = t.relatedTarget;
    this.isSameNode(e)
      ? this.focus()
      : (this.options && this.options.includes(e)) || (this.open = !1);
  }
  inputHandler(t) {
    if (
      ((this.filter = this.control.value),
      this.filterOptions(),
      "deleteContentBackward" === t.inputType || !this.filter.length)
    )
      return !0;
    this.isAutocompleteList && !this.open && (this.open = !0),
      this.isAutocompleteInline &&
        this.filteredOptions.length &&
        ((this.selectedOptions = [this.filteredOptions[0]]),
        (this.selectedIndex = this.options.indexOf(this.firstSelectedOption)),
        this.setInlineSelection());
  }
  keydownHandler(t) {
    const e = t.key;
    if (t.ctrlKey || t.shiftKey) return !0;
    switch (e) {
      case "Enter": {
        this.updateValue(!0),
          this.isAutocompleteInline && (this.filter = this.value),
          (this.open = !1);
        const t = this.control.value.length;
        this.control.setSelectionRange(t, t);
        break;
      }
      case "Escape":
        if (
          (this.isAutocompleteInline || (this.selectedIndex = -1), this.open)
        ) {
          this.open = !1;
          break;
        }
        (this.value = ""),
          (this.control.value = ""),
          (this.filter = ""),
          this.filterOptions();
        break;
      case "Tab":
        if ((this.updateValue(), !this.open)) return !0;
        t.preventDefault(), (this.open = !1);
        break;
      case "ArrowUp":
      case "ArrowDown":
        if ((this.filterOptions(), !this.open)) {
          this.open = !0;
          break;
        }
        this.filteredOptions.length > 0 && super.keydownHandler(t),
          this.isAutocompleteInline &&
            (this.updateValue(), this.setInlineSelection());
        break;
      default:
        return !0;
    }
  }
  keyupHandler(t) {
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowRight":
      case "Backspace":
      case "Delete":
      case "Home":
      case "End":
        (this.filter = this.control.value),
          (this.selectedIndex = -1),
          this.filterOptions();
    }
  }
  selectedIndexChanged(t, e) {
    if (this.$fastController.isConnected) {
      if ((e = mo(-1, this.options.length - 1, e)) !== this.selectedIndex)
        return void (this.selectedIndex = e);
      super.selectedIndexChanged(t, e);
    }
  }
  selectPreviousOption() {
    !this.disabled &&
      this.selectedIndex >= 0 &&
      (this.selectedIndex = this.selectedIndex - 1);
  }
  setDefaultSelectedOption() {
    if (this.$fastController.isConnected && this.options) {
      const t = this.options.findIndex(
        (t) => null !== t.getAttribute("selected") || t.selected
      );
      (this.selectedIndex = t),
        !this.dirtyValue &&
          this.firstSelectedOption &&
          (this.value = this.firstSelectedOption.text),
        this.setSelectedOptions();
    }
  }
  setInlineSelection() {
    this.firstSelectedOption &&
      ((this.control.value = this.firstSelectedOption.text),
      this.control.focus(),
      this.control.setSelectionRange(
        this.filter.length,
        this.control.value.length,
        "backward"
      ));
  }
  setPositioning() {
    const t = this.getBoundingClientRect(),
      e = window.innerHeight - t.bottom;
    (this.position = this.forcedPosition
      ? this.positionAttribute
      : t.top > e
      ? Ko.above
      : Ko.below),
      (this.positionAttribute = this.forcedPosition
        ? this.positionAttribute
        : this.position),
      (this.maxHeight = this.position === Ko.above ? ~~t.top : ~~e);
  }
  selectedOptionsChanged(t, e) {
    this.$fastController.isConnected &&
      this._options.forEach((t) => {
        t.selected = e.includes(t);
      });
  }
  slottedOptionsChanged(t, e) {
    super.slottedOptionsChanged(t, e), this.updateValue();
  }
  updateValue(t) {
    var e;
    this.$fastController.isConnected &&
      (this.value =
        (null === (e = this.firstSelectedOption) || void 0 === e
          ? void 0
          : e.text) || this.control.value),
      t && this.$emit("change");
  }
}
ie(
  [bt({ attribute: "autocomplete", mode: "fromView" })],
  os.prototype,
  "autocomplete",
  void 0
),
  ie([S], os.prototype, "maxHeight", void 0),
  ie(
    [bt({ attribute: "open", mode: "boolean" })],
    os.prototype,
    "open",
    void 0
  ),
  ie([bt], os.prototype, "placeholder", void 0),
  ie(
    [bt({ attribute: "position" })],
    os.prototype,
    "positionAttribute",
    void 0
  ),
  ie([S], os.prototype, "position", void 0);
class ss {}
ie(
  [bt({ attribute: "aria-autocomplete", mode: "fromView" })],
  ss.prototype,
  "ariaAutocomplete",
  void 0
),
  We(ss, xo),
  We(os, Jt, ss);
var ns, rs, as;
!(function (t) {
  (t.none = "none"), (t.default = "default"), (t.sticky = "sticky");
})(ns || (ns = {})),
  (function (t) {
    (t.default = "default"), (t.columnHeader = "columnheader");
  })(rs || (rs = {})),
  (function (t) {
    (t.default = "default"),
      (t.header = "header"),
      (t.stickyHeader = "sticky-header");
  })(as || (as = {}));
class ls extends Ue {
  constructor() {
    super(...arguments),
      (this.rowType = as.default),
      (this.rowData = null),
      (this.columnDefinitions = null),
      (this.isActiveRow = !1),
      (this.cellsRepeatBehavior = null),
      (this.cellsPlaceholder = null),
      (this.focusColumnIndex = 0),
      (this.refocusOnLoad = !1),
      (this.updateRowStyle = () => {
        this.style.gridTemplateColumns = this.gridTemplateColumns;
      });
  }
  gridTemplateColumnsChanged() {
    this.$fastController.isConnected && this.updateRowStyle();
  }
  rowTypeChanged() {
    this.$fastController.isConnected && this.updateItemTemplate();
  }
  rowDataChanged() {
    null !== this.rowData && this.isActiveRow && (this.refocusOnLoad = !0);
  }
  cellItemTemplateChanged() {
    this.updateItemTemplate();
  }
  headerCellItemTemplateChanged() {
    this.updateItemTemplate();
  }
  connectedCallback() {
    super.connectedCallback(),
      null === this.cellsRepeatBehavior &&
        ((this.cellsPlaceholder = document.createComment("")),
        this.appendChild(this.cellsPlaceholder),
        this.updateItemTemplate(),
        (this.cellsRepeatBehavior = new Gt(
          (t) => t.columnDefinitions,
          (t) => t.activeCellItemTemplate,
          { positioning: !0 }
        ).createBehavior(this.cellsPlaceholder)),
        this.$fastController.addBehaviors([this.cellsRepeatBehavior])),
      this.addEventListener("cell-focused", this.handleCellFocus),
      this.addEventListener("focusout", this.handleFocusout),
      this.addEventListener("keydown", this.handleKeydown),
      this.updateRowStyle(),
      this.refocusOnLoad &&
        ((this.refocusOnLoad = !1),
        this.cellElements.length > this.focusColumnIndex &&
          this.cellElements[this.focusColumnIndex].focus());
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      this.removeEventListener("cell-focused", this.handleCellFocus),
      this.removeEventListener("focusout", this.handleFocusout),
      this.removeEventListener("keydown", this.handleKeydown);
  }
  handleFocusout(t) {
    this.contains(t.target) ||
      ((this.isActiveRow = !1), (this.focusColumnIndex = 0));
  }
  handleCellFocus(t) {
    (this.isActiveRow = !0),
      (this.focusColumnIndex = this.cellElements.indexOf(t.target)),
      this.$emit("row-focused", this);
  }
  handleKeydown(t) {
    if (t.defaultPrevented) return;
    let e = 0;
    switch (t.keyCode) {
      case 37:
        (e = Math.max(0, this.focusColumnIndex - 1)),
          this.cellElements[e].focus(),
          t.preventDefault();
        break;
      case 39:
        (e = Math.min(this.cellElements.length - 1, this.focusColumnIndex + 1)),
          this.cellElements[e].focus(),
          t.preventDefault();
        break;
      case 36:
        t.ctrlKey || (this.cellElements[0].focus(), t.preventDefault());
        break;
      case 35:
        t.ctrlKey ||
          (this.cellElements[this.cellElements.length - 1].focus(),
          t.preventDefault());
    }
  }
  updateItemTemplate() {
    this.activeCellItemTemplate =
      this.rowType === as.default && void 0 !== this.cellItemTemplate
        ? this.cellItemTemplate
        : this.rowType === as.default && void 0 === this.cellItemTemplate
        ? this.defaultCellItemTemplate
        : void 0 !== this.headerCellItemTemplate
        ? this.headerCellItemTemplate
        : this.defaultHeaderCellItemTemplate;
  }
}
ie(
  [bt({ attribute: "grid-template-columns" })],
  ls.prototype,
  "gridTemplateColumns",
  void 0
),
  ie([bt({ attribute: "row-type" })], ls.prototype, "rowType", void 0),
  ie([S], ls.prototype, "rowData", void 0),
  ie([S], ls.prototype, "columnDefinitions", void 0),
  ie([S], ls.prototype, "cellItemTemplate", void 0),
  ie([S], ls.prototype, "headerCellItemTemplate", void 0),
  ie([S], ls.prototype, "rowIndex", void 0),
  ie([S], ls.prototype, "isActiveRow", void 0),
  ie([S], ls.prototype, "activeCellItemTemplate", void 0),
  ie([S], ls.prototype, "defaultCellItemTemplate", void 0),
  ie([S], ls.prototype, "defaultHeaderCellItemTemplate", void 0),
  ie([S], ls.prototype, "cellElements", void 0);
class cs extends Ue {
  constructor() {
    super(),
      (this.generateHeader = ns.default),
      (this.rowsData = []),
      (this.columnDefinitions = null),
      (this.focusRowIndex = 0),
      (this.focusColumnIndex = 0),
      (this.rowsPlaceholder = null),
      (this.generatedHeader = null),
      (this.isUpdatingFocus = !1),
      (this.pendingFocusUpdate = !1),
      (this.rowindexUpdateQueued = !1),
      (this.columnDefinitionsStale = !0),
      (this.generatedGridTemplateColumns = ""),
      (this.focusOnCell = (t, e, i) => {
        if (0 === this.rowElements.length)
          return (this.focusRowIndex = 0), void (this.focusColumnIndex = 0);
        const o = Math.max(0, Math.min(this.rowElements.length - 1, t)),
          s = this.rowElements[o].querySelectorAll(
            '[role="cell"], [role="gridcell"], [role="columnheader"]'
          ),
          n = s[Math.max(0, Math.min(s.length - 1, e))];
        i &&
          this.scrollHeight !== this.clientHeight &&
          ((o < this.focusRowIndex && this.scrollTop > 0) ||
            (o > this.focusRowIndex &&
              this.scrollTop < this.scrollHeight - this.clientHeight)) &&
          n.scrollIntoView({ block: "center", inline: "center" }),
          n.focus();
      }),
      (this.onChildListChange = (t, e) => {
        t.length &&
          (t.forEach((t) => {
            t.addedNodes.forEach((t) => {
              1 === t.nodeType &&
                "row" === t.getAttribute("role") &&
                (t.columnDefinitions = this.columnDefinitions);
            });
          }),
          this.queueRowIndexUpdate());
      }),
      (this.queueRowIndexUpdate = () => {
        this.rowindexUpdateQueued ||
          ((this.rowindexUpdateQueued = !0),
          u.queueUpdate(this.updateRowIndexes));
      }),
      (this.updateRowIndexes = () => {
        const t =
          void 0 === this.gridTemplateColumns
            ? this.generatedGridTemplateColumns
            : this.gridTemplateColumns;
        this.rowElements.forEach((e, i) => {
          const o = e;
          (o.rowIndex = i),
            (o.gridTemplateColumns = t),
            this.columnDefinitionsStale &&
              (o.columnDefinitions = this.columnDefinitions);
        }),
          (this.rowindexUpdateQueued = !1),
          (this.columnDefinitionsStale = !1);
      });
  }
  static generateTemplateColumns(t) {
    let e = "";
    return (
      t.forEach((t) => {
        e = `${e}${"" === e ? "" : " "}1fr`;
      }),
      e
    );
  }
  generateHeaderChanged() {
    this.$fastController.isConnected && this.toggleGeneratedHeader();
  }
  gridTemplateColumnsChanged() {
    this.$fastController.isConnected && this.updateRowIndexes();
  }
  rowsDataChanged() {
    null === this.columnDefinitions &&
      this.rowsData.length > 0 &&
      (this.columnDefinitions = cs.generateColumns(this.rowsData[0]));
  }
  columnDefinitionsChanged() {
    null !== this.columnDefinitions
      ? ((this.generatedGridTemplateColumns = cs.generateTemplateColumns(
          this.columnDefinitions
        )),
        this.$fastController.isConnected &&
          ((this.columnDefinitionsStale = !0), this.queueRowIndexUpdate()))
      : (this.generatedGridTemplateColumns = "");
  }
  headerCellItemTemplateChanged() {
    this.$fastController.isConnected &&
      null !== this.generatedHeader &&
      (this.generatedHeader.headerCellItemTemplate =
        this.headerCellItemTemplate);
  }
  focusRowIndexChanged() {
    this.$fastController.isConnected && this.queueFocusUpdate();
  }
  focusColumnIndexChanged() {
    this.$fastController.isConnected && this.queueFocusUpdate();
  }
  connectedCallback() {
    super.connectedCallback(),
      void 0 === this.rowItemTemplate &&
        (this.rowItemTemplate = this.defaultRowItemTemplate),
      (this.rowsPlaceholder = document.createComment("")),
      this.appendChild(this.rowsPlaceholder),
      this.toggleGeneratedHeader(),
      (this.rowsRepeatBehavior = new Gt(
        (t) => t.rowsData,
        (t) => t.rowItemTemplate,
        { positioning: !0 }
      ).createBehavior(this.rowsPlaceholder)),
      this.$fastController.addBehaviors([this.rowsRepeatBehavior]),
      this.addEventListener("row-focused", this.handleRowFocus),
      this.addEventListener("focus", this.handleFocus),
      this.addEventListener("keydown", this.handleKeydown),
      this.addEventListener("focusout", this.handleFocusOut),
      (this.observer = new MutationObserver(this.onChildListChange)),
      this.observer.observe(this, { childList: !0 }),
      u.queueUpdate(this.queueRowIndexUpdate);
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      this.removeEventListener("row-focused", this.handleRowFocus),
      this.removeEventListener("focus", this.handleFocus),
      this.removeEventListener("keydown", this.handleKeydown),
      this.removeEventListener("focusout", this.handleFocusOut),
      this.observer.disconnect(),
      (this.rowsPlaceholder = null),
      (this.generatedHeader = null);
  }
  handleRowFocus(t) {
    this.isUpdatingFocus = !0;
    const e = t.target;
    (this.focusRowIndex = this.rowElements.indexOf(e)),
      (this.focusColumnIndex = e.focusColumnIndex),
      this.setAttribute("tabIndex", "-1"),
      (this.isUpdatingFocus = !1);
  }
  handleFocus(t) {
    this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, !0);
  }
  handleFocusOut(t) {
    (null !== t.relatedTarget && this.contains(t.relatedTarget)) ||
      this.setAttribute("tabIndex", "0");
  }
  handleKeydown(t) {
    if (t.defaultPrevented) return;
    let e;
    const i = this.rowElements.length - 1,
      o = this.offsetHeight + this.scrollTop,
      s = this.rowElements[i];
    switch (t.keyCode) {
      case 38:
        t.preventDefault(),
          this.focusOnCell(this.focusRowIndex - 1, this.focusColumnIndex, !0);
        break;
      case 40:
        t.preventDefault(),
          this.focusOnCell(this.focusRowIndex + 1, this.focusColumnIndex, !0);
        break;
      case 33:
        if ((t.preventDefault(), 0 === this.rowElements.length)) {
          this.focusOnCell(0, 0, !1);
          break;
        }
        if (0 === this.focusRowIndex)
          return void this.focusOnCell(0, this.focusColumnIndex, !1);
        for (e = this.focusRowIndex - 1; e >= 0; e--) {
          const t = this.rowElements[e];
          if (t.offsetTop < this.scrollTop) {
            this.scrollTop = t.offsetTop + t.clientHeight - this.clientHeight;
            break;
          }
        }
        this.focusOnCell(e, this.focusColumnIndex, !1);
        break;
      case 34:
        if ((t.preventDefault(), 0 === this.rowElements.length)) {
          this.focusOnCell(0, 0, !1);
          break;
        }
        if (this.focusRowIndex >= i || s.offsetTop + s.offsetHeight <= o)
          return void this.focusOnCell(i, this.focusColumnIndex, !1);
        for (e = this.focusRowIndex + 1; e <= i; e++) {
          const t = this.rowElements[e];
          if (t.offsetTop + t.offsetHeight > o) {
            let e = 0;
            this.generateHeader === ns.sticky &&
              null !== this.generatedHeader &&
              (e = this.generatedHeader.clientHeight),
              (this.scrollTop = t.offsetTop - e);
            break;
          }
        }
        this.focusOnCell(e, this.focusColumnIndex, !1);
        break;
      case 36:
        t.ctrlKey && (t.preventDefault(), this.focusOnCell(0, 0, !0));
        break;
      case 35:
        t.ctrlKey &&
          null !== this.columnDefinitions &&
          (t.preventDefault(),
          this.focusOnCell(
            this.rowElements.length - 1,
            this.columnDefinitions.length - 1,
            !0
          ));
    }
  }
  queueFocusUpdate() {
    (this.isUpdatingFocus &&
      (this.contains(document.activeElement) ||
        this === document.activeElement)) ||
      (!1 === this.pendingFocusUpdate &&
        ((this.pendingFocusUpdate = !0),
        u.queueUpdate(() => this.updateFocus())));
  }
  updateFocus() {
    (this.pendingFocusUpdate = !1),
      this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, !0);
  }
  toggleGeneratedHeader() {
    if (
      (null !== this.generatedHeader &&
        (this.removeChild(this.generatedHeader), (this.generatedHeader = null)),
      this.generateHeader !== ns.none)
    ) {
      const t = document.createElement(this.rowElementTag);
      return (
        (this.generatedHeader = t),
        (this.generatedHeader.columnDefinitions = this.columnDefinitions),
        (this.generatedHeader.gridTemplateColumns = this.gridTemplateColumns),
        (this.generatedHeader.rowType =
          this.generateHeader === ns.sticky ? as.stickyHeader : as.header),
        void (
          (null === this.firstChild && null === this.rowsPlaceholder) ||
          this.insertBefore(
            t,
            null !== this.firstChild ? this.firstChild : this.rowsPlaceholder
          )
        )
      );
    }
  }
}
(cs.generateColumns = (t) =>
  Object.getOwnPropertyNames(t).map((t, e) => ({
    columnDataKey: t,
    gridColumn: "" + e,
  }))),
  ie(
    [bt({ attribute: "generate-header" })],
    cs.prototype,
    "generateHeader",
    void 0
  ),
  ie(
    [bt({ attribute: "grid-template-columns" })],
    cs.prototype,
    "gridTemplateColumns",
    void 0
  ),
  ie([S], cs.prototype, "rowsData", void 0),
  ie([S], cs.prototype, "columnDefinitions", void 0),
  ie([S], cs.prototype, "rowItemTemplate", void 0),
  ie([S], cs.prototype, "cellItemTemplate", void 0),
  ie([S], cs.prototype, "headerCellItemTemplate", void 0),
  ie([S], cs.prototype, "focusRowIndex", void 0),
  ie([S], cs.prototype, "focusColumnIndex", void 0),
  ie([S], cs.prototype, "defaultRowItemTemplate", void 0),
  ie([S], cs.prototype, "rowElementTag", void 0),
  ie([S], cs.prototype, "rowElements", void 0);
const hs = rt`<template>${(t) =>
    null === t.rowData ||
    null === t.columnDefinition ||
    null === t.columnDefinition.columnDataKey
      ? null
      : t.rowData[t.columnDefinition.columnDataKey]}</template>`,
  ds = rt`<template>${(t) =>
    null === t.columnDefinition
      ? null
      : void 0 === t.columnDefinition.title
      ? t.columnDefinition.columnDataKey
      : t.columnDefinition.title}</template>`;
class us extends Ue {
  constructor() {
    super(...arguments),
      (this.rowData = null),
      (this.columnDefinition = null),
      (this.isActiveCell = !1),
      (this.customCellView = null),
      (this.isInternalFocused = !1),
      (this.updateCellStyle = () => {
        this.style.gridColumn = this.gridColumn;
      });
  }
  cellTypeChanged() {
    this.$fastController.isConnected && this.updateCellView();
  }
  gridColumnChanged() {
    this.$fastController.isConnected && this.updateCellStyle();
  }
  columnDefinitionChanged(t, e) {
    this.$fastController.isConnected && this.updateCellView();
  }
  connectedCallback() {
    var t;
    super.connectedCallback(),
      this.addEventListener("focusin", this.handleFocusin),
      this.addEventListener("focusout", this.handleFocusout),
      this.addEventListener("keydown", this.handleKeydown),
      (this.style.gridColumn =
        "" +
        (void 0 ===
        (null === (t = this.columnDefinition) || void 0 === t
          ? void 0
          : t.gridColumn)
          ? 0
          : this.columnDefinition.gridColumn)),
      this.updateCellView(),
      this.updateCellStyle();
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      this.removeEventListener("focusin", this.handleFocusin),
      this.removeEventListener("focusout", this.handleFocusout),
      this.removeEventListener("keydown", this.handleKeydown),
      this.disconnectCellView();
  }
  handleFocusin(t) {
    if (!this.isActiveCell) {
      switch (((this.isActiveCell = !0), this.cellType)) {
        case rs.columnHeader:
          if (
            null !== this.columnDefinition &&
            !0 !== this.columnDefinition.headerCellInternalFocusQueue &&
            "function" ==
              typeof this.columnDefinition.headerCellFocusTargetCallback
          ) {
            const t = this.columnDefinition.headerCellFocusTargetCallback(this);
            null !== t && t.focus();
          }
          break;
        default:
          if (
            null !== this.columnDefinition &&
            !0 !== this.columnDefinition.cellInternalFocusQueue &&
            "function" == typeof this.columnDefinition.cellFocusTargetCallback
          ) {
            const t = this.columnDefinition.cellFocusTargetCallback(this);
            null !== t && t.focus();
          }
      }
      this.$emit("cell-focused", this);
    }
  }
  handleFocusout(t) {
    this === document.activeElement ||
      this.contains(document.activeElement) ||
      ((this.isActiveCell = !1), (this.isInternalFocused = !1));
  }
  handleKeydown(t) {
    if (
      !(
        t.defaultPrevented ||
        null === this.columnDefinition ||
        (this.cellType === rs.default &&
          !0 !== this.columnDefinition.cellInternalFocusQueue) ||
        (this.cellType === rs.columnHeader &&
          !0 !== this.columnDefinition.headerCellInternalFocusQueue)
      )
    )
      switch (t.keyCode) {
        case 13:
        case 113:
          if (this.isInternalFocused || void 0 === this.columnDefinition)
            return;
          switch (this.cellType) {
            case rs.default:
              if (void 0 !== this.columnDefinition.cellFocusTargetCallback) {
                const e = this.columnDefinition.cellFocusTargetCallback(this);
                null !== e && ((this.isInternalFocused = !0), e.focus()),
                  t.preventDefault();
              }
              break;
            case rs.columnHeader:
              if (
                void 0 !== this.columnDefinition.headerCellFocusTargetCallback
              ) {
                const e =
                  this.columnDefinition.headerCellFocusTargetCallback(this);
                null !== e && ((this.isInternalFocused = !0), e.focus()),
                  t.preventDefault();
              }
          }
          break;
        case 27:
          this.isInternalFocused &&
            (this.focus(), (this.isInternalFocused = !1), t.preventDefault());
      }
  }
  updateCellView() {
    if ((this.disconnectCellView(), null !== this.columnDefinition))
      switch (this.cellType) {
        case rs.columnHeader:
          void 0 !== this.columnDefinition.headerCellTemplate
            ? (this.customCellView =
                this.columnDefinition.headerCellTemplate.render(this, this))
            : (this.customCellView = ds.render(this, this));
          break;
        case void 0:
        case rs.default:
          void 0 !== this.columnDefinition.cellTemplate
            ? (this.customCellView = this.columnDefinition.cellTemplate.render(
                this,
                this
              ))
            : (this.customCellView = hs.render(this, this));
      }
  }
  disconnectCellView() {
    null !== this.customCellView &&
      (this.customCellView.dispose(), (this.customCellView = null));
  }
}
ie([bt({ attribute: "cell-type" })], us.prototype, "cellType", void 0),
  ie([bt({ attribute: "grid-column" })], us.prototype, "gridColumn", void 0),
  ie([S], us.prototype, "rowData", void 0),
  ie([S], us.prototype, "columnDefinition", void 0);
class ps {
  getElementStyles(t, e) {
    let i = ps.cache.get(t.cssCustomProperty);
    i || ((i = new Map()), ps.cache.set(t.cssCustomProperty, i));
    let o = i.get(e);
    return o || ((o = this.createElementStyles(t, e)), i.set(e, o)), o;
  }
  getOrCreateAppliedCache(t) {
    return (
      (ps.appliedCache.has(t) || ps.appliedCache.set(t, new Map())) &&
      ps.appliedCache.get(t)
    );
  }
  createElementStyles(t, e) {
    return Dt`:host{${t.cssCustomProperty}:${e};}`;
  }
  addTo(t, e, i) {
    if (gs(t)) {
      const o = this.getElementStyles(e, i);
      t.$fastController.addStyles(o),
        this.getOrCreateAppliedCache(t).set(e.cssCustomProperty, o);
    } else u.queueUpdate(() => t.style.setProperty(e.cssCustomProperty, i));
  }
  removeFrom(t, e) {
    if (gs(t)) {
      const i = this.getOrCreateAppliedCache(t),
        o = i.get(e.cssCustomProperty);
      o && (t.$fastController.removeStyles(o), i.delete(e.cssCustomProperty));
    } else u.queueUpdate(() => t.style.removeProperty(e.cssCustomProperty));
  }
}
function gs(t) {
  return t instanceof It;
}
(ps.cache = new Map()), (ps.appliedCache = new WeakMap());
const fs = new ps(),
  bs = document.body;
class ms extends Ft {
  constructor(t) {
    super(),
      (this.subscribers = new WeakMap()),
      (this._appliedTo = new Set()),
      (this.name = t.name),
      null !== t.cssCustomPropertyName &&
        ((this.cssCustomProperty = "--" + t.cssCustomPropertyName),
        (this.cssVar = `var(${this.cssCustomProperty})`)),
      (this.id = ms.uniqueId()),
      ms.tokensById.set(this.id, this),
      this.subscribe(this);
  }
  get appliedTo() {
    return [...this._appliedTo];
  }
  static from(t) {
    return new ms({
      name: "string" == typeof t ? t : t.name,
      cssCustomPropertyName:
        "string" == typeof t
          ? t
          : void 0 === t.cssCustomPropertyName
          ? t.name
          : t.cssCustomPropertyName,
    });
  }
  static isCSSDesignToken(t) {
    return "string" == typeof t.cssCustomProperty;
  }
  static isDerivedDesignTokenValue(t) {
    return "function" == typeof t;
  }
  static getTokenById(t) {
    return ms.tokensById.get(t);
  }
  getOrCreateSubscriberSet(t = this) {
    return (
      this.subscribers.get(t) ||
      (this.subscribers.set(t, new Set()) && this.subscribers.get(t))
    );
  }
  createCSS() {
    return this.cssVar || "";
  }
  getValueFor(t) {
    const e = $s.getOrCreate(t).get(this);
    if (void 0 !== e) return e;
    throw new Error(
      `Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${t} or an ancestor of ${t}.`
    );
  }
  setValueFor(t, e) {
    return (
      this._appliedTo.add(t),
      e instanceof ms && (e = this.alias(e)),
      $s.getOrCreate(t).set(this, e),
      this
    );
  }
  deleteValueFor(t) {
    return (
      this._appliedTo.delete(t),
      $s.existsFor(t) && $s.getOrCreate(t).delete(this),
      this
    );
  }
  withDefault(t) {
    return this.setValueFor(bs, t), this;
  }
  subscribe(t, e) {
    const i = this.getOrCreateSubscriberSet(e);
    i.has(t) || i.add(t);
  }
  unsubscribe(t, e) {
    const i = this.subscribers.get(e || this);
    i && i.has(t) && i.delete(t);
  }
  notify(t) {
    const e = Object.freeze({ token: this, target: t });
    this.subscribers.has(this) &&
      this.subscribers.get(this).forEach((t) => t.handleChange(e)),
      this.subscribers.has(t) &&
        this.subscribers.get(t).forEach((t) => t.handleChange(e));
  }
  handleChange(t) {
    const e = $s.getOrCreate(t.target);
    T.getNotifier(e).notify(t.token.id);
  }
  alias(t) {
    return (e) => t.getValueFor(e);
  }
}
(ms.uniqueId = (() => {
  let t = 0;
  return () => (t++, t.toString(16));
})()),
  (ms.tokensById = new Map());
class vs {
  constructor(t, e, i) {
    (this.source = t),
      (this.token = e),
      (this.node = i),
      (this.dependencies = new Set()),
      (this.observer = T.binding(t, this)),
      (this.observer.handleChange = this.observer.call),
      this.handleChange();
    for (const t of this.observer.records())
      if (t.propertySource instanceof $s) {
        const e = ms.getTokenById(t.propertyName);
        void 0 !== e && this.dependencies.add(e);
      }
  }
  disconnect() {
    this.observer.disconnect();
  }
  _valueChanged(t, e) {
    void 0 !== t && this.token.notify(this.node.target);
  }
  get value() {
    return this._value;
  }
  handleChange() {
    this._value = this.observer.observe(this.node.target, R);
  }
}
ie([S], vs.prototype, "_value", void 0);
const ys = new WeakMap(),
  xs = new WeakMap();
class $s {
  constructor(t) {
    (this.target = t),
      (this.children = []),
      (this.rawValues = new Map()),
      (this.reflecting = new Set()),
      (this.bindingObservers = new Map()),
      (this.tokenSubscribers = new Map()),
      ys.set(t, this),
      t instanceof It
        ? t.$fastController.addBehaviors([this])
        : t.isConnected && this.bind();
  }
  static getOrCreate(t) {
    return ys.get(t) || new $s(t);
  }
  static existsFor(t) {
    return ys.has(t);
  }
  static findParent(t) {
    if (bs !== t.target) {
      let e = ko(t.target);
      for (; null !== e; ) {
        if (ys.has(e)) return ys.get(e);
        e = ko(e);
      }
      return $s.getOrCreate(bs);
    }
    return null;
  }
  static findClosestAssignedNode(t, e) {
    let i = e;
    do {
      if (i.has(t)) return i;
      i = i.parent ? i.parent : i.target !== bs ? $s.getOrCreate(bs) : null;
    } while (null !== i);
    return null;
  }
  get parent() {
    return xs.get(this) || null;
  }
  has(t) {
    return this.rawValues.has(t);
  }
  get(t) {
    const e = this.getRaw(t);
    if ((T.track(this, t.id), void 0 !== e))
      return ms.isDerivedDesignTokenValue(e)
        ? (this.bindingObservers.get(t) || this.setupBindingObserver(t, e))
            .value
        : e;
  }
  getRaw(t) {
    var e;
    return this.rawValues.has(t)
      ? this.rawValues.get(t)
      : null === (e = $s.findClosestAssignedNode(t, this)) || void 0 === e
      ? void 0
      : e.getRaw(t);
  }
  set(t, e) {
    if (
      (ms.isDerivedDesignTokenValue(this.rawValues.get(t)) &&
        (this.tearDownBindingObserver(t),
        this.children.forEach((e) => e.purgeInheritedBindings(t))),
      this.rawValues.set(t, e),
      this.tokenSubscribers.has(t) &&
        (t.unsubscribe(this.tokenSubscribers.get(t)),
        this.tokenSubscribers.delete(t)),
      ms.isDerivedDesignTokenValue(e))
    ) {
      const i = this.setupBindingObserver(t, e),
        { dependencies: o } = i,
        s = ms.isCSSDesignToken(t);
      if (o.size > 0) {
        const i = {
          handleChange: (e) => {
            const i = $s.getOrCreate(e.target);
            this !== i &&
              this.contains(i) &&
              (t.notify(e.target), $s.getOrCreate(e.target).reflectToCSS(t));
          },
        };
        this.tokenSubscribers.set(t, i),
          o.forEach((o) => {
            s &&
              o.appliedTo.forEach((i) => {
                const o = $s.getOrCreate(i);
                this.contains(o) &&
                  o.getRaw(t) === e &&
                  (t.notify(o.target), o.reflectToCSS(t));
              }),
              o.subscribe(i);
          });
      }
    }
    ms.isCSSDesignToken(t) && this.reflectToCSS(t), t.notify(this.target);
  }
  delete(t) {
    this.rawValues.delete(t),
      this.tearDownBindingObserver(t),
      this.children.forEach((e) => e.purgeInheritedBindings(t)),
      t.notify(this.target);
  }
  bind() {
    const t = $s.findParent(this);
    t && t.appendChild(this);
    for (const t of this.rawValues.keys()) t.notify(this.target);
  }
  unbind() {
    if (this.parent) {
      xs.get(this).removeChild(this);
    }
  }
  appendChild(t) {
    t.parent && xs.get(t).removeChild(t);
    const e = this.children.filter((e) => t.contains(e));
    xs.set(t, this),
      this.children.push(t),
      e.forEach((e) => t.appendChild(e)),
      T.getNotifier(this).subscribe(t);
  }
  removeChild(t) {
    const e = this.children.indexOf(t);
    return (
      -1 !== e && this.children.splice(e, 1),
      T.getNotifier(this).unsubscribe(t),
      t.parent === this && xs.delete(t)
    );
  }
  contains(t) {
    return (function (t, e) {
      let i = e;
      for (; null !== i; ) {
        if (i === t) return !0;
        i = ko(i);
      }
      return !1;
    })(this.target, t.target);
  }
  reflectToCSS(t) {
    this.reflecting.has(t) ||
      (this.reflecting.add(t),
      $s.cssCustomPropertyReflector.startReflection(t, this.target));
  }
  handleChange(t, e) {
    const i = ms.getTokenById(e);
    !i || this.has(i) || this.bindingObservers.has(i) || i.notify(this.target);
  }
  purgeInheritedBindings(t) {
    this.has(t) ||
      (this.tearDownBindingObserver(t),
      this.children.length &&
        this.children.forEach((e) => e.purgeInheritedBindings(t)));
  }
  setupBindingObserver(t, e) {
    const i = new vs(e, t, this);
    return this.bindingObservers.set(t, i), i;
  }
  tearDownBindingObserver(t) {
    return (
      !!this.bindingObservers.has(t) &&
      (this.bindingObservers.get(t).disconnect(),
      this.bindingObservers.delete(t),
      !0)
    );
  }
}
($s.cssCustomPropertyReflector = new (class {
  startReflection(t, e) {
    t.subscribe(this, e), this.handleChange({ token: t, target: e });
  }
  stopReflection(t, e) {
    t.unsubscribe(this, e), this.remove(t, e);
  }
  handleChange(t) {
    const { token: e, target: i } = t;
    this.remove(e, i), this.add(e, i);
  }
  add(t, e) {
    fs.addTo(e, t, this.resolveCSSValue($s.getOrCreate(e).get(t)));
  }
  remove(t, e) {
    fs.removeFrom(e, t);
  }
  resolveCSSValue(t) {
    return t && "function" == typeof t.createCSS ? t.createCSS() : t;
  }
})()),
  ie([S], $s.prototype, "children", void 0);
const ws = Object.freeze({
  create: function (t) {
    return ms.from(t);
  },
  notifyConnection: (t) =>
    !(!t.isConnected || !$s.existsFor(t)) && ($s.getOrCreate(t).bind(), !0),
  notifyDisconnection: (t) =>
    !(t.isConnected || !$s.existsFor(t)) && ($s.getOrCreate(t).unbind(), !0),
});
/*!
 * tabbable 5.2.0
 * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
 */
var ks = [
    "input",
    "select",
    "textarea",
    "a[href]",
    "button",
    "[tabindex]",
    "audio[controls]",
    "video[controls]",
    '[contenteditable]:not([contenteditable="false"])',
    "details>summary:first-of-type",
    "details",
  ],
  Cs = ks.join(","),
  Ts =
    "undefined" == typeof Element
      ? function () {}
      : Element.prototype.matches ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector,
  Is = function (t) {
    return "INPUT" === t.tagName;
  },
  Fs = function (t) {
    return (
      (function (t) {
        return Is(t) && "radio" === t.type;
      })(t) &&
      !(function (t) {
        if (!t.name) return !0;
        var e,
          i = t.form || t.ownerDocument,
          o = function (t) {
            return i.querySelectorAll('input[type="radio"][name="' + t + '"]');
          };
        if (
          "undefined" != typeof window &&
          void 0 !== window.CSS &&
          "function" == typeof window.CSS.escape
        )
          e = o(window.CSS.escape(t.name));
        else
          try {
            e = o(t.name);
          } catch (t) {
            return (
              console.error(
                "Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",
                t.message
              ),
              !1
            );
          }
        var s = (function (t, e) {
          for (var i = 0; i < t.length; i++)
            if (t[i].checked && t[i].form === e) return t[i];
        })(e, t.form);
        return !s || s === t;
      })(t)
    );
  },
  Ss = function (t, e) {
    return !(
      e.disabled ||
      (function (t) {
        return Is(t) && "hidden" === t.type;
      })(e) ||
      (function (t, e) {
        if ("hidden" === getComputedStyle(t).visibility) return !0;
        var i = Ts.call(t, "details>summary:first-of-type")
          ? t.parentElement
          : t;
        if (Ts.call(i, "details:not([open]) *")) return !0;
        if (e && "full" !== e) {
          if ("non-zero-area" === e) {
            var o = t.getBoundingClientRect(),
              s = o.width,
              n = o.height;
            return 0 === s && 0 === n;
          }
        } else
          for (; t; ) {
            if ("none" === getComputedStyle(t).display) return !0;
            t = t.parentElement;
          }
        return !1;
      })(e, t.displayCheck) ||
      (function (t) {
        return (
          "DETAILS" === t.tagName &&
          Array.prototype.slice.apply(t.children).some(function (t) {
            return "SUMMARY" === t.tagName;
          })
        );
      })(e)
    );
  },
  Ds = function (t, e) {
    return !(
      !Ss(t, e) ||
      Fs(e) ||
      (function (t) {
        var e = parseInt(t.getAttribute("tabindex"), 10);
        return isNaN(e)
          ? (function (t) {
              return "true" === t.contentEditable;
            })(t)
            ? 0
            : ("AUDIO" !== t.nodeName &&
                "VIDEO" !== t.nodeName &&
                "DETAILS" !== t.nodeName) ||
              null !== t.getAttribute("tabindex")
            ? t.tabIndex
            : 0
          : e;
      })(e) < 0
    );
  },
  Es = function (t, e) {
    if (((e = e || {}), !t)) throw new Error("No node provided");
    return !1 !== Ts.call(t, Cs) && Ds(e, t);
  },
  Os = ks.concat("iframe").join(","),
  Rs = function (t, e) {
    if (((e = e || {}), !t)) throw new Error("No node provided");
    return !1 !== Ts.call(t, Os) && Ss(e, t);
  };
class Ls extends Ue {
  constructor() {
    super(...arguments),
      (this.modal = !0),
      (this.hidden = !1),
      (this.trapFocus = !0),
      (this.trapFocusChanged = () => {
        this.$fastController.isConnected && this.updateTrapFocus();
      }),
      (this.isTrappingFocus = !1),
      (this.handleDocumentKeydown = (t) => {
        if (!t.defaultPrevented && !this.hidden)
          switch (t.keyCode) {
            case 27:
              this.dismiss(), t.preventDefault();
              break;
            case 9:
              this.handleTabKeyDown(t);
          }
      }),
      (this.handleDocumentFocus = (t) => {
        !t.defaultPrevented &&
          this.shouldForceFocus(t.target) &&
          (this.focusFirstElement(), t.preventDefault());
      }),
      (this.handleTabKeyDown = (t) => {
        if (!this.trapFocus || this.hidden) return;
        const e = this.getTabQueueBounds();
        return 0 !== e.length
          ? 1 === e.length
            ? (e[0].focus(), void t.preventDefault())
            : void (t.shiftKey && t.target === e[0]
                ? (e[e.length - 1].focus(), t.preventDefault())
                : t.shiftKey ||
                  t.target !== e[e.length - 1] ||
                  (e[0].focus(), t.preventDefault()))
          : void 0;
      }),
      (this.getTabQueueBounds = () => Ls.reduceTabbableItems([], this)),
      (this.focusFirstElement = () => {
        const t = this.getTabQueueBounds();
        t.length > 0
          ? t[0].focus()
          : this.dialog instanceof HTMLElement && this.dialog.focus();
      }),
      (this.shouldForceFocus = (t) =>
        this.isTrappingFocus && !this.contains(t)),
      (this.shouldTrapFocus = () => this.trapFocus && !this.hidden),
      (this.updateTrapFocus = (t) => {
        const e = void 0 === t ? this.shouldTrapFocus() : t;
        e && !this.isTrappingFocus
          ? ((this.isTrappingFocus = !0),
            document.addEventListener("focusin", this.handleDocumentFocus),
            u.queueUpdate(() => {
              this.shouldForceFocus(document.activeElement) &&
                this.focusFirstElement();
            }))
          : !e &&
            this.isTrappingFocus &&
            ((this.isTrappingFocus = !1),
            document.removeEventListener("focusin", this.handleDocumentFocus));
      });
  }
  dismiss() {
    this.$emit("dismiss");
  }
  show() {
    this.hidden = !1;
  }
  hide() {
    this.hidden = !0;
  }
  connectedCallback() {
    super.connectedCallback(),
      document.addEventListener("keydown", this.handleDocumentKeydown),
      (this.notifier = T.getNotifier(this)),
      this.notifier.subscribe(this, "hidden"),
      this.updateTrapFocus();
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      document.removeEventListener("keydown", this.handleDocumentKeydown),
      this.updateTrapFocus(!1),
      this.notifier.unsubscribe(this, "hidden");
  }
  handleChange(t, e) {
    switch (e) {
      case "hidden":
        this.updateTrapFocus();
    }
  }
  static reduceTabbableItems(t, e) {
    return "-1" === e.getAttribute("tabindex")
      ? t
      : Es(e) || (Ls.isFocusableFastElement(e) && Ls.hasTabbableShadow(e))
      ? (t.push(e), t)
      : e.childElementCount
      ? t.concat(Array.from(e.children).reduce(Ls.reduceTabbableItems, []))
      : t;
  }
  static isFocusableFastElement(t) {
    var e, i;
    return !!(null ===
      (i =
        null === (e = t.$fastController) || void 0 === e
          ? void 0
          : e.definition.shadowOptions) || void 0 === i
      ? void 0
      : i.delegatesFocus);
  }
  static hasTabbableShadow(t) {
    var e, i;
    return Array.from(
      null !==
        (i =
          null === (e = t.shadowRoot) || void 0 === e
            ? void 0
            : e.querySelectorAll("*")) && void 0 !== i
        ? i
        : []
    ).some((t) => Es(t));
  }
}
ie([bt({ mode: "boolean" })], Ls.prototype, "modal", void 0),
  ie([bt({ mode: "boolean" })], Ls.prototype, "hidden", void 0),
  ie(
    [bt({ attribute: "trap-focus", mode: "boolean" })],
    Ls.prototype,
    "trapFocus",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-describedby" })],
    Ls.prototype,
    "ariaDescribedby",
    void 0
  ),
  ie(
    [bt({ attribute: "aria-labelledby" })],
    Ls.prototype,
    "ariaLabelledby",
    void 0
  ),
  ie([bt({ attribute: "aria-label" })], Ls.prototype, "ariaLabel", void 0);
class As extends Ue {
  connectedCallback() {
    super.connectedCallback(), this.setup();
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      this.details.removeEventListener("toggle", this.onToggle);
  }
  show() {
    this.details.open = !0;
  }
  hide() {
    this.details.open = !1;
  }
  toggle() {
    this.details.open = !this.details.open;
  }
  setup() {
    (this.onToggle = this.onToggle.bind(this)),
      this.details.addEventListener("toggle", this.onToggle),
      this.expanded && this.show();
  }
  onToggle() {
    (this.expanded = this.details.open), this.$emit("toggle");
  }
}
ie([bt({ mode: "boolean" })], As.prototype, "expanded", void 0),
  ie([bt], As.prototype, "title", void 0);
var Vs, Ps;
!(function (t) {
  (t.separator = "separator"), (t.presentation = "presentation");
})(Vs || (Vs = {}));
class Hs extends Ue {
  constructor() {
    super(...arguments), (this.role = Vs.separator);
  }
}
ie([bt], Hs.prototype, "role", void 0),
  (function (t) {
    (t.next = "next"), (t.previous = "previous");
  })(Ps || (Ps = {}));
class zs extends Ue {
  constructor() {
    super(...arguments), (this.hiddenFromAT = !0), (this.direction = Ps.next);
  }
  keyupHandler(t) {
    if (!this.hiddenFromAT) {
      const e = t.key;
      "Enter" === e && this.$emit("click", t), "Escape" === e && this.blur();
    }
  }
}
ie([bt({ mode: "boolean" })], zs.prototype, "disabled", void 0),
  ie(
    [bt({ attribute: "aria-hidden", converter: pt })],
    zs.prototype,
    "hiddenFromAT",
    void 0
  ),
  ie([bt], zs.prototype, "direction", void 0);
var Ms;
!(function (t) {
  (t.menuitem = "menuitem"),
    (t.menuitemcheckbox = "menuitemcheckbox"),
    (t.menuitemradio = "menuitemradio");
})(Ms || (Ms = {}));
class Ns extends Ue {
  constructor() {
    super(...arguments),
      (this.role = Ms.menuitem),
      (this.hasSubmenu = !1),
      (this.currentDirection = po.ltr),
      (this.focusSubmenuOnLoad = !1),
      (this.handleMenuItemKeyDown = (t) => {
        if (t.defaultPrevented) return !1;
        switch (t.keyCode) {
          case 13:
          case 32:
            return this.invoke(), !1;
          case 39:
            return this.expandAndFocus(), !1;
          case 37:
            if (this.expanded) return (this.expanded = !1), this.focus(), !1;
        }
        return !0;
      }),
      (this.handleMenuItemClick = (t) => (
        t.defaultPrevented || this.disabled || this.invoke(), !1
      )),
      (this.submenuLoaded = () => {
        this.focusSubmenuOnLoad &&
          ((this.focusSubmenuOnLoad = !1),
          this.hasSubmenu &&
            (this.submenu.focus(), this.setAttribute("tabindex", "-1")));
      }),
      (this.handleMouseOver = (t) => (
        this.disabled ||
          !this.hasSubmenu ||
          this.expanded ||
          (this.expanded = !0),
        !1
      )),
      (this.handleMouseOut = (t) => (
        !this.expanded ||
          this.contains(document.activeElement) ||
          (this.expanded = !1),
        !1
      )),
      (this.expandAndFocus = () => {
        this.hasSubmenu &&
          ((this.focusSubmenuOnLoad = !0), (this.expanded = !0));
      }),
      (this.invoke = () => {
        if (!this.disabled)
          switch (this.role) {
            case Ms.menuitemcheckbox:
              (this.checked = !this.checked), this.$emit("change");
              break;
            case Ms.menuitem:
              this.updateSubmenu(),
                this.hasSubmenu ? this.expandAndFocus() : this.$emit("change");
              break;
            case Ms.menuitemradio:
              this.checked || (this.checked = !0);
          }
      }),
      (this.updateSubmenu = () => {
        (this.submenu = this.domChildren().find(
          (t) => "menu" === t.getAttribute("role")
        )),
          (this.hasSubmenu = void 0 !== this.submenu);
      });
  }
  expandedChanged(t) {
    if (this.$fastController.isConnected) {
      if (void 0 === this.submenu) return;
      !1 === this.expanded
        ? this.submenu.collapseExpandedItem()
        : (this.currentDirection = Do(this)),
        this.$emit("expanded-change", this, { bubbles: !1 });
    }
  }
  checkedChanged(t, e) {
    this.$fastController.isConnected && this.$emit("change");
  }
  connectedCallback() {
    super.connectedCallback(),
      u.queueUpdate(() => {
        this.updateSubmenu();
      }),
      this.startColumnCount || (this.startColumnCount = 1),
      (this.observer = new MutationObserver(this.updateSubmenu));
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      (this.submenu = void 0),
      void 0 !== this.observer &&
        (this.observer.disconnect(), (this.observer = void 0));
  }
  domChildren() {
    return Array.from(this.children);
  }
}
ie([bt({ mode: "boolean" })], Ns.prototype, "disabled", void 0),
  ie([bt({ mode: "boolean" })], Ns.prototype, "expanded", void 0),
  ie([S], Ns.prototype, "startColumnCount", void 0),
  ie([bt], Ns.prototype, "role", void 0),
  ie([bt({ mode: "boolean" })], Ns.prototype, "checked", void 0),
  ie([S], Ns.prototype, "submenuRegion", void 0),
  ie([S], Ns.prototype, "hasSubmenu", void 0),
  ie([S], Ns.prototype, "currentDirection", void 0),
  ie([S], Ns.prototype, "submenu", void 0),
  We(Ns, Jt);
class Bs extends Ue {
  constructor() {
    super(...arguments),
      (this.expandedItem = null),
      (this.focusIndex = -1),
      (this.isNestedMenu = () =>
        null !== this.parentElement &&
        lo(this.parentElement) &&
        "menuitem" === this.parentElement.getAttribute("role")),
      (this.handleFocusOut = (t) => {
        if (!this.contains(t.relatedTarget)) {
          this.collapseExpandedItem();
          const t = this.menuItems.findIndex(this.isFocusableElement);
          this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"),
            this.menuItems[t].setAttribute("tabindex", "0"),
            (this.focusIndex = t);
        }
      }),
      (this.handleItemFocus = (t) => {
        const e = t.target;
        e !== this.menuItems[this.focusIndex] &&
          (this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"),
          (this.focusIndex = this.menuItems.indexOf(e)),
          e.setAttribute("tabindex", "0"));
      }),
      (this.handleExpandedChanged = (t) => {
        if (
          t.defaultPrevented ||
          null === t.target ||
          this.menuItems.indexOf(t.target) < 0
        )
          return;
        t.preventDefault();
        const e = t.target;
        null === this.expandedItem ||
        e !== this.expandedItem ||
        !1 !== e.expanded
          ? e.expanded &&
            (null !== this.expandedItem &&
              this.expandedItem !== e &&
              (this.expandedItem.expanded = !1),
            this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"),
            (this.expandedItem = e),
            (this.focusIndex = this.menuItems.indexOf(e)),
            e.setAttribute("tabindex", "0"))
          : (this.expandedItem = null);
      }),
      (this.setItems = () => {
        const t = this.menuItems.filter(this.isMenuItemElement);
        t.length && (this.focusIndex = 0);
        const e = t.reduce((t, e) => {
          const i =
            (o = e) instanceof Ns
              ? (o.role !== Ms.menuitem &&
                  null === o.querySelector("[slot=start]")) ||
                (o.role === Ms.menuitem &&
                  null !== o.querySelector("[slot=start]"))
                ? 1
                : o.role !== Ms.menuitem &&
                  null !== o.querySelector("[slot=start]")
                ? 2
                : 0
              : 1;
          var o;
          return t > i ? t : i;
        }, 0);
        t.forEach((t, i) => {
          t.setAttribute("tabindex", 0 === i ? "0" : "-1"),
            t.addEventListener("expanded-change", this.handleExpandedChanged),
            t.addEventListener("focus", this.handleItemFocus),
            t instanceof Ns && (t.startColumnCount = e);
        });
      }),
      (this.resetItems = (t) => {
        t.forEach((t) => {
          t.removeEventListener("expanded-change", this.handleExpandedChanged),
            t.removeEventListener("focus", this.handleItemFocus);
        });
      }),
      (this.changeHandler = (t) => {
        const e = t.target,
          i = this.menuItems.indexOf(e);
        if (-1 !== i && "menuitemradio" === e.role && !0 === e.checked) {
          for (let t = i - 1; t >= 0; --t) {
            const e = this.menuItems[t],
              i = e.getAttribute("role");
            if ((i === Ms.menuitemradio && (e.checked = !1), "separator" === i))
              break;
          }
          const t = this.menuItems.length - 1;
          for (let e = i + 1; e <= t; ++e) {
            const t = this.menuItems[e],
              i = t.getAttribute("role");
            if ((i === Ms.menuitemradio && (t.checked = !1), "separator" === i))
              break;
          }
        }
      }),
      (this.isMenuItemElement = (t) =>
        lo(t) &&
        Bs.focusableElementRoles.hasOwnProperty(t.getAttribute("role"))),
      (this.isFocusableElement = (t) => this.isMenuItemElement(t));
  }
  itemsChanged(t, e) {
    this.$fastController.isConnected &&
      ((this.menuItems = this.domChildren()),
      this.resetItems(t),
      this.setItems());
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.menuItems = this.domChildren()),
      this.addEventListener("change", this.changeHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      (this.menuItems = []),
      this.removeEventListener("change", this.changeHandler);
  }
  focus() {
    this.setFocus(0, 1);
  }
  collapseExpandedItem() {
    null !== this.expandedItem &&
      ((this.expandedItem.expanded = !1), (this.expandedItem = null));
  }
  handleMenuKeyDown(t) {
    if (!t.defaultPrevented)
      switch (t.keyCode) {
        case 40:
          return void this.setFocus(this.focusIndex + 1, 1);
        case 38:
          return void this.setFocus(this.focusIndex - 1, -1);
        case 35:
          return void this.setFocus(this.menuItems.length - 1, -1);
        case 36:
          return void this.setFocus(0, 1);
        default:
          return !0;
      }
  }
  domChildren() {
    return Array.from(this.children);
  }
  setFocus(t, e) {
    if (void 0 !== this.menuItems)
      for (; to(t, this.menuItems.length); ) {
        const i = this.menuItems[t];
        if (this.isFocusableElement(i)) {
          this.focusIndex > -1 &&
            this.menuItems.length >= this.focusIndex - 1 &&
            this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"),
            (this.focusIndex = t),
            i.setAttribute("tabindex", "0"),
            i.focus();
          break;
        }
        t += e;
      }
  }
}
(Bs.focusableElementRoles = no(Ms)), ie([S], Bs.prototype, "items", void 0);
class js extends Ue {}
class qs extends zo(js) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("input"));
  }
}
var _s;
!(function (t) {
  (t.email = "email"),
    (t.password = "password"),
    (t.tel = "tel"),
    (t.text = "text"),
    (t.url = "url");
})(_s || (_s = {}));
class Us extends qs {
  constructor() {
    super(...arguments), (this.type = _s.text);
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement &&
      ((this.proxy.readOnly = this.readOnly), this.validate());
  }
  autofocusChanged() {
    this.proxy instanceof HTMLInputElement &&
      ((this.proxy.autofocus = this.autofocus), this.validate());
  }
  placeholderChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.placeholder = this.placeholder);
  }
  typeChanged() {
    this.proxy instanceof HTMLInputElement &&
      ((this.proxy.type = this.type), this.validate());
  }
  listChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.setAttribute("list", this.list), this.validate());
  }
  maxlengthChanged() {
    this.proxy instanceof HTMLInputElement &&
      ((this.proxy.maxLength = this.maxlength), this.validate());
  }
  minlengthChanged() {
    this.proxy instanceof HTMLInputElement &&
      ((this.proxy.minLength = this.minlength), this.validate());
  }
  patternChanged() {
    this.proxy instanceof HTMLInputElement &&
      ((this.proxy.pattern = this.pattern), this.validate());
  }
  sizeChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.size = this.size);
  }
  spellcheckChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.spellcheck = this.spellcheck);
  }
  connectedCallback() {
    super.connectedCallback(),
      this.proxy.setAttribute("type", this.type),
      this.validate(),
      this.autofocus &&
        u.queueUpdate(() => {
          this.focus();
        });
  }
  handleTextInput() {
    this.value = this.control.value;
  }
  handleChange() {
    this.$emit("change");
  }
}
ie(
  [bt({ attribute: "readonly", mode: "boolean" })],
  Us.prototype,
  "readOnly",
  void 0
),
  ie([bt({ mode: "boolean" })], Us.prototype, "autofocus", void 0),
  ie([bt], Us.prototype, "placeholder", void 0),
  ie([bt], Us.prototype, "type", void 0),
  ie([bt], Us.prototype, "list", void 0),
  ie([bt({ converter: gt })], Us.prototype, "maxlength", void 0),
  ie([bt({ converter: gt })], Us.prototype, "minlength", void 0),
  ie([bt], Us.prototype, "pattern", void 0),
  ie([bt({ converter: gt })], Us.prototype, "size", void 0),
  ie([bt({ mode: "boolean" })], Us.prototype, "spellcheck", void 0),
  ie([S], Us.prototype, "defaultSlottedNodes", void 0);
class Gs {}
We(Gs, xo), We(Us, Jt, Gs);
class Ks extends Ue {}
class Ws extends zo(Ks) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("input"));
  }
}
class Xs extends Ws {
  constructor() {
    super(...arguments), (this.hideStep = !1), (this.step = 1);
  }
  maxChanged(t, e) {
    const i = parseFloat(e);
    void 0 !== i &&
      (void 0 !== this.min && i < this.min
        ? ((this.max = this.min), (this.min = i))
        : (this.max = i)),
      this.updateValue(this.value);
  }
  minChanged(t, e) {
    const i = parseFloat(e);
    void 0 !== i &&
      (void 0 !== this.max && i > this.max
        ? ((this.min = this.max), (this.max = i))
        : (this.min = i)),
      this.updateValue(this.value);
  }
  valueChanged(t, e) {
    super.valueChanged(t, e), this.updateValue(e);
  }
  updateValue(t) {
    "" === t || isNaN(parseFloat(t))
      ? (t = "")
      : ((t = parseFloat(t)),
        void 0 !== this.min && t < this.min
          ? (t = this.min)
          : void 0 !== this.max && t > this.max && (t = this.max),
        (t = parseFloat(t.toPrecision(12)).toString())),
      t != this.value &&
        ((this.value = t),
        this.proxy instanceof HTMLInputElement &&
          (this.proxy.value = this.value),
        this.$emit("input"),
        this.$emit("change"));
  }
  stepUp() {
    const t = this.step + (parseFloat(this.value) || 0);
    this.updateValue(t);
  }
  stepDown() {
    const t = (parseFloat(this.value) || 0) - this.step;
    this.updateValue(t);
  }
  connectedCallback() {
    super.connectedCallback(),
      this.proxy.setAttribute("type", "number"),
      this.validate(),
      this.autofocus &&
        u.queueUpdate(() => {
          this.focus();
        });
  }
  handleTextInput() {
    this.value = this.control.value;
  }
  handleChange() {
    this.$emit("change");
  }
  handleKeyDown(t) {
    switch (t.key) {
      case "ArrowUp":
        return this.stepUp(), !1;
      case "ArrowDown":
        return this.stepDown(), !1;
    }
    return !0;
  }
}
ie(
  [bt({ attribute: "readonly", mode: "boolean" })],
  Xs.prototype,
  "readOnly",
  void 0
),
  ie([bt({ mode: "boolean" })], Xs.prototype, "autofocus", void 0),
  ie(
    [bt({ attribute: "hide-step", mode: "boolean" })],
    Xs.prototype,
    "hideStep",
    void 0
  ),
  ie([bt], Xs.prototype, "placeholder", void 0),
  ie([bt], Xs.prototype, "list", void 0),
  ie([bt({ converter: gt })], Xs.prototype, "maxlength", void 0),
  ie([bt({ converter: gt })], Xs.prototype, "minlength", void 0),
  ie([bt({ converter: gt })], Xs.prototype, "size", void 0),
  ie([bt({ converter: gt })], Xs.prototype, "step", void 0),
  ie([bt({ converter: gt })], Xs.prototype, "max", void 0),
  ie([bt({ converter: gt })], Xs.prototype, "min", void 0),
  ie([S], Xs.prototype, "defaultSlottedNodes", void 0),
  We(Xs, Jt, Gs);
class Ys extends Ue {}
ie([bt({ converter: gt })], Ys.prototype, "value", void 0),
  ie([bt({ converter: gt })], Ys.prototype, "min", void 0),
  ie([bt({ converter: gt })], Ys.prototype, "max", void 0),
  ie([bt({ mode: "boolean" })], Ys.prototype, "paused", void 0);
class Qs extends Ue {
  constructor() {
    super(...arguments),
      (this.orientation = Ye.horizontal),
      (this.radioChangeHandler = (t) => {
        const e = t.target;
        e.checked &&
          (this.slottedRadioButtons.forEach((t) => {
            t !== e &&
              ((t.checked = !1),
              this.isInsideFoundationToolbar ||
                t.setAttribute("tabindex", "-1"));
          }),
          (this.selectedRadio = e),
          (this.value = e.value),
          e.setAttribute("tabindex", "0"),
          (this.focusedRadio = e)),
          t.stopPropagation();
      }),
      (this.moveToRadioByIndex = (t, e) => {
        const i = t[e];
        this.isInsideToolbar ||
          (i.setAttribute("tabindex", "0"),
          i.readOnly
            ? this.slottedRadioButtons.forEach((t) => {
                t !== i && t.setAttribute("tabindex", "-1");
              })
            : ((i.checked = !0), (this.selectedRadio = i))),
          (this.focusedRadio = i),
          i.focus();
      }),
      (this.moveRightOffGroup = () => {
        var t;
        null === (t = this.nextElementSibling) || void 0 === t || t.focus();
      }),
      (this.moveLeftOffGroup = () => {
        var t;
        null === (t = this.previousElementSibling) || void 0 === t || t.focus();
      }),
      (this.focusOutHandler = (t) => {
        const e = this.slottedRadioButtons,
          i = t.target,
          o = null !== i ? e.indexOf(i) : 0,
          s = this.focusedRadio ? e.indexOf(this.focusedRadio) : -1;
        return (
          ((0 === s && o === s) || (s === e.length - 1 && s === o)) &&
            (this.selectedRadio
              ? ((this.focusedRadio = this.selectedRadio),
                this.isInsideFoundationToolbar ||
                  (this.selectedRadio.setAttribute("tabindex", "0"),
                  e.forEach((t) => {
                    t !== this.selectedRadio &&
                      t.setAttribute("tabindex", "-1");
                  })))
              : ((this.focusedRadio = e[0]),
                this.focusedRadio.setAttribute("tabindex", "0"),
                e.forEach((t) => {
                  t !== this.focusedRadio && t.setAttribute("tabindex", "-1");
                }))),
          !0
        );
      }),
      (this.clickHandler = (t) => {
        const e = t.target;
        if (e) {
          const t = this.slottedRadioButtons;
          e.checked || 0 === t.indexOf(e)
            ? (e.setAttribute("tabindex", "0"), (this.selectedRadio = e))
            : (e.setAttribute("tabindex", "-1"), (this.selectedRadio = null)),
            (this.focusedRadio = e);
        }
        t.preventDefault();
      }),
      (this.shouldMoveOffGroupToTheRight = (t, e, i) =>
        t === e.length && this.isInsideToolbar && 39 === i),
      (this.shouldMoveOffGroupToTheLeft = (t, e) =>
        (this.focusedRadio ? t.indexOf(this.focusedRadio) - 1 : 0) < 0 &&
        this.isInsideToolbar &&
        37 === e),
      (this.checkFocusedRadio = () => {
        null === this.focusedRadio ||
          this.focusedRadio.readOnly ||
          this.focusedRadio.checked ||
          ((this.focusedRadio.checked = !0),
          this.focusedRadio.setAttribute("tabindex", "0"),
          this.focusedRadio.focus(),
          (this.selectedRadio = this.focusedRadio));
      }),
      (this.moveRight = (t) => {
        const e = this.slottedRadioButtons;
        let i = 0;
        if (
          ((i = this.focusedRadio ? e.indexOf(this.focusedRadio) + 1 : 1),
          this.shouldMoveOffGroupToTheRight(i, e, t.keyCode))
        )
          this.moveRightOffGroup();
        else
          for (i === e.length && (i = 0); i < e.length && e.length > 1; ) {
            if (!e[i].disabled) {
              this.moveToRadioByIndex(e, i);
              break;
            }
            if (this.focusedRadio && i === e.indexOf(this.focusedRadio)) break;
            if (i + 1 >= e.length) {
              if (this.isInsideToolbar) break;
              i = 0;
            } else i += 1;
          }
      }),
      (this.moveLeft = (t) => {
        const e = this.slottedRadioButtons;
        let i = 0;
        if (
          ((i = this.focusedRadio ? e.indexOf(this.focusedRadio) - 1 : 0),
          (i = i < 0 ? e.length - 1 : i),
          this.shouldMoveOffGroupToTheLeft(e, t.keyCode))
        )
          this.moveLeftOffGroup();
        else
          for (; i >= 0 && e.length > 1; ) {
            if (!e[i].disabled) {
              this.moveToRadioByIndex(e, i);
              break;
            }
            if (this.focusedRadio && i === e.indexOf(this.focusedRadio)) break;
            i - 1 < 0 ? (i = e.length - 1) : (i -= 1);
          }
      }),
      (this.keydownHandler = (t) => {
        const e = t.key;
        if (e in uo && this.isInsideFoundationToolbar) return !0;
        switch (e) {
          case "Enter":
            this.checkFocusedRadio();
            break;
          case "ArrowRight":
          case "ArrowDown":
            this.direction === po.ltr ? this.moveRight(t) : this.moveLeft(t);
            break;
          case "ArrowLeft":
          case "ArrowUp":
            this.direction === po.ltr ? this.moveLeft(t) : this.moveRight(t);
            break;
          default:
            return !0;
        }
      });
  }
  readOnlyChanged() {
    void 0 !== this.slottedRadioButtons &&
      this.slottedRadioButtons.forEach((t) => {
        this.readOnly ? (t.readOnly = !0) : (t.readOnly = !1);
      });
  }
  disabledChanged() {
    void 0 !== this.slottedRadioButtons &&
      this.slottedRadioButtons.forEach((t) => {
        this.disabled ? (t.disabled = !0) : (t.disabled = !1);
      });
  }
  nameChanged() {
    this.slottedRadioButtons &&
      this.slottedRadioButtons.forEach((t) => {
        t.setAttribute("name", this.name);
      });
  }
  valueChanged() {
    this.slottedRadioButtons &&
      this.slottedRadioButtons.forEach((t) => {
        t.getAttribute("value") === this.value &&
          ((t.checked = !0), (this.selectedRadio = t));
      }),
      this.$emit("change");
  }
  slottedRadioButtonsChanged(t, e) {
    this.slottedRadioButtons &&
      this.slottedRadioButtons.length > 0 &&
      this.setupRadioButtons();
  }
  get parentToolbar() {
    return this.closest('[role="toolbar"]');
  }
  get isInsideToolbar() {
    var t;
    return null !== (t = this.parentToolbar) && void 0 !== t && t;
  }
  get isInsideFoundationToolbar() {
    var t;
    return !!(null === (t = this.parentToolbar) || void 0 === t
      ? void 0
      : t.$fastController);
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.direction = Do(this)),
      this.setupRadioButtons();
  }
  disconnectedCallback() {
    this.slottedRadioButtons.forEach((t) => {
      t.removeEventListener("change", this.radioChangeHandler);
    });
  }
  setupRadioButtons() {
    const t = this.slottedRadioButtons.filter((t) => t.hasAttribute("checked")),
      e = t ? t.length : 0;
    if (e > 1) {
      t[e - 1].checked = !0;
    }
    let i = !1;
    if (
      (this.slottedRadioButtons.forEach((t) => {
        void 0 !== this.name && t.setAttribute("name", this.name),
          this.disabled && (t.disabled = !0),
          this.readOnly && (t.readOnly = !0),
          this.value && this.value === t.value
            ? ((this.selectedRadio = t),
              (this.focusedRadio = t),
              (t.checked = !0),
              t.setAttribute("tabindex", "0"),
              (i = !0))
            : (this.isInsideFoundationToolbar ||
                t.setAttribute("tabindex", "-1"),
              (t.checked = !1)),
          t.addEventListener("change", this.radioChangeHandler);
      }),
      void 0 === this.value && this.slottedRadioButtons.length > 0)
    ) {
      const t = this.slottedRadioButtons.filter((t) =>
          t.hasAttribute("checked")
        ),
        e = null !== t ? t.length : 0;
      if (e > 0 && !i) {
        const i = t[e - 1];
        (i.checked = !0),
          (this.focusedRadio = i),
          i.setAttribute("tabindex", "0");
      } else
        this.slottedRadioButtons[0].setAttribute("tabindex", "0"),
          (this.focusedRadio = this.slottedRadioButtons[0]);
    }
  }
}
ie(
  [bt({ attribute: "readonly", mode: "boolean" })],
  Qs.prototype,
  "readOnly",
  void 0
),
  ie(
    [bt({ attribute: "disabled", mode: "boolean" })],
    Qs.prototype,
    "disabled",
    void 0
  ),
  ie([bt], Qs.prototype, "name", void 0),
  ie([bt], Qs.prototype, "value", void 0),
  ie([bt], Qs.prototype, "orientation", void 0),
  ie([S], Qs.prototype, "childItems", void 0),
  ie([S], Qs.prototype, "slottedRadioButtons", void 0);
class Zs extends Ue {}
class Js extends zo(Zs) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("input"));
  }
}
class tn extends Js {
  constructor() {
    var t;
    super(),
      (this.initialValue = "on"),
      (this.checkedAttribute = !1),
      (this.dirtyChecked = !1),
      (this.formResetCallback = () => {
        (this.checked = !!this.defaultChecked), (this.dirtyChecked = !1);
      }),
      (this.keypressHandler = (t) => {
        switch (t.keyCode) {
          case 32:
            return void (this.checked || this.readOnly || (this.checked = !0));
        }
        return !0;
      }),
      (this.clickHandler = (t) => {
        this.disabled || this.readOnly || this.checked || (this.checked = !0);
      }),
      (this.checked = null !== (t = this.defaultChecked) && void 0 !== t && t);
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.readOnly = this.readOnly);
  }
  checkedAttributeChanged() {
    this.defaultChecked = this.checkedAttribute;
  }
  defaultCheckedChanged() {
    var t;
    this.$fastController.isConnected &&
      !this.dirtyChecked &&
      (this.isInsideRadioGroup() ||
        ((this.checked =
          null !== (t = this.defaultChecked) && void 0 !== t && t),
        (this.dirtyChecked = !1)));
  }
  checkedChanged() {
    this.$fastController.isConnected &&
      (this.dirtyChecked || (this.dirtyChecked = !0),
      this.updateForm(),
      this.proxy instanceof HTMLInputElement &&
        (this.proxy.checked = this.checked),
      this.$emit("change"),
      this.validate());
  }
  connectedCallback() {
    var t, e;
    super.connectedCallback(),
      this.proxy.setAttribute("type", "radio"),
      this.validate(),
      "radiogroup" !==
        (null === (t = this.parentElement) || void 0 === t
          ? void 0
          : t.getAttribute("role")) &&
        null === this.getAttribute("tabindex") &&
        (this.disabled || this.setAttribute("tabindex", "0")),
      this.updateForm(),
      this.checkedAttribute &&
        (this.dirtyChecked ||
          this.isInsideRadioGroup() ||
          ((this.checked =
            null !== (e = this.defaultChecked) && void 0 !== e && e),
          (this.dirtyChecked = !1)));
  }
  isInsideRadioGroup() {
    return null !== this.closest("[role=radiogroup]");
  }
  updateForm() {
    const t = this.checked ? this.value : null;
    this.setFormValue(t, t);
  }
}
ie(
  [bt({ attribute: "readonly", mode: "boolean" })],
  tn.prototype,
  "readOnly",
  void 0
),
  ie([S], tn.prototype, "name", void 0),
  ie(
    [bt({ attribute: "checked", mode: "boolean" })],
    tn.prototype,
    "checkedAttribute",
    void 0
  ),
  ie([S], tn.prototype, "defaultSlottedNodes", void 0),
  ie([S], tn.prototype, "defaultChecked", void 0),
  ie([S], tn.prototype, "checked", void 0);
class en extends Ue {
  constructor() {
    super(...arguments),
      (this.framesPerSecond = 120),
      (this.updatingItems = !1),
      (this.speed = 600),
      (this.easing = "ease-in-out"),
      (this.flippersHiddenFromAT = !1),
      (this.scrolling = !1),
      (this.resizeDetector = null);
  }
  get frameTime() {
    return 1e3 / this.framesPerSecond;
  }
  get isRtl() {
    return (
      this.scrollItems.length > 1 &&
      this.scrollItems[0].offsetLeft > this.scrollItems[1].offsetLeft
    );
  }
  connectedCallback() {
    super.connectedCallback(), this.initializeResizeDetector();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.disconnectResizeDetector();
  }
  scrollItemsChanged(t, e) {
    e && !this.updatingItems && this.setStops();
  }
  disconnectResizeDetector() {
    this.resizeDetector &&
      (this.resizeDetector.disconnect(), (this.resizeDetector = null));
  }
  initializeResizeDetector() {
    this.disconnectResizeDetector(),
      (this.resizeDetector = new window.ResizeObserver(
        this.resized.bind(this)
      )),
      this.resizeDetector.observe(this);
  }
  updateScrollStops() {
    this.updatingItems = !0;
    let t = [];
    this.scrollItems.forEach((e) => {
      e instanceof HTMLSlotElement
        ? (t = t.concat(e.assignedElements()))
        : t.push(e);
    }),
      (this.scrollItems = t),
      (this.updatingItems = !1);
  }
  setStops() {
    this.updateScrollStops(), (this.width = this.offsetWidth);
    let t = 0,
      e = this.scrollItems
        .map(({ offsetLeft: e, offsetWidth: i }, o) => {
          const s = e + i;
          return this.isRtl ? -s : ((t = s), 0 === o ? 0 : e);
        })
        .concat(t);
    (e = this.fixScrollMisalign(e)),
      e.sort((t, e) => Math.abs(t) - Math.abs(e)),
      (this.scrollStops = e),
      this.setFlippers();
  }
  fixScrollMisalign(t) {
    if (this.isRtl && t.some((t) => t > 0)) {
      t.sort((t, e) => e - t);
      const e = t[0];
      t = t.map((t) => t - e);
    }
    return t;
  }
  setFlippers() {
    const t = this.scrollContainer.scrollLeft;
    if (
      (this.previousFlipperContainer &&
        this.previousFlipperContainer.classList.toggle("disabled", 0 === t),
      this.nextFlipperContainer && this.scrollStops)
    ) {
      const e = Math.abs(this.scrollStops[this.scrollStops.length - 1]);
      this.nextFlipperContainer.classList.toggle(
        "disabled",
        Math.abs(t) + this.width >= e
      );
    }
  }
  keyupHandler(t) {
    switch (t.key) {
      case "ArrowLeft":
        this.scrollToPrevious();
        break;
      case "ArrowRight":
        this.scrollToNext();
    }
  }
  scrollToPrevious() {
    const t = this.scrollContainer.scrollLeft,
      e = this.scrollStops.findIndex(
        (e, i) =>
          e <= t &&
          (this.isRtl ||
            i === this.scrollStops.length - 1 ||
            this.scrollStops[i + 1] > t)
      ),
      i = Math.abs(this.scrollStops[e + 1]);
    let o = this.scrollStops.findIndex((t) => Math.abs(t) + this.width > i);
    (o > e || -1 === o) && (o = e > 0 ? e - 1 : 0),
      this.scrollToPosition(this.scrollStops[o], t);
  }
  scrollToNext() {
    const t = this.scrollContainer.scrollLeft,
      e = this.scrollStops.findIndex((e) => Math.abs(e) >= Math.abs(t)),
      i = this.scrollStops.findIndex(
        (e) => Math.abs(t) + this.width <= Math.abs(e)
      );
    let o = e;
    i > e + 2 ? (o = i - 2) : e < this.scrollStops.length - 2 && (o = e + 1);
    const s = this.scrollStops[o];
    this.scrollToPosition(s, t);
  }
  scrollToPosition(t, e = this.scrollContainer.scrollLeft) {
    if (this.scrolling) return;
    this.scrolling = !0;
    const i = [],
      o = e < t ? 1 : -1,
      s = Math.abs(t - e),
      n = s / this.speed,
      r = Math.floor(this.framesPerSecond * n);
    if (r < 1) this.scrolling = !1;
    else {
      for (let t = 0; t < r; t++) {
        const n = t / r,
          a = s * this.getEasedFactor(this.easing, n) * o;
        i.push(a + e);
      }
      i.push(t), this.move(i, this.frameTime);
    }
  }
  move(t, e) {
    if (!t || t.length <= 0)
      return this.setFlippers(), void (this.scrolling = !1);
    this.moveStartTime = requestAnimationFrame((i) => {
      if (i - this.moveStartTime >= e) {
        const e = t.shift();
        this.scrollContainer.scrollLeft =
          null != e ? e : this.scrollContainer.scrollLeft;
      }
      this.move(t, e);
    });
  }
  resized() {
    this.resizeTimeout &&
      (this.resizeTimeout = clearTimeout(this.resizeTimeout)),
      (this.resizeTimeout = setTimeout(() => {
        (this.width = this.offsetWidth), this.setFlippers();
      }, this.frameTime));
  }
  scrolled() {
    this.scrollTimeout &&
      (this.scrollTimeout = clearTimeout(this.scrollTimeout)),
      (this.scrollTimeout = setTimeout(() => {
        this.setFlippers();
      }, this.frameTime));
  }
  getEasedFactor(t, e) {
    switch ((e > 1 && (e = 1), t)) {
      case "ease-in":
        return Math.pow(e, 1.675);
      case "ease-out":
        return 1 - Math.pow(1 - e, 1.675);
      case "ease-in-out":
        return 0.5 * (Math.sin((e - 0.5) * Math.PI) + 1);
      default:
        return e;
    }
  }
}
ie([bt({ converter: gt })], en.prototype, "speed", void 0),
  ie([bt], en.prototype, "easing", void 0),
  ie(
    [bt({ attribute: "aria-hidden", converter: pt })],
    en.prototype,
    "flippersHiddenFromAT",
    void 0
  ),
  ie([S], en.prototype, "scrollItems", void 0),
  ie([bt({ attribute: "view" })], en.prototype, "view", void 0);
class on extends Jo {}
class sn extends zo(on) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("select"));
  }
}
class nn extends sn {
  constructor() {
    super(...arguments),
      (this.open = !1),
      (this.forcedPosition = !1),
      (this.role = Wo.combobox),
      (this.position = Ko.below),
      (this.maxHeight = 0),
      (this.displayValue = ""),
      (this.formResetCallback = () => {
        this.setProxyOptions(),
          this.setDefaultSelectedOption(),
          (this.value = this.firstSelectedOption.value);
      });
  }
  openChanged() {
    (this.ariaExpanded = this.open ? "true" : "false"),
      this.open &&
        (this.setPositioning(),
        this.focusAndScrollOptionIntoView(),
        (this.indexWhenOpened = this.selectedIndex));
  }
  get value() {
    return T.track(this, "value"), this._value;
  }
  set value(t) {
    const e = "" + this._value;
    if (this.$fastController.isConnected && this.options) {
      const e = this.options.findIndex((e) => e.value === t),
        i = this.options[this.selectedIndex],
        o = this.options[e],
        s = i ? i.value : null,
        n = o ? o.value : null;
      (-1 !== e && s === n) || ((t = ""), (this.selectedIndex = e)),
        this.firstSelectedOption && (t = this.firstSelectedOption.value);
    }
    e !== t &&
      ((this._value = t), super.valueChanged(e, t), T.notify(this, "value"));
  }
  updateValue(t) {
    this.$fastController.isConnected &&
      ((this.value = this.firstSelectedOption
        ? this.firstSelectedOption.value
        : ""),
      (this.displayValue = this.firstSelectedOption
        ? this.firstSelectedOption.textContent || this.firstSelectedOption.value
        : this.value)),
      t &&
        (this.$emit("input"),
        this.$emit("change", this, { bubbles: !0, composed: void 0 }));
  }
  selectedIndexChanged(t, e) {
    super.selectedIndexChanged(t, e), this.updateValue();
  }
  setPositioning() {
    const t = this.getBoundingClientRect(),
      e = window.innerHeight - t.bottom;
    (this.position = this.forcedPosition
      ? this.positionAttribute
      : t.top > e
      ? Ko.above
      : Ko.below),
      (this.positionAttribute = this.forcedPosition
        ? this.positionAttribute
        : this.position),
      (this.maxHeight = this.position === Ko.above ? ~~t.top : ~~e);
  }
  disabledChanged(t, e) {
    super.disabledChanged && super.disabledChanged(t, e),
      (this.ariaDisabled = this.disabled ? "true" : "false");
  }
  clickHandler(t) {
    if (!this.disabled) {
      if (this.open) {
        const e = t.target.closest("option,[role=option]");
        if (e && e.disabled) return;
      }
      return (
        super.clickHandler(t),
        (this.open = !this.open),
        this.open ||
          this.indexWhenOpened === this.selectedIndex ||
          this.updateValue(!0),
        !0
      );
    }
  }
  focusoutHandler(t) {
    var e;
    if (!this.open) return !0;
    const i = t.relatedTarget;
    this.isSameNode(i)
      ? this.focus()
      : (null === (e = this.options) || void 0 === e
          ? void 0
          : e.includes(i)) ||
        ((this.open = !1),
        this.indexWhenOpened !== this.selectedIndex && this.updateValue(!0));
  }
  slottedOptionsChanged(t, e) {
    super.slottedOptionsChanged(t, e),
      this.setProxyOptions(),
      this.updateValue();
  }
  setProxyOptions() {
    this.proxy instanceof HTMLSelectElement &&
      this.options &&
      ((this.proxy.options.length = 0),
      this.options.forEach((t) => {
        const e =
          t.proxy || (t instanceof HTMLOptionElement ? t.cloneNode() : null);
        e && this.proxy.appendChild(e);
      }));
  }
  keydownHandler(t) {
    super.keydownHandler(t);
    switch (t.key || t.key.charCodeAt(0)) {
      case " ":
        this.typeAheadExpired && (t.preventDefault(), (this.open = !this.open));
        break;
      case "Enter":
        t.preventDefault(), (this.open = !this.open);
        break;
      case "Escape":
        this.open && (t.preventDefault(), (this.open = !1));
        break;
      case "Tab":
        if (!this.open) return !0;
        t.preventDefault(), (this.open = !1);
    }
    return (
      this.open ||
        this.indexWhenOpened === this.selectedIndex ||
        (this.updateValue(!0), (this.indexWhenOpened = this.selectedIndex)),
      !0
    );
  }
  connectedCallback() {
    super.connectedCallback(), (this.forcedPosition = !!this.positionAttribute);
  }
}
ie([bt({ attribute: "open", mode: "boolean" })], nn.prototype, "open", void 0),
  ie(
    [bt({ attribute: "position" })],
    nn.prototype,
    "positionAttribute",
    void 0
  ),
  ie([S], nn.prototype, "position", void 0),
  ie([S], nn.prototype, "maxHeight", void 0),
  ie([S], nn.prototype, "displayValue", void 0);
class rn {}
ie([S], rn.prototype, "ariaExpanded", void 0),
  ie(
    [bt({ attribute: "aria-pressed", mode: "fromView" })],
    rn.prototype,
    "ariaPressed",
    void 0
  ),
  We(rn, xo),
  We(nn, Jt, rn);
class an extends Ue {
  constructor() {
    super(...arguments), (this.shape = "rect");
  }
}
ie([bt], an.prototype, "fill", void 0),
  ie([bt], an.prototype, "shape", void 0),
  ie([bt], an.prototype, "pattern", void 0),
  ie([bt({ mode: "boolean" })], an.prototype, "shimmer", void 0);
function ln(t, e, i, o) {
  let s = mo(0, 1, (t - e) / (i - e));
  return o === po.rtl && (s = 1 - s), s;
}
const cn = {
  min: 0,
  max: 0,
  direction: po.ltr,
  orientation: Ye.horizontal,
  disabled: !1,
};
class hn extends Ue {
  constructor() {
    super(...arguments),
      (this.hideMark = !1),
      (this.sliderDirection = po.ltr),
      (this.getSliderConfiguration = () => {
        if (this.isSliderConfig(this.parentNode)) {
          const t = this.parentNode,
            { min: e, max: i, direction: o, orientation: s, disabled: n } = t;
          void 0 !== n && (this.disabled = n),
            (this.sliderDirection = o || po.ltr),
            (this.sliderOrientation = s || Ye.horizontal),
            (this.sliderMaxPosition = i),
            (this.sliderMinPosition = e);
        } else
          (this.sliderDirection = cn.direction || po.ltr),
            (this.sliderOrientation = cn.orientation || Ye.horizontal),
            (this.sliderMaxPosition = cn.max),
            (this.sliderMinPosition = cn.min);
      }),
      (this.positionAsStyle = () => {
        const t = this.sliderDirection ? this.sliderDirection : po.ltr,
          e = ln(
            Number(this.position),
            Number(this.sliderMinPosition),
            Number(this.sliderMaxPosition)
          );
        let i = Math.round(100 * (1 - e)),
          o = Math.round(100 * e);
        return (
          o === Number.NaN && i === Number.NaN && ((i = 50), (o = 50)),
          this.sliderOrientation === Ye.horizontal
            ? t === po.rtl
              ? `right: ${o}%; left: ${i}%;`
              : `left: ${o}%; right: ${i}%;`
            : `top: ${o}%; bottom: ${i}%;`
        );
      });
  }
  positionChanged() {
    this.positionStyle = this.positionAsStyle();
  }
  sliderOrientationChanged() {}
  connectedCallback() {
    super.connectedCallback(),
      this.getSliderConfiguration(),
      (this.positionStyle = this.positionAsStyle()),
      (this.notifier = T.getNotifier(this.parentNode)),
      this.notifier.subscribe(this, "orientation"),
      this.notifier.subscribe(this, "direction"),
      this.notifier.subscribe(this, "max"),
      this.notifier.subscribe(this, "min");
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      this.notifier.unsubscribe(this, "orientation"),
      this.notifier.unsubscribe(this, "direction"),
      this.notifier.unsubscribe(this, "max"),
      this.notifier.unsubscribe(this, "min");
  }
  handleChange(t, e) {
    switch (e) {
      case "direction":
        this.sliderDirection = t.direction;
        break;
      case "orientation":
        this.sliderOrientation = t.orientation;
        break;
      case "max":
        this.sliderMinPosition = t.max;
        break;
      case "min":
        this.sliderMinPosition = t.min;
    }
    this.positionStyle = this.positionAsStyle();
  }
  isSliderConfig(t) {
    return void 0 !== t.max && void 0 !== t.min;
  }
}
ie([S], hn.prototype, "positionStyle", void 0),
  ie([bt], hn.prototype, "position", void 0),
  ie(
    [bt({ attribute: "hide-mark", mode: "boolean" })],
    hn.prototype,
    "hideMark",
    void 0
  ),
  ie(
    [bt({ attribute: "disabled", mode: "boolean" })],
    hn.prototype,
    "disabled",
    void 0
  ),
  ie([S], hn.prototype, "sliderOrientation", void 0),
  ie([S], hn.prototype, "sliderMinPosition", void 0),
  ie([S], hn.prototype, "sliderMaxPosition", void 0),
  ie([S], hn.prototype, "sliderDirection", void 0);
class dn extends Ue {}
class un extends zo(dn) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("input"));
  }
}
var pn;
!(function (t) {
  t.singleValue = "single-value";
})(pn || (pn = {}));
class gn extends un {
  constructor() {
    super(...arguments),
      (this.direction = po.ltr),
      (this.isDragging = !1),
      (this.trackWidth = 0),
      (this.trackMinWidth = 0),
      (this.trackHeight = 0),
      (this.trackLeft = 0),
      (this.trackMinHeight = 0),
      (this.valueTextFormatter = () => null),
      (this.min = 0),
      (this.max = 10),
      (this.step = 1),
      (this.orientation = Ye.horizontal),
      (this.mode = pn.singleValue),
      (this.keypressHandler = (t) => {
        if ((9 !== t.keyCode && t.preventDefault(), 36 === t.keyCode))
          this.value = "" + this.min;
        else if (35 === t.keyCode) this.value = "" + this.max;
        else if (!t.shiftKey)
          switch (t.keyCode) {
            case 39:
            case 38:
              this.increment();
              break;
            case 37:
            case 40:
              this.decrement();
          }
      }),
      (this.setupTrackConstraints = () => {
        const t = this.track.getBoundingClientRect();
        (this.trackWidth = this.track.clientWidth),
          (this.trackMinWidth = this.track.clientLeft),
          (this.trackHeight = t.bottom),
          (this.trackMinHeight = t.top),
          (this.trackLeft = this.getBoundingClientRect().left),
          0 === this.trackWidth && (this.trackWidth = 1);
      }),
      (this.setupListeners = () => {
        this.addEventListener("keydown", this.keypressHandler),
          this.addEventListener("mousedown", this.handleMouseDown),
          this.thumb.addEventListener("mousedown", this.handleThumbMouseDown),
          this.thumb.addEventListener("touchstart", this.handleThumbMouseDown);
      }),
      (this.initialValue = ""),
      (this.handleThumbMouseDown = (t) => {
        this.readOnly ||
          this.disabled ||
          t.defaultPrevented ||
          (t.preventDefault(),
          t.target.focus(),
          window.addEventListener("mouseup", this.handleWindowMouseUp),
          window.addEventListener("mousemove", this.handleMouseMove),
          window.addEventListener("touchmove", this.handleMouseMove),
          window.addEventListener("touchend", this.handleWindowMouseUp),
          (this.isDragging = !0));
      }),
      (this.handleMouseMove = (t) => {
        if (this.readOnly || this.disabled || t.defaultPrevented) return;
        const e =
            window.TouchEvent && t instanceof TouchEvent ? t.touches[0] : t,
          i =
            this.orientation === Ye.horizontal
              ? e.pageX - document.documentElement.scrollLeft - this.trackLeft
              : e.pageY - document.documentElement.scrollTop;
        this.value = "" + this.calculateNewValue(i);
      }),
      (this.calculateNewValue = (t) => {
        const e = ln(
            t,
            this.orientation === Ye.horizontal
              ? this.trackMinWidth
              : this.trackMinHeight,
            this.orientation === Ye.horizontal
              ? this.trackWidth
              : this.trackHeight,
            this.direction
          ),
          i = (this.max - this.min) * e + this.min;
        return this.convertToConstrainedValue(i);
      }),
      (this.handleWindowMouseUp = (t) => {
        this.stopDragging();
      }),
      (this.stopDragging = () => {
        (this.isDragging = !1),
          window.removeEventListener("mouseup", this.handleWindowMouseUp),
          window.removeEventListener("mousemove", this.handleMouseMove),
          window.removeEventListener("touchmove", this.handleMouseMove),
          window.removeEventListener("touchend", this.handleWindowMouseUp);
      }),
      (this.handleMouseDown = (t) => {
        if ((t.preventDefault(), !this.disabled && !this.readOnly)) {
          this.setupTrackConstraints(),
            t.target.focus(),
            window.addEventListener("mouseup", this.handleWindowMouseUp),
            window.addEventListener("mousemove", this.handleMouseMove);
          const e =
            this.orientation === Ye.horizontal
              ? t.pageX - document.documentElement.scrollLeft - this.trackLeft
              : t.pageY - document.documentElement.scrollTop;
          this.value = "" + this.calculateNewValue(e);
        }
      }),
      (this.convertToConstrainedValue = (t) => {
        isNaN(t) && (t = this.min);
        let e = t - this.min;
        const i =
          e -
          (Math.round(e / this.step) * (this.stepMultiplier * this.step)) /
            this.stepMultiplier;
        return (
          (e = i >= Number(this.step) / 2 ? e - i + Number(this.step) : e - i),
          e + this.min
        );
      });
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.readOnly = this.readOnly);
  }
  valueChanged(t, e) {
    super.valueChanged(t, e),
      this.$fastController.isConnected &&
        this.setThumbPositionForOrientation(this.direction),
      this.$emit("change");
  }
  minChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.min = "" + this.min),
      this.validate();
  }
  maxChanged() {
    this.proxy instanceof HTMLInputElement && (this.proxy.max = "" + this.max),
      this.validate();
  }
  stepChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.step = "" + this.step),
      this.updateStepMultiplier(),
      this.validate();
  }
  orientationChanged() {
    this.$fastController.isConnected &&
      this.setThumbPositionForOrientation(this.direction);
  }
  connectedCallback() {
    super.connectedCallback(),
      this.proxy.setAttribute("type", "range"),
      (this.direction = Do(this)),
      this.updateStepMultiplier(),
      this.setupTrackConstraints(),
      this.setupListeners(),
      this.setupDefaultValue(),
      this.setThumbPositionForOrientation(this.direction);
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this.keypressHandler),
      this.removeEventListener("mousedown", this.handleMouseDown),
      this.thumb.removeEventListener("mousedown", this.handleThumbMouseDown),
      this.thumb.removeEventListener("touchstart", this.handleThumbMouseDown);
  }
  increment() {
    const t =
        this.direction !== po.rtl && this.orientation !== Ye.vertical
          ? Number(this.value) + Number(this.step)
          : Number(this.value) - Number(this.step),
      e = this.convertToConstrainedValue(t),
      i = e < Number(this.max) ? "" + e : "" + this.max;
    this.value = i;
  }
  decrement() {
    const t =
        this.direction !== po.rtl && this.orientation !== Ye.vertical
          ? Number(this.value) - Number(this.step)
          : Number(this.value) + Number(this.step),
      e = this.convertToConstrainedValue(t),
      i = e > Number(this.min) ? "" + e : "" + this.min;
    this.value = i;
  }
  setThumbPositionForOrientation(t) {
    const e = ln(Number(this.value), Number(this.min), Number(this.max), t),
      i = Math.round(100 * (1 - e));
    this.orientation === Ye.horizontal
      ? (this.position = this.isDragging
          ? `right: ${i}%; transition: none;`
          : `right: ${i}%; transition: all 0.2s ease;`)
      : (this.position = this.isDragging
          ? `bottom: ${i}%; transition: none;`
          : `bottom: ${i}%; transition: all 0.2s ease;`);
  }
  updateStepMultiplier() {
    const t = this.step + "",
      e = this.step % 1 ? t.length - t.indexOf(".") - 1 : 0;
    this.stepMultiplier = Math.pow(10, e);
  }
  get midpoint() {
    return "" + this.convertToConstrainedValue((this.max + this.min) / 2);
  }
  setupDefaultValue() {
    if ("string" == typeof this.value)
      if (0 === this.value.length) this.initialValue = this.midpoint;
      else {
        const t = parseFloat(this.value);
        !Number.isNaN(t) &&
          (t < this.min || t > this.max) &&
          (this.value = this.midpoint);
      }
  }
}
ie(
  [bt({ attribute: "readonly", mode: "boolean" })],
  gn.prototype,
  "readOnly",
  void 0
),
  ie([S], gn.prototype, "direction", void 0),
  ie([S], gn.prototype, "isDragging", void 0),
  ie([S], gn.prototype, "position", void 0),
  ie([S], gn.prototype, "trackWidth", void 0),
  ie([S], gn.prototype, "trackMinWidth", void 0),
  ie([S], gn.prototype, "trackHeight", void 0),
  ie([S], gn.prototype, "trackLeft", void 0),
  ie([S], gn.prototype, "trackMinHeight", void 0),
  ie([S], gn.prototype, "valueTextFormatter", void 0),
  ie([bt({ converter: gt })], gn.prototype, "min", void 0),
  ie([bt({ converter: gt })], gn.prototype, "max", void 0),
  ie([bt({ converter: gt })], gn.prototype, "step", void 0),
  ie([bt], gn.prototype, "orientation", void 0),
  ie([bt], gn.prototype, "mode", void 0);
class fn extends Ue {}
class bn extends zo(fn) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("input"));
  }
}
class mn extends bn {
  constructor() {
    super(),
      (this.initialValue = "on"),
      (this.dirtyChecked = !1),
      (this.formResetCallback = () => {
        (this.checked = this.checkedAttribute), (this.dirtyChecked = !1);
      }),
      (this.keypressHandler = (t) => {
        switch (t.keyCode) {
          case 32:
            this.checked = !this.checked;
        }
      }),
      (this.clickHandler = (t) => {
        this.disabled || this.readOnly || (this.checked = !this.checked);
      }),
      (this.defaultChecked = !!this.checkedAttribute),
      (this.checked = this.defaultChecked);
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLInputElement &&
      (this.proxy.readOnly = this.readOnly),
      this.readOnly
        ? this.classList.add("readonly")
        : this.classList.remove("readonly");
  }
  checkedAttributeChanged() {
    this.defaultChecked = this.checkedAttribute;
  }
  defaultCheckedChanged() {
    this.dirtyChecked ||
      ((this.checked = this.defaultChecked), (this.dirtyChecked = !1));
  }
  checkedChanged() {
    this.dirtyChecked || (this.dirtyChecked = !0),
      this.updateForm(),
      this.proxy instanceof HTMLInputElement &&
        (this.proxy.checked = this.checked),
      this.$emit("change"),
      this.checked
        ? this.classList.add("checked")
        : this.classList.remove("checked"),
      this.validate();
  }
  connectedCallback() {
    super.connectedCallback(),
      this.proxy.setAttribute("type", "checkbox"),
      this.updateForm();
  }
  updateForm() {
    const t = this.checked ? this.value : null;
    this.setFormValue(t, t);
  }
}
ie(
  [bt({ attribute: "readonly", mode: "boolean" })],
  mn.prototype,
  "readOnly",
  void 0
),
  ie(
    [bt({ attribute: "checked", mode: "boolean" })],
    mn.prototype,
    "checkedAttribute",
    void 0
  ),
  ie([S], mn.prototype, "defaultSlottedNodes", void 0),
  ie([S], mn.prototype, "defaultChecked", void 0),
  ie([S], mn.prototype, "checked", void 0);
class vn extends Ue {}
class yn extends Ue {}
ie([bt({ mode: "boolean" })], yn.prototype, "disabled", void 0);
var xn, $n;
!(function (t) {
  (t.vertical = "vertical"), (t.horizontal = "horizontal");
})(xn || (xn = {}));
class wn extends Ue {
  constructor() {
    super(...arguments),
      (this.orientation = xn.horizontal),
      (this.activeindicator = !0),
      (this.showActiveIndicator = !0),
      (this.prevActiveTabIndex = 0),
      (this.activeTabIndex = 0),
      (this.ticking = !1),
      (this.change = () => {
        this.$emit("change", this.activetab);
      }),
      (this.isDisabledElement = (t) =>
        "true" === t.getAttribute("aria-disabled")),
      (this.isFocusableElement = (t) => !this.isDisabledElement(t)),
      (this.setTabs = () => {
        const t = this.isHorizontal() ? "gridColumn" : "gridRow";
        (this.tabIds = this.getTabIds()),
          (this.tabpanelIds = this.getTabPanelIds()),
          (this.activeTabIndex = this.getActiveIndex()),
          (this.showActiveIndicator = !1),
          this.tabs.forEach((e, i) => {
            if ("tab" === e.slot && this.isFocusableElement(e)) {
              this.activeindicator && (this.showActiveIndicator = !0);
              const t = this.tabIds[i],
                o = this.tabpanelIds[i];
              e.setAttribute("id", "string" != typeof t ? "tab-" + (i + 1) : t),
                e.setAttribute(
                  "aria-selected",
                  this.activeTabIndex === i ? "true" : "false"
                ),
                e.setAttribute(
                  "aria-controls",
                  "string" != typeof o ? "panel-" + (i + 1) : o
                ),
                e.addEventListener("click", this.handleTabClick),
                e.addEventListener("keydown", this.handleTabKeyDown),
                e.setAttribute(
                  "tabindex",
                  this.activeTabIndex === i ? "0" : "-1"
                ),
                this.activeTabIndex === i && (this.activetab = e);
            }
            (e.style[t] = "" + (i + 1)),
              this.isHorizontal()
                ? e.classList.remove("vertical")
                : e.classList.add("vertical");
          });
      }),
      (this.setTabPanels = () => {
        (this.tabIds = this.getTabIds()),
          (this.tabpanelIds = this.getTabPanelIds()),
          this.tabpanels.forEach((t, e) => {
            const i = this.tabIds[e],
              o = this.tabpanelIds[e];
            t.setAttribute("id", "string" != typeof o ? "panel-" + (e + 1) : o),
              t.setAttribute(
                "aria-labelledby",
                "string" != typeof i ? "tab-" + (e + 1) : i
              ),
              this.activeTabIndex !== e
                ? t.setAttribute("hidden", "")
                : t.removeAttribute("hidden");
          });
      }),
      (this.handleTabClick = (t) => {
        const e = t.currentTarget;
        1 === e.nodeType &&
          ((this.prevActiveTabIndex = this.activeTabIndex),
          (this.activeTabIndex = this.tabs.indexOf(e)),
          this.setComponent());
      }),
      (this.handleTabKeyDown = (t) => {
        const e = t.keyCode;
        if (this.isHorizontal())
          switch (e) {
            case 37:
              t.preventDefault(), this.adjustBackward(t);
              break;
            case 39:
              t.preventDefault(), this.adjustForward(t);
          }
        else
          switch (e) {
            case 38:
              t.preventDefault(), this.adjustBackward(t);
              break;
            case 40:
              t.preventDefault(), this.adjustForward(t);
          }
        switch (e) {
          case 36:
            t.preventDefault(), this.adjust(-this.activeTabIndex);
            break;
          case 35:
            t.preventDefault(),
              this.adjust(this.tabs.length - this.activeTabIndex - 1);
        }
      }),
      (this.adjustForward = (t) => {
        const e = this.tabs;
        let i = 0;
        for (
          i = this.activetab ? e.indexOf(this.activetab) + 1 : 1,
            i === e.length && (i = 0);
          i < e.length && e.length > 1;

        ) {
          if (this.isFocusableElement(e[i])) {
            this.moveToTabByIndex(e, i);
            break;
          }
          if (this.activetab && i === e.indexOf(this.activetab)) break;
          i + 1 >= e.length ? (i = 0) : (i += 1);
        }
      }),
      (this.adjustBackward = (t) => {
        const e = this.tabs;
        let i = 0;
        for (
          i = this.activetab ? e.indexOf(this.activetab) - 1 : 0,
            i = i < 0 ? e.length - 1 : i;
          i >= 0 && e.length > 1;

        ) {
          if (this.isFocusableElement(e[i])) {
            this.moveToTabByIndex(e, i);
            break;
          }
          i - 1 < 0 ? (i = e.length - 1) : (i -= 1);
        }
      }),
      (this.moveToTabByIndex = (t, e) => {
        const i = t[e];
        (this.activetab = i),
          (this.prevActiveTabIndex = this.activeTabIndex),
          (this.activeTabIndex = e),
          i.focus(),
          this.setComponent();
      });
  }
  activeidChanged() {
    this.$fastController.isConnected &&
      this.tabs.length <= this.tabpanels.length &&
      (this.setTabs(),
      this.setTabPanels(),
      this.handleActiveIndicatorPosition());
  }
  tabsChanged() {
    this.$fastController.isConnected &&
      this.tabs.length <= this.tabpanels.length &&
      (this.setTabs(),
      this.setTabPanels(),
      this.handleActiveIndicatorPosition());
  }
  tabpanelsChanged() {
    this.$fastController.isConnected &&
      this.tabpanels.length <= this.tabs.length &&
      (this.setTabs(),
      this.setTabPanels(),
      this.handleActiveIndicatorPosition());
  }
  getActiveIndex() {
    return void 0 !== this.activeid
      ? -1 === this.tabIds.indexOf(this.activeid)
        ? 0
        : this.tabIds.indexOf(this.activeid)
      : 0;
  }
  getTabIds() {
    return this.tabs.map((t) => t.getAttribute("id"));
  }
  getTabPanelIds() {
    return this.tabpanels.map((t) => t.getAttribute("id"));
  }
  setComponent() {
    this.activeTabIndex !== this.prevActiveTabIndex &&
      ((this.activeid = this.tabIds[this.activeTabIndex]),
      this.change(),
      this.setTabs(),
      this.handleActiveIndicatorPosition(),
      this.setTabPanels(),
      this.focusTab(),
      this.change());
  }
  isHorizontal() {
    return this.orientation === xn.horizontal;
  }
  handleActiveIndicatorPosition() {
    this.showActiveIndicator &&
      this.activeindicator &&
      this.activeTabIndex !== this.prevActiveTabIndex &&
      (this.ticking
        ? (this.ticking = !1)
        : ((this.ticking = !0), this.animateActiveIndicator()));
  }
  animateActiveIndicator() {
    this.ticking = !0;
    const t = this.isHorizontal() ? "gridColumn" : "gridRow",
      e = this.isHorizontal() ? "translateX" : "translateY",
      i = this.isHorizontal() ? "offsetLeft" : "offsetTop",
      o = this.activeIndicatorRef[i];
    this.activeIndicatorRef.style[t] = "" + (this.activeTabIndex + 1);
    const s = this.activeIndicatorRef[i];
    this.activeIndicatorRef.style[t] = "" + (this.prevActiveTabIndex + 1);
    const n = s - o;
    (this.activeIndicatorRef.style.transform = `${e}(${n}px)`),
      this.activeIndicatorRef.classList.add("activeIndicatorTransition"),
      this.activeIndicatorRef.addEventListener("transitionend", () => {
        (this.ticking = !1),
          (this.activeIndicatorRef.style[t] = "" + (this.activeTabIndex + 1)),
          (this.activeIndicatorRef.style.transform = e + "(0px)"),
          this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
      });
  }
  adjust(t) {
    (this.prevActiveTabIndex = this.activeTabIndex),
      (this.activeTabIndex = bo(
        0,
        this.tabs.length - 1,
        this.activeTabIndex + t
      )),
      this.setComponent();
  }
  focusTab() {
    this.tabs[this.activeTabIndex].focus();
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.tabIds = this.getTabIds()),
      (this.tabpanelIds = this.getTabPanelIds()),
      (this.activeTabIndex = this.getActiveIndex());
  }
}
ie([bt], wn.prototype, "orientation", void 0),
  ie([bt], wn.prototype, "activeid", void 0),
  ie([S], wn.prototype, "tabs", void 0),
  ie([S], wn.prototype, "tabpanels", void 0),
  ie([bt({ mode: "boolean" })], wn.prototype, "activeindicator", void 0),
  ie([S], wn.prototype, "activeIndicatorRef", void 0),
  ie([S], wn.prototype, "showActiveIndicator", void 0),
  We(wn, Jt);
class kn extends Ue {}
class Cn extends zo(kn) {
  constructor() {
    super(...arguments), (this.proxy = document.createElement("textarea"));
  }
}
!(function (t) {
  (t.none = "none"),
    (t.both = "both"),
    (t.horizontal = "horizontal"),
    (t.vertical = "vertical");
})($n || ($n = {}));
class Tn extends Cn {
  constructor() {
    super(...arguments),
      (this.resize = $n.none),
      (this.cols = 20),
      (this.handleTextInput = () => {
        this.value = this.control.value;
      });
  }
  readOnlyChanged() {
    this.proxy instanceof HTMLTextAreaElement &&
      (this.proxy.readOnly = this.readOnly);
  }
  autofocusChanged() {
    this.proxy instanceof HTMLTextAreaElement &&
      (this.proxy.autofocus = this.autofocus);
  }
  listChanged() {
    this.proxy instanceof HTMLTextAreaElement &&
      this.proxy.setAttribute("list", this.list);
  }
  maxlengthChanged() {
    this.proxy instanceof HTMLTextAreaElement &&
      (this.proxy.maxLength = this.maxlength);
  }
  minlengthChanged() {
    this.proxy instanceof HTMLTextAreaElement &&
      (this.proxy.minLength = this.minlength);
  }
  spellcheckChanged() {
    this.proxy instanceof HTMLTextAreaElement &&
      (this.proxy.spellcheck = this.spellcheck);
  }
  handleChange() {
    this.$emit("change");
  }
}
ie([bt({ mode: "boolean" })], Tn.prototype, "readOnly", void 0),
  ie([bt], Tn.prototype, "resize", void 0),
  ie([bt({ mode: "boolean" })], Tn.prototype, "autofocus", void 0),
  ie([bt({ attribute: "form" })], Tn.prototype, "formId", void 0),
  ie([bt], Tn.prototype, "list", void 0),
  ie([bt({ converter: gt })], Tn.prototype, "maxlength", void 0),
  ie([bt({ converter: gt })], Tn.prototype, "minlength", void 0),
  ie([bt], Tn.prototype, "name", void 0),
  ie([bt], Tn.prototype, "placeholder", void 0),
  ie([bt({ converter: gt, mode: "fromView" })], Tn.prototype, "cols", void 0),
  ie([bt({ converter: gt, mode: "fromView" })], Tn.prototype, "rows", void 0),
  ie([bt({ mode: "boolean" })], Tn.prototype, "spellcheck", void 0),
  ie([S], Tn.prototype, "defaultSlottedNodes", void 0),
  We(Tn, Gs);
const In = Object.freeze({
  [uo.ArrowUp]: { [Ye.vertical]: -1 },
  [uo.ArrowDown]: { [Ye.vertical]: 1 },
  [uo.ArrowLeft]: { [Ye.horizontal]: { [po.ltr]: -1, [po.rtl]: 1 } },
  [uo.ArrowRight]: { [Ye.horizontal]: { [po.ltr]: 1, [po.rtl]: -1 } },
});
class Fn extends Ue {
  constructor() {
    super(...arguments),
      (this._activeIndex = 0),
      (this.direction = po.ltr),
      (this.orientation = Ye.horizontal);
  }
  get activeIndex() {
    return T.track(this, "activeIndex"), this._activeIndex;
  }
  set activeIndex(t) {
    this.$fastController.isConnected &&
      ((this._activeIndex = mo(0, this.focusableElements.length - 1, t)),
      T.notify(this, "activeIndex"));
  }
  slottedItemsChanged() {
    this.$fastController.isConnected && this.reduceFocusableElements();
  }
  clickHandler(t) {
    var e;
    const i =
      null === (e = this.focusableElements) || void 0 === e
        ? void 0
        : e.indexOf(t.target);
    return i > -1 && this.activeIndex !== i && this.setFocusedElement(i), !0;
  }
  connectedCallback() {
    super.connectedCallback(), (this.direction = Do(this));
  }
  focusinHandler(t) {
    const e = t.relatedTarget;
    e && !this.contains(e) && this.setFocusedElement();
  }
  getDirectionalIncrementer(t) {
    var e, i, o, s, n;
    return null !==
      (n =
        null !==
          (o =
            null ===
              (i =
                null === (e = In[t]) || void 0 === e
                  ? void 0
                  : e[this.orientation]) || void 0 === i
              ? void 0
              : i[this.direction]) && void 0 !== o
          ? o
          : null === (s = In[t]) || void 0 === s
          ? void 0
          : s[this.orientation]) && void 0 !== n
      ? n
      : 0;
  }
  keydownHandler(t) {
    const e = t.key;
    if (!(e in uo) || t.defaultPrevented || t.shiftKey) return !0;
    const i = this.getDirectionalIncrementer(e);
    if (!i) return !t.target.closest("[role=radiogroup]");
    const o = this.activeIndex + i;
    return (
      this.focusableElements[o] && t.preventDefault(),
      this.setFocusedElement(o),
      !0
    );
  }
  get allSlottedItems() {
    return [
      ...this.start.assignedElements(),
      ...this.slottedItems,
      ...this.end.assignedElements(),
    ];
  }
  reduceFocusableElements() {
    (this.focusableElements = this.allSlottedItems.reduce(
      Fn.reduceFocusableItems,
      []
    )),
      this.setFocusableElements();
  }
  setFocusedElement(t = this.activeIndex) {
    var e;
    (this.activeIndex = t),
      this.setFocusableElements(),
      null === (e = this.focusableElements[this.activeIndex]) ||
        void 0 === e ||
        e.focus();
  }
  static reduceFocusableItems(t, e) {
    var i, o, s, n;
    const r = "radio" === e.getAttribute("role"),
      a =
        null ===
          (o =
            null === (i = e.$fastController) || void 0 === i
              ? void 0
              : i.definition.shadowOptions) || void 0 === o
          ? void 0
          : o.delegatesFocus,
      l = Array.from(
        null !==
          (n =
            null === (s = e.shadowRoot) || void 0 === s
              ? void 0
              : s.querySelectorAll("*")) && void 0 !== n
          ? n
          : []
      ).some((t) => Rs(t));
    return Rs(e) || r || a || l
      ? (t.push(e), t)
      : e.childElementCount
      ? t.concat(Array.from(e.children).reduce(Fn.reduceFocusableItems, []))
      : t;
  }
  setFocusableElements() {
    this.$fastController.isConnected &&
      this.focusableElements.length > 0 &&
      this.focusableElements.forEach((t, e) => {
        t.tabIndex = this.activeIndex === e ? 0 : -1;
      });
  }
}
ie([S], Fn.prototype, "direction", void 0),
  ie([bt], Fn.prototype, "orientation", void 0),
  ie([S], Fn.prototype, "slottedItems", void 0),
  ie([S], Fn.prototype, "slottedLabel", void 0);
class Sn {}
ie(
  [bt({ attribute: "aria-labelledby" })],
  Sn.prototype,
  "ariaLabelledby",
  void 0
),
  ie([bt({ attribute: "aria-label" })], Sn.prototype, "ariaLabel", void 0),
  We(Sn, xo),
  We(Fn, Jt, Sn);
var Dn;
!(function (t) {
  (t.top = "top"),
    (t.right = "right"),
    (t.bottom = "bottom"),
    (t.left = "left"),
    (t.start = "start"),
    (t.end = "end");
})(Dn || (Dn = {}));
class En extends Ue {
  constructor() {
    super(...arguments),
      (this.anchor = ""),
      (this.delay = 300),
      (this.autoUpdateMode = "anchor"),
      (this.anchorElement = null),
      (this.viewportElement = null),
      (this.verticalPositioningMode = "dynamic"),
      (this.horizontalPositioningMode = "dynamic"),
      (this.horizontalInset = "true"),
      (this.verticalInset = "false"),
      (this.horizontalScaling = "anchor"),
      (this.verticalScaling = "content"),
      (this.verticalDefaultPosition = void 0),
      (this.horizontalDefaultPosition = void 0),
      (this.tooltipVisible = !1),
      (this.currentDirection = po.ltr),
      (this.delayTimer = null),
      (this.isAnchorHovered = !1),
      (this.handlePositionChange = (t) => {
        this.classList.toggle("top", "start" === this.region.verticalPosition),
          this.classList.toggle(
            "bottom",
            "end" === this.region.verticalPosition
          ),
          this.classList.toggle(
            "inset-top",
            "insetStart" === this.region.verticalPosition
          ),
          this.classList.toggle(
            "inset-bottom",
            "insetEnd" === this.region.verticalPosition
          ),
          this.classList.toggle(
            "left",
            "start" === this.region.horizontalPosition
          ),
          this.classList.toggle(
            "right",
            "end" === this.region.horizontalPosition
          ),
          this.classList.toggle(
            "inset-left",
            "insetStart" === this.region.horizontalPosition
          ),
          this.classList.toggle(
            "inset-right",
            "insetEnd" === this.region.horizontalPosition
          );
      }),
      (this.handleAnchorMouseOver = (t) => {
        this.startHoverTimer();
      }),
      (this.handleAnchorMouseOut = (t) => {
        this.isAnchorHovered &&
          ((this.isAnchorHovered = !1), this.updateTooltipVisibility()),
          this.clearDelayTimer();
      }),
      (this.startHoverTimer = () => {
        this.isAnchorHovered ||
          (this.delay > 1
            ? null === this.delayTimer &&
              (this.delayTimer = window.setTimeout(() => {
                this.startHover();
              }, this.delay))
            : this.startHover());
      }),
      (this.startHover = () => {
        (this.isAnchorHovered = !0), this.updateTooltipVisibility();
      }),
      (this.clearDelayTimer = () => {
        null !== this.delayTimer &&
          (clearTimeout(this.delayTimer), (this.delayTimer = null));
      }),
      (this.getAnchor = () => {
        const t = this.getRootNode();
        return t instanceof ShadowRoot
          ? t.getElementById(this.anchor)
          : document.getElementById(this.anchor);
      }),
      (this.handleDocumentKeydown = (t) => {
        if (!t.defaultPrevented && this.tooltipVisible)
          switch (t.keyCode) {
            case 27:
              (this.isAnchorHovered = !1),
                this.updateTooltipVisibility(),
                this.$emit("dismiss");
          }
      }),
      (this.updateTooltipVisibility = () => {
        if (!1 === this.visible) this.hideTooltip();
        else if (!0 === this.visible) this.showTooltip();
        else {
          if (this.isAnchorHovered) return void this.showTooltip();
          this.hideTooltip();
        }
      }),
      (this.showTooltip = () => {
        this.tooltipVisible ||
          ((this.currentDirection = Do(this)),
          (this.tooltipVisible = !0),
          document.addEventListener("keydown", this.handleDocumentKeydown),
          u.queueUpdate(this.setRegionProps));
      }),
      (this.hideTooltip = () => {
        this.tooltipVisible &&
          (null !== this.region &&
            void 0 !== this.region &&
            (this.region.removeEventListener(
              "positionchange",
              this.handlePositionChange
            ),
            (this.region.viewportElement = null),
            (this.region.anchorElement = null)),
          document.removeEventListener("keydown", this.handleDocumentKeydown),
          (this.tooltipVisible = !1));
      }),
      (this.setRegionProps = () => {
        this.tooltipVisible &&
          ((this.viewportElement = document.body),
          (this.region.viewportElement = this.viewportElement),
          (this.region.anchorElement = this.anchorElement),
          this.region.addEventListener(
            "positionchange",
            this.handlePositionChange
          ));
      });
  }
  visibleChanged() {
    this.$fastController.isConnected &&
      (this.updateTooltipVisibility(), this.updateLayout());
  }
  anchorChanged() {
    this.$fastController.isConnected && this.updateLayout();
  }
  positionChanged() {
    this.$fastController.isConnected && this.updateLayout();
  }
  anchorElementChanged(t) {
    if (this.$fastController.isConnected) {
      if (
        (null != t &&
          (t.removeEventListener("mouseover", this.handleAnchorMouseOver),
          t.removeEventListener("mouseout", this.handleAnchorMouseOut)),
        null !== this.anchorElement && void 0 !== this.anchorElement)
      ) {
        this.anchorElement.addEventListener(
          "mouseover",
          this.handleAnchorMouseOver,
          { passive: !0 }
        ),
          this.anchorElement.addEventListener(
            "mouseout",
            this.handleAnchorMouseOut,
            { passive: !0 }
          );
        const t = this.anchorElement.id;
        null !== this.anchorElement.parentElement &&
          this.anchorElement.parentElement
            .querySelectorAll(":hover")
            .forEach((e) => {
              e.id === t && this.startHoverTimer();
            });
      }
      null !== this.region &&
        void 0 !== this.region &&
        this.tooltipVisible &&
        (this.region.anchorElement = this.anchorElement),
        this.updateLayout();
    }
  }
  viewportElementChanged() {
    null !== this.region &&
      void 0 !== this.region &&
      (this.region.viewportElement = this.viewportElement),
      this.updateLayout();
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.anchorElement = this.getAnchor()),
      this.updateLayout(),
      this.updateTooltipVisibility();
  }
  disconnectedCallback() {
    this.hideTooltip(), this.clearDelayTimer(), super.disconnectedCallback();
  }
  updateLayout() {
    switch (this.position) {
      case Dn.top:
      case Dn.bottom:
        (this.verticalPositioningMode = "locktodefault"),
          (this.horizontalPositioningMode = "dynamic"),
          (this.verticalDefaultPosition = this.position),
          (this.horizontalDefaultPosition = void 0),
          (this.horizontalInset = "true"),
          (this.verticalInset = "false"),
          (this.horizontalScaling = "anchor"),
          (this.verticalScaling = "content");
        break;
      case Dn.right:
      case Dn.left:
      case Dn.start:
      case Dn.end:
        (this.verticalPositioningMode = "dynamic"),
          (this.horizontalPositioningMode = "locktodefault"),
          (this.verticalDefaultPosition = void 0),
          (this.horizontalDefaultPosition = this.position),
          (this.horizontalInset = "false"),
          (this.verticalInset = "true"),
          (this.horizontalScaling = "content"),
          (this.verticalScaling = "anchor");
        break;
      default:
        (this.verticalPositioningMode = "dynamic"),
          (this.horizontalPositioningMode = "dynamic"),
          (this.verticalDefaultPosition = void 0),
          (this.horizontalDefaultPosition = void 0),
          (this.horizontalInset = "true"),
          (this.verticalInset = "false"),
          (this.horizontalScaling = "anchor"),
          (this.verticalScaling = "content");
    }
  }
}
(En.DirectionAttributeName = "dir"),
  ie([bt({ mode: "boolean" })], En.prototype, "visible", void 0),
  ie([bt], En.prototype, "anchor", void 0),
  ie([bt], En.prototype, "delay", void 0),
  ie([bt], En.prototype, "position", void 0),
  ie(
    [bt({ attribute: "auto-update-mode" })],
    En.prototype,
    "autoUpdateMode",
    void 0
  ),
  ie([S], En.prototype, "anchorElement", void 0),
  ie([S], En.prototype, "viewportElement", void 0),
  ie([S], En.prototype, "verticalPositioningMode", void 0),
  ie([S], En.prototype, "horizontalPositioningMode", void 0),
  ie([S], En.prototype, "horizontalInset", void 0),
  ie([S], En.prototype, "verticalInset", void 0),
  ie([S], En.prototype, "horizontalScaling", void 0),
  ie([S], En.prototype, "verticalScaling", void 0),
  ie([S], En.prototype, "verticalDefaultPosition", void 0),
  ie([S], En.prototype, "horizontalDefaultPosition", void 0),
  ie([S], En.prototype, "tooltipVisible", void 0),
  ie([S], En.prototype, "currentDirection", void 0);
function On(t) {
  return lo(t) && "treeitem" === t.getAttribute("role");
}
class Rn extends Ue {
  constructor() {
    super(...arguments),
      (this.expanded = !1),
      (this.focusable = !1),
      (this.enabledChildTreeItems = []),
      (this.handleKeyDown = (t) => {
        if (t.target !== t.currentTarget) return !0;
        switch (t.keyCode) {
          case 37:
            t.preventDefault(), this.collapseOrFocusParent();
            break;
          case 39:
            t.preventDefault(), this.expandOrFocusFirstChild();
            break;
          case 40:
            t.preventDefault(), this.focusNextNode(1);
            break;
          case 38:
            t.preventDefault(), this.focusNextNode(-1);
            break;
          case 13:
            this.handleSelected(t);
        }
        return !0;
      }),
      (this.handleExpandCollapseButtonClick = (t) => {
        this.disabled || (t.preventDefault(), this.setExpanded(!this.expanded));
      }),
      (this.handleClick = (t) => {
        t.defaultPrevented || this.disabled || this.handleSelected(t);
      }),
      (this.isNestedItem = () => On(this.parentElement));
  }
  itemsChanged(t, e) {
    this.$fastController.isConnected &&
      (this.items.forEach((t) => {
        On(t) && (t.nested = !0);
      }),
      (this.enabledChildTreeItems = this.items.filter(
        (t) => On(t) && !t.hasAttribute("disabled")
      )));
  }
  getParentTreeNode() {
    return this.parentElement.closest("[role='tree']");
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this.getParentTreeNode();
    t &&
      (t.hasAttribute("render-collapsed-nodes") &&
        (this.renderCollapsedChildren =
          "true" === t.getAttribute("render-collapsed-nodes")),
      (this.notifier = T.getNotifier(t)),
      this.notifier.subscribe(this, "renderCollapsedNodes"));
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      this.notifier && this.notifier.unsubscribe(this, "renderCollapsedNodes");
  }
  static focusItem(t) {
    t.setAttribute("tabindex", "0"), (t.focusable = !0), t.focus();
  }
  handleChange(t, e) {
    switch (e) {
      case "renderCollapsedNodes":
        this.renderCollapsedChildren = t.renderCollapsedNodes;
    }
  }
  childItemLength() {
    const t = this.childItems.filter((t) => On(t));
    return t ? t.length : 0;
  }
  collapseOrFocusParent() {
    if (this.expanded) this.setExpanded(!1);
    else if (lo(this.parentElement)) {
      const t = this.parentElement.closest("[role='treeitem']");
      lo(t) && Rn.focusItem(t);
    }
  }
  expandOrFocusFirstChild() {
    "boolean" == typeof this.expanded &&
      (!this.expanded && this.childItemLength() > 0
        ? this.setExpanded(!0)
        : this.enabledChildTreeItems.length > 0 &&
          Rn.focusItem(this.enabledChildTreeItems[0]));
  }
  focusNextNode(t) {
    const e = this.getVisibleNodes();
    if (!e) return;
    const i = e.indexOf(this);
    if (-1 !== i) {
      let o = e[i + t];
      if (void 0 !== o)
        for (; o.hasAttribute("disabled"); ) {
          if (((o = e[i + t + (t >= 0 ? 1 : -1)]), !o)) break;
        }
      lo(o) && Rn.focusItem(o);
    }
  }
  getVisibleNodes() {
    return (function (t, e) {
      if (!lo(t)) return;
      return Array.from(t.querySelectorAll(e)).filter(
        (t) => null !== t.offsetParent
      );
    })(this.getTreeRoot(), "[role='treeitem']");
  }
  getTreeRoot() {
    return lo(this) ? this.closest("[role='tree']") : null;
  }
  handleSelected(t) {
    (this.selected = !this.selected), this.$emit("selected-change", t);
  }
  setExpanded(t) {
    (this.expanded = t), this.$emit("expanded-change", this);
  }
}
ie([bt({ mode: "boolean" })], Rn.prototype, "expanded", void 0),
  ie([bt({ mode: "boolean" })], Rn.prototype, "selected", void 0),
  ie([bt({ mode: "boolean" })], Rn.prototype, "disabled", void 0),
  ie([S], Rn.prototype, "focusable", void 0),
  ie([S], Rn.prototype, "childItems", void 0),
  ie([S], Rn.prototype, "items", void 0),
  ie([S], Rn.prototype, "nested", void 0),
  ie([S], Rn.prototype, "renderCollapsedChildren", void 0),
  We(Rn, Jt);
class Ln extends Ue {
  constructor() {
    super(...arguments),
      (this.handleBlur = (t) => {
        const { relatedTarget: e, target: i } = t;
        e instanceof HTMLElement &&
          i instanceof HTMLElement &&
          this.contains(e) &&
          i.removeAttribute("tabindex");
      }),
      (this.handleKeyDown = (t) => {
        if (!this.treeItems) return !0;
        switch (t.keyCode) {
          case 36:
            this.treeItems &&
              this.treeItems.length &&
              Rn.focusItem(this.treeItems[0]);
            break;
          case 35:
            this.treeItems &&
              this.treeItems.length &&
              Rn.focusItem(this.treeItems[this.treeItems.length - 1]);
            break;
          default:
            return !0;
        }
      }),
      (this.setItems = () => {
        const t = this.treeItems.findIndex(this.isFocusableElement);
        for (let e = 0; e < this.treeItems.length; e++)
          e !== t ||
            this.treeItems[e].hasAttribute("disabled") ||
            this.treeItems[e].setAttribute("tabindex", "0"),
            this.treeItems[e].addEventListener(
              "selected-change",
              this.handleItemSelected
            );
      }),
      (this.resetItems = () => {
        for (let t = 0; t < this.treeItems.length; t++)
          this.treeItems[t].removeEventListener(
            "selected-change",
            this.handleItemSelected
          );
      }),
      (this.handleItemSelected = (t) => {
        const e = t.target;
        e !== this.currentSelected &&
          (this.currentSelected &&
            (this.currentSelected.removeAttribute("selected"),
            (this.currentSelected.selected = !1)),
          (this.currentSelected = e));
      }),
      (this.isFocusableElement = (t) => On(t) && !this.isDisabledElement(t)),
      (this.isDisabledElement = (t) =>
        On(t) && "true" === t.getAttribute("aria-disabled"));
  }
  slottedTreeItemsChanged(t, e) {
    this.$fastController.isConnected &&
      (this.resetItems(),
      (this.treeItems = this.getVisibleNodes()),
      this.setItems(),
      this.checkForNestedItems() &&
        this.slottedTreeItems.forEach((t) => {
          On(t) && (t.nested = !0);
        }));
  }
  checkForNestedItems() {
    return this.slottedTreeItems.some(
      (t) => On(t) && t.querySelector("[role='treeitem']")
    );
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.treeItems = this.getVisibleNodes()),
      u.queueUpdate(() => {
        const t = this.treeView.querySelector("[aria-selected='true']");
        t && (this.currentSelected = t);
      });
  }
  getVisibleNodes() {
    const t = [];
    return (
      void 0 !== this.slottedTreeItems &&
        this.slottedTreeItems.forEach((e) => {
          On(e) && t.push(e);
        }),
      t
    );
  }
}
function An(t, e, i) {
  return isNaN(t) || t <= e ? e : t >= i ? i : t;
}
function Vn(t, e, i) {
  return isNaN(t) || t <= e ? 0 : t >= i ? 1 : t / (i - e);
}
function Pn(t, e, i) {
  return isNaN(t) ? e : e + t * (i - e);
}
function Hn(t) {
  return t * (Math.PI / 180);
}
function zn(t, e, i) {
  return isNaN(t) || t <= 0 ? e : t >= 1 ? i : e + t * (i - e);
}
function Mn(t, e, i) {
  if (t <= 0) return e % 360;
  if (t >= 1) return i % 360;
  const o = (e - i + 360) % 360;
  return o <= (i - e + 360) % 360
    ? (e - o * t + 360) % 360
    : (e + o * t + 360) % 360;
}
function Nn(t, e) {
  const i = Math.pow(10, e);
  return Math.round(t * i) / i;
}
ie(
  [bt({ attribute: "render-collapsed-nodes" })],
  Ln.prototype,
  "renderCollapsedNodes",
  void 0
),
  ie([S], Ln.prototype, "currentSelected", void 0),
  ie([S], Ln.prototype, "nested", void 0),
  ie([S], Ln.prototype, "slottedTreeItems", void 0);
class Bn {
  constructor(t, e, i) {
    (this.h = t), (this.s = e), (this.l = i);
  }
  static fromObject(t) {
    return !t || isNaN(t.h) || isNaN(t.s) || isNaN(t.l)
      ? null
      : new Bn(t.h, t.s, t.l);
  }
  equalValue(t) {
    return this.h === t.h && this.s === t.s && this.l === t.l;
  }
  roundToPrecision(t) {
    return new Bn(Nn(this.h, t), Nn(this.s, t), Nn(this.l, t));
  }
  toObject() {
    return { h: this.h, s: this.s, l: this.l };
  }
}
class jn {
  constructor(t, e, i) {
    (this.h = t), (this.s = e), (this.v = i);
  }
  static fromObject(t) {
    return !t || isNaN(t.h) || isNaN(t.s) || isNaN(t.v)
      ? null
      : new jn(t.h, t.s, t.v);
  }
  equalValue(t) {
    return this.h === t.h && this.s === t.s && this.v === t.v;
  }
  roundToPrecision(t) {
    return new jn(Nn(this.h, t), Nn(this.s, t), Nn(this.v, t));
  }
  toObject() {
    return { h: this.h, s: this.s, v: this.v };
  }
}
class qn {
  constructor(t, e, i) {
    (this.l = t), (this.a = e), (this.b = i);
  }
  static fromObject(t) {
    return !t || isNaN(t.l) || isNaN(t.a) || isNaN(t.b)
      ? null
      : new qn(t.l, t.a, t.b);
  }
  equalValue(t) {
    return this.l === t.l && this.a === t.a && this.b === t.b;
  }
  roundToPrecision(t) {
    return new qn(Nn(this.l, t), Nn(this.a, t), Nn(this.b, t));
  }
  toObject() {
    return { l: this.l, a: this.a, b: this.b };
  }
}
(qn.epsilon = 216 / 24389), (qn.kappa = 24389 / 27);
class _n {
  constructor(t, e, i) {
    (this.l = t), (this.c = e), (this.h = i);
  }
  static fromObject(t) {
    return !t || isNaN(t.l) || isNaN(t.c) || isNaN(t.h)
      ? null
      : new _n(t.l, t.c, t.h);
  }
  equalValue(t) {
    return this.l === t.l && this.c === t.c && this.h === t.h;
  }
  roundToPrecision(t) {
    return new _n(Nn(this.l, t), Nn(this.c, t), Nn(this.h, t));
  }
  toObject() {
    return { l: this.l, c: this.c, h: this.h };
  }
}
class Un {
  constructor(t, e, i, o) {
    (this.r = t),
      (this.g = e),
      (this.b = i),
      (this.a = "number" != typeof o || isNaN(o) ? 1 : o);
  }
  static fromObject(t) {
    return !t || isNaN(t.r) || isNaN(t.g) || isNaN(t.b)
      ? null
      : new Un(t.r, t.g, t.b, t.a);
  }
  equalValue(t) {
    return this.r === t.r && this.g === t.g && this.b === t.b && this.a === t.a;
  }
  toStringHexRGB() {
    return "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("");
  }
  toStringHexRGBA() {
    return this.toStringHexRGB() + this.formatHexValue(this.a);
  }
  toStringHexARGB() {
    return (
      "#" + [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("")
    );
  }
  toStringWebRGB() {
    return `rgb(${Math.round(Pn(this.r, 0, 255))},${Math.round(
      Pn(this.g, 0, 255)
    )},${Math.round(Pn(this.b, 0, 255))})`;
  }
  toStringWebRGBA() {
    return `rgba(${Math.round(Pn(this.r, 0, 255))},${Math.round(
      Pn(this.g, 0, 255)
    )},${Math.round(Pn(this.b, 0, 255))},${An(this.a, 0, 1)})`;
  }
  roundToPrecision(t) {
    return new Un(Nn(this.r, t), Nn(this.g, t), Nn(this.b, t), Nn(this.a, t));
  }
  clamp() {
    return new Un(
      An(this.r, 0, 1),
      An(this.g, 0, 1),
      An(this.b, 0, 1),
      An(this.a, 0, 1)
    );
  }
  toObject() {
    return { r: this.r, g: this.g, b: this.b, a: this.a };
  }
  formatHexValue(t) {
    return (function (t) {
      const e = Math.round(An(t, 0, 255)).toString(16);
      return 1 === e.length ? "0" + e : e;
    })(Pn(t, 0, 255));
  }
}
class Gn {
  constructor(t, e, i) {
    (this.x = t), (this.y = e), (this.z = i);
  }
  static fromObject(t) {
    return !t || isNaN(t.x) || isNaN(t.y) || isNaN(t.z)
      ? null
      : new Gn(t.x, t.y, t.z);
  }
  equalValue(t) {
    return this.x === t.x && this.y === t.y && this.z === t.z;
  }
  roundToPrecision(t) {
    return new Gn(Nn(this.x, t), Nn(this.y, t), Nn(this.z, t));
  }
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }
}
function Kn(t) {
  return 0.2126 * t.r + 0.7152 * t.g + 0.0722 * t.b;
}
function Wn(t) {
  function e(t) {
    return t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
  }
  return Kn(new Un(e(t.r), e(t.g), e(t.b), 1));
}
Gn.whitePoint = new Gn(0.95047, 1, 1.08883);
const Xn = (t, e) => (t + 0.05) / (e + 0.05);
function Yn(t, e) {
  const i = Wn(t),
    o = Wn(e);
  return i > o ? Xn(i, o) : Xn(o, i);
}
function Qn(t) {
  const e = Math.max(t.r, t.g, t.b),
    i = Math.min(t.r, t.g, t.b),
    o = e - i;
  let s = 0;
  0 !== o &&
    (s =
      e === t.r
        ? (((t.g - t.b) / o) % 6) * 60
        : e === t.g
        ? 60 * ((t.b - t.r) / o + 2)
        : 60 * ((t.r - t.g) / o + 4)),
    s < 0 && (s += 360);
  const n = (e + i) / 2;
  let r = 0;
  return 0 !== o && (r = o / (1 - Math.abs(2 * n - 1))), new Bn(s, r, n);
}
function Zn(t, e = 1) {
  const i = (1 - Math.abs(2 * t.l - 1)) * t.s,
    o = i * (1 - Math.abs(((t.h / 60) % 2) - 1)),
    s = t.l - i / 2;
  let n = 0,
    r = 0,
    a = 0;
  return (
    t.h < 60
      ? ((n = i), (r = o), (a = 0))
      : t.h < 120
      ? ((n = o), (r = i), (a = 0))
      : t.h < 180
      ? ((n = 0), (r = i), (a = o))
      : t.h < 240
      ? ((n = 0), (r = o), (a = i))
      : t.h < 300
      ? ((n = o), (r = 0), (a = i))
      : t.h < 360 && ((n = i), (r = 0), (a = o)),
    new Un(n + s, r + s, a + s, e)
  );
}
function Jn(t) {
  const e = Math.max(t.r, t.g, t.b),
    i = e - Math.min(t.r, t.g, t.b);
  let o = 0;
  0 !== i &&
    (o =
      e === t.r
        ? (((t.g - t.b) / i) % 6) * 60
        : e === t.g
        ? 60 * ((t.b - t.r) / i + 2)
        : 60 * ((t.r - t.g) / i + 4)),
    o < 0 && (o += 360);
  let s = 0;
  return 0 !== e && (s = i / e), new jn(o, s, e);
}
function tr(t) {
  let e = 0;
  (Math.abs(t.b) > 0.001 || Math.abs(t.a) > 0.001) &&
    (e = Math.atan2(t.b, t.a) * (180 / Math.PI)),
    e < 0 && (e += 360);
  const i = Math.sqrt(t.a * t.a + t.b * t.b);
  return new _n(t.l, i, e);
}
function er(t) {
  function e(t) {
    return t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
  }
  const i = e(t.r),
    o = e(t.g),
    s = e(t.b);
  return new Gn(
    0.4124564 * i + 0.3575761 * o + 0.1804375 * s,
    0.2126729 * i + 0.7151522 * o + 0.072175 * s,
    0.0193339 * i + 0.119192 * o + 0.9503041 * s
  );
}
function ir(t, e = 1) {
  function i(t) {
    return t <= 0.0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055;
  }
  const o = i(3.2404542 * t.x - 1.5371385 * t.y - 0.4985314 * t.z),
    s = i(-0.969266 * t.x + 1.8760108 * t.y + 0.041556 * t.z),
    n = i(0.0556434 * t.x - 0.2040259 * t.y + 1.0572252 * t.z);
  return new Un(o, s, n, e);
}
function or(t) {
  return (function (t) {
    function e(t) {
      return t > qn.epsilon ? Math.pow(t, 1 / 3) : (qn.kappa * t + 16) / 116;
    }
    const i = e(t.x / Gn.whitePoint.x),
      o = e(t.y / Gn.whitePoint.y),
      s = e(t.z / Gn.whitePoint.z);
    return new qn(116 * o - 16, 500 * (i - o), 200 * (o - s));
  })(er(t));
}
function sr(t, e = 1) {
  return ir(
    (function (t) {
      const e = (t.l + 16) / 116,
        i = e + t.a / 500,
        o = e - t.b / 200,
        s = Math.pow(i, 3),
        n = Math.pow(e, 3),
        r = Math.pow(o, 3);
      let a = 0;
      a = s > qn.epsilon ? s : (116 * i - 16) / qn.kappa;
      let l = 0;
      l = t.l > qn.epsilon * qn.kappa ? n : t.l / qn.kappa;
      let c = 0;
      return (
        (c = r > qn.epsilon ? r : (116 * o - 16) / qn.kappa),
        (a = Gn.whitePoint.x * a),
        (l = Gn.whitePoint.y * l),
        (c = Gn.whitePoint.z * c),
        new Gn(a, l, c)
      );
    })(t),
    e
  );
}
function nr(t) {
  return tr(or(t));
}
function rr(t, e = 1) {
  return sr(
    (function (t) {
      let e = 0,
        i = 0;
      return (
        0 !== t.h &&
          ((e = Math.cos(Hn(t.h)) * t.c), (i = Math.sin(Hn(t.h)) * t.c)),
        new qn(t.l, e, i)
      );
    })(t),
    e
  );
}
function ar(t, e, i = 18) {
  const o = nr(t);
  let s = o.c + e * i;
  return s < 0 && (s = 0), rr(new _n(o.l, s, o.h));
}
function lr(t, e) {
  return t * e;
}
function cr(t, e) {
  return new Un(lr(t.r, e.r), lr(t.g, e.g), lr(t.b, e.b), 1);
}
function hr(t, e) {
  return An(t < 0.5 ? 2 * e * t : 1 - 2 * (1 - e) * (1 - t), 0, 1);
}
function dr(t, e) {
  return new Un(hr(t.r, e.r), hr(t.g, e.g), hr(t.b, e.b), 1);
}
var ur, pr;
function gr(t, e, i, o) {
  if (isNaN(t) || t <= 0) return i;
  if (t >= 1) return o;
  switch (e) {
    case pr.HSL:
      return Zn(
        (function (t, e, i) {
          return isNaN(t) || t <= 0
            ? e
            : t >= 1
            ? i
            : new Bn(Mn(t, e.h, i.h), zn(t, e.s, i.s), zn(t, e.l, i.l));
        })(t, Qn(i), Qn(o))
      );
    case pr.HSV:
      return (function (t, e = 1) {
        const i = t.s * t.v,
          o = i * (1 - Math.abs(((t.h / 60) % 2) - 1)),
          s = t.v - i;
        let n = 0,
          r = 0,
          a = 0;
        return (
          t.h < 60
            ? ((n = i), (r = o), (a = 0))
            : t.h < 120
            ? ((n = o), (r = i), (a = 0))
            : t.h < 180
            ? ((n = 0), (r = i), (a = o))
            : t.h < 240
            ? ((n = 0), (r = o), (a = i))
            : t.h < 300
            ? ((n = o), (r = 0), (a = i))
            : t.h < 360 && ((n = i), (r = 0), (a = o)),
          new Un(n + s, r + s, a + s, e)
        );
      })(
        (function (t, e, i) {
          return isNaN(t) || t <= 0
            ? e
            : t >= 1
            ? i
            : new jn(Mn(t, e.h, i.h), zn(t, e.s, i.s), zn(t, e.v, i.v));
        })(t, Jn(i), Jn(o))
      );
    case pr.XYZ:
      return ir(
        (function (t, e, i) {
          return isNaN(t) || t <= 0
            ? e
            : t >= 1
            ? i
            : new Gn(zn(t, e.x, i.x), zn(t, e.y, i.y), zn(t, e.z, i.z));
        })(t, er(i), er(o))
      );
    case pr.LAB:
      return sr(
        (function (t, e, i) {
          return isNaN(t) || t <= 0
            ? e
            : t >= 1
            ? i
            : new qn(zn(t, e.l, i.l), zn(t, e.a, i.a), zn(t, e.b, i.b));
        })(t, or(i), or(o))
      );
    case pr.LCH:
      return rr(
        (function (t, e, i) {
          return isNaN(t) || t <= 0
            ? e
            : t >= 1
            ? i
            : new _n(zn(t, e.l, i.l), zn(t, e.c, i.c), Mn(t, e.h, i.h));
        })(t, nr(i), nr(o))
      );
    default:
      return (function (t, e, i) {
        return isNaN(t) || t <= 0
          ? e
          : t >= 1
          ? i
          : new Un(
              zn(t, e.r, i.r),
              zn(t, e.g, i.g),
              zn(t, e.b, i.b),
              zn(t, e.a, i.a)
            );
      })(t, i, o);
  }
}
!(function (t) {
  (t[(t.Burn = 0)] = "Burn"),
    (t[(t.Color = 1)] = "Color"),
    (t[(t.Darken = 2)] = "Darken"),
    (t[(t.Dodge = 3)] = "Dodge"),
    (t[(t.Lighten = 4)] = "Lighten"),
    (t[(t.Multiply = 5)] = "Multiply"),
    (t[(t.Overlay = 6)] = "Overlay"),
    (t[(t.Screen = 7)] = "Screen");
})(ur || (ur = {})),
  (function (t) {
    (t[(t.RGB = 0)] = "RGB"),
      (t[(t.HSL = 1)] = "HSL"),
      (t[(t.HSV = 2)] = "HSV"),
      (t[(t.XYZ = 3)] = "XYZ"),
      (t[(t.LAB = 4)] = "LAB"),
      (t[(t.LCH = 5)] = "LCH");
  })(pr || (pr = {}));
class fr {
  constructor(t) {
    if (null == t || 0 === t.length)
      throw new Error("The stops argument must be non-empty");
    this.stops = this.sortColorScaleStops(t);
  }
  static createBalancedColorScale(t) {
    if (null == t || 0 === t.length)
      throw new Error("The colors argument must be non-empty");
    const e = new Array(t.length);
    for (let i = 0; i < t.length; i++)
      0 === i
        ? (e[i] = { color: t[i], position: 0 })
        : i === t.length - 1
        ? (e[i] = { color: t[i], position: 1 })
        : (e[i] = { color: t[i], position: i * (1 / (t.length - 1)) });
    return new fr(e);
  }
  getColor(t, e = pr.RGB) {
    if (1 === this.stops.length) return this.stops[0].color;
    if (t <= 0) return this.stops[0].color;
    if (t >= 1) return this.stops[this.stops.length - 1].color;
    let i = 0;
    for (let e = 0; e < this.stops.length; e++)
      this.stops[e].position <= t && (i = e);
    let o = i + 1;
    o >= this.stops.length && (o = this.stops.length - 1);
    return gr(
      (t - this.stops[i].position) *
        (1 / (this.stops[o].position - this.stops[i].position)),
      e,
      this.stops[i].color,
      this.stops[o].color
    );
  }
  trim(t, e, i = pr.RGB) {
    if (t < 0 || e > 1 || e < t) throw new Error("Invalid bounds");
    if (t === e) return new fr([{ color: this.getColor(t, i), position: 0 }]);
    const o = [];
    for (let i = 0; i < this.stops.length; i++)
      this.stops[i].position >= t &&
        this.stops[i].position <= e &&
        o.push(this.stops[i]);
    if (0 === o.length)
      return new fr([
        { color: this.getColor(t), position: t },
        { color: this.getColor(e), position: e },
      ]);
    o[0].position !== t && o.unshift({ color: this.getColor(t), position: t }),
      o[o.length - 1].position !== e &&
        o.push({ color: this.getColor(e), position: e });
    const s = e - t,
      n = new Array(o.length);
    for (let e = 0; e < o.length; e++)
      n[e] = { color: o[e].color, position: (o[e].position - t) / s };
    return new fr(n);
  }
  findNextColor(t, e, i = !1, o = pr.RGB, s = 0.005, n = 32) {
    isNaN(t) || t <= 0 ? (t = 0) : t >= 1 && (t = 1);
    const r = this.getColor(t, o),
      a = i ? 0 : 1;
    if (Yn(r, this.getColor(a, o)) <= e) return a;
    let l = i ? 0 : t,
      c = i ? t : 0,
      h = a,
      d = 0;
    for (; d <= n; ) {
      h = Math.abs(c - l) / 2 + l;
      const t = Yn(r, this.getColor(h, o));
      if (Math.abs(t - e) <= s) return h;
      t > e ? (i ? (l = h) : (c = h)) : i ? (c = h) : (l = h), d++;
    }
    return h;
  }
  clone() {
    const t = new Array(this.stops.length);
    for (let e = 0; e < t.length; e++)
      t[e] = { color: this.stops[e].color, position: this.stops[e].position };
    return new fr(t);
  }
  sortColorScaleStops(t) {
    return t.sort((t, e) => {
      const i = t.position,
        o = e.position;
      return i < o ? -1 : i > o ? 1 : 0;
    });
  }
}
const br = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;
function mr(t) {
  const e = br.exec(t);
  if (null === e) return null;
  let i = e[1];
  if (3 === i.length) {
    const t = i.charAt(0),
      e = i.charAt(1),
      o = i.charAt(2);
    i = t.concat(t, e, e, o, o);
  }
  const o = parseInt(i, 16);
  return isNaN(o)
    ? null
    : new Un(
        Vn((16711680 & o) >>> 16, 0, 255),
        Vn((65280 & o) >>> 8, 0, 255),
        Vn(255 & o, 0, 255),
        1
      );
}
class vr {
  constructor(t) {
    (this.config = Object.assign({}, vr.defaultPaletteConfig, t)),
      (this.palette = []),
      this.updatePaletteColors();
  }
  updatePaletteGenerationValues(t) {
    let e = !1;
    for (const i in t)
      this.config[i] &&
        (this.config[i].equalValue
          ? this.config[i].equalValue(t[i]) ||
            ((this.config[i] = t[i]), (e = !0))
          : t[i] !== this.config[i] && ((this.config[i] = t[i]), (e = !0)));
    return e && this.updatePaletteColors(), e;
  }
  updatePaletteColors() {
    const t = this.generatePaletteColorScale();
    for (let e = 0; e < this.config.steps; e++)
      this.palette[e] = t.getColor(
        e / (this.config.steps - 1),
        this.config.interpolationMode
      );
  }
  generatePaletteColorScale() {
    const t = Qn(this.config.baseColor),
      e = new fr([
        { position: 0, color: this.config.scaleColorLight },
        { position: 0.5, color: this.config.baseColor },
        { position: 1, color: this.config.scaleColorDark },
      ]).trim(this.config.clipLight, 1 - this.config.clipDark);
    let i = e.getColor(0),
      o = e.getColor(1);
    if (
      (t.s >= this.config.saturationAdjustmentCutoff &&
        ((i = ar(i, this.config.saturationLight)),
        (o = ar(o, this.config.saturationDark))),
      0 !== this.config.multiplyLight)
    ) {
      const t = cr(this.config.baseColor, i);
      i = gr(this.config.multiplyLight, this.config.interpolationMode, i, t);
    }
    if (0 !== this.config.multiplyDark) {
      const t = cr(this.config.baseColor, o);
      o = gr(this.config.multiplyDark, this.config.interpolationMode, o, t);
    }
    if (0 !== this.config.overlayLight) {
      const t = dr(this.config.baseColor, i);
      i = gr(this.config.overlayLight, this.config.interpolationMode, i, t);
    }
    if (0 !== this.config.overlayDark) {
      const t = dr(this.config.baseColor, o);
      o = gr(this.config.overlayDark, this.config.interpolationMode, o, t);
    }
    return this.config.baseScalePosition
      ? this.config.baseScalePosition <= 0
        ? new fr([
            { position: 0, color: this.config.baseColor },
            { position: 1, color: o.clamp() },
          ])
        : this.config.baseScalePosition >= 1
        ? new fr([
            { position: 0, color: i.clamp() },
            { position: 1, color: this.config.baseColor },
          ])
        : new fr([
            { position: 0, color: i.clamp() },
            {
              position: this.config.baseScalePosition,
              color: this.config.baseColor,
            },
            { position: 1, color: o.clamp() },
          ])
      : new fr([
          { position: 0, color: i.clamp() },
          { position: 0.5, color: this.config.baseColor },
          { position: 1, color: o.clamp() },
        ]);
  }
}
(vr.defaultPaletteConfig = {
  baseColor: mr("#808080"),
  steps: 11,
  interpolationMode: pr.RGB,
  scaleColorLight: new Un(1, 1, 1, 1),
  scaleColorDark: new Un(0, 0, 0, 1),
  clipLight: 0.185,
  clipDark: 0.16,
  saturationAdjustmentCutoff: 0.05,
  saturationLight: 0.35,
  saturationDark: 1.25,
  overlayLight: 0,
  overlayDark: 0.25,
  multiplyLight: 0,
  multiplyDark: 0,
  baseScalePosition: 0.5,
}),
  (vr.greyscalePaletteConfig = {
    baseColor: mr("#808080"),
    steps: 11,
    interpolationMode: pr.RGB,
    scaleColorLight: new Un(1, 1, 1, 1),
    scaleColorDark: new Un(0, 0, 0, 1),
    clipLight: 0,
    clipDark: 0,
    saturationAdjustmentCutoff: 0,
    saturationLight: 0,
    saturationDark: 0,
    overlayLight: 0,
    overlayDark: 0,
    multiplyLight: 0,
    multiplyDark: 0,
    baseScalePosition: 0.5,
  }),
  vr.defaultPaletteConfig.scaleColorLight,
  vr.defaultPaletteConfig.scaleColorDark;
class yr {
  constructor(t) {
    (this.palette = []),
      (this.config = Object.assign({}, yr.defaultPaletteConfig, t)),
      this.regenPalettes();
  }
  regenPalettes() {
    let t = this.config.steps;
    (isNaN(t) || t < 3) && (t = 3);
    const e = new Un(0.14, 0.14, 0.14, 1),
      i = new vr(
        Object.assign(Object.assign({}, vr.greyscalePaletteConfig), {
          baseColor: e,
          baseScalePosition: 86 / 94,
          steps: t,
        })
      ).palette,
      o = (Kn(this.config.baseColor) + Qn(this.config.baseColor).l) / 2,
      s = this.matchRelativeLuminanceIndex(o, i) / (t - 1),
      n = this.matchRelativeLuminanceIndex(0.14, i) / (t - 1),
      r = Qn(this.config.baseColor),
      a = Zn(Bn.fromObject({ h: r.h, s: r.s, l: 0.14 })),
      l = Zn(Bn.fromObject({ h: r.h, s: r.s, l: 0.06 })),
      c = new Array(5);
    (c[0] = { position: 0, color: new Un(1, 1, 1, 1) }),
      (c[1] = { position: s, color: this.config.baseColor }),
      (c[2] = { position: n, color: a }),
      (c[3] = { position: 0.99, color: l }),
      (c[4] = { position: 1, color: new Un(0, 0, 0, 1) });
    const h = new fr(c);
    this.palette = new Array(t);
    for (let e = 0; e < t; e++) {
      const i = h.getColor(e / (t - 1), pr.RGB);
      this.palette[e] = i;
    }
  }
  matchRelativeLuminanceIndex(t, e) {
    let i = Number.MAX_VALUE,
      o = 0,
      s = 0;
    const n = e.length;
    for (; s < n; s++) {
      const n = Math.abs(Kn(e[s]) - t);
      n < i && ((i = n), (o = s));
    }
    return o;
  }
}
function xr(t, e) {
  const i = t.relativeLuminance > e.relativeLuminance ? t : e,
    o = t.relativeLuminance > e.relativeLuminance ? e : t;
  return (i.relativeLuminance + 0.05) / (o.relativeLuminance + 0.05);
}
yr.defaultPaletteConfig = { baseColor: mr("#808080"), steps: 94 };
const $r = Object.freeze({
  create: (t, e, i) => new wr(t, e, i),
  from: (t) => new wr(t.r, t.g, t.b),
});
class wr extends Un {
  constructor(t, e, i) {
    super(t, e, i, 1),
      (this.toColorString = this.toStringHexRGB),
      (this.contrast = xr.bind(null, this)),
      (this.createCSS = this.toColorString),
      (this.relativeLuminance = Wn(this));
  }
  static fromObject(t) {
    return new wr(t.r, t.g, t.b);
  }
}
const kr = (-0.1 + Math.sqrt(0.21)) / 2;
function Cr(t) {
  return t.relativeLuminance <= kr;
}
function Tr(t) {
  return Cr(t) ? -1 : 1;
}
const Ir = Object.freeze({
  create: function (t, e, i) {
    return "number" == typeof t ? Ir.from($r.create(t, e, i)) : Ir.from(t);
  },
  from: function (t) {
    return (function (t) {
      const e = {
        r: 0,
        g: 0,
        b: 0,
        toColorString: () => "",
        contrast: () => 0,
        relativeLuminance: 0,
      };
      for (const i in e) if (typeof e[i] != typeof t[i]) return !1;
      return !0;
    })(t)
      ? Fr.from(t)
      : Fr.from($r.create(t.r, t.g, t.b));
  },
});
class Fr {
  constructor(t, e) {
    (this.source = t),
      (this.swatches = e),
      (this.reversedSwatches = Object.freeze([...this.swatches].reverse())),
      (this.lastIndex = this.swatches.length - 1);
  }
  colorContrast(t, e, i, o) {
    void 0 === i && (i = this.closestIndexOf(t));
    let s = this.swatches;
    const n = this.lastIndex;
    let r = i;
    void 0 === o && (o = Tr(t));
    return (
      -1 === o && ((s = this.reversedSwatches), (r = n - r)),
      (function t(e, i, o = 0, s = e.length - 1) {
        if (s === o) return e[o];
        const n = Math.floor((s - o) / 2) + o;
        return i(e[n]) ? t(e, i, o, n) : t(e, i, n + 1, s);
      })(s, (i) => xr(t, i) >= e, r, n)
    );
  }
  get(t) {
    return this.swatches[t] || this.swatches[An(t, 0, this.lastIndex)];
  }
  closestIndexOf(t) {
    const e = this.swatches.indexOf(t);
    if (-1 !== e) return e;
    const i = this.swatches.reduce((e, i) =>
      Math.abs(i.relativeLuminance - t.relativeLuminance) <
      Math.abs(e.relativeLuminance - t.relativeLuminance)
        ? i
        : e
    );
    return this.swatches.indexOf(i);
  }
  static from(t) {
    return new Fr(
      t,
      Object.freeze(
        new yr({ baseColor: Un.fromObject(t) }).palette.map((t) => {
          const e = mr(t.toStringHexRGB());
          return $r.create(e.r, e.g, e.b);
        })
      )
    );
  }
}
const Sr = $r.create(1, 1, 1),
  Dr = $r.create(0, 0, 0),
  Er = $r.create(0.5, 0.5, 0.5),
  Or = mr("#DA1A5F"),
  Rr = $r.create(Or.r, Or.g, Or.b);
function Lr(t) {
  return $r.create(t, t, t);
}
var Ar;
function Vr(t, e, i, o, s, n) {
  return Math.max(t.closestIndexOf(Lr(e)) + i, o, s, n);
}
!(function (t) {
  (t[(t.LightMode = 1)] = "LightMode"), (t[(t.DarkMode = 0.23)] = "DarkMode");
})(Ar || (Ar = {}));
const { create: Pr } = ws,
  Hr = Pr("body-font").withDefault(
    'aktiv-grotesk, "Segoe UI", Arial, Helvetica, sans-serif'
  ),
  zr = Pr("base-height-multiplier").withDefault(10),
  Mr = Pr("base-horizontal-spacing-multiplier").withDefault(3),
  Nr = Pr("base-layer-luminance").withDefault(Ar.DarkMode),
  Br = Pr("control-corner-radius").withDefault(4),
  jr = Pr("density").withDefault(0),
  qr = Pr("design-unit").withDefault(4),
  _r = Pr("direction").withDefault(po.ltr),
  Ur = Pr("disabled-opacity").withDefault(0.3),
  Gr = Pr("stroke-width").withDefault(1),
  Kr = Pr("focus-stroke-width").withDefault(2),
  Wr = Pr("type-ramp-base-font-size").withDefault("14px"),
  Xr = Pr("type-ramp-base-line-height").withDefault("20px"),
  Yr = Pr("type-ramp-minus-1-font-size").withDefault("12px"),
  Qr = Pr("type-ramp-minus-1-line-height").withDefault("16px"),
  Zr = Pr("type-ramp-minus-2-font-size").withDefault("10px"),
  Jr = Pr("type-ramp-minus-2-line-height").withDefault("16px"),
  ta = Pr("type-ramp-plus-1-font-size").withDefault("16px"),
  ea = Pr("type-ramp-plus-1-line-height").withDefault("24px"),
  ia = Pr("type-ramp-plus-2-font-size").withDefault("20px"),
  oa = Pr("type-ramp-plus-2-line-height").withDefault("28px"),
  sa = Pr("type-ramp-plus-3-font-size").withDefault("28px"),
  na = Pr("type-ramp-plus-3-line-height").withDefault("36px"),
  ra = Pr("type-ramp-plus-4-font-size").withDefault("34px"),
  aa = Pr("type-ramp-plus-4-line-height").withDefault("44px"),
  la = Pr("type-ramp-plus-5-font-size").withDefault("46px"),
  ca = Pr("type-ramp-plus-5-line-height").withDefault("56px"),
  ha = Pr("type-ramp-plus-6-font-size").withDefault("60px"),
  da = Pr("type-ramp-plus-6-line-height").withDefault("72px"),
  ua = Pr("accent-fill-rest-delta").withDefault(0),
  pa = Pr("accent-fill-hover-delta").withDefault(4),
  ga = Pr("accent-fill-active-delta").withDefault(-5),
  fa = Pr("accent-fill-focus-delta").withDefault(0),
  ba = Pr("accent-foreground-rest-delta").withDefault(0),
  ma = Pr("accent-foreground-hover-delta").withDefault(6),
  va = Pr("accent-foreground-active-delta").withDefault(-4),
  ya = Pr("accent-foreground-focus-delta").withDefault(0),
  xa = Pr("neutral-fill-rest-delta").withDefault(7),
  $a = Pr("neutral-fill-hover-delta").withDefault(10),
  wa = Pr("neutral-fill-active-delta").withDefault(5),
  ka = Pr("neutral-fill-focus-delta").withDefault(0),
  Ca = Pr("neutral-fill-input-rest-delta").withDefault(0),
  Ta = Pr("neutral-fill-input-hover-delta").withDefault(0),
  Ia = Pr("neutral-fill-input-active-delta").withDefault(0),
  Fa = Pr("neutral-fill-input-focus-delta").withDefault(0),
  Sa = Pr("neutral-fill-stealth-rest-delta").withDefault(0),
  Da = Pr("neutral-fill-stealth-hover-delta").withDefault(5),
  Ea = Pr("neutral-fill-stealth-active-delta").withDefault(3),
  Oa = Pr("neutral-fill-stealth-focus-delta").withDefault(0),
  Ra = Pr("neutral-fill-strong-rest-delta").withDefault(0),
  La = Pr("neutral-fill-strong-hover-delta").withDefault(8),
  Aa = Pr("neutral-fill-strong-active-delta").withDefault(-5),
  Va = Pr("neutral-fill-strong-focus-delta").withDefault(0),
  Pa = Pr("neutral-fill-layer-rest-delta").withDefault(3),
  Ha = Pr("neutral-stroke-rest-delta").withDefault(25),
  za = Pr("neutral-stroke-hover-delta").withDefault(40),
  Ma = Pr("neutral-stroke-active-delta").withDefault(16),
  Na = Pr("neutral-stroke-focus-delta").withDefault(25),
  Ba = Pr("neutral-stroke-divider-rest-delta").withDefault(8),
  ja = Pr({ name: "neutral-palette", cssCustomPropertyName: null }).withDefault(
    Ir.create(Er)
  ),
  qa = Pr({ name: "accent-palette", cssCustomPropertyName: null }).withDefault(
    Ir.create(Rr)
  ),
  _a = Pr({
    name: "neutral-layer-card-container-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) => {
      return (
        (e = ja.getValueFor(t)),
        (i = Nr.getValueFor(t)),
        (o = Pa.getValueFor(t)),
        e.get(e.closestIndexOf(Lr(i)) + o)
      );
      var e, i, o;
    },
  }),
  Ua = Pr("neutral-layer-card-container").withDefault((t) =>
    _a.getValueFor(t).evaluate(t)
  ),
  Ga = Pr({
    name: "neutral-layer-floating-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) =>
      (function (t, e, i) {
        const o = t.closestIndexOf(Lr(e)) - i;
        return t.get(o - i);
      })(ja.getValueFor(t), Nr.getValueFor(t), Pa.getValueFor(t)),
  }),
  Ka = Pr("neutral-layer-floating").withDefault((t) =>
    Ga.getValueFor(t).evaluate(t)
  ),
  Wa = Pr({
    name: "neutral-layer-1-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) =>
      (function (t, e) {
        return t.get(t.closestIndexOf(Lr(e)));
      })(ja.getValueFor(t), Nr.getValueFor(t)),
  }),
  Xa = Pr("neutral-layer-1").withDefault((t) => Wa.getValueFor(t).evaluate(t)),
  Ya = Pr({
    name: "neutral-layer-2-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) => {
      return (
        (e = ja.getValueFor(t)),
        (i = Nr.getValueFor(t)),
        (o = Pa.getValueFor(t)),
        (s = xa.getValueFor(t)),
        (n = $a.getValueFor(t)),
        (r = wa.getValueFor(t)),
        e.get(Vr(e, i, o, s, n, r))
      );
      var e, i, o, s, n, r;
    },
  }),
  Qa = Pr("neutral-layer-2").withDefault((t) => Ya.getValueFor(t).evaluate(t)),
  Za = Pr({
    name: "neutral-layer-3-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) => {
      return (
        (e = ja.getValueFor(t)),
        (i = Nr.getValueFor(t)),
        (o = Pa.getValueFor(t)),
        (s = xa.getValueFor(t)),
        (n = $a.getValueFor(t)),
        (r = wa.getValueFor(t)),
        e.get(Vr(e, i, o, s, n, r) + o)
      );
      var e, i, o, s, n, r;
    },
  }),
  Ja = Pr("neutral-layer-3").withDefault((t) => Za.getValueFor(t).evaluate(t)),
  tl = Pr({
    name: "neutral-layer-4-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) => {
      return (
        (e = ja.getValueFor(t)),
        (i = Nr.getValueFor(t)),
        (o = Pa.getValueFor(t)),
        (s = xa.getValueFor(t)),
        (n = $a.getValueFor(t)),
        (r = wa.getValueFor(t)),
        e.get(Vr(e, i, o, s, n, r) + 2 * o)
      );
      var e, i, o, s, n, r;
    },
  }),
  el = Pr("neutral-layer-4").withDefault((t) => tl.getValueFor(t).evaluate(t)),
  il = Pr("fill-color").withDefault((t) => Xa.getValueFor(t));
var ol;
!(function (t) {
  (t[(t.normal = 4.5)] = "normal"), (t[(t.large = 7)] = "large");
})(ol || (ol = {}));
const sl = Pr({
    name: "accent-fill-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t, e) =>
      (function (t, e, i, o, s, n, r, a, l) {
        const c = t.source,
          h = e.closestIndexOf(i) >= Math.max(r, a, l) ? -1 : 1,
          d = t.closestIndexOf(c),
          u = d + -1 * h * o,
          p = u + h * s,
          g = u + h * n;
        return {
          rest: t.get(u),
          hover: t.get(d),
          active: t.get(p),
          focus: t.get(g),
        };
      })(
        qa.getValueFor(t),
        ja.getValueFor(t),
        e || il.getValueFor(t),
        pa.getValueFor(t),
        ga.getValueFor(t),
        fa.getValueFor(t),
        xa.getValueFor(t),
        $a.getValueFor(t),
        wa.getValueFor(t)
      ),
  }),
  nl = Pr("accent-fill-rest").withDefault(
    (t) => sl.getValueFor(t).evaluate(t).rest
  ),
  rl = Pr("accent-fill-hover").withDefault(
    (t) => sl.getValueFor(t).evaluate(t).hover
  ),
  al = Pr("accent-fill-active").withDefault(
    (t) => sl.getValueFor(t).evaluate(t).active
  ),
  ll = Pr("accent-fill-focus").withDefault(
    (t) => sl.getValueFor(t).evaluate(t).focus
  ),
  cl = (t) => (e, i) =>
    (function (t, e) {
      return t.contrast(Sr) >= e ? Sr : Dr;
    })(i || nl.getValueFor(e), t),
  hl = Pr({
    name: "foreground-on-accent-recipe",
    cssCustomPropertyName: null,
  }).withDefault({ evaluate: (t, e) => cl(ol.normal)(t, e) }),
  dl = Pr("foreground-on-accent-rest").withDefault((t) =>
    hl.getValueFor(t).evaluate(t, nl.getValueFor(t))
  ),
  ul = Pr("foreground-on-accent-hover").withDefault((t) =>
    hl.getValueFor(t).evaluate(t, rl.getValueFor(t))
  ),
  pl = Pr("foreground-on-accent-active").withDefault((t) =>
    hl.getValueFor(t).evaluate(t, al.getValueFor(t))
  ),
  gl = Pr("foreground-on-accent-focus").withDefault((t) =>
    hl.getValueFor(t).evaluate(t, ll.getValueFor(t))
  ),
  fl = Pr({
    name: "foreground-on-accent-large-recipe",
    cssCustomPropertyName: null,
  }).withDefault({ evaluate: (t, e) => cl(ol.large)(t, e) }),
  bl = Pr("foreground-on-accent-rest-large").withDefault((t) =>
    fl.getValueFor(t).evaluate(t, nl.getValueFor(t))
  ),
  ml = Pr("foreground-on-accent-hover-large").withDefault((t) =>
    fl.getValueFor(t).evaluate(t, rl.getValueFor(t))
  ),
  vl = Pr("foreground-on-accent-active-large").withDefault((t) =>
    fl.getValueFor(t).evaluate(t, al.getValueFor(t))
  ),
  yl = Pr("foreground-on-accent-focus-large").withDefault((t) =>
    fl.getValueFor(t).evaluate(t, ll.getValueFor(t))
  ),
  xl = (t) => (e, i) =>
    (function (t, e, i, o, s, n, r) {
      const a = t.source,
        l = t.closestIndexOf(a),
        c = Tr(e),
        h = l + (1 === c ? Math.min(o, s) : Math.max(c * o, c * s)),
        d = t.colorContrast(e, i, h, c),
        u = t.closestIndexOf(d),
        p = u + c * Math.abs(o - s);
      let g, f;
      return (
        (1 === c ? o < s : c * o > c * s)
          ? ((g = u), (f = p))
          : ((g = p), (f = u)),
        {
          rest: t.get(g),
          hover: t.get(f),
          active: t.get(g + c * n),
          focus: t.get(g + c * r),
        }
      );
    })(
      qa.getValueFor(e),
      i || il.getValueFor(e),
      t,
      ba.getValueFor(e),
      ma.getValueFor(e),
      va.getValueFor(e),
      ya.getValueFor(e)
    ),
  $l = Pr({
    name: "accent-foreground-recipe",
    cssCustomPropertyName: null,
  }).withDefault({ evaluate: (t, e) => xl(ol.normal)(t, e) }),
  wl = Pr("accent-foreground-rest").withDefault(
    (t) => $l.getValueFor(t).evaluate(t).rest
  ),
  kl = Pr("accent-foreground-hover").withDefault(
    (t) => $l.getValueFor(t).evaluate(t).hover
  ),
  Cl = Pr("accent-foreground-active").withDefault(
    (t) => $l.getValueFor(t).evaluate(t).active
  ),
  Tl = Pr("accent-foreground-focus").withDefault(
    (t) => $l.getValueFor(t).evaluate(t).focus
  ),
  Il = Pr({
    name: "neutral-fill-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t, e) =>
      (function (t, e, i, o, s, n) {
        const r = t.closestIndexOf(e),
          a = r >= Math.max(i, o, s, n) ? -1 : 1;
        return {
          rest: t.get(r + a * i),
          hover: t.get(r + a * o),
          active: t.get(r + a * s),
          focus: t.get(r + a * n),
        };
      })(
        ja.getValueFor(t),
        e || il.getValueFor(t),
        xa.getValueFor(t),
        $a.getValueFor(t),
        wa.getValueFor(t),
        ka.getValueFor(t)
      ),
  }),
  Fl = Pr("neutral-fill-rest").withDefault(
    (t) => Il.getValueFor(t).evaluate(t).rest
  ),
  Sl = Pr("neutral-fill-hover").withDefault(
    (t) => Il.getValueFor(t).evaluate(t).hover
  ),
  Dl = Pr("neutral-fill-active").withDefault(
    (t) => Il.getValueFor(t).evaluate(t).active
  ),
  El = Pr("neutral-fill-focus").withDefault(
    (t) => Il.getValueFor(t).evaluate(t).focus
  ),
  Ol = Pr({
    name: "neutral-fill-input-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t, e) =>
      (function (t, e, i, o, s, n) {
        const r = Tr(e),
          a = t.closestIndexOf(e);
        return {
          rest: t.get(a - r * i),
          hover: t.get(a - r * o),
          active: t.get(a - r * s),
          focus: t.get(a - r * n),
        };
      })(
        ja.getValueFor(t),
        e || il.getValueFor(t),
        Ca.getValueFor(t),
        Ta.getValueFor(t),
        Ia.getValueFor(t),
        Fa.getValueFor(t)
      ),
  }),
  Rl = Pr("neutral-fill-input-rest").withDefault(
    (t) => Ol.getValueFor(t).evaluate(t).rest
  ),
  Ll = Pr("neutral-fill-input-hover").withDefault(
    (t) => Ol.getValueFor(t).evaluate(t).hover
  ),
  Al = Pr("neutral-fill-input-active").withDefault(
    (t) => Ol.getValueFor(t).evaluate(t).active
  ),
  Vl = Pr("neutral-fill-input-focus").withDefault(
    (t) => Ol.getValueFor(t).evaluate(t).focus
  ),
  Pl = Pr({
    name: "neutral-fill-stealth-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t, e) =>
      (function (t, e, i, o, s, n, r, a, l, c) {
        const h = Math.max(i, o, s, n, r, a, l, c),
          d = t.closestIndexOf(e),
          u = d >= h ? -1 : 1;
        return {
          rest: t.get(d + u * i),
          hover: t.get(d + u * o),
          active: t.get(d + u * s),
          focus: t.get(d + u * n),
        };
      })(
        ja.getValueFor(t),
        e || il.getValueFor(t),
        Sa.getValueFor(t),
        Da.getValueFor(t),
        Ea.getValueFor(t),
        Oa.getValueFor(t),
        xa.getValueFor(t),
        $a.getValueFor(t),
        wa.getValueFor(t),
        ka.getValueFor(t)
      ),
  }),
  Hl = Pr("neutral-fill-stealth-rest").withDefault(
    (t) => Pl.getValueFor(t).evaluate(t).rest
  ),
  zl = Pr("neutral-fill-stealth-hover").withDefault(
    (t) => Pl.getValueFor(t).evaluate(t).hover
  ),
  Ml = Pr("neutral-fill-stealth-active").withDefault(
    (t) => Pl.getValueFor(t).evaluate(t).active
  ),
  Nl = Pr("neutral-fill-stealth-focus").withDefault(
    (t) => Pl.getValueFor(t).evaluate(t).focus
  ),
  Bl = Pr({
    name: "neutral-fill-strong-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t, e) =>
      (function (t, e, i, o, s, n) {
        const r = Tr(e),
          a = t.closestIndexOf(t.colorContrast(e, 4.5)),
          l = a + r * Math.abs(i - o);
        let c, h;
        return (
          (1 === r ? i < o : r * i > r * o)
            ? ((c = a), (h = l))
            : ((c = l), (h = a)),
          {
            rest: t.get(c),
            hover: t.get(h),
            active: t.get(c + r * s),
            focus: t.get(c + r * n),
          }
        );
      })(
        ja.getValueFor(t),
        e || il.getValueFor(t),
        Ra.getValueFor(t),
        La.getValueFor(t),
        Aa.getValueFor(t),
        Va.getValueFor(t)
      ),
  }),
  jl = Pr("neutral-fill-strong-rest").withDefault(
    (t) => Bl.getValueFor(t).evaluate(t).rest
  ),
  ql = Pr("neutral-fill-strong-hover").withDefault(
    (t) => Bl.getValueFor(t).evaluate(t).hover
  ),
  _l = Pr("neutral-fill-strong-active").withDefault(
    (t) => Bl.getValueFor(t).evaluate(t).active
  ),
  Ul = Pr("neutral-fill-strong-focus").withDefault(
    (t) => Bl.getValueFor(t).evaluate(t).focus
  ),
  Gl = Pr({
    name: "neutral-fill-layer-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t, e) =>
      (function (t, e, i) {
        const o = t.closestIndexOf(e);
        return t.get(o - (o < i ? -1 * i : i));
      })(ja.getValueFor(t), e || il.getValueFor(t), Pa.getValueFor(t)),
  }),
  Kl = Pr("neutral-fill-layer-rest").withDefault((t) =>
    Gl.getValueFor(t).evaluate(t)
  ),
  Wl = Pr({
    name: "focus-stroke-outer-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) => {
      return (
        (e = ja.getValueFor(t)),
        (i = il.getValueFor(t)),
        e.colorContrast(i, 3.5)
      );
      var e, i;
    },
  }),
  Xl = Pr("focus-stroke-outer").withDefault((t) =>
    Wl.getValueFor(t).evaluate(t)
  ),
  Yl = Pr({
    name: "focus-stroke-inner-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) => {
      return (
        (e = qa.getValueFor(t)),
        (i = il.getValueFor(t)),
        (o = Xl.getValueFor(t)),
        e.colorContrast(o, 3.5, e.closestIndexOf(e.source), -1 * Tr(i))
      );
      var e, i, o;
    },
  }),
  Ql = Pr("focus-stroke-inner").withDefault((t) =>
    Yl.getValueFor(t).evaluate(t)
  ),
  Zl = Pr({
    name: "neutral-foreground-hint-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) => {
      return (
        (e = ja.getValueFor(t)),
        (i = il.getValueFor(t)),
        e.colorContrast(i, 4.5)
      );
      var e, i;
    },
  }),
  Jl = Pr("neutral-foreground-hint").withDefault((t) =>
    Zl.getValueFor(t).evaluate(t)
  ),
  tc = Pr({
    name: "neutral-foreground-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) => {
      return (
        (e = ja.getValueFor(t)), (i = il.getValueFor(t)), e.colorContrast(i, 14)
      );
      var e, i;
    },
  }),
  ec = Pr("neutral-foreground-rest").withDefault((t) =>
    tc.getValueFor(t).evaluate(t)
  ),
  ic = Pr({
    name: "neutral-stroke-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t) =>
      (function (t, e, i, o, s, n) {
        const r = t.closestIndexOf(e),
          a = Tr(e),
          l = r + a * i,
          c = l + a * (o - i),
          h = l + a * (s - i),
          d = l + a * (n - i);
        return {
          rest: t.get(l),
          hover: t.get(c),
          active: t.get(h),
          focus: t.get(d),
        };
      })(
        ja.getValueFor(t),
        il.getValueFor(t),
        Ha.getValueFor(t),
        za.getValueFor(t),
        Ma.getValueFor(t),
        Na.getValueFor(t)
      ),
  }),
  oc = Pr("neutral-stroke-rest").withDefault(
    (t) => ic.getValueFor(t).evaluate(t).rest
  ),
  sc = Pr("neutral-stroke-hover").withDefault(
    (t) => ic.getValueFor(t).evaluate(t).hover
  ),
  nc = Pr("neutral-stroke-active").withDefault(
    (t) => ic.getValueFor(t).evaluate(t).active
  ),
  rc = Pr("neutral-stroke-focus").withDefault(
    (t) => ic.getValueFor(t).evaluate(t).focus
  ),
  ac = Pr({
    name: "neutral-stroke-divider-recipe",
    cssCustomPropertyName: null,
  }).withDefault({
    evaluate: (t, e) =>
      (function (t, e, i) {
        return t.get(t.closestIndexOf(e) + Tr(e) * i);
      })(ja.getValueFor(t), e || il.getValueFor(t), Ba.getValueFor(t)),
  }),
  lc = Pr("neutral-stroke-divider-rest").withDefault((t) =>
    ac.getValueFor(t).evaluate(t)
  ),
  cc = (t, e) => Dt`
        ${Fo(
          "flex"
        )} :host{box-sizing:border-box;flex-direction:column;font-family:${Hr};font-size:${Yr};line-height:${Qr};color:${ec};border-top:calc(${Gr} * 1px) solid ${lc}}`,
  hc = Ot`(${zr} + ${jr}) * ${qr}`,
  dc = (t, e) =>
    Dt`
    ${Fo(
      "flex"
    )} :host{box-sizing:border-box;font-family:${Hr};flex-direction:column;font-size:${Yr};line-height:${Qr};border-bottom:calc(${Gr} * 1px) solid ${lc}}.region{display:none;padding:calc((6 + (${qr} * 2 * ${jr})) * 1px)}.heading{display:grid;position:relative;grid-template-columns:auto 1fr auto calc(${hc} * 1px);z-index:2}.button{appearance:none;border:none;background:none;grid-column:2;grid-row:1;outline:none;padding:0 calc((6 + (${qr} * 2 * ${jr})) * 1px);text-align:left;height:calc(${hc} * 1px);color:${ec};cursor:pointer;font-family:inherit}.button:hover{color:${ec}}.button:active{color:${ec}}.button::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;z-index:1;cursor:pointer}.button:${So}::before{outline:none;border:calc(${Kr} * 1px) solid ${Xl};border-radius:calc(${Br} * 1px)}:host([expanded]) .region{display:block}.icon{display:flex;align-items:center;justify-content:center;grid-column:4;z-index:2;pointer-events:none}slot[name="expanded-icon"],slot[name="collapsed-icon"]{fill:${nl}}slot[name="collapsed-icon"]{display:flex}:host([expanded]) slot[name="collapsed-icon"]{display:none}slot[name="expanded-icon"]{display:none}:host([expanded]) slot[name="expanded-icon"]{display:flex}.start{display:flex;align-items:center;padding-inline-start:calc(${qr} * 1px);justify-content:center;grid-column:1;z-index:2}.end{display:flex;align-items:center;justify-content:center;grid-column:3;z-index:2}`.withBehaviors(
      To(Dt`
            .button:${So}::before{border-color:${go.Highlight}}:host slot[name="collapsed-icon"],:host([expanded]) slot[name="expanded-icon"]{fill:${go.ButtonText}}`)
    ),
  uc = Xe.compose({
    baseName: "accordion-item",
    template: (t, e) =>
      rt`<template class="${(t) =>
        t.expanded
          ? "expanded"
          : ""}" slot="item"><div class="heading" part="heading" role="heading" aria-level="${(
        t
      ) => t.headinglevel}"><button class="button" part="button" ${Bt(
        "expandbutton"
      )} aria-expanded="${(t) => t.expanded}" aria-controls="${(t) =>
        t.id}-panel" id="${(t) => t.id}" @click="${(t, e) =>
        t.clickHandler(
          e.event
        )}"><span class="heading"><slot name="heading" part="heading"></slot></span></button>${ee} ${te}<span class="icon" part="icon" aria-hidden="true"><slot name="expanded-icon" part="expanded-icon">${
        e.expandedIcon || ""
      }</slot><slot name="collapsed-icon" part="collapsed-icon">${
        e.collapsedIcon || ""
      }</slot><span></div><div class="region" part="region" id="${(t) =>
        t.id}-panel" role="region" aria-labelledby="${(t) =>
        t.id}"><slot></slot></div></template>`,
    styles: dc,
    collapsedIcon:
      '\n        <svg\n            width="20"\n            height="20"\n            viewBox="0 0 20 20"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                fill-rule="evenodd"\n                clip-rule="evenodd"\n                d="M16.22 3H3.78a.78.78 0 00-.78.78v12.44c0 .43.35.78.78.78h12.44c.43 0 .78-.35.78-.78V3.78a.78.78 0 00-.78-.78zM3.78 2h12.44C17.2 2 18 2.8 18 3.78v12.44c0 .98-.8 1.78-1.78 1.78H3.78C2.8 18 2 17.2 2 16.22V3.78C2 2.8 2.8 2 3.78 2zM11 9h3v2h-3v3H9v-3H6V9h3V6h2v3z"\n            />\n        </svg>\n    ',
    expandedIcon:
      '\n        <svg\n            width="20"\n            height="20"\n            viewBox="0 0 20 20"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                fill-rule="evenodd"\n                clip-rule="evenodd"\n                d="M3.78 3h12.44c.43 0 .78.35.78.78v12.44c0 .43-.35.78-.78.78H3.78a.78.78 0 01-.78-.78V3.78c0-.43.35-.78.78-.78zm12.44-1H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.78-.8 1.78-1.78V3.78C18 2.8 17.2 2 16.22 2zM14 9H6v2h8V9z"\n            />\n        </svg>\n    ',
  }),
  pc = dc,
  gc = vo.compose({
    baseName: "accordion",
    template: (t, e) =>
      rt`<template><slot name="item" part="item" ${Yt(
        "accordionItems"
      )}></slot></template>`,
    styles: cc,
  }),
  fc = cc;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function bc(t, e, i, o) {
  var s,
    n = arguments.length,
    r =
      n < 3 ? e : null === o ? (o = Object.getOwnPropertyDescriptor(e, i)) : o;
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
    r = Reflect.decorate(t, e, i, o);
  else
    for (var a = t.length - 1; a >= 0; a--)
      (s = t[a]) && (r = (n < 3 ? s(r) : n > 3 ? s(e, i, r) : s(e, i)) || r);
  return n > 3 && r && Object.defineProperty(e, i, r), r;
}
const mc =
    "box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))));",
  vc = Dt`
    ${Fo(
      "inline-flex"
    )} :host{font-family:${Hr};outline:none;font-size:${Wr};line-height:${Xr};height:calc(${hc} * 1px);min-width:calc(${hc} * 1px);background-color:${Fl};color:${ec};border-radius:calc(${Br} * 1px);fill:currentcolor;cursor:pointer}.control{background:transparent;height:inherit;flex-grow:1;box-sizing:border-box;display:inline-flex;justify-content:center;align-items:center;padding:0 calc((10 + (${qr} * 2 * ${jr})) * 1px);white-space:nowrap;outline:none;text-decoration:none;border:calc(${Gr} * 1px) solid transparent;color:inherit;border-radius:inherit;fill:inherit;cursor:inherit;font-family:inherit;font-size:inherit;line-height:inherit}:host(:hover){background-color:${Sl}}:host(:active){background-color:${Dl}}.control:${So}{border-color:${Xl};box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px) ${Xl} inset}.control::-moz-focus-inner{border:0}.start,.end{display:flex}.control.icon-only{padding:0;line-height:0}::slotted(svg){${""} width:16px;height:16px;pointer-events:none}.start{margin-inline-end:11px}.end{margin-inline-start:11px}`.withBehaviors(
    To(Dt`
            :host .control{background-color:${go.ButtonFace};border-color:${go.ButtonText};color:${go.ButtonText};fill:currentColor}:host(:hover) .control{forced-color-adjust:none;background-color:${go.Highlight};color:${go.HighlightText}}.control:${So}{forced-color-adjust:none;background-color:${go.Highlight};border-color:${go.ButtonText};box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px) ${go.ButtonText} inset;color:${go.HighlightText}}.control:hover,:host([appearance="outline"]) .control:hover{border-color:${go.ButtonText}}:host([href]) .control{border-color:${go.LinkText};color:${go.LinkText}}:host([href]) .control:hover,:host([href]) .control:${So}{forced-color-adjust:none;background:${go.ButtonFace};border-color:${go.LinkText};box-shadow:0 0 0 1px ${go.LinkText} inset;color:${go.LinkText};fill:currentColor}`)
  ),
  yc = Dt`
    :host([appearance="accent"]){background:${nl};color:${dl}}:host([appearance="accent"]:hover){background:${rl};color:${ul}}:host([appearance="accent"]:active) .control:active{background:${al};color:${pl}}:host([appearance="accent"]) .control:${So}{box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px) ${Xl} inset,0 0 0 calc((${Kr} + ${Gr}) * 1px) ${Ql} inset}`.withBehaviors(
    To(Dt`
            :host([appearance="accent"]) .control{forced-color-adjust:none;background:${go.Highlight};color:${go.HighlightText}}:host([appearance="accent"]) .control:hover,:host([appearance="accent"]:active) .control:active{background:${go.HighlightText};border-color:${go.Highlight};color:${go.Highlight}}:host([appearance="accent"]) .control:${So}{border-color:${go.Highlight};box-shadow:0 0 0 calc(${Kr} * 1px) ${go.HighlightText} inset}:host([appearance="accent"][href]) .control{background:${go.LinkText};color:${go.HighlightText}}:host([appearance="accent"][href]) .control:hover{background:${go.ButtonFace};border-color:${go.LinkText};box-shadow:none;color:${go.LinkText};fill:currentColor}:host([appearance="accent"][href]) .control:${So}{border-color:${go.LinkText};box-shadow:0 0 0 calc(${Kr} * 1px) ${go.HighlightText} inset}`)
  ),
  xc = Dt`
    :host([appearance="hypertext"]){font-size:inherit;line-height:inherit;height:auto;min-width:0;background:transparent}:host([appearance="hypertext"]) .control{display:inline;padding:0;border:none;box-shadow:none;border-radius:0;line-height:1}:host a.control:not(:link){background-color:transparent;cursor:default}:host([appearance="hypertext"]) .control:link,:host([appearance="hypertext"]) .control:visited{background:transparent;color:${wl};border-bottom:calc(${Gr} * 1px) solid ${wl}}:host([appearance="hypertext"]:hover),:host([appearance="hypertext"]) .control:hover{background:transparent;border-bottom-color:${kl}}:host([appearance="hypertext"]:active),:host([appearance="hypertext"]) .control:active{background:transparent;border-bottom-color:${Cl}}:host([appearance="hypertext"]) .control:${So}{border-bottom:calc(${Kr} * 1px) solid ${Xl};margin-bottom:calc(calc(${Gr} - ${Kr}) * 1px)}`.withBehaviors(
    To(Dt`
            :host([appearance="hypertext"]:hover){background-color:${go.ButtonFace};color:${go.ButtonText}}:host([appearance="hypertext"][href]) .control:hover,:host([appearance="hypertext"][href]) .control:active,:host([appearance="hypertext"][href]) .control:${So}{color:${go.LinkText};border-bottom-color:${go.LinkText};box-shadow:none}`)
  ),
  $c = Dt`
    :host([appearance="lightweight"]){background:transparent;color:${wl}}:host([appearance="lightweight"]) .control{padding:0;height:initial;border:none;box-shadow:none;border-radius:0}:host([appearance="lightweight"]:hover){background:transparent;color:${kl}}:host([appearance="lightweight"]:active){background:transparent;color:${Cl}}:host([appearance="lightweight"]) .content{position:relative}:host([appearance="lightweight"]) .content::before{content:"";display:block;height:calc(${Gr} * 1px);position:absolute;top:calc(1em + 4px);width:100%}:host([appearance="lightweight"]:hover) .content::before{background:${kl}}:host([appearance="lightweight"]:active) .content::before{background:${Cl}}:host([appearance="lightweight"]) .control:${So} .content::before{background:${ec};height:calc(${Kr} * 1px)}`.withBehaviors(
    To(Dt`
            :host([appearance="lightweight"]) .control:hover,:host([appearance="lightweight"]) .control:${So}{forced-color-adjust:none;background:${go.ButtonFace};color:${go.Highlight}}:host([appearance="lightweight"]) .control:hover .content::before,:host([appearance="lightweight"]) .control:${So} .content::before{background:${go.Highlight}}:host([appearance="lightweight"][href]) .control:hover,:host([appearance="lightweight"][href]) .control:${So}{background:${go.ButtonFace};box-shadow:none;color:${go.LinkText}}:host([appearance="lightweight"][href]) .control:hover .content::before,:host([appearance="lightweight"][href]) .control:${So} .content::before{background:${go.LinkText}}`)
  ),
  wc = Dt`
    :host([appearance="outline"]){background:transparent;border-color:${nl}}:host([appearance="outline"]:hover){border-color:${rl}}:host([appearance="outline"]:active){border-color:${al}}:host([appearance="outline"]) .control{border-color:inherit}:host([appearance="outline"]) .control:${So}{box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px) ${Xl} inset;border-color:${Xl}}`.withBehaviors(
    To(Dt`
            :host([appearance="outline"]) .control{border-color:${go.ButtonText}}:host([appearance="outline"]) .control:${So}{forced-color-adjust:none;background-color:${go.Highlight};border-color:${go.ButtonText};box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px) ${go.ButtonText} inset;color:${go.HighlightText};fill:currentColor}:host([appearance="outline"][href]) .control{background:${go.ButtonFace};border-color:${go.LinkText};color:${go.LinkText};fill:currentColor}:host([appearance="outline"][href]) .control:hover,:host([appearance="outline"][href]) .control:${So}{forced-color-adjust:none;border-color:${go.LinkText};box-shadow:0 0 0 1px ${go.LinkText} inset}`)
  ),
  kc = Dt`
    :host([appearance="stealth"]){background:${Hl}}:host([appearance="stealth"]:hover){background:${zl}}:host([appearance="stealth"]:active){background:${Ml}}`.withBehaviors(
    To(Dt`
            :host([appearance="stealth"]),:host([appearance="stealth"]) .control{forced-color-adjust:none;background:${go.ButtonFace};border-color:transparent;color:${go.ButtonText};fill:currentColor}:host([appearance="stealth"]:hover) .control{background:${go.Highlight};border-color:${go.Highlight};color:${go.HighlightText};fill:currentColor}:host([appearance="stealth"]:${So}) .control{background:${go.Highlight};box-shadow:0 0 0 1px ${go.Highlight};color:${go.HighlightText};fill:currentColor}:host([appearance="stealth"][href]) .control{color:${go.LinkText}}:host([appearance="stealth"][href]:hover) .control,:host([appearance="stealth"][href]:${So}) .control{background:${go.LinkText};border-color:${go.LinkText};color:${go.HighlightText};fill:currentColor}:host([appearance="stealth"][href]:${So}) .control{forced-color-adjust:none;box-shadow:0 0 0 1px ${go.LinkText}}`)
  );
class Cc {
  constructor(t, e) {
    (this.cache = new WeakMap()), (this.ltr = t), (this.rtl = e);
  }
  bind(t) {
    this.attach(t);
  }
  unbind(t) {
    const e = this.cache.get(t);
    e && _r.unsubscribe(e);
  }
  attach(t) {
    const e = this.cache.get(t) || new Tc(this.ltr, this.rtl, t),
      i = _r.getValueFor(t);
    _r.subscribe(e), e.attach(i), this.cache.set(t, e);
  }
}
class Tc {
  constructor(t, e, i) {
    (this.ltr = t), (this.rtl = e), (this.source = i), (this.attached = null);
  }
  handleChange({ target: t, token: e }) {
    this.attach(e.getValueFor(t));
  }
  attach(t) {
    this.attached !== this[t] &&
      (null !== this.attached &&
        this.source.$fastController.removeStyles(this.attached),
      (this.attached = this[t]),
      null !== this.attached &&
        this.source.$fastController.addStyles(this.attached));
  }
}
function Ic(t, e) {
  return new Io("appearance", t, e);
}
const Fc = (t, e) =>
  Dt`
        ${vc}
    `.withBehaviors(
    Ic("accent", yc),
    Ic("hypertext", xc),
    Ic("lightweight", $c),
    Ic("outline", wc),
    Ic("stealth", kc)
  );
class Sc extends $o {
  appearanceChanged(t, e) {
    t !== e && (this.classList.add(e), this.classList.remove(t));
  }
  connectedCallback() {
    super.connectedCallback(), this.appearance || (this.appearance = "neutral");
  }
  defaultSlottedContentChanged(t, e) {
    const i = this.defaultSlottedContent.filter(
      (t) => t.nodeType === Node.ELEMENT_NODE
    );
    1 === i.length && i[0] instanceof SVGElement
      ? this.control.classList.add("icon-only")
      : this.control.classList.remove("icon-only");
  }
}
bc([bt], Sc.prototype, "appearance", void 0);
const Dc = Fc,
  Ec = Sc.compose({
    baseName: "anchor",
    template: yo,
    styles: Fc,
    shadowOptions: { delegatesFocus: !0 },
  }),
  Oc = (t, e) => Dt`
    :host{contain:layout;display:block}`,
  Rc = Oo.compose({
    baseName: "anchored-region",
    template: (t, e) =>
      rt`<template class="${(t) =>
        t.initialLayoutComplete ? "loaded" : ""}">${jt(
        (t) => t.initialLayoutComplete,
        rt`<slot></slot>`
      )}</template>`,
    styles: Oc,
  }),
  Lc = Oc,
  Ac = (t, e) =>
    Dt`
        ${Fo(
          "flex"
        )} :host{position:relative;height:var(--avatar-size,var(--avatar-size-default));max-width:var(--avatar-size,var(--avatar-size-default));--avatar-size-default:calc(
                (
                        (${zr} + ${jr}) * ${qr} +
                            ((${qr} * 8) - 40)
                    ) * 1px
            );--avatar-text-size:${Wr};--avatar-text-ratio:${qr}}.link{text-decoration:none;color:${ec};display:flex;flex-direction:row;justify-content:center;align-items:center;min-width:100%}.square{border-radius:calc(${Br} * 1px);min-width:100%;overflow:hidden}.circle{border-radius:100%;min-width:100%;overflow:hidden}.backplate{position:relative;display:flex}.media,::slotted(img){max-width:100%;position:absolute;display:block}.content{font-size:calc(
                (var(--avatar-text-size) + var(--avatar-size,var(--avatar-size-default))) /
                    var(--avatar-text-ratio)
            );line-height:var(--avatar-size,var(--avatar-size-default));display:block;min-height:var(--avatar-size,var(--avatar-size-default))}::slotted(${t.tagFor(
              Lo
            )}){position:absolute;display:block}`.withBehaviors(
      new Cc(
        ((t, e) => Dt`
    ::slotted(${t.tagFor(Lo)}){right:0}`)(t),
        ((t, e) => Dt`
    ::slotted(${t.tagFor(Lo)}){left:0}`)(t)
      )
    );
class Vc extends Ro {}
bc([bt({ attribute: "src" })], Vc.prototype, "imgSrc", void 0),
  bc([bt], Vc.prototype, "alt", void 0);
const Pc = rt` ${jt(
    (t) => t.imgSrc,
    rt`<img src="${(t) => t.imgSrc}" alt="${(t) =>
      t.alt}" slot="media" class="media" part="media" />`
  )}
`,
  Hc = Vc.compose({
    baseName: "avatar",
    template: (t, e) =>
      rt`<div class="backplate ${(t) => t.shape}" part="backplate" style="${(
        t
      ) =>
        t.fill
          ? `background-color: var(--avatar-fill-${t.fill});`
          : void 0}"><a class="link" part="link" href="${(t) =>
        t.link ? t.link : void 0}" style="${(t) =>
        t.color
          ? `color: var(--avatar-color-${t.color});`
          : void 0}"><slot name="media" part="media">${
        e.media || ""
      }</slot><slot class="content" part="content"><slot></a></div><slot name="badge" part="badge"></slot>`,
    styles: Ac,
    media: Pc,
    shadowOptions: { delegatesFocus: !0 },
  }),
  zc = Ac,
  Mc = (t, e) => Dt`
        ${Fo(
          "inline-block"
        )} :host{box-sizing:border-box;font-family:${Hr};font-size:${Yr};line-height:${Qr}}.control{border-radius:calc(${Br} * 1px);padding:calc(((${qr} * 0.5) - ${Gr}) * 1px)
                calc((${qr} - ${Gr}) * 1px);color:${wl};font-weight:600;border:calc(${Gr} * 1px) solid transparent}.control[style]{font-weight:400}:host([circular]) .control{border-radius:100px;padding:0 calc(${qr} * 1px);height:calc((${hc} - (${qr} * 3)) * 1px);min-width:calc((${hc} - (${qr} * 3)) * 1px);display:flex;align-items:center;justify-content:center;box-sizing:border-box}`,
  Nc = Lo.compose({
    baseName: "badge",
    template: (t, e) =>
      rt`<template class="${(t) =>
        t.circular
          ? "circular"
          : ""}"><div class="control" part="control" style="${(t) =>
        t.generateBadgeStyle()}"><slot></slot></div></template>`,
    styles: Mc,
  }),
  Bc = Mc,
  jc = Ao.compose({
    baseName: "breadcrumb-item",
    template: (t, e) =>
      rt`<div role="listitem" class="listitem" part="listitem">${jt(
        (t) => t.href && t.href.length > 0,
        rt` ${yo()} `
      )} ${jt((t) => !t.href, rt` ${ee}<slot></slot>${te} `)} ${jt(
        (t) => t.separator,
        rt`<span class="separator" part="separator" aria-hidden="true"><slot name="separator">${
          e.separator || ""
        }</slot></span>`
      )}</div>`,
    styles: (t, e) =>
      Dt`
    ${Fo(
      "inline-flex"
    )} :host{background:transparent;box-sizing:border-box;font-family:${Hr};font-size:${Wr};fill:currentColor;line-height:${Xr};min-width:calc(${hc} * 1px);outline:none;color:${ec}}.listitem{display:flex;align-items:center;width:max-content}.separator{margin:0 6px}.control{align-items:center;box-sizing:border-box;color:${wl};cursor:pointer;display:flex;fill:inherit;outline:none;text-decoration:none;white-space:nowrap}.control:hover{color:${kl}}.control:active{color:${Cl}}.control .content{position:relative}.control .content::before{content:"";display:block;height:calc(${Gr} * 1px);left:0;position:absolute;right:0;top:calc(1em + 4px);width:100%}.control:hover .content::before{background:${kl}}.control:active .content::before{background:${Cl}}.control:${So} .content::before{background:${ec};height:calc(${Kr} * 1px)}.control:not([href]){color:${ec};cursor:default}.control:not([href]) .content::before{background:none}.start,.end{display:flex}::slotted(svg){width:16px;height:16px}.start{margin-inline-end:6px}.end{margin-inline-start:6px}`.withBehaviors(
        To(Dt`
                .control:hover .content::before,.control:${So} .content::before{background:${go.LinkText}}.start,.end{fill:${go.ButtonText}}`)
      ),
    separator: "/",
    shadowOptions: { delegatesFocus: !0 },
  }),
  qc = Vo.compose({
    baseName: "breadcrumb",
    template: (t, e) =>
      rt`<template role="navigation"><div role="list" class="list" part="list"><slot ${Yt(
        { property: "slottedBreadcrumbItems", filter: Kt() }
      )}></slot></div></template>`,
    styles: (t, e) => Dt`
    ${Fo(
      "inline-block"
    )} :host{box-sizing:border-box;font-family:${Hr};font-size:${Wr};line-height:${Xr}}.list{display:flex;flex-wrap:wrap}`,
  }),
  _c = (t, e) =>
    Dt`
        :host([disabled]),:host([disabled]:hover),:host([disabled]:active){opacity:${Ur};background-color:${Fl};cursor:${"not-allowed"}}${vc}
    `.withBehaviors(
      To(Dt`
                :host([disabled]),:host([disabled]) .control,:host([disabled]:hover),:host([disabled]:active){forced-color-adjust:none;background-color:${
                  go.ButtonFace
                };border-color:${go.GrayText};color:${
        go.GrayText
      };cursor:${"not-allowed"};opacity:1}`),
      Ic(
        "accent",
        Dt`
                :host([appearance="accent"][disabled]),:host([appearance="accent"][disabled]:hover),:host([appearance="accent"][disabled]:active){background:${nl}}${yc}
            `.withBehaviors(
          To(Dt`
                        :host([appearance="accent"][disabled]) .control,:host([appearance="accent"][disabled]) .control:hover{background:${go.ButtonFace};border-color:${go.GrayText};color:${go.GrayText}}`)
        )
      ),
      Ic(
        "lightweight",
        Dt`
                :host([appearance="lightweight"][disabled]:hover),:host([appearance="lightweight"][disabled]:active){background-color:transparent;color:${wl}}:host([appearance="lightweight"][disabled]) .content::before,:host([appearance="lightweight"][disabled]:hover) .content::before,:host([appearance="lightweight"][disabled]:active) .content::before{background:transparent}${$c}
            `.withBehaviors(
          To(Dt`
                        :host([appearance="lightweight"].disabled) .control{forced-color-adjust:none;color:${go.GrayText}}:host([appearance="lightweight"].disabled)
                            .control:hover
                            .content::before{background:none}`)
        )
      ),
      Ic(
        "outline",
        Dt`
                :host([appearance="outline"][disabled]),:host([appearance="outline"][disabled]:hover),:host([appearance="outline"][disabled]:active){background:transparent;border-color:${nl}}${wc}
            `.withBehaviors(
          To(Dt`
                        :host([appearance="outline"][disabled]) .control{border-color:${go.GrayText}}`)
        )
      ),
      Ic(
        "stealth",
        Dt`
                :host([appearance="stealth"][disabled]),:host([appearance="stealth"][disabled]:hover),:host([appearance="stealth"][disabled]:active){background:${Hl}}${kc}
            `.withBehaviors(
          To(Dt`
                        :host([appearance="stealth"][disabled]){background:${go.ButtonFace}}:host([appearance="stealth"][disabled]) .control{background:${go.ButtonFace};border-color:transparent;color:${go.GrayText}}`)
        )
      )
    );
class Uc extends Bo {
  connectedCallback() {
    super.connectedCallback(), this.appearance || (this.appearance = "neutral");
  }
  defaultSlottedContentChanged(t, e) {
    const i = this.defaultSlottedContent.filter(
      (t) => t.nodeType === Node.ELEMENT_NODE
    );
    1 === i.length && i[0] instanceof SVGElement
      ? this.control.classList.add("icon-only")
      : this.control.classList.remove("icon-only");
  }
}
bc([bt], Uc.prototype, "appearance", void 0);
const Gc = Uc.compose({
    baseName: "button",
    template: (t, e) =>
      rt`<button class="control" part="control" ?autofocus="${(t) =>
        t.autofocus}" ?disabled="${(t) => t.disabled}" form="${(t) =>
        t.formId}" formaction="${(t) => t.formaction}" formenctype="${(t) =>
        t.formenctype}" formmethod="${(t) => t.formmethod}" formnovalidate="${(
        t
      ) => t.formnovalidate}" formtarget="${(t) => t.formtarget}" name="${(t) =>
        t.name}" type="${(t) => t.type}" value="${(t) =>
        t.value}" aria-atomic="${(t) => t.ariaAtomic}" aria-busy="${(t) =>
        t.ariaBusy}" aria-controls="${(t) => t.ariaControls}" aria-current="${(
        t
      ) => t.ariaCurrent}" aria-describedBy="${(t) =>
        t.ariaDescribedby}" aria-details="${(t) =>
        t.ariaDetails}" aria-disabled="${(t) =>
        t.ariaDisabled}" aria-errormessage="${(t) =>
        t.ariaErrormessage}" aria-expanded="${(t) =>
        t.ariaExpanded}" aria-flowto="${(t) => t.ariaFlowto}" aria-haspopup="${(
        t
      ) => t.ariaHaspopup}" aria-hidden="${(t) =>
        t.ariaHidden}" aria-invalid="${(t) =>
        t.ariaInvalid}" aria-keyshortcuts="${(t) =>
        t.ariaKeyshortcuts}" aria-label="${(t) =>
        t.ariaLabel}" aria-labelledby="${(t) =>
        t.ariaLabelledby}" aria-live="${(t) => t.ariaLive}" aria-owns="${(t) =>
        t.ariaOwns}" aria-pressed="${(t) => t.ariaPressed}" aria-relevant="${(
        t
      ) => t.ariaRelevant}" aria-roledescription="${(t) =>
        t.ariaRoledescription}" ${Bt(
        "control"
      )}>${ee}<span class="content" part="content"><slot ${Yt(
        "defaultSlottedContent"
      )}></slot></span>${te}</button>`,
    styles: _c,
    shadowOptions: { delegatesFocus: !0 },
  }),
  Kc = _c,
  Wc = (t, e) =>
    Dt`
        ${Fo(
          "block"
        )} :host{--elevation:4;display:block;contain:content;height:var(--card-height,100%);width:var(--card-width,100%);box-sizing:border-box;background:${il};border-radius:calc(${Br} * 1px);${mc}}`.withBehaviors(
      To(Dt`
                :host{forced-color-adjust:none;background:${go.Canvas};box-shadow:0 0 0 1px ${go.CanvasText}}`)
    );
class Xc extends qo {
  connectedCallback() {
    super.connectedCallback();
    const t = ko(this);
    t &&
      il.setValueFor(this, (e) =>
        Gl.getValueFor(e).evaluate(e, il.getValueFor(t))
      );
  }
}
const Yc = Xc.compose({
    baseName: "card",
    template: (t, e) => rt`<slot></slot>`,
    styles: Wc,
  }),
  Qc = Wc,
  Zc = (t, e) =>
    Dt`
    ${Fo(
      "inline-flex"
    )} :host{align-items:center;outline:none;margin:calc(${qr} * 1px) 0;user-select:none}.control{position:relative;width:calc((${hc} / 2 + ${qr}) * 1px);height:calc((${hc} / 2 + ${qr}) * 1px);box-sizing:border-box;border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid ${oc};background:${Rl};outline:none;cursor:pointer}.label{font-family:${Hr};color:${ec};padding-inline-start:calc(${qr} * 2px + 2px);margin-inline-end:calc(${qr} * 2px + 2px);cursor:pointer;font-size:${Wr};line-height:${Xr}}.label__hidden{display:none;visibility:hidden}.checked-indicator{width:100%;height:100%;display:block;fill:${dl};opacity:0;pointer-events:none}.indeterminate-indicator{border-radius:calc(${Br} * 1px);background:${dl};position:absolute;top:50%;left:50%;width:50%;height:50%;transform:translate(-50%,-50%);opacity:0}:host(:not([disabled])) .control:hover{background:${Ll};border-color:${sc}}:host(:not([disabled])) .control:active{background:${Al};border-color:${nc}}:host(:${So}) .control{box-shadow:0 0 0 2px ${il},0 0 0 4px ${Xl}}:host([aria-checked="true"]) .control{background:${nl};border:calc(${Gr} * 1px) solid ${nl}}:host([aria-checked="true"]:not([disabled])) .control:hover{background:${rl};border:calc(${Gr} * 1px) solid ${rl}}:host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator{fill:${ul}}:host([aria-checked="true"]:not([disabled])) .control:hover .indeterminate-indicator{background:${ul}}:host([aria-checked="true"]:not([disabled])) .control:active{background:${al};border:calc(${Gr} * 1px) solid ${al}}:host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator{fill:${pl}}:host([aria-checked="true"]:not([disabled])) .control:active .indeterminate-indicator{background:${pl}}:host([aria-checked="true"]:${So}:not([disabled])) .control{box-shadow:0 0 0 2px ${il},0 0 0 4px ${Xl}}:host([disabled]) .label,:host([readonly]) .label,:host([readonly]) .control,:host([disabled]) .control{cursor:${"not-allowed"}}:host([aria-checked="true"]:not(.indeterminate)) .checked-indicator,:host(.indeterminate) .indeterminate-indicator{opacity:1}:host([disabled]){opacity:${Ur}}`.withBehaviors(
      To(Dt`
            .control{forced-color-adjust:none;border-color:${go.FieldText};background:${go.Field}}.checked-indicator{fill:${go.FieldText}}.indeterminate-indicator{background:${go.FieldText}}:host(:not([disabled])) .control:hover,.control:active{border-color:${go.Highlight};background:${go.Field}}:host(:${So}) .control{box-shadow:0 0 0 2px ${go.Field},0 0 0 4px ${go.FieldText}}:host([aria-checked="true"]:${So}:not([disabled])) .control{box-shadow:0 0 0 2px ${go.Field},0 0 0 4px ${go.FieldText}}:host([aria-checked="true"]) .control{background:${go.Highlight};border-color:${go.Highlight}}:host([aria-checked="true"]:not([disabled])) .control:hover,.control:active{border-color:${go.Highlight};background:${go.HighlightText}}:host([aria-checked="true"]) .checked-indicator{fill:${go.HighlightText}}:host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator{fill:${go.Highlight}}:host([aria-checked="true"]) .indeterminate-indicator{background:${go.HighlightText}}:host([aria-checked="true"]) .control:hover .indeterminate-indicator{background:${go.Highlight}}:host([disabled]){opacity:1}:host([disabled]) .control{forced-color-adjust:none;border-color:${go.GrayText};background:${go.Field}}:host([disabled]) .indeterminate-indicator,:host([aria-checked="true"][disabled]) .control:hover .indeterminate-indicator{forced-color-adjust:none;background:${go.GrayText}}:host([disabled]) .checked-indicator,:host([aria-checked="true"][disabled]) .control:hover .checked-indicator{forced-color-adjust:none;fill:${go.GrayText}}`)
    ),
  Jc = Go.compose({
    baseName: "checkbox",
    template: (t, e) =>
      rt`<template role="checkbox" aria-checked="${(t) =>
        t.checked}" aria-required="${(t) => t.required}" aria-disabled="${(t) =>
        t.disabled}" aria-readonly="${(t) => t.readOnly}" tabindex="${(t) =>
        t.disabled ? null : 0}" @keypress="${(t, e) =>
        t.keypressHandler(e.event)}" @click="${(t, e) =>
        t.clickHandler(e.event)}" class="${(t) =>
        t.readOnly ? "readonly" : ""} ${(t) => (t.checked ? "checked" : "")} ${(
        t
      ) =>
        t.indeterminate
          ? "indeterminate"
          : ""}"><div part="control" class="control"><slot name="checked-indicator">${
        e.checkedIndicator || ""
      }</slot><slot name="indeterminate-indicator">${
        e.indeterminateIndicator || ""
      }</slot></div><label part="label" class="${(t) =>
        t.defaultSlottedNodes && t.defaultSlottedNodes.length
          ? "label"
          : "label label__hidden"}"><slot ${Yt(
        "defaultSlottedNodes"
      )}></slot></label></template>`,
    styles: Zc,
    checkedIndicator:
      '\n        <svg\n            part="checked-indicator"\n            class="checked-indicator"\n            viewBox="0 0 20 20"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                fill-rule="evenodd"\n                clip-rule="evenodd"\n                d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"\n            />\n        </svg>\n    ',
    indeterminateIndicator:
      '\n        <div part="indeterminate-indicator" class="indeterminate-indicator"></div>\n    ',
  }),
  th = Zc,
  eh = (t, e) =>
    Dt`
    ${Fo(
      "inline-flex"
    )} :host{--elevation:14;background:${Rl};border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid ${nl};box-sizing:border-box;color:${ec};font-family:${Hr};height:calc(${hc} * 1px);position:relative;user-select:none;min-width:250px;outline:none;vertical-align:top}.listbox{${mc}
        background:${Ka};border:calc(${Gr} * 1px) solid ${oc};border-radius:calc(${Br} * 1px);box-sizing:border-box;display:inline-flex;flex-direction:column;left:0;max-height:calc(var(--max-height) - (${hc} * 1px));padding:calc(${qr} * 1px) 0;overflow-y:auto;position:absolute;width:100%;z-index:1}.listbox[hidden]{display:none}.control{align-items:center;box-sizing:border-box;cursor:pointer;display:flex;font-size:${Wr};font-family:inherit;line-height:${Xr};min-height:100%;padding:0 calc(${qr} * 2.25px);width:100%}:host(:not([disabled]):hover){background:${Ll};border-color:${rl}}:host(:${So}){border-color:${Xl};box-shadow:0 0 0 calc(${Kr} * 1px) ${Xl}}:host(:${So}) ::slotted([aria-selected="true"][role="option"]:not([disabled])){box-shadow:0 0 0 calc(${Kr} * 1px) inset ${Ql};border-color:${Xl};background:${ll};color:${gl}}:host([disabled]){cursor:${"not-allowed"};opacity:${Ur}}:host([disabled]) .control{cursor:${"not-allowed"};user-select:none}:host([disabled]:hover){background:${Hl};color:${ec};fill:currentcolor}:host(:not([disabled])) .control:active{background:${Al};border-color:${al};border-radius:calc(${Br} * 1px)}:host([open][position="above"]) .listbox{border-bottom-left-radius:0;border-bottom-right-radius:0}:host([open][position="below"]) .listbox{border-top-left-radius:0;border-top-right-radius:0}:host([open][position="above"]) .listbox{border-bottom:0;bottom:calc(${hc} * 1px)}:host([open][position="below"]) .listbox{border-top:0;top:calc(${hc} * 1px)}.selected-value{flex:1 1 auto;font-family:inherit;text-align:start;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.indicator{flex:0 0 auto;margin-inline-start:1em}slot[name="listbox"]{display:none;width:100%}:host([open]) slot[name="listbox"]{display:flex;position:absolute;${mc}}.end{margin-inline-start:auto}.start,.end,.indicator,.select-indicator,::slotted(svg){fill:currentcolor;height:1em;min-height:calc(${qr} * 4px);min-width:calc(${qr} * 4px);width:1em}::slotted([role="option"]),::slotted(option){flex:0 0 auto}`.withBehaviors(
      To(Dt`
            :host(:not([disabled]):hover),:host(:not([disabled]):active){border-color:${go.Highlight}}:host(:not([disabled]):${So}){background-color:${go.ButtonFace};box-shadow:0 0 0 calc(${Kr} * 1px) ${go.Highlight};color:${go.ButtonText};fill:currentcolor;forced-color-adjust:none}:host(:not([disabled]):${So}) .listbox{background:${go.ButtonFace}}:host([disabled]){border-color:${go.GrayText};background-color:${go.ButtonFace};color:${go.GrayText};fill:currentcolor;opacity:1;forced-color-adjust:none}:host([disabled]:hover){background:${go.ButtonFace}}:host([disabled]) .control{color:${go.GrayText};border-color:${go.GrayText}}:host([disabled]) .control .select-indicator{fill:${go.GrayText}}:host(:${So}) ::slotted([aria-selected="true"][role="option"]),:host(:${So}) ::slotted(option[aria-selected="true"]),:host(:${So}) ::slotted([aria-selected="true"][role="option"]:not([disabled])){background:${go.Highlight};border-color:${go.ButtonText};box-shadow:0 0 0 calc(${Kr} * 1px) inset ${go.HighlightText};color:${go.HighlightText};fill:currentcolor}.start,.end,.indicator,.select-indicator,::slotted(svg){color:${go.ButtonText};fill:currentcolor}`)
    ),
  ih = (t, e) => Dt`
    ${eh()}

    :host(:empty) .listbox{display:none}:host([disabled]) *,:host([disabled]){cursor:${"not-allowed"};user-select:none}.selected-value{-webkit-appearance:none;background:transparent;border:none;color:inherit;font-size:${Wr};line-height:${Xr};height:calc(100% - (${Gr} * 1px));margin:auto 0;width:100%}.selected-value:hover,.selected-value:${So},.selected-value:disabled,.selected-value:active{outline:none}`,
  oh = os.compose({
    baseName: "combobox",
    template: (t, e) =>
      rt`<template autocomplete="${(t) => t.autocomplete}" class="${(t) =>
        t.disabled ? "disabled" : ""} ${(t) => t.position}" tabindex="${(t) =>
        t.disabled ? null : "0"}" aria-disabled="${(t) =>
        t.ariaDisabled}" aria-autocomplete="${(t) =>
        t.autocomplete}" @click="${(t, e) =>
        t.clickHandler(e.event)}" @focusout="${(t, e) =>
        t.focusoutHandler(
          e.event
        )}"><div class="control" part="control">${ee}<slot name="control"><input class="selected-value" part="selected-value" placeholder="${(
        t
      ) => t.placeholder}" role="${(t) =>
        t.role}" type="text" aria-activedescendant="${(t) =>
        t.open ? t.ariaActiveDescendant : null}" aria-controls="${(t) =>
        t.listboxId}" aria-expanded="${(t) =>
        t.ariaExpanded}" aria-haspopup="listbox" ?disabled="${(t) =>
        t.disabled}" :value="${(t) => t.value}" @input="${(t, e) =>
        t.inputHandler(e.event)}" @keydown="${(t, e) =>
        t.keydownHandler(e.event)}" @keyup="${(t, e) =>
        t.keyupHandler(e.event)}" ${Bt(
        "control"
      )} /><div class="indicator" part="indicator" aria-hidden="true"><slot name="indicator">${
        e.indicator || ""
      }</slot></div></slot>${te}</div><div aria-disabled="${(t) =>
        t.disabled}" class="listbox" id="${(t) =>
        t.listboxId}" part="listbox" role="listbox" style="--max-height: ${(
        t
      ) => t.maxHeight}px" ?disabled="${(t) => t.disabled}" ?hidden="${(t) =>
        !t.open}"><slot ${Yt({
        filter: Jo.slottedOptionFilter,
        flatten: !0,
        property: "slottedOptions",
      })}></slot></div></template>`,
    styles: ih,
    shadowOptions: { delegatesFocus: !0 },
    indicator:
      '\n        <svg\n            class="select-indicator"\n            part="select-indicator"\n            viewBox="0 0 12 7"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"\n            />\n        </svg>\n    ',
  }),
  sh = ih,
  nh = (t, e) => Dt`
    :host{display:flex;position:relative;flex-direction:column}`,
  rh = (t, e) => Dt`
    :host{display:grid;padding:1px 0;box-sizing:border-box;width:100%;border-bottom:calc(${Gr} * 1px) solid ${lc}}:host(.header){}:host(.sticky-header){background:${Fl};position:sticky;top:0}`,
  ah = (t, e) =>
    Dt`
    :host{padding:calc(${qr} * 1px) calc(${qr} * 3px);color:${ec};box-sizing:border-box;font-family:${Hr};font-size:${Wr};line-height:${Xr};font-weight:400;border:transparent calc(${Gr} * 1px) solid;overflow:hidden;white-space:nowrap;border-radius:calc(${Br} * 1px)}:host(.column-header){font-weight:600}:host(:${So}){border:${Xl} calc(${Gr} * 1px) solid;color:${ec}}`.withBehaviors(
      To(Dt`
        :host{forced-color-adjust:none;border-color:transparent;background:${go.Field};color:${go.FieldText}}:host(:${So}){border-color:${go.FieldText};box-shadow:0 0 0 2px inset ${go.Field};color:${go.FieldText}}`)
    ),
  lh = us.compose({
    baseName: "data-grid-cell",
    template: (t, e) =>
      rt`<template tabindex="-1" role="${(t) =>
        "columnheader" === t.cellType ? "columnheader" : "gridcell"}" class="${(
        t
      ) =>
        "columnheader" === t.cellType
          ? "column-header"
          : ""}"><slot></slot></template>`,
    styles: ah,
  }),
  ch = ah,
  hh = ls.compose({
    baseName: "data-grid-row",
    template: (t, e) =>
      rt`<template role="row" class="${(t) =>
        "default" !== t.rowType
          ? t.rowType
          : ""}" :defaultCellItemTemplate="${(function (t) {
        const e = t.tagFor(us);
        return rt`<${e} grid-column="${(t, e) => e.index + 1}" :rowData="${(
          t,
          e
        ) => e.parent.rowData}" :columnDefinition="${(t) => t}"></${e}>`;
      })(t)}" :defaultHeaderCellItemTemplate="${(function (t) {
        const e = t.tagFor(us);
        return rt`<${e} cell-type="columnheader" grid-column="${(t, e) =>
          e.index + 1}" :columnDefinition="${(t) => t}"></${e}>`;
      })(t)}" ${Zt({
        property: "cellElements",
        filter: Kt('[role="cell"],[role="gridcell"],[role="columnheader"]'),
      })}><slot ${Yt("slottedCellElements")}></slot></template>`,
    styles: rh,
  }),
  dh = rh,
  uh = cs.compose({
    baseName: "data-grid",
    template: (t, e) => {
      const i = (function (t) {
          const e = t.tagFor(ls);
          return rt`<${e} :rowData="${(t) => t}" :cellItemTemplate="${(t, e) =>
            e.parent.cellItemTemplate}" :headerCellItemTemplate="${(t, e) =>
            e.parent.headerCellItemTemplate}"></${e}>`;
        })(t),
        o = t.tagFor(ls);
      return rt`<template role="grid" tabindex="0" :rowElementTag="${() =>
        o}" :defaultRowItemTemplate="${i}" ${Zt({
        property: "rowElements",
        filter: Kt("[role=row]"),
      })}><slot></slot></template>`;
    },
    styles: nh,
  }),
  ph = nh,
  gh = {
    toView(t) {
      var e;
      return null == t
        ? null
        : null === (e = t) || void 0 === e
        ? void 0
        : e.toColorString();
    },
    fromView(t) {
      if (null == t) return null;
      const e = mr(t);
      return e ? $r.create(e.r, e.g, e.b) : null;
    },
  },
  fh = Dt`
    :host{background-color:${il};color:${ec}}`.withBehaviors(
    To(Dt`
            :host{background-color:${go.ButtonFace};box-shadow:0 0 0 1px ${go.CanvasText};color:${go.ButtonText}}`)
  );
function bh(t) {
  return (e, i) => {
    e[i + "Changed"] = function (e, i) {
      null != i ? t.setValueFor(this, i) : t.deleteValueFor(this);
    };
  };
}
class mh extends Ue {
  constructor() {
    super(),
      (this.noPaint = !1),
      T.getNotifier(this).subscribe(
        { handleChange: this.noPaintChanged.bind(this) },
        "fillColor"
      );
  }
  noPaintChanged() {
    this.noPaint || void 0 === this.fillColor
      ? this.$fastController.removeStyles(fh)
      : this.$fastController.addStyles(fh);
  }
}
bc(
  [bt({ attribute: "no-paint", mode: "boolean" })],
  mh.prototype,
  "noPaint",
  void 0
),
  bc(
    [bt({ attribute: "fill-color", converter: gh }), bh(il)],
    mh.prototype,
    "fillColor",
    void 0
  ),
  bc([S, bh(ja)], mh.prototype, "neutralPalette", void 0),
  bc([S, bh(qa)], mh.prototype, "accentPalette", void 0),
  bc([bt({ converter: gt }), bh(jr)], mh.prototype, "density", void 0),
  bc(
    [bt({ attribute: "design-unit", converter: gt }), bh(qr)],
    mh.prototype,
    "designUnit",
    void 0
  ),
  bc(
    [bt({ attribute: "direction" }), bh(_r)],
    mh.prototype,
    "direction",
    void 0
  ),
  bc(
    [bt({ attribute: "base-height-multiplier", converter: gt }), bh(zr)],
    mh.prototype,
    "baseHeightMultiplier",
    void 0
  ),
  bc(
    [
      bt({ attribute: "base-horizontal-spacing-multiplier", converter: gt }),
      bh(Mr),
    ],
    mh.prototype,
    "baseHorizontalSpacingMultiplier",
    void 0
  ),
  bc(
    [bt({ attribute: "control-corner-radius", converter: gt }), bh(Br)],
    mh.prototype,
    "controlCornerRadius",
    void 0
  ),
  bc(
    [bt({ attribute: "stroke-width", converter: gt }), bh(Gr)],
    mh.prototype,
    "strokeWidth",
    void 0
  ),
  bc(
    [bt({ attribute: "focus-stroke-width", converter: gt }), bh(Kr)],
    mh.prototype,
    "focusStrokeWidth",
    void 0
  ),
  bc(
    [bt({ attribute: "disabled-opacity", converter: gt }), bh(Ur)],
    mh.prototype,
    "disabledOpacity",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-minus-2-font-size" }), bh(Zr)],
    mh.prototype,
    "typeRampMinus2FontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-minus-2-line-height" }), bh(Jr)],
    mh.prototype,
    "typeRampMinus2LineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-minus-1-font-size" }), bh(Yr)],
    mh.prototype,
    "typeRampMinus1FontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-minus-1-line-height" }), bh(Qr)],
    mh.prototype,
    "typeRampMinus1LineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-base-font-size" }), bh(Wr)],
    mh.prototype,
    "typeRampBaseFontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-base-line-height" }), bh(Xr)],
    mh.prototype,
    "typeRampBaseLineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-1-font-size" }), bh(ta)],
    mh.prototype,
    "typeRampPlus1FontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-1-line-height" }), bh(ea)],
    mh.prototype,
    "typeRampPlus1LineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-2-font-size" }), bh(ia)],
    mh.prototype,
    "typeRampPlus2FontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-2-line-height" }), bh(oa)],
    mh.prototype,
    "typeRampPlus2LineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-3-font-size" }), bh(sa)],
    mh.prototype,
    "typeRampPlus3FontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-3-line-height" }), bh(na)],
    mh.prototype,
    "typeRampPlus3LineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-4-font-size" }), bh(ra)],
    mh.prototype,
    "typeRampPlus4FontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-4-line-height" }), bh(aa)],
    mh.prototype,
    "typeRampPlus4LineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-5-font-size" }), bh(la)],
    mh.prototype,
    "typeRampPlus5FontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-5-line-height" }), bh(ca)],
    mh.prototype,
    "typeRampPlus5LineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-6-font-size" }), bh(ha)],
    mh.prototype,
    "typeRampPlus6FontSize",
    void 0
  ),
  bc(
    [bt({ attribute: "type-ramp-plus-6-line-height" }), bh(da)],
    mh.prototype,
    "typeRampPlus6LineHeight",
    void 0
  ),
  bc(
    [bt({ attribute: "accent-fill-rest-delta", converter: gt }), bh(ua)],
    mh.prototype,
    "accentFillRestDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "accent-fill-hover-delta", converter: gt }), bh(pa)],
    mh.prototype,
    "accentFillHoverDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "accent-fill-active-delta", converter: gt }), bh(ga)],
    mh.prototype,
    "accentFillActiveDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "accent-fill-focus-delta", converter: gt }), bh(fa)],
    mh.prototype,
    "accentFillFocusDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "accent-foreground-rest-delta", converter: gt }), bh(ba)],
    mh.prototype,
    "accentForegroundRestDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "accent-foreground-hover-delta", converter: gt }), bh(ma)],
    mh.prototype,
    "accentForegroundHoverDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "accent-foreground-active-delta", converter: gt }),
      bh(va),
    ],
    mh.prototype,
    "accentForegroundActiveDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "accent-foreground-focus-delta", converter: gt }), bh(ya)],
    mh.prototype,
    "accentForegroundFocusDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-fill-rest-delta", converter: gt }), bh(xa)],
    mh.prototype,
    "neutralFillRestDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-fill-hover-delta", converter: gt }), bh($a)],
    mh.prototype,
    "neutralFillHoverDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-fill-active-delta", converter: gt }), bh(wa)],
    mh.prototype,
    "neutralFillActiveDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-fill-focus-delta", converter: gt }), bh(ka)],
    mh.prototype,
    "neutralFillFocusDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-fill-input-rest-delta", converter: gt }), bh(Ca)],
    mh.prototype,
    "neutralFillInputRestDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-input-hover-delta", converter: gt }),
      bh(Ta),
    ],
    mh.prototype,
    "neutralFillInputHoverDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-input-active-delta", converter: gt }),
      bh(Ia),
    ],
    mh.prototype,
    "neutralFillInputActiveDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-input-focus-delta", converter: gt }),
      bh(Fa),
    ],
    mh.prototype,
    "neutralFillInputFocusDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-stealth-rest-delta", converter: gt }),
      bh(Sa),
    ],
    mh.prototype,
    "neutralFillStealthRestDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-stealth-hover-delta", converter: gt }),
      bh(Da),
    ],
    mh.prototype,
    "neutralFillStealthHoverDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-stealth-active-delta", converter: gt }),
      bh(Ea),
    ],
    mh.prototype,
    "neutralFillStealthActiveDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-stealth-focus-delta", converter: gt }),
      bh(Oa),
    ],
    mh.prototype,
    "neutralFillStealthFocusDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-strong-hover-delta", converter: gt }),
      bh(La),
    ],
    mh.prototype,
    "neutralFillStrongHoverDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-strong-active-delta", converter: gt }),
      bh(Aa),
    ],
    mh.prototype,
    "neutralFillStrongActiveDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-fill-strong-focus-delta", converter: gt }),
      bh(Va),
    ],
    mh.prototype,
    "neutralFillStrongFocusDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "base-layer-luminance", converter: gt }), bh(Nr)],
    mh.prototype,
    "baseLayerLuminance",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-fill-layer-rest-delta", converter: gt }), bh(Pa)],
    mh.prototype,
    "neutralFillLayerRestDelta",
    void 0
  ),
  bc(
    [
      bt({ attribute: "neutral-stroke-divider-rest-delta", converter: gt }),
      bh(Ba),
    ],
    mh.prototype,
    "neutralStrokeDividerRestDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-stroke-rest-delta", converter: gt }), bh(Ha)],
    mh.prototype,
    "neutralStrokeRestDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-stroke-hover-delta", converter: gt }), bh(za)],
    mh.prototype,
    "neutralStrokeHoverDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-stroke-active-delta", converter: gt }), bh(Ma)],
    mh.prototype,
    "neutralStrokeActiveDelta",
    void 0
  ),
  bc(
    [bt({ attribute: "neutral-stroke-focus-delta", converter: gt }), bh(Na)],
    mh.prototype,
    "neutralStrokeFocusDelta",
    void 0
  );
const vh = (t, e) => rt`<slot></slot>`,
  yh = (t, e) => Dt`
    ${Fo("block")}
`,
  xh = mh.compose({
    baseName: "design-system-provider",
    template: vh,
    styles: yh,
  }),
  $h = (t, e) => Dt`
    :host([hidden]){display:none}:host{--elevation:14;--dialog-height:480px;--dialog-width:640px;display:block}.overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);touch-action:none}.positioning-region{display:flex;justify-content:center;position:fixed;top:0;bottom:0;left:0;right:0;overflow:auto}.control{${mc}
        margin-top:auto;margin-bottom:auto;width:var(--dialog-width);height:var(--dialog-height);background-color:${il};z-index:1;border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid transparent}`,
  wh = Ls.compose({
    baseName: "dialog",
    template: (t, e) =>
      rt`<div class="positioning-region" part="positioning-region">${jt(
        (t) => t.modal,
        rt`<div class="overlay" part="overlay" role="presentation" @click="${(
          t
        ) => t.dismiss()}"></div>`
      )}<div role="dialog" tabindex="-1" class="control" part="control" aria-modal="${(
        t
      ) => t.modal}" aria-describedby="${(t) =>
        t.ariaDescribedby}" aria-labelledby="${(t) =>
        t.ariaLabelledby}" aria-label="${(t) => t.ariaLabel}" ${Bt(
        "dialog"
      )}><slot></slot></div></div>`,
    styles: $h,
  }),
  kh = $h,
  Ch = (t, e) => Dt`
    .disclosure{transition:height 0.35s}.disclosure .invoker::-webkit-details-marker{display:none}.disclosure .invoker{list-style-type:none}:host([appearance="accent"]) .invoker{background:${nl};color:${dl};font-family:${Hr};font-size:${Wr};border-radius:calc(${Br} * 1px);outline:none;cursor:pointer;margin:16px 0;padding:12px;max-width:max-content}:host([appearance="accent"]) .invoker:active{background:${al};color:${pl}}:host([appearance="accent"]) .invoker:hover{background:${rl};color:${ul}}:host([appearance="lightweight"]) .invoker{background:transparent;color:${wl};border-bottom:calc(${Gr} * 1px) solid ${wl};cursor:pointer;width:max-content;margin:16px 0}:host([appearance="lightweight"]) .invoker:active{border-bottom-color:${Cl}}:host([appearance="lightweight"]) .invoker:hover{border-bottom-color:${kl}}.disclosure[open] .invoker ~ *{animation:fadeIn 0.5s ease-in-out}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}`;
class Th extends As {
  appearanceChanged(t, e) {
    t !== e && (this.classList.add(e), this.classList.remove(t));
  }
  onToggle() {
    super.onToggle(),
      this.details.style.setProperty("height", this.disclosureHeight + "px");
  }
  setup() {
    super.setup(), this.appearance || (this.appearance = "accent");
    const t = () => this.details.getBoundingClientRect().height;
    this.show(),
      (this.totalHeight = t()),
      this.hide(),
      (this.height = t()),
      this.expanded && this.show();
  }
  get disclosureHeight() {
    return this.expanded ? this.totalHeight : this.height;
  }
}
bc([bt], Th.prototype, "appearance", void 0);
const Ih = Ch,
  Fh = Th.compose({
    baseName: "disclosure",
    template: (t, e) =>
      rt`<details class="disclosure" ${Bt(
        "details"
      )}><summary class="invoker" role="button" aria-controls="disclosure-content" aria-expanded="${(
        t
      ) => t.expanded}"><slot name="start"></slot><slot name="title">${(t) =>
        t.title}</slot><slot name="end"></slot></summary><div id="disclosure-content"><slot></slot></div></details>`,
    styles: Ch,
  }),
  Sh = (t, e) => Dt`
        ${Fo(
          "block"
        )} :host{box-sizing:content-box;height:0;margin:calc(${qr} * 1px) 0;border:none;border-top:calc(${Gr} * 1px) solid ${lc}}`,
  Dh = Hs.compose({
    baseName: "divider",
    template: (t, e) => rt`<template role="${(t) => t.role}"></template>`,
    styles: Sh,
  }),
  Eh = Sh,
  Oh = (t, e) =>
    Dt`
    ${Fo(
      "inline-flex"
    )} :host{width:calc(${hc} * 1px);height:calc(${hc} * 1px);justify-content:center;align-items:center;margin:0;position:relative;fill:currentcolor;color:${dl};background:transparent;outline:none;border:none;padding:0}:host::before{content:"";background:${nl};border:calc(${Gr} * 1px) solid ${nl};border-radius:50%;position:absolute;top:0;right:0;left:0;bottom:0;transition:all 0.1s ease-in-out}.next,.previous{position:relative;width:16px;height:16px;display:grid}:host([disabled]){opacity:${Ur};cursor:${"not-allowed"};fill:currentcolor;color:${ec}}:host([disabled])::before,:host([disabled]:hover)::before,:host([disabled]:active)::before{background:${Hl};border-color:${oc}}:host(:hover){color:${ul}}:host(:hover)::before{background:${rl};border-color:${rl}}:host(:active){color:${pl}}:host(:active)::before{background:${al};border-color:${al}}:host(:${So}){outline:none}:host(:${So})::before{box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px) ${Xl} inset,0 0 0 calc((${Kr} + ${Gr}) * 1px) ${Ql} inset;border-color:${Xl}}:host::-moz-focus-inner{border:0}`.withBehaviors(
      To(Dt`
            :host{background:${go.Canvas}}:host .next,:host .previous{color:${go.ButtonText};fill:currentcolor}:host::before{background:${go.Canvas};border-color:${go.ButtonText}}:host(:hover)::before{forced-color-adjust:none;background:${go.Highlight};border-color:${go.ButtonText};opacity:1}:host(:hover) .next,:host(:hover) .previous{forced-color-adjust:none;color:${go.HighlightText};fill:currentcolor}:host([disabled]){opacity:1}:host([disabled])::before,:host([disabled]:hover)::before,:host([disabled]) .next,:host([disabled]) .previous{forced-color-adjust:none;background:${go.Canvas};border-color:${go.GrayText};color:${go.GrayText};fill:${go.GrayText}}:host(:${So})::before{forced-color-adjust:none;border-color:${go.Highlight};box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px) ${go.Highlight} inset}`)
    ),
  Rh = zs.compose({
    baseName: "flipper",
    template: (t, e) =>
      rt`<template role="button" aria-disabled="${(t) =>
        !!t.disabled || void 0}" tabindex="${(t) =>
        t.hiddenFromAT ? -1 : 0}" class="${(t) => t.direction} ${(t) =>
        t.disabled ? "disabled" : ""}" @keyup="${(t, e) =>
        t.keyupHandler(e.event)}">${jt(
        (t) => t.direction === Ps.next,
        rt`<span part="next" class="next"><slot name="next">${
          e.next || ""
        }</slot></span>`
      )} ${jt(
        (t) => t.direction === Ps.previous,
        rt`<span part="previous" class="previous"><slot name="previous">${
          e.previous || ""
        }</slot></span>`
      )}</template>`,
    styles: Oh,
    next: '\n        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n            <path\n                d="M4.023 15.273L11.29 8 4.023.727l.704-.704L12.71 8l-7.984 7.977-.704-.704z"\n            />\n        </svg>\n    ',
    previous:
      '\n        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n            <path\n                d="M11.273 15.977L3.29 8 11.273.023l.704.704L4.71 8l7.266 7.273-.704.704z"\n            />\n        </svg>\n    ',
  }),
  Lh = Oh,
  Ah = Dt`
    .scroll-prev{right:auto;left:0}.scroll.scroll-next::before,.scroll-next .scroll-action{left:auto;right:0}.scroll.scroll-next::before{background:linear-gradient(to right,transparent,var(--scroll-fade-next))}.scroll-next .scroll-action{transform:translate(50%,-50%)}`,
  Vh = Dt`
    .scroll.scroll-next{right:auto;left:0}.scroll.scroll-next::before{background:linear-gradient(to right,var(--scroll-fade-next),transparent);left:auto;right:0}.scroll.scroll-prev::before{background:linear-gradient(to right,transparent,var(--scroll-fade-previous))}.scroll-prev .scroll-action{left:auto;right:0;transform:translate(50%,-50%)}`,
  Ph = Dt`
    .scroll-area{position:relative}div.scroll-view{overflow-x:hidden}.scroll{bottom:0;pointer-events:none;position:absolute;right:0;top:0;user-select:none;width:100px}.scroll.disabled{display:none}.scroll::before,.scroll-action{left:0;position:absolute}.scroll::before{background:linear-gradient(to right,var(--scroll-fade-previous),transparent);content:"";display:block;height:100%;width:100%}.scroll-action{pointer-events:auto;right:auto;top:50%;transform:translate(-50%,-50%)}`.withBehaviors(
    new Cc(Ah, Vh)
  );
class Hh extends en {
  connectedCallback() {
    super.connectedCallback(),
      "mobile" !== this.view && this.$fastController.addStyles(Ph);
  }
}
const zh = Hh.compose({
    baseName: "horizontal-scroll",
    template: (t, e) => {
      var i, o;
      return rt`<template class="horizontal-scroll" @keyup="${(t, e) =>
        t.keyupHandler(
          e.event
        )}">${ee}<div class="scroll-area"><div class="scroll-view" @scroll="${(
        t
      ) => t.scrolled()}" ${Bt(
        "scrollContainer"
      )}><div class="content-container"><slot ${Yt({
        property: "scrollItems",
        filter: Kt(),
      })}></slot></div></div>${jt(
        (t) => "mobile" !== t.view,
        rt`<div class="scroll scroll-prev" part="scroll-prev" ${Bt(
          "previousFlipperContainer"
        )}><div class="scroll-action"><slot name="previous-flipper">${
          e.previousFlipper instanceof Function
            ? e.previousFlipper(t, e)
            : null !== (i = e.previousFlipper) && void 0 !== i
            ? i
            : ""
        }</slot></div></div><div class="scroll scroll-next" part="scroll-next" ${Bt(
          "nextFlipperContainer"
        )}><div class="scroll-action"><slot name="next-flipper">${
          e.nextFlipper instanceof Function
            ? e.nextFlipper(t, e)
            : null !== (o = e.nextFlipper) && void 0 !== o
            ? o
            : ""
        }</slot></div></div>`
      )}</div>${te}</template>`;
    },
    styles: (t, e) => Dt`
    ${Fo(
      "block"
    )} :host{--scroll-align:center;--scroll-item-spacing:5px;contain:layout;position:relative}.scroll-view{overflow-x:auto;scrollbar-width:none}::-webkit-scrollbar{display:none}.content-container{align-items:var(--scroll-align);display:inline-flex;flex-wrap:nowrap;position:relative}.content-container ::slotted(*){margin-right:var(--scroll-item-spacing)}.content-container ::slotted(*:last-child){margin-right:0}`,
    nextFlipper: (t) =>
      rt`<${t.tagFor(zs)} @click="${(t) => t.scrollToNext()}" aria-hidden="${(
        t
      ) => t.flippersHiddenFromAT}"></${t.tagFor(zs)}>`,
    previousFlipper: (t) =>
      rt`<${t.tagFor(zs)} @click="${(t) =>
        t.scrollToPrevious()}" direction="previous" aria-hidden="${(t) =>
        t.flippersHiddenFromAT}"></${t.tagFor(zs)}>`,
  }),
  Mh = (t, e) =>
    Dt`
    ${Fo(
      "inline-flex"
    )} :host{align-items:center;font-family:${Hr};border-radius:calc(${Br} * 1px);border:calc(${Kr} * 1px) solid transparent;box-sizing:border-box;color:${ec};cursor:pointer;fill:currentcolor;font-size:${Wr};height:calc(${hc} * 1px);line-height:${Xr};margin:0 calc(${qr} * 1px);outline:none;overflow:hidden;padding:0 calc(${qr} * 2.25px);user-select:none;white-space:nowrap}:host(:${So}){box-shadow:0 0 0 calc(${Kr} * 1px) inset ${Ql};border-color:${Xl};background:${ll};color:${gl}}:host([aria-selected="true"]){background:${nl};color:${dl}}:host(:hover){background:${rl};color:${ul}}:host(:active){background:${al};color:${pl}}:host(:not([aria-selected="true"]):hover){background:${Sl};color:${ec}}:host(:not([aria-selected="true"]):active){background:${Sl};color:${ec}}:host([disabled]){cursor:${"not-allowed"};opacity:${Ur}}:host([disabled]:hover){background-color:inherit}.content{grid-column-start:2;justify-self:start;overflow:hidden;text-overflow:ellipsis}.start,.end,::slotted(svg){display:flex}::slotted(svg){height:calc(${qr} * 4px);width:calc(${qr} * 4px)}::slotted([slot="end"]){margin-inline-start:1ch}::slotted([slot="start"]){margin-inline-end:1ch}`.withBehaviors(
      To(Dt`
                :host{border-color:transparent;forced-color-adjust:none;color:${go.ButtonText};fill:currentcolor}:host(:not([aria-selected="true"]):hover),:host([aria-selected="true"]){background:${go.Highlight};color:${go.HighlightText}}:host([disabled]),:host([disabled]:not([aria-selected="true"]):hover){background:${go.Canvas};color:${go.GrayText};fill:currentcolor;opacity:1}`)
    ),
  Nh = Zo.compose({
    baseName: "option",
    template: (t, e) =>
      rt`<template aria-selected="${(t) => t.selected}" class="${(t) =>
        t.selected ? "selected" : ""} ${(t) =>
        t.disabled
          ? "disabled"
          : ""}" role="option">${ee}<span class="content" part="content"><slot></slot></span>${te}</template>`,
    styles: Mh,
  }),
  Bh = Mh,
  jh = (t, e) =>
    Dt`
        ${Fo(
          "inline-flex"
        )} :host{background:${Ka};border:calc(${Gr} * 1px) solid ${oc};border-radius:calc(${Br} * 1px);box-sizing:border-box;flex-direction:column;padding:calc(${qr} * 1px) 0}:host(:focus-within:not([disabled])){border-color:${Xl};box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px)
                ${Xl} inset}`.withBehaviors(
      To(Dt`
            :host(:${So}) ::slotted([aria-selected="true"][role="option"]){background:${go.Highlight};border-color:${go.ButtonText};box-shadow:0 0 0 calc(${Kr} * 1px) inset ${go.HighlightText};color:${go.HighlightText};fill:currentcolor}:host(:${So}) ::slotted([aria-selected="true"][role="option"]){background:${go.Highlight};border-color:${go.ButtonText};box-shadow:0 0 0 calc(${Kr} * 1px) inset ${go.HighlightText};color:${go.HighlightText};fill:currentcolor}`)
    ),
  qh = Jo.compose({
    baseName: "listbox",
    template: (t, e) =>
      rt`<template aria-activedescendant="${(t) =>
        t.ariaActiveDescendant}" class="listbox" role="${(t) =>
        t.role}" tabindex="${(t) => (t.disabled ? null : "0")}" @click="${(
        t,
        e
      ) => t.clickHandler(e.event)}" @focusin="${(t, e) =>
        t.focusinHandler(e.event)}" @keydown="${(t, e) =>
        t.keydownHandler(e.event)}" @mousedown="${(t, e) =>
        t.mousedownHandler(e.event)}"><slot ${Yt({
        filter: Jo.slottedOptionFilter,
        flatten: !0,
        property: "slottedOptions",
      })}></slot></template>`,
    styles: jh,
  }),
  _h = jh,
  Uh = (t, e) =>
    Dt`
    ${Fo(
      "grid"
    )} :host{contain:layout;overflow:visible;font-family:${Hr};outline:none;box-sizing:border-box;height:calc(${hc} * 1px);grid-template-columns:minmax(42px,auto) 1fr minmax(42px,auto);grid-template-rows:auto;justify-items:center;align-items:center;padding:0;margin:0 calc(${qr} * 1px);white-space:nowrap;color:${ec};fill:currentcolor;cursor:pointer;font-size:${Wr};line-height:${Xr};border-radius:calc(${Br} * 1px);border:calc(${Kr} * 1px) solid transparent}:host(.indent-0){grid-template-columns:auto 1fr minmax(42px,auto)}:host(.indent-0) .content{grid-column:1;grid-row:1;margin-inline-start:10px}:host(.indent-0) .expand-collapse-glyph-container{grid-column:5;grid-row:1}:host(.indent-2){grid-template-columns:minmax(42px,auto) minmax(42px,auto) 1fr minmax(42px,auto) minmax(42px,auto)}:host(.indent-2) .content{grid-column:3;grid-row:1;margin-inline-start:10px}:host(.indent-2) .expand-collapse-glyph-container{grid-column:5;grid-row:1}:host(.indent-2) .start{grid-column:2}:host(.indent-2) .end{grid-column:4}:host(:${So}){border-color:${Xl};background:${Ja};color:${ec}}:host(:hover){background:${Ja};color:${ec}}:host([aria-checked="true"]),:host(:active),:host(.expanded){background:${Qa};color:${ec}}:host([disabled]){cursor:${"not-allowed"};opacity:${Ur}}:host([disabled]:hover){color:${ec};fill:currentcolor;background:${Hl}}:host([disabled]:hover) .start,:host([disabled]:hover) .end,:host([disabled]:hover)::slotted(svg){fill:${ec}}.expand-collapse-glyph{width:16px;height:16px;fill:currentcolor}.content{grid-column-start:2;justify-self:start;overflow:hidden;text-overflow:ellipsis}.start,.end{display:flex;justify-content:center}::slotted(svg){width:16px;height:16px}:host(:hover) .start,:host(:hover) .end,:host(:hover)::slotted(svg),:host(:active) .start,:host(:active) .end,:host(:active)::slotted(svg){fill:${ec}}:host(.indent-0[aria-haspopup="menu"]){display:grid;grid-template-columns:minmax(42px,auto) auto 1fr minmax(42px,auto) minmax(42px,auto);align-items:center;min-height:32px}:host(.indent-1[aria-haspopup="menu"]),:host(.indent-1[role="menuitemcheckbox"]),:host(.indent-1[role="menuitemradio"]){display:grid;grid-template-columns:minmax(42px,auto) auto 1fr minmax(42px,auto) minmax(42px,auto);align-items:center;min-height:32px}:host(.indent-2:not([aria-haspopup="menu"])) .end{grid-column:5}:host .input-container,:host .expand-collapse-glyph-container{display:none}:host([aria-haspopup="menu"]) .expand-collapse-glyph-container,:host([role="menuitemcheckbox"]) .input-container,:host([role="menuitemradio"]) .input-container{display:grid;margin-inline-end:10px}:host([aria-haspopup="menu"]) .content,:host([role="menuitemcheckbox"]) .content,:host([role="menuitemradio"]) .content{grid-column-start:3}:host([aria-haspopup="menu"].indent-0) .content{grid-column-start:1}:host([aria-haspopup="menu"]) .end,:host([role="menuitemcheckbox"]) .end,:host([role="menuitemradio"]) .end{grid-column-start:4}:host .expand-collapse,:host .checkbox,:host .radio{display:flex;align-items:center;justify-content:center;position:relative;width:20px;height:20px;box-sizing:border-box;outline:none;margin-inline-start:10px}:host .checkbox,:host .radio{border:calc(${Gr} * 1px) solid ${ec}}:host([aria-checked="true"]) .checkbox,:host([aria-checked="true"]) .radio{background:${nl};border-color:${nl}}:host .checkbox{border-radius:calc(${Br} * 1px)}:host .radio{border-radius:999px}:host .checkbox-indicator,:host .radio-indicator,:host .expand-collapse-indicator,::slotted([slot="checkbox-indicator"]),::slotted([slot="radio-indicator"]),::slotted([slot="expand-collapse-indicator"]){display:none}::slotted([slot="end"]:not(svg)){margin-inline-end:10px;color:${Jl}}:host([aria-checked="true"]) .checkbox-indicator,:host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]){width:100%;height:100%;display:block;fill:${dl};pointer-events:none}:host([aria-checked="true"]) .radio-indicator{position:absolute;top:4px;left:4px;right:4px;bottom:4px;border-radius:999px;display:block;background:${dl};pointer-events:none}:host([aria-checked="true"]) ::slotted([slot="radio-indicator"]){display:block;pointer-events:none}`.withBehaviors(
      To(Dt`
            :host{border-color:transparent;color:${go.ButtonText};forced-color-adjust:none}:host(:hover){background:${go.Highlight};color:${go.HighlightText}}:host(:hover) .start,:host(:hover) .end,:host(:hover)::slotted(svg),:host(:active) .start,:host(:active) .end,:host(:active)::slotted(svg){fill:${go.HighlightText}}:host(.expanded){background:${go.Highlight};border-color:${go.Highlight};color:${go.HighlightText}}:host(:${So}){background:${go.Highlight};border-color:${go.ButtonText};box-shadow:0 0 0 calc(${Kr} * 1px) inset ${go.HighlightText};color:${go.HighlightText};fill:currentcolor}:host([disabled]),:host([disabled]:hover),:host([disabled]:hover) .start,:host([disabled]:hover) .end,:host([disabled]:hover)::slotted(svg){background:${go.Canvas};color:${go.GrayText};fill:currentcolor;opacity:1}:host .expanded-toggle,:host .checkbox,:host .radio{border-color:${go.ButtonText};background:${go.HighlightText}}:host([checked="true"]) .checkbox,:host([checked="true"]) .radio{background:${go.HighlightText};border-color:${go.HighlightText}}:host(:hover) .expanded-toggle,:host(:hover) .checkbox,:host(:hover) .radio,:host(:${So}) .expanded-toggle,:host(:${So}) .checkbox,:host(:${So}) .radio,:host([checked="true"]:hover) .checkbox,:host([checked="true"]:hover) .radio,:host([checked="true"]:${So}) .checkbox,:host([checked="true"]:${So}) .radio{border-color:${go.HighlightText}}:host([aria-checked="true"]){background:${go.Highlight};color:${go.HighlightText}}:host([aria-checked="true"]) .checkbox-indicator,:host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]),:host([aria-checked="true"]) ::slotted([slot="radio-indicator"]){fill:${go.Highlight}}:host([aria-checked="true"]) .radio-indicator{background:${go.Highlight}}::slotted([slot="end"]:not(svg)){color:${go.ButtonText}}:host(:hover) ::slotted([slot="end"]:not(svg)),:host(:${So}) ::slotted([slot="end"]:not(svg)){color:${go.HighlightText}}`),
      new Cc(
        Dt`
                .expand-collapse-glyph{transform:rotate(0deg)}`,
        Dt`
                .expand-collapse-glyph{transform:rotate(180deg)}`
      )
    ),
  Gh = Ns.compose({
    baseName: "menu-item",
    template: (t, e) =>
      rt`<template role="${(t) => t.role}" aria-haspopup="${(t) =>
        t.hasSubmenu ? "menu" : void 0}" aria-checked="${(t) =>
        t.role !== Ms.menuitem ? t.checked : void 0}" aria-disabled="${(t) =>
        t.disabled}" aria-expanded="${(t) => t.expanded}" @keydown="${(t, e) =>
        t.handleMenuItemKeyDown(e.event)}" @click="${(t, e) =>
        t.handleMenuItemClick(e.event)}" @mouseover="${(t, e) =>
        t.handleMouseOver(e.event)}" @mouseout="${(t, e) =>
        t.handleMouseOut(e.event)}" class="${(t) =>
        t.disabled ? "disabled" : ""} ${(t) =>
        t.expanded ? "expanded" : ""} ${(t) =>
        "indent-" + t.startColumnCount}">${jt(
        (t) => t.role === Ms.menuitemcheckbox,
        rt`<div part="input-container" class="input-container"><span part="checkbox" class="checkbox"><slot name="checkbox-indicator">${
          e.checkboxIndicator || ""
        }</slot></span></div>`
      )} ${jt(
        (t) => t.role === Ms.menuitemradio,
        rt`<div part="input-container" class="input-container"><span part="radio" class="radio"><slot name="radio-indicator">${
          e.radioIndicator || ""
        }</slot></span></div>`
      )}</div>${ee}<span class="content" part="content"><slot></slot></span>${te} ${jt(
        (t) => t.hasSubmenu,
        rt`<div part="expand-collapse-glyph-container" class="expand-collapse-glyph-container"><span part="expand-collapse" class="expand-collapse"><slot name="expand-collapse-indicator">${
          e.expandCollapseGlyph || ""
        }</slot></span></div>`
      )} ${jt(
        (t) => t.expanded,
        rt`<${t.tagFor(Oo)} :anchorElement="${(t) =>
          t}" vertical-positioning-mode="dynamic" vertical-default-position="bottom" vertical-inset="true" horizontal-positioning-mode="dynamic" horizontal-default-position="end" class="submenu-region" dir="${(
          t
        ) => t.currentDirection}" @loaded="${(t) => t.submenuLoaded()}" ${Bt(
          "submenuRegion"
        )} part="submenu-region"><slot name="submenu"></slot></${t.tagFor(Oo)}>`
      )}</template>`,
    styles: Uh,
    checkboxIndicator:
      '\n        <svg\n            part="checkbox-indicator"\n            class="checkbox-indicator"\n            viewBox="0 0 20 20"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                fill-rule="evenodd"\n                clip-rule="evenodd"\n                d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"\n            />\n        </svg>\n    ',
    expandCollapseGlyph:
      '\n        <svg\n            viewBox="0 0 16 16"\n            xmlns="http://www.w3.org/2000/svg"\n            class="expand-collapse-glyph"\n            part="expand-collapse-glyph"\n        >\n            <path\n                d="M5.00001 12.3263C5.00124 12.5147 5.05566 12.699 5.15699 12.8578C5.25831 13.0167 5.40243 13.1437 5.57273 13.2242C5.74304 13.3047 5.9326 13.3354 6.11959 13.3128C6.30659 13.2902 6.4834 13.2152 6.62967 13.0965L10.8988 8.83532C11.0739 8.69473 11.2153 8.51658 11.3124 8.31402C11.4096 8.11146 11.46 7.88966 11.46 7.66499C11.46 7.44033 11.4096 7.21853 11.3124 7.01597C11.2153 6.81341 11.0739 6.63526 10.8988 6.49467L6.62967 2.22347C6.48274 2.10422 6.30501 2.02912 6.11712 2.00691C5.92923 1.9847 5.73889 2.01628 5.56823 2.09799C5.39757 2.17969 5.25358 2.30817 5.153 2.46849C5.05241 2.62882 4.99936 2.8144 5.00001 3.00369V12.3263Z"\n            />\n        </svg>\n    ',
    radioIndicator:
      '\n        <span part="radio-indicator" class="radio-indicator"></span>\n    ',
  }),
  Kh = Uh,
  Wh = (t, e) =>
    Dt`
        ${Fo(
          "block"
        )} :host{--elevation:11;background:${Ka};border:calc(${Gr} * 1px) solid transparent;${mc}
            margin:0;border-radius:calc(${Br} * 1px);padding:calc(${qr} * 1px) 0;max-width:368px;min-width:64px}:host([slot="submenu"]){width:max-content;margin:0 calc(${qr} * 1px)}::slotted(hr){box-sizing:content-box;height:0;margin:0;border:none;border-top:calc(${Gr} * 1px) solid ${lc}}`.withBehaviors(
      To(Dt`
                :host{background:${go.Canvas};border-color:${go.CanvasText}}`)
    ),
  Xh = Bs.compose({
    baseName: "menu",
    template: (t, e) =>
      rt`<template slot="${(t) =>
        t.slot
          ? t.slot
          : t.isNestedMenu()
          ? "submenu"
          : void 0}" role="menu" @keydown="${(t, e) =>
        t.handleMenuKeyDown(e.event)}" @focusout="${(t, e) =>
        t.handleFocusOut(e.event)}"><slot ${Yt("items")}></slot></template>`,
    styles: Wh,
  }),
  Yh = Wh,
  Qh = (t, e) =>
    Dt`
    ${Fo(
      "inline-block"
    )} :host{font-family:${Hr};outline:none;user-select:none}.root{box-sizing:border-box;position:relative;display:flex;flex-direction:row;color:${ec};background:${Rl};border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid ${nl};height:calc(${hc} * 1px)}.control{-webkit-appearance:none;font:inherit;background:transparent;border:0;color:inherit;height:calc(100% - 4px);width:100%;margin-top:auto;margin-bottom:auto;border:none;padding:0 calc(${qr} * 2px + 1px);font-size:${Wr};line-height:${Xr}}.control:hover,.control:${So},.control:disabled,.control:active{outline:none}.controls{opacity:0}.label{display:block;color:${ec};cursor:pointer;font-size:${Wr};line-height:${Xr};margin-bottom:4px}.label__hidden{display:none;visibility:hidden}.start,.end{margin:auto;fill:currentcolor}.step-up-glyph,.step-down-glyph{display:block;padding:4px 10px;cursor:pointer}.step-up-glyph:before,.step-down-glyph:before{content:'';display:block;border:solid transparent 6px}.step-up-glyph:before{border-bottom-color:${ec}}.step-down-glyph:before{border-top-color:${ec}}::slotted(svg){width:16px;height:16px}.start{margin-inline-start:11px}.end{margin-inline-end:11px}:host(:hover:not([disabled])) .root{background:${Ll};border-color:${rl}}:host(:active:not([disabled])) .root{background:${Ll};border-color:${al}}:host(:focus-within:not([disabled])) .root{border-color:${Xl};box-shadow:0 0 0 1px ${Xl} inset}:host(:hover:not([disabled])) .controls,:host(:focus-within:not([disabled])) .controls{opacity:1}:host([appearance="filled"]) .root{background:${Fl}}:host([appearance="filled"]:hover:not([disabled])) .root{background:${Sl}}:host([disabled]) .label,:host([readonly]) .label,:host([readonly]) .control,:host([disabled]) .control{cursor:${"not-allowed"}}:host([disabled]){opacity:${Ur}}:host([disabled]) .control{border-color:${oc}}`.withBehaviors(
      To(Dt`
                .root,:host([appearance="filled"]) .root{forced-color-adjust:none;background:${go.Field};border-color:${go.FieldText}}:host(:hover:not([disabled])) .root,:host([appearance="filled"]:hover:not([disabled])) .root,:host([appearance="filled"]:hover) .root{background:${go.Field};border-color:${go.Highlight}}.start,.end{fill:currentcolor}:host([disabled]){opacity:1}:host([disabled]) .root,:host([appearance="filled"]:hover[disabled]) .root{border-color:${go.GrayText};background:${go.Field}}:host(:focus-within:enabled) .root{border-color:${go.Highlight};box-shadow:0 0 0 1px ${go.Highlight} inset}input::placeholder{color:${go.GrayText}}`)
    );
class Zh extends Xs {
  connectedCallback() {
    super.connectedCallback(), this.appearance || (this.appearance = "outline");
  }
}
bc([bt], Zh.prototype, "appearance", void 0);
const Jh = Qh,
  td = Zh.compose({
    baseName: "number-field",
    styles: Qh,
    template: (t, e) =>
      rt`<template class="${(t) =>
        t.readOnly
          ? "readonly"
          : ""}"><label part="label" for="control" class="${(t) =>
        t.defaultSlottedNodes && t.defaultSlottedNodes.length
          ? "label"
          : "label label__hidden"}"><slot ${Yt(
        "defaultSlottedNodes"
      )}></slot></label><div class="root" part="root">${ee}<input class="control" part="control" id="control" @input="${(
        t
      ) => t.handleTextInput()}" @change="${(t) =>
        t.handleChange()}" @keydown="${(t, e) =>
        t.handleKeyDown(e.event)}" ?autofocus="${(t) =>
        t.autofocus}" ?disabled="${(t) => t.disabled}" list="${(t) =>
        t.list}" maxlength="${(t) => t.maxlength}" minlength="${(t) =>
        t.minlength}" placeholder="${(t) => t.placeholder}" ?readonly="${(t) =>
        t.readOnly}" ?required="${(t) => t.required}" size="${(t) =>
        t.size}" :value="${(t) =>
        t.value}" type="text" inputmode="numeric" min="${(t) => t.min}" max="${(
        t
      ) => t.max}" step="${(t) => t.step}" aria-atomic="${(t) =>
        t.ariaAtomic}" aria-busy="${(t) => t.ariaBusy}" aria-controls="${(t) =>
        t.ariaControls}" aria-current="${(t) =>
        t.ariaCurrent}" aria-describedBy="${(t) =>
        t.ariaDescribedby}" aria-details="${(t) =>
        t.ariaDetails}" aria-disabled="${(t) =>
        t.ariaDisabled}" aria-errormessage="${(t) =>
        t.ariaErrormessage}" aria-flowto="${(t) =>
        t.ariaFlowto}" aria-haspopup="${(t) => t.ariaHaspopup}" aria-hidden="${(
        t
      ) => t.ariaHidden}" aria-invalid="${(t) =>
        t.ariaInvalid}" aria-keyshortcuts="${(t) =>
        t.ariaKeyshortcuts}" aria-label="${(t) =>
        t.ariaLabel}" aria-labelledby="${(t) =>
        t.ariaLabelledby}" aria-live="${(t) => t.ariaLive}" aria-owns="${(t) =>
        t.ariaOwns}" aria-relevant="${(t) =>
        t.ariaRelevant}" aria-roledescription="${(t) =>
        t.ariaRoledescription}" ${Bt("control")} />${jt(
        (t) => !t.hideStep && !t.readOnly && !t.disabled,
        rt`<div class="controls" part="controls"><div class="step-up" part="step-up" @click="${(
          t
        ) => t.stepUp()}"><slot name="step-up-glyph">${
          e.stepUpGlyph || ""
        }</slot></div><div class="step-down" part="step-down" @click="${(t) =>
          t.stepDown()}"><slot name="step-down-glyph">${
          e.stepDownGlyph || ""
        }</slot></div></div>`
      )} ${te}</div></template>`,
    shadowOptions: { delegatesFocus: !0 },
    stepDownGlyph:
      '\n        <span class="step-down-glyph" part="step-down-glyph"></span>\n    ',
    stepUpGlyph:
      '\n        <span class="step-up-glyph" part="step-up-glyph"></span>\n    ',
  }),
  ed = (t, e) =>
    Dt`
        ${Fo(
          "flex"
        )} :host{align-items:center;outline:none;height:calc(${hc} * 1px);width:calc(${hc} * 1px);margin:calc(${hc} * 1px) 0}.progress{height:100%;width:100%}.background{stroke:${Fl};fill:none;stroke-width:2px}.determinate{stroke:${wl};fill:none;stroke-width:2px;stroke-linecap:round;transform-origin:50% 50%;transform:rotate(-90deg);transition:all 0.2s ease-in-out}.indeterminate-indicator-1{stroke:${wl};fill:none;stroke-width:2px;stroke-linecap:round;transform-origin:50% 50%;transform:rotate(-90deg);transition:all 0.2s ease-in-out;animation:spin-infinite 2s linear infinite}:host([paused]) .indeterminate-indicator-1{animation-play-state:paused;stroke:${Fl}}:host([paused]) .determinate{stroke:${Jl}}@keyframes spin-infinite{0%{stroke-dasharray:0.01px 43.97px;transform:rotate(0deg)}50%{stroke-dasharray:21.99px 21.99px;transform:rotate(450deg)}100%{stroke-dasharray:0.01px 43.97px;transform:rotate(1080deg)}}`.withBehaviors(
      To(Dt`
                .indeterminate-indicator-1,.determinate{stroke:${go.FieldText}}.background{stroke:${go.Field}}:host([paused]) .indeterminate-indicator-1{stroke:${go.Field}}:host([paused]) .determinate{stroke:${go.GrayText}}`)
    ),
  id = Ys.compose({
    baseName: "progress-ring",
    template: (t, e) =>
      rt`<template role="progressbar" aria-valuenow="${(t) =>
        t.value}" aria-valuemin="${(t) => t.min}" aria-valuemax="${(t) =>
        t.max}" class="${(t) => (t.paused ? "paused" : "")}">${jt(
        (t) => "number" == typeof t.value,
        rt`<svg class="progress" part="progress" viewBox="0 0 16 16" slot="determinate"><circle class="background" part="background" cx="8px" cy="8px" r="7px"></circle><circle class="determinate" part="determinate" style="stroke-dasharray: ${(
          t
        ) =>
          (44 * t.value) /
          100}px 44px" cx="8px" cy="8px" r="7px"></circle></svg>`
      )} ${jt(
        (t) => "number" != typeof t.value,
        rt`<slot name="indeterminate" slot="indeterminate">${
          e.indeterminateIndicator || ""
        }</slot>`
      )}</template>`,
    styles: ed,
    indeterminateIndicator:
      '\n        <svg class="progress" part="progress" viewBox="0 0 16 16">\n            <circle\n                class="background"\n                part="background"\n                cx="8px"\n                cy="8px"\n                r="7px"\n            ></circle>\n            <circle\n                class="indeterminate-indicator-1"\n                part="indeterminate-indicator-1"\n                cx="8px"\n                cy="8px"\n                r="7px"\n            ></circle>\n        </svg>\n    ',
  }),
  od = ed,
  sd = (t, e) =>
    Dt`
        ${Fo(
          "flex"
        )} :host{align-items:center;outline:none;height:calc(${qr} * 1px);margin:calc(${qr} * 1px) 0}.progress{background-color:${Fl};border-radius:calc(${qr} * 1px);width:100%;height:100%;display:flex;align-items:center;position:relative}.determinate{background-color:${wl};border-radius:calc(${qr} * 1px);height:100%;transition:all 0.2s ease-in-out;display:flex}.indeterminate{height:100%;border-radius:calc(${qr} * 1px);display:flex;width:100%;position:relative;overflow:hidden}.indeterminate-indicator-1{position:absolute;opacity:0;height:100%;background-color:${wl};border-radius:calc(${qr} * 1px);animation-timing-function:cubic-bezier(0.4,0,0.6,1);width:40%;animation:indeterminate-1 2s infinite}.indeterminate-indicator-2{position:absolute;opacity:0;height:100%;background-color:${wl};border-radius:calc(${qr} * 1px);animation-timing-function:cubic-bezier(0.4,0,0.6,1);width:60%;animation:indeterminate-2 2s infinite}:host([paused]) .indeterminate-indicator-1,:host([paused]) .indeterminate-indicator-2{animation-play-state:paused;background-color:${Fl}}:host([paused]) .determinate{background-color:${Jl}}@keyframes indeterminate-1{0%{opacity:1;transform:translateX(-100%)}70%{opacity:1;transform:translateX(300%)}70.01%{opacity:0}100%{opacity:0;transform:translateX(300%)}}@keyframes indeterminate-2{0%{opacity:0;transform:translateX(-150%)}29.99%{opacity:0}30%{opacity:1;transform:translateX(-150%)}100%{transform:translateX(166.66%);opacity:1}}`.withBehaviors(
      To(Dt`
                .progress{forced-color-adjust:none;background-color:${go.Field};box-shadow:0 0 0 1px inset ${go.FieldText}}.determinate,.indeterminate-indicator-1,.indeterminate-indicator-2{forced-color-adjust:none;background-color:${go.FieldText}}:host([paused]) .determinate,:host([paused]) .indeterminate-indicator-1,:host([paused]) .indeterminate-indicator-2{background-color:${go.GrayText}}`)
    ),
  nd = Ys.compose({
    baseName: "progress",
    template: (t, e) =>
      rt`<template role="progressbar" aria-valuenow="${(t) =>
        t.value}" aria-valuemin="${(t) => t.min}" aria-valuemax="${(t) =>
        t.max}" class="${(t) => (t.paused ? "paused" : "")}">${jt(
        (t) => "number" == typeof t.value,
        rt`<div class="progress" part="progress" slot="determinate"><div class="determinate" part="determinate" style="width: ${(
          t
        ) => t.value}%"></div></div>`
      )} ${jt(
        (t) => "number" != typeof t.value,
        rt`<div class="progress" part="progress" slot="indeterminate"><slot class="indeterminate" name="indeterminate">${
          e.indeterminateIndicator1 || ""
        } ${e.indeterminateIndicator2 || ""}</slot></div>`
      )}</template>`,
    styles: sd,
    indeterminateIndicator1:
      '\n        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>\n    ',
    indeterminateIndicator2:
      '\n        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>\n    ',
  }),
  rd = sd,
  ad = (t, e) => Dt`
    ${Fo(
      "flex"
    )} :host{align-items:flex-start;margin:calc(${qr} * 1px) 0;flex-direction:column}.positioning-region{display:flex;flex-wrap:wrap}:host([orientation="vertical"]) .positioning-region{flex-direction:column}:host([orientation="horizontal"]) .positioning-region{flex-direction:row}`,
  ld = Qs.compose({
    baseName: "radio-group",
    template: (t, e) =>
      rt`<template role="radiogroup" aria-disabled="${(t) =>
        t.disabled}" aria-readonly="${(t) => t.readOnly}" @click="${(t, e) =>
        t.clickHandler(e.event)}" @keydown="${(t, e) =>
        t.keydownHandler(e.event)}" @focusout="${(t, e) =>
        t.focusOutHandler(
          e.event
        )}"><slot name="label"></slot><div class="positioning-region ${(t) =>
        t.orientation === Ye.horizontal
          ? "horizontal"
          : "vertical"}" part="positioning-region"><slot ${Yt({
        property: "slottedRadioButtons",
        filter: Kt("[role=radio]"),
      })}></slot></div></template>`,
    styles: ad,
  }),
  cd = ad,
  hd = (t, e) =>
    Dt`
    ${Fo(
      "inline-flex"
    )} :host{--input-size:calc((${hc} / 2) + ${qr});align-items:center;outline:none;margin:calc(${qr} * 1px) 0;user-select:none;position:relative;flex-direction:row;transition:all 0.2s ease-in-out}.control{position:relative;width:calc((${hc} / 2 + ${qr}) * 1px);height:calc((${hc} / 2 + ${qr}) * 1px);box-sizing:border-box;border-radius:999px;border:calc(${Gr} * 1px) solid ${oc};background:${Rl};outline:none;cursor:pointer}.label{font-family:${Hr};color:${ec};padding-inline-start:calc(${qr} * 2px + 2px);margin-inline-end:calc(${qr} * 2px + 2px);cursor:pointer;font-size:${Wr};line-height:${Xr}}.label__hidden{display:none;visibility:hidden}.control,.checked-indicator{flex-shrink:0}.checked-indicator{position:absolute;top:5px;left:5px;right:5px;bottom:5px;border-radius:999px;display:inline-block;background:${dl};fill:${dl};opacity:0;pointer-events:none}:host(:not([disabled])) .control:hover{background:${Ll};border-color:${sc}}:host(:not([disabled])) .control:active{background:${Al};border-color:${nc}}:host(:${So}) .control{box-shadow:0 0 0 2px ${il},0 0 0 4px ${Xl}}:host([aria-checked="true"]) .control{background:${nl};border:calc(${Gr} * 1px) solid ${nl}}:host([aria-checked="true"]:not([disabled])) .control:hover{background:${rl};border:calc(${Gr} * 1px) solid ${rl}}:host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator{background:${ul};fill:${ul}}:host([aria-checked="true"]:not([disabled])) .control:active{background:${al};border:calc(${Gr} * 1px) solid ${al}}:host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator{background:${pl};fill:${pl}}:host([aria-checked="true"]:${So}:not([disabled])) .control{box-shadow:0 0 0 2px ${il},0 0 0 4px ${Xl}}:host([disabled]) .label,:host([readonly]) .label,:host([readonly]) .control,:host([disabled]) .control{cursor:${"not-allowed"}}:host([aria-checked="true"]) .checked-indicator{opacity:1}:host([disabled]){opacity:${Ur}}`.withBehaviors(
      To(Dt`
            .control,:host([aria-checked="true"]:not([disabled])) .control{forced-color-adjust:none;border-color:${go.FieldText};background:${go.Field}}:host(:not([disabled])) .control:hover{border-color:${go.Highlight};background:${go.Field}}:host([aria-checked="true"]:not([disabled])) .control:hover,:host([aria-checked="true"]:not([disabled])) .control:active{border-color:${go.Highlight};background:${go.Highlight}}:host([aria-checked="true"]) .checked-indicator{background:${go.Highlight};fill:${go.Highlight}}:host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator,:host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator{background:${go.HighlightText};fill:${go.HighlightText}}:host(:${So}) .control{border-color:${go.Highlight};box-shadow:0 0 0 2px ${go.Field},0 0 0 4px ${go.FieldText}}:host([aria-checked="true"]:${So}:not([disabled])) .control{border-color:${go.Highlight};box-shadow:0 0 0 2px ${go.Field},0 0 0 4px ${go.FieldText}}:host([disabled]){forced-color-adjust:none;opacity:1}:host([disabled]) .label{color:${go.GrayText}}:host([disabled]) .control,:host([aria-checked="true"][disabled]) .control:hover,.control:active{background:${go.Field};border-color:${go.GrayText}}:host([disabled]) .checked-indicator,:host([aria-checked="true"][disabled]) .control:hover .checked-indicator{fill:${go.GrayText};background:${go.GrayText}}`)
    ),
  dd = tn.compose({
    baseName: "radio",
    template: (t, e) =>
      rt`<template role="radio" class="${(t) =>
        t.checked ? "checked" : ""} ${(t) =>
        t.readOnly ? "readonly" : ""}" aria-checked="${(t) =>
        t.checked}" aria-required="${(t) => t.required}" aria-disabled="${(t) =>
        t.disabled}" aria-readonly="${(t) => t.readOnly}" @keypress="${(t, e) =>
        t.keypressHandler(e.event)}" @click="${(t, e) =>
        t.clickHandler(
          e.event
        )}"><div part="control" class="control"><slot name="checked-indicator">${
        e.checkedIndicator || ""
      }</slot></div><label part="label" class="${(t) =>
        t.defaultSlottedNodes && t.defaultSlottedNodes.length
          ? "label"
          : "label label__hidden"}"><slot ${Yt(
        "defaultSlottedNodes"
      )}></slot></label></template>`,
    styles: hd,
    checkedIndicator:
      '\n        <div part="checked-indicator" class="checked-indicator"></div>\n    ',
  }),
  ud = hd,
  pd = nn.compose({
    baseName: "select",
    template: (t, e) =>
      rt`<template class="${(t) => (t.open ? "open" : "")} ${(t) =>
        t.disabled ? "disabled" : ""} ${(t) => t.position}" role="${(t) =>
        t.role}" tabindex="${(t) =>
        t.disabled ? null : "0"}" aria-disabled="${(t) =>
        t.ariaDisabled}" aria-expanded="${(t) => t.ariaExpanded}" @click="${(
        t,
        e
      ) => t.clickHandler(e.event)}" @focusout="${(t, e) =>
        t.focusoutHandler(e.event)}" @keydown="${(t, e) =>
        t.keydownHandler(e.event)}"><div aria-activedescendant="${(t) =>
        t.open
          ? t.ariaActiveDescendant
          : null}" aria-controls="listbox" aria-expanded="${(t) =>
        t.ariaExpanded}" aria-haspopup="listbox" class="control" part="control" role="button" ?disabled="${(
        t
      ) =>
        t.disabled}">${ee}<slot name="button-container"><div class="selected-value" part="selected-value"><slot name="selected-value">${(
        t
      ) =>
        t.displayValue}</slot></div><div class="indicator" part="indicator"><slot name="indicator">${
        e.indicator || ""
      }</slot></div></slot>${te}</div><div aria-disabled="${(t) =>
        t.disabled}" class="listbox" id="listbox" part="listbox" role="listbox" style="--max-height: ${(
        t
      ) => t.maxHeight}px" ?disabled="${(t) => t.disabled}" ?hidden="${(t) =>
        !t.open}"><slot ${Yt({
        filter: Jo.slottedOptionFilter,
        flatten: !0,
        property: "slottedOptions",
      })}></slot></div></template>`,
    styles: eh,
    indicator:
      '\n        <svg\n            class="select-indicator"\n            part="select-indicator"\n            viewBox="0 0 12 7"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"\n            />\n        </svg>\n    ',
  }),
  gd = eh,
  fd = (t, e) =>
    Dt`
        ${Fo(
          "block"
        )} :host{--skeleton-fill-default:#e1dfdd;overflow:hidden;width:100%;position:relative;background-color:var(--skeleton-fill,var(--skeleton-fill-default));--skeleton-animation-gradient-default:linear-gradient(
                270deg,var(--skeleton-fill,var(--skeleton-fill-default)) 0%,#f3f2f1 51.13%,var(--skeleton-fill,var(--skeleton-fill-default)) 100%
            );--skeleton-animation-timing-default:ease-in-out}:host([shape="rect"]){border-radius:calc(${Br} * 1px)}:host([shape="circle"]){border-radius:100%;overflow:hidden}object{position:absolute;width:100%;height:auto;z-index:2}object img{width:100%;height:auto}${Fo(
      "block"
    )} span.shimmer{position:absolute;width:100%;height:100%;background-image:var(
                --skeleton-animation-gradient,var(--skeleton-animation-gradient-default)
            );background-size:0px 0px / 90% 100%;background-repeat:no-repeat;background-color:var(--skeleton-animation-fill,${Fl});animation:shimmer 2s infinite;animation-timing-function:var(
                --skeleton-animation-timing,var(--skeleton-timing-default)
            );animation-direction:normal;z-index:1}::slotted(svg){z-index:2}::slotted(.pattern){width:100%;height:100%}@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`.withBehaviors(
      To(Dt`
                :host{forced-color-adjust:none;background-color:${
                  go.ButtonFace
                };box-shadow:0 0 0 1px ${go.ButtonText}}${Fo(
        "block"
      )} span.shimmer{display:none}`)
    ),
  bd = an.compose({
    baseName: "skeleton",
    template: (t, e) =>
      rt`<template class="${(t) =>
        "circle" === t.shape ? "circle" : "rect"}" pattern="${(t) =>
        t.pattern}" ?shimmer="${(t) => t.shimmer}">${jt(
        (t) => !0 === t.shimmer,
        rt`<span class="shimmer"></span>`
      )}<object type="image/svg+xml" data="${(t) =>
        t.pattern}"><img class="pattern" src="${(t) =>
        t.pattern}" /></object><slot></slot></template>`,
    styles: fd,
  }),
  md = fd,
  vd = Dt`
    :host{align-self:start;grid-row:2;margin-top:-2px;height:calc((${hc} / 2 + ${qr}) * 1px);width:auto}.container{grid-template-rows:auto auto;grid-template-columns:0}.label{margin:2px 0}`,
  yd = Dt`
    :host{justify-self:start;grid-column:2;margin-left:2px;height:auto;width:calc((${hc} / 2 + ${qr}) * 1px)}.container{grid-template-columns:auto auto;grid-template-rows:0;min-width:calc(var(--thumb-size) * 1px);height:calc(var(--thumb-size) * 1px)}.mark{transform:rotate(90deg);align-self:center}.label{margin-left:calc((${qr} / 2) * 3px);align-self:center}`,
  xd = (t, e) =>
    Dt`
        ${Fo(
          "block"
        )} :host{font-family:${Hr};color:${ec};fill:currentcolor}.root{position:absolute;display:grid}.container{display:grid;justify-self:center}.label{justify-self:center;align-self:center;white-space:nowrap;max-width:30px}.mark{width:calc((${qr} / 4) * 1px);height:calc(${hc} * 0.25 * 1px);background:${oc};justify-self:center}:host(.disabled){opacity:${Ur}}`.withBehaviors(
      To(Dt`
                .mark{forced-color-adjust:none;background:${go.FieldText}}:host(.disabled){forced-color-adjust:none;opacity:1}:host(.disabled) .label{color:${go.GrayText}}:host(.disabled) .mark{background:${go.GrayText}}`)
    );
class $d extends hn {
  sliderOrientationChanged() {
    this.sliderOrientation === Ye.horizontal
      ? (this.$fastController.addStyles(vd),
        this.$fastController.removeStyles(yd))
      : (this.$fastController.addStyles(yd),
        this.$fastController.removeStyles(vd));
  }
}
const wd = $d.compose({
    baseName: "slider-label",
    template: (t, e) =>
      rt`<template aria-disabled="${(t) => t.disabled}" class="${(t) =>
        t.sliderOrientation || Ye.horizontal} ${(t) =>
        t.disabled ? "disabled" : ""}"><div ${Bt(
        "root"
      )} part="root" class="root" style="${(t) =>
        t.positionStyle}"><div class="container">${jt(
        (t) => !t.hideMark,
        rt`<div class="mark"></div>`
      )}<div class="label"><slot></slot></div></div></div></template>`,
    styles: xd,
  }),
  kd = xd,
  Cd = (t, e) =>
    Dt`
    :host([hidden]){display:none}${Fo(
      "inline-grid"
    )} :host{--thumb-size:calc(${hc} * 0.5 - ${qr});--thumb-translate:calc(var(--thumb-size) * 0.5);--track-overhang:calc((${qr} / 2) * -1);--track-width:${qr};--fast-slider-height:calc(var(--thumb-size) * 10);align-items:center;width:100%;margin:calc(${qr} * 1px) 0;user-select:none;box-sizing:border-box;border-radius:calc(${Br} * 1px);outline:none;cursor:pointer}:host([orientation="horizontal"]) .positioning-region{position:relative;margin:0 8px;display:grid;grid-template-rows:calc(var(--thumb-size) * 1px) 1fr}:host([orientation="vertical"]) .positioning-region{position:relative;margin:0 8px;display:grid;height:100%;grid-template-columns:calc(var(--thumb-size) * 1px) 1fr}:host(:${So}) .thumb-cursor{box-shadow:0 0 0 2px ${il},0 0 0 4px ${Xl}}.thumb-container{position:absolute;height:calc(var(--thumb-size) * 1px);width:calc(var(--thumb-size) * 1px);transition:all 0.2s ease;color:${ec};fill:currentcolor}.thumb-cursor{border:none;width:calc(var(--thumb-size) * 1px);height:calc(var(--thumb-size) * 1px);background:${ec};border-radius:calc(${Br} * 1px)}.thumb-cursor:hover{background:${ec};border-color:${sc}}.thumb-cursor:active{background:${ec}}:host([orientation="horizontal"]) .thumb-container{transform:translateX(calc(var(--thumb-translate) * 1px))}:host([orientation="vertical"]) .thumb-container{transform:translateY(calc(var(--thumb-translate) * 1px))}:host([orientation="horizontal"]){min-width:calc(var(--thumb-size) * 1px)}:host([orientation="horizontal"]) .track{right:calc(var(--track-overhang) * 1px);left:calc(var(--track-overhang) * 1px);align-self:start;margin-top:calc((${qr} + calc(${jr} + 2)) * 1px);height:calc(var(--track-width) * 1px)}:host([orientation="vertical"]) .track{top:calc(var(--track-overhang) * 1px);bottom:calc(var(--track-overhang) * 1px);width:calc(var(--track-width) * 1px);margin-inline-start:calc((${qr} + calc(${jr} + 2)) * 1px);height:100%}.track{background:${oc};position:absolute;border-radius:calc(${Br} * 1px)}:host([orientation="vertical"]){height:calc(var(--fast-slider-height) * 1px);min-height:calc(var(--thumb-size) * 1px);min-width:calc(${qr} * 20px)}:host([disabled]),:host([readonly]){cursor:${"not-allowed"}}:host([disabled]){opacity:${Ur}}`.withBehaviors(
      To(Dt`
            .thumb-cursor{forced-color-adjust:none;border-color:${go.FieldText};background:${go.FieldText}}.thumb-cursor:hover,.thumb-cursor:active{background:${go.Highlight}}.track{forced-color-adjust:none;background:${go.FieldText}}:host(:${So}) .thumb-cursor{border-color:${go.Highlight}}:host([disabled]){opacity:1}:host([disabled]) .track,:host([disabled]) .thumb-cursor{forced-color-adjust:none;background:${go.GrayText}}:host(:${So}) .thumb-cursor{background:${go.Highlight};border-color:${go.Highlight};box-shadow:0 0 0 2px ${go.Field},0 0 0 4px ${go.FieldText}}`)
    ),
  Td = gn.compose({
    baseName: "slider",
    template: (t, e) =>
      rt`<template role="slider" class="${(t) =>
        t.readOnly ? "readonly" : ""} ${(t) =>
        t.orientation || Ye.horizontal}" tabindex="${(t) =>
        t.disabled ? null : 0}" aria-valuetext="${(t) =>
        t.valueTextFormatter(t.value)}" aria-valuenow="${(t) =>
        t.value}" aria-valuemin="${(t) => t.min}" aria-valuemax="${(t) =>
        t.max}" aria-disabled="${(t) =>
        !!t.disabled || void 0}" aria-readonly="${(t) =>
        !!t.readOnly || void 0}" aria-orientation="${(t) =>
        t.orientation}" class="${(t) =>
        t.orientation}"><div part="positioning-region" class="positioning-region"><div ${Bt(
        "track"
      )} part="track-container" class="track"><slot name="track"></slot></div><slot></slot><div ${Bt(
        "thumb"
      )} part="thumb-container" class="thumb-container" style="${(t) =>
        t.position}"><slot name="thumb">${
        e.thumb || ""
      }</slot></div></div></template>`,
    styles: Cd,
    thumb: '\n        <div class="thumb-cursor"></div>\n    ',
  }),
  Id = Cd,
  Fd = (t, e) =>
    Dt`
    :host([hidden]){display:none}${Fo(
      "inline-flex"
    )} :host{align-items:center;outline:none;font-family:${Hr};margin:calc(${qr} * 1px) 0;${""} user-select:none}:host([disabled]){opacity:${Ur}}:host([disabled]) .label,:host([readonly]) .label,:host([readonly]) .switch,:host([disabled]) .switch{cursor:${"not-allowed"}}.switch{position:relative;outline:none;box-sizing:border-box;width:calc(${hc} * 1px);height:calc((${hc} / 2 + ${qr}) * 1px);background:${Rl};border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid ${oc}}.switch:hover{background:${Ll};border-color:${sc};cursor:pointer}host([disabled]) .switch:hover,host([readonly]) .switch:hover{background:${Ll};border-color:${sc};cursor:${"not-allowed"}}:host(:not([disabled])) .switch:active{background:${Al};border-color:${nc}}:host(:${So}) .switch{box-shadow:0 0 0 2px ${il},0 0 0 4px ${Xl}}.checked-indicator{position:absolute;top:5px;bottom:5px;background:${ec};border-radius:calc(${Br} * 1px);transition:all 0.2s ease-in-out}.status-message{color:${ec};cursor:pointer;font-size:${Wr};line-height:${Xr}}:host([disabled]) .status-message,:host([readonly]) .status-message{cursor:${"not-allowed"}}.label{color:${ec};${""} margin-inline-end:calc(${qr} * 2px + 2px);font-size:${Wr};line-height:${Xr};cursor:pointer}.label__hidden{display:none;visibility:hidden}::slotted(*){${""} margin-inline-start:calc(${qr} * 2px + 2px)}:host([aria-checked="true"]) .checked-indicator{background:${dl}}:host([aria-checked="true"]) .switch{background:${nl};border-color:${nl}}:host([aria-checked="true"]:not([disabled])) .switch:hover{background:${rl};border-color:${rl}}:host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator{background:${ul}}:host([aria-checked="true"]:not([disabled])) .switch:active{background:${al};border-color:${al}}:host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator{background:${pl}}:host([aria-checked="true"]:${So}:not([disabled])) .switch{box-shadow:0 0 0 2px ${il},0 0 0 4px ${Xl}}.unchecked-message{display:block}.checked-message{display:none}:host([aria-checked="true"]) .unchecked-message{display:none}:host([aria-checked="true"]) .checked-message{display:block}`.withBehaviors(
      To(Dt`
            .checked-indicator,:host(:not([disabled])) .switch:active .checked-indicator{forced-color-adjust:none;background:${go.FieldText}}.switch{forced-color-adjust:none;background:${go.Field};border-color:${go.FieldText}}:host(:not([disabled])) .switch:hover{background:${go.HighlightText};border-color:${go.Highlight}}:host([aria-checked="true"]) .switch{background:${go.Highlight};border-color:${go.Highlight}}:host([aria-checked="true"]:not([disabled])) .switch:hover,:host(:not([disabled])) .switch:active{background:${go.HighlightText};border-color:${go.Highlight}}:host([aria-checked="true"]) .checked-indicator{background:${go.HighlightText}}:host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator{background:${go.Highlight}}:host([disabled]){opacity:1}:host(:${So}) .switch{border-color:${go.Highlight};box-shadow:0 0 0 2px ${go.Field},0 0 0 4px ${go.FieldText}}:host([aria-checked="true"]:${So}:not([disabled])) .switch{box-shadow:0 0 0 2px ${go.Field},0 0 0 4px ${go.FieldText}}:host([disabled]) .checked-indicator{background:${go.GrayText}}:host([disabled]) .switch{background:${go.Field};border-color:${go.GrayText}}`),
      new Cc(
        Dt`
                .checked-indicator{left:5px;right:calc(((${hc} / 2) + 1) * 1px)}:host([aria-checked="true"]) .checked-indicator{left:calc(((${hc} / 2) + 1) * 1px);right:5px}`,
        Dt`
                .checked-indicator{right:5px;left:calc(((${hc} / 2) + 1) * 1px)}:host([aria-checked="true"]) .checked-indicator{right:calc(((${hc} / 2) + 1) * 1px);left:5px}`
      )
    ),
  Sd = mn.compose({
    baseName: "switch",
    template: (t, e) =>
      rt`<template role="switch" aria-checked="${(t) =>
        t.checked}" aria-disabled="${(t) => t.disabled}" aria-readonly="${(t) =>
        t.readOnly}" tabindex="${(t) => (t.disabled ? null : 0)}" @keypress="${(
        t,
        e
      ) => t.keypressHandler(e.event)}" @click="${(t, e) =>
        t.clickHandler(e.event)}" class="${(t) =>
        t.checked ? "checked" : ""}"><label part="label" class="${(t) =>
        t.defaultSlottedNodes && t.defaultSlottedNodes.length
          ? "label"
          : "label label__hidden"}"><slot ${Yt(
        "defaultSlottedNodes"
      )}></slot></label><div part="switch" class="switch"><slot name="switch">${
        e.switch || ""
      }</slot></div><span class="status-message" part="status-message"><span class="checked-message" part="checked-message"><slot name="checked-message"></slot></span><span class="unchecked-message" part="unchecked-message"><slot name="unchecked-message"></slot></span></span></template>`,
    styles: Fd,
    switch:
      '\n        <span class="checked-indicator" part="checked-indicator"></span>\n    ',
  }),
  Dd = Fd,
  Ed = (t, e) =>
    Dt`
        ${Fo(
          "grid"
        )} :host{box-sizing:border-box;font-family:${Hr};font-size:${Wr};line-height:${Xr};color:${ec};grid-template-columns:auto 1fr auto;grid-template-rows:auto 1fr}.tablist{display:grid;grid-template-rows:auto auto;grid-template-columns:auto;position:relative;width:max-content;align-self:end;padding:calc(${qr} * 4px) calc(${qr} * 4px) 0;box-sizing:border-box}.start,.end{align-self:center}.activeIndicator{grid-row:2;grid-column:1;width:100%;height:5px;justify-self:center;background:${nl};margin-top:10px;border-radius:calc(${Br} * 1px)
                calc(${Br} * 1px) 0 0}.activeIndicatorTransition{transition:transform 0.2s ease-in-out}.tabpanel{grid-row:2;grid-column-start:1;grid-column-end:4;position:relative}:host([orientation="vertical"]){grid-template-rows:auto 1fr auto;grid-template-columns:auto 1fr}:host([orientation="vertical"]) .tablist{grid-row-start:2;grid-row-end:2;display:grid;grid-template-rows:auto;grid-template-columns:auto 1fr;position:relative;width:max-content;justify-self:end;width:100%;padding:calc((${hc} - ${qr}) * 1px)
                calc(${qr} * 4px) calc((${hc} - ${qr}) * 1px) 0}:host([orientation="vertical"]) .tabpanel{grid-column:2;grid-row-start:1;grid-row-end:4}:host([orientation="vertical"]) .end{grid-row:3}:host([orientation="vertical"]) .activeIndicator{grid-column:1;grid-row:1;width:5px;height:100%;margin-inline-end:10px;align-self:center;background:${nl};margin-top:0;border-radius:0 calc(${Br} * 1px)
                calc(${Br} * 1px) 0}:host([orientation="vertical"]) .activeIndicatorTransition{transition:transform 0.2s linear}`.withBehaviors(
      To(Dt`
                .activeIndicator,:host([orientation="vertical"]) .activeIndicator{forced-color-adjust:none;background:${go.Highlight}}`)
    ),
  Od = (t, e) =>
    Dt`
    ${Fo(
      "inline-flex"
    )} :host{box-sizing:border-box;font-family:${Hr};font-size:${Wr};line-height:${Xr};height:calc(${hc} * 1px);padding:calc(${qr} * 5px) calc(${qr} * 4px);color:${Jl};fill:currentcolor;border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid transparent;align-items:center;justify-content:center;grid-row:1;cursor:pointer}:host(:hover){color:${ec};fill:currentcolor}:host(:active){color:${ec};fill:currentcolor}:host([disabled]){cursor:${"not-allowed"};opacity:${Ur}}:host([disabled]:hover){color:${Jl};background:${Hl}}:host([aria-selected="true"]){background:${Fl};color:${wl};fill:currentcolor}:host([aria-selected="true"]:hover){background:${Sl};color:${kl};fill:currentcolor}:host([aria-selected="true"]:active){background:${Dl};color:${Cl};fill:currentcolor}:host(:${So}){outline:none;border:calc(${Gr} * 1px) solid ${Xl};box-shadow:0 0 0 calc((${Kr} - ${Gr}) * 1px)
            ${Xl}}:host(:focus){outline:none}:host(.vertical){justify-content:end;grid-column:2}:host(.vertical[aria-selected="true"]){z-index:2}:host(.vertical:hover){color:${ec}}:host(.vertical:active){color:${ec}}:host(.vertical:hover[aria-selected="true"]){}`.withBehaviors(
      To(Dt`
            :host{forced-color-adjust:none;border-color:transparent;color:${go.ButtonText};fill:currentcolor}:host(:hover),:host(.vertical:hover),:host([aria-selected="true"]:hover){background:${go.Highlight};color:${go.HighlightText};fill:currentcolor}:host([aria-selected="true"]){background:${go.HighlightText};color:${go.Highlight};fill:currentcolor}:host(:${So}){border-color:${go.ButtonText};box-shadow:none}:host([disabled]),:host([disabled]:hover){opacity:1;color:${go.GrayText};background:${go.ButtonFace}}`)
    ),
  Rd = yn.compose({
    baseName: "tab",
    template: (t, e) =>
      rt`<template slot="tab" role="tab" aria-disabled="${(t) =>
        t.disabled}"><slot></slot></template>`,
    styles: Od,
  }),
  Ld = Od,
  Ad = (t, e) => Dt`
    ${Fo(
      "flex"
    )} :host{box-sizing:border-box;font-size:${Wr};line-height:${Xr};padding:0 calc((6 + (${qr} * 2 * ${jr})) * 1px)}`,
  Vd = vn.compose({
    baseName: "tab-panel",
    template: (t, e) =>
      rt`<template slot="tabpanel" role="tabpanel"><slot></slot></template>`,
    styles: Ad,
  }),
  Pd = Ad,
  Hd = wn.compose({
    baseName: "tabs",
    template: (t, e) =>
      rt`<template class="${(t) =>
        t.orientation}">${ee}<div class="tablist" part="tablist" role="tablist"><slot class="tab" name="tab" part="tab" ${Yt(
        "tabs"
      )}></slot>${jt(
        (t) => t.showActiveIndicator,
        rt`<div ${Bt(
          "activeIndicatorRef"
        )} class="activeIndicator" part="activeIndicator"></div>`
      )}</div>${te}<div class="tabpanel"><slot name="tabpanel" part="tabpanel" ${Yt(
        "tabpanels"
      )}></slot></div></template>`,
    styles: Ed,
  }),
  zd = Ed,
  Md = (t, e) =>
    Dt`
    ${Fo(
      "inline-block"
    )} :host{font-family:${Hr};outline:none;user-select:none}.control{box-sizing:border-box;position:relative;color:${ec};background:${Rl};border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid ${nl};height:calc(${hc} * 2px);font:inherit;font-size:${Wr};line-height:${Xr};padding:calc(${qr} * 2px + 1px);width:100%;resize:none}.control:hover:enabled{background:${Ll};border-color:${rl}}.control:active:enabled{background:${Al};border-color:${al}}.control:hover,.control:${So},.control:disabled,.control:active{outline:none}:host(:focus-within) .control{border-color:${Xl};box-shadow:0 0 0 1px ${Xl} inset}:host([appearance="filled"]) .control{background:${Fl}}:host([appearance="filled"]:hover:not([disabled])) .control{background:${Sl}}:host([resize="both"]) .control{resize:both}:host([resize="horizontal"]) .control{resize:horizontal}:host([resize="vertical"]) .control{resize:vertical}.label{display:block;color:${ec};cursor:pointer;font-size:${Wr};line-height:${Xr};margin-bottom:4px}.label__hidden{display:none;visibility:hidden}:host([disabled]) .label,:host([readonly]) .label,:host([readonly]) .control,:host([disabled]) .control{cursor:${"not-allowed"}}:host([disabled]){opacity:${Ur}}:host([disabled]) .control{border-color:${oc}}`.withBehaviors(
      To(Dt`
                :host([disabled]){opacity:1}`)
    );
class Nd extends Tn {
  connectedCallback() {
    super.connectedCallback(), this.appearance || (this.appearance = "outline");
  }
}
bc([bt], Nd.prototype, "appearance", void 0);
const Bd = Nd.compose({
    baseName: "text-area",
    template: (t, e) =>
      rt`<template class=" ${(t) => (t.readOnly ? "readonly" : "")} ${(t) =>
        t.resize !== $n.none
          ? "resize-" + t.resize
          : ""}"><label part="label" for="control" class="${(t) =>
        t.defaultSlottedNodes && t.defaultSlottedNodes.length
          ? "label"
          : "label label__hidden"}"><slot ${Yt(
        "defaultSlottedNodes"
      )}></slot></label><textarea part="control" class="control" id="control" ?autofocus="${(
        t
      ) => t.autofocus}" cols="${(t) => t.cols}" ?disabled="${(t) =>
        t.disabled}" form="${(t) => t.form}" list="${(t) =>
        t.list}" maxlength="${(t) => t.maxlength}" minlength="${(t) =>
        t.minlength}" name="${(t) => t.name}" placeholder="${(t) =>
        t.placeholder}" ?readonly="${(t) => t.readOnly}" ?required="${(t) =>
        t.required}" rows="${(t) => t.rows}" ?spellcheck="${(t) =>
        t.spellcheck}" :value="${(t) => t.value}" aria-atomic="${(t) =>
        t.ariaAtomic}" aria-busy="${(t) => t.ariaBusy}" aria-controls="${(t) =>
        t.ariaControls}" aria-current="${(t) =>
        t.ariaCurrent}" aria-describedBy="${(t) =>
        t.ariaDescribedby}" aria-details="${(t) =>
        t.ariaDetails}" aria-disabled="${(t) =>
        t.ariaDisabled}" aria-errormessage="${(t) =>
        t.ariaErrormessage}" aria-flowto="${(t) =>
        t.ariaFlowto}" aria-haspopup="${(t) => t.ariaHaspopup}" aria-hidden="${(
        t
      ) => t.ariaHidden}" aria-invalid="${(t) =>
        t.ariaInvalid}" aria-keyshortcuts="${(t) =>
        t.ariaKeyshortcuts}" aria-label="${(t) =>
        t.ariaLabel}" aria-labelledby="${(t) =>
        t.ariaLabelledby}" aria-live="${(t) => t.ariaLive}" aria-owns="${(t) =>
        t.ariaOwns}" aria-relevant="${(t) =>
        t.ariaRelevant}" aria-roledescription="${(t) =>
        t.ariaRoledescription}" @input="${(t, e) =>
        t.handleTextInput()}" @change="${(t) => t.handleChange()}" ${Bt(
        "control"
      )}></textarea></template>`,
    styles: Md,
    shadowOptions: { delegatesFocus: !0 },
  }),
  jd = Md,
  qd = (t, e) =>
    Dt`
    ${Fo(
      "inline-block"
    )} :host{font-family:${Hr};outline:none;user-select:none}.root{box-sizing:border-box;position:relative;display:flex;flex-direction:row;color:${ec};background:${Rl};border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid ${nl};height:calc(${hc} * 1px)}.control{-webkit-appearance:none;font:inherit;background:transparent;border:0;color:inherit;height:calc(100% - 4px);width:100%;margin-top:auto;margin-bottom:auto;border:none;padding:0 calc(${qr} * 2px + 1px);font-size:${Wr};line-height:${Xr}}.control:hover,.control:${So},.control:disabled,.control:active{outline:none}.label{display:block;color:${ec};cursor:pointer;font-size:${Wr};line-height:${Xr};margin-bottom:4px}.label__hidden{display:none;visibility:hidden}.start,.end{display:flex;margin:auto;fill:currentcolor}::slotted(svg){width:16px;height:16px}.start{margin-inline-start:11px}.end{margin-inline-end:11px}:host(:hover:not([disabled])) .root{background:${Ll};border-color:${rl}}:host(:active:not([disabled])) .root{background:${Ll};border-color:${al}}:host(:focus-within:not([disabled])) .root{border-color:${Xl};box-shadow:0 0 0 1px ${Xl} inset}:host([appearance="filled"]) .root{background:${Fl}}:host([appearance="filled"]:hover:not([disabled])) .root{background:${Sl}}:host([disabled]) .label,:host([readonly]) .label,:host([readonly]) .control,:host([disabled]) .control{cursor:${"not-allowed"}}:host([disabled]){opacity:${Ur}}:host([disabled]) .control{border-color:${oc}}`.withBehaviors(
      To(Dt`
                .root,:host([appearance="filled"]) .root{forced-color-adjust:none;background:${go.Field};border-color:${go.FieldText}}:host(:hover:not([disabled])) .root,:host([appearance="filled"]:hover:not([disabled])) .root,:host([appearance="filled"]:hover) .root{background:${go.Field};border-color:${go.Highlight}}.start,.end{fill:currentcolor}:host([disabled]){opacity:1}:host([disabled]) .root,:host([appearance="filled"]:hover[disabled]) .root{border-color:${go.GrayText};background:${go.Field}}:host(:focus-within:enabled) .root{border-color:${go.Highlight};box-shadow:0 0 0 1px ${go.Highlight} inset}input::placeholder{color:${go.GrayText}}`)
    );
class _d extends Us {
  connectedCallback() {
    super.connectedCallback(), this.appearance || (this.appearance = "outline");
  }
}
bc([bt], _d.prototype, "appearance", void 0);
const Ud = _d.compose({
    baseName: "text-field",
    template: (t, e) =>
      rt`<template class=" ${(t) =>
        t.readOnly
          ? "readonly"
          : ""} "><label part="label" for="control" class="${(t) =>
        t.defaultSlottedNodes && t.defaultSlottedNodes.length
          ? "label"
          : "label label__hidden"}"><slot ${Yt({
        property: "defaultSlottedNodes",
        filter: Eo,
      })}></slot></label><div class="root" part="root">${ee}<input class="control" part="control" id="control" @input="${(
        t
      ) => t.handleTextInput()}" @change="${(t) =>
        t.handleChange()}" ?autofocus="${(t) => t.autofocus}" ?disabled="${(
        t
      ) => t.disabled}" list="${(t) => t.list}" maxlength="${(t) =>
        t.maxlength}" minlength="${(t) => t.minlength}" pattern="${(t) =>
        t.pattern}" placeholder="${(t) => t.placeholder}" ?readonly="${(t) =>
        t.readOnly}" ?required="${(t) => t.required}" size="${(t) =>
        t.size}" ?spellcheck="${(t) => t.spellcheck}" :value="${(t) =>
        t.value}" type="${(t) => t.type}" aria-atomic="${(t) =>
        t.ariaAtomic}" aria-busy="${(t) => t.ariaBusy}" aria-controls="${(t) =>
        t.ariaControls}" aria-current="${(t) =>
        t.ariaCurrent}" aria-describedBy="${(t) =>
        t.ariaDescribedby}" aria-details="${(t) =>
        t.ariaDetails}" aria-disabled="${(t) =>
        t.ariaDisabled}" aria-errormessage="${(t) =>
        t.ariaErrormessage}" aria-flowto="${(t) =>
        t.ariaFlowto}" aria-haspopup="${(t) => t.ariaHaspopup}" aria-hidden="${(
        t
      ) => t.ariaHidden}" aria-invalid="${(t) =>
        t.ariaInvalid}" aria-keyshortcuts="${(t) =>
        t.ariaKeyshortcuts}" aria-label="${(t) =>
        t.ariaLabel}" aria-labelledby="${(t) =>
        t.ariaLabelledby}" aria-live="${(t) => t.ariaLive}" aria-owns="${(t) =>
        t.ariaOwns}" aria-relevant="${(t) =>
        t.ariaRelevant}" aria-roledescription="${(t) =>
        t.ariaRoledescription}" ${Bt("control")} />${te}</div></template>`,
    styles: qd,
    shadowOptions: { delegatesFocus: !0 },
  }),
  Gd = qd,
  Kd = (t, e) =>
    Dt`
        ${Fo("inline-flex")} :host{--toolbar-item-gap:calc(
                (var(--design-unit) + calc(var(--density) + 2)) * 1px
            );background-color:${il};border-radius:calc(${Br} * 1px);fill:currentcolor;padding:var(--toolbar-item-gap)}:host(${So}){outline:calc(${Gr} * 1px) solid ${rc}}.positioning-region{align-items:flex-start;display:inline-flex;flex-flow:row wrap;justify-content:flex-start}:host([orientation="vertical"]) .positioning-region{flex-direction:column}::slotted(:not([slot])){flex:0 0 auto;margin:0 var(--toolbar-item-gap)}:host([orientation="vertical"]) ::slotted(:not([slot])){margin:var(--toolbar-item-gap) 0}.start,.end{display:flex;margin:auto;margin-inline:0}::slotted(svg){width:16px;height:16px}`.withBehaviors(
      To(Dt`
            :host(:${So}){box-shadow:0 0 0 calc(${Kr} * 1px) ${go.Highlight};color:${go.ButtonText};forced-color-adjust:none}`)
    );
class Wd extends Fn {
  connectedCallback() {
    super.connectedCallback();
    const t = ko(this);
    t &&
      il.setValueFor(this, (e) =>
        Gl.getValueFor(e).evaluate(e, il.getValueFor(t))
      );
  }
}
const Xd = Wd.compose({
    baseName: "toolbar",
    template: (t, e) =>
      rt`<template aria-label="${(t) => t.ariaLabel}" aria-labelledby="${(t) =>
        t.ariaLabelledby}" aria-orientation="${(t) =>
        t.orientation}" orientation="${(t) =>
        t.orientation}" role="toolbar" @click="${(t, e) =>
        t.clickHandler(e.event)}" @focusin="${(t, e) =>
        t.focusinHandler(e.event)}" @keydown="${(t, e) =>
        t.keydownHandler(
          e.event
        )}"><slot name="label"></slot><div class="positioning-region" part="positioning-region">${ee}<slot ${Yt(
        { filter: Kt(), property: "slottedItems" }
      )}></slot>${te}</div></template>`,
    styles: Kd,
    shadowOptions: { delegatesFocus: !0 },
  }),
  Yd = Kd,
  Qd = (t, e) =>
    Dt`
        :host{contain:layout;overflow:visible;height:0;width:0}.tooltip{box-sizing:border-box;border-radius:calc(${Br} * 1px);border:calc(${Gr} * 1px) solid ${Xl};box-shadow:0 0 0 1px ${Xl} inset;background:${Fl};color:${ec};padding:4px;height:fit-content;width:fit-content;font-family:${Hr};font-size:${Wr};line-height:${Xr};white-space:nowrap;z-index:10000}${t.tagFor(
      Oo
    )}{display:flex;justify-content:center;align-items:center;overflow:visible;flex-direction:row}${t.tagFor(
      Oo
    )}.right,${t.tagFor(Oo)}.left{flex-direction:column}${t.tagFor(
      Oo
    )}.top .tooltip{margin-bottom:4px}${t.tagFor(
      Oo
    )}.bottom .tooltip{margin-top:4px}${t.tagFor(
      Oo
    )}.left .tooltip{margin-right:4px}${t.tagFor(
      Oo
    )}.right .tooltip{margin-left:4px}`.withBehaviors(
      To(Dt`
                :host([disabled]){opacity:1}`)
    ),
  Zd = En.compose({
    baseName: "tooltip",
    template: (t, e) =>
      rt` ${jt(
        (t) => t.tooltipVisible,
        rt`<${t.tagFor(Oo)} fixed-placement="true" auto-update-mode="${(t) =>
          t.autoUpdateMode}" vertical-positioning-mode="${(t) =>
          t.verticalPositioningMode}" vertical-default-position="${(t) =>
          t.verticalDefaultPosition}" vertical-inset="${(t) =>
          t.verticalInset}" vertical-scaling="${(t) =>
          t.verticalScaling}" horizontal-positioning-mode="${(t) =>
          t.horizontalPositioningMode}" horizontal-default-position="${(t) =>
          t.horizontalDefaultPosition}" horizontal-scaling="${(t) =>
          t.horizontalScaling}" horizontal-inset="${(t) =>
          t.horizontalInset}" dir="${(t) => t.currentDirection}" ${Bt(
          "region"
        )}><div class="tooltip" part="tooltip" role="tooltip"><slot></slot></div></${t.tagFor(
          Oo
        )}>`
      )} `,
    styles: Qd,
  }),
  Jd = Qd,
  tu = Dt`
    .expand-collapse-glyph{transform:rotate(0deg)}:host(.nested) .expand-collapse-button{left:var(--expand-collapse-button-nested-width,calc(${hc} * -1px))}:host([selected])::after{left:calc(${Kr} * 1px)}:host([expanded]) > .positioning-region .expand-collapse-glyph{transform:rotate(45deg)}`,
  eu = Dt`
    .expand-collapse-glyph{transform:rotate(180deg)}:host(.nested) .expand-collapse-button{right:var(--expand-collapse-button-nested-width,calc(${hc} * -1px))}:host([selected])::after{right:calc(${Kr} * 1px)}:host([expanded]) > .positioning-region .expand-collapse-glyph{transform:rotate(135deg)}`,
  iu = Ot`((${zr} / 2) * ${qr}) + ((${qr} * ${jr}) / 2)`,
  ou = ws.create("tree-item-expand-collapse-hover").withDefault((t) => {
    const e = Pl.getValueFor(t);
    return e.evaluate(t, e.evaluate(t).hover).hover;
  }),
  su = ws
    .create("tree-item-expand-collapse-selected-hover")
    .withDefault((t) => {
      const e = Il.getValueFor(t);
      return Pl.getValueFor(t).evaluate(t, e.evaluate(t).rest).hover;
    }),
  nu = (t, e) =>
    Dt`
    ${Fo(
      "block"
    )} :host{contain:content;position:relative;outline:none;color:${ec};background:${Hl};cursor:pointer;font-family:${Hr};--expand-collapse-button-size:calc(${hc} * 1px);--tree-item-nested-width:0}:host(:focus) > .positioning-region{outline:none}:host(:focus) .content-region{outline:none}:host(:${So}) .positioning-region{border:${Xl} calc(${Gr} * 1px) solid;border-radius:calc(${Br} * 1px);color:${ec}}.positioning-region{display:flex;position:relative;box-sizing:border-box;border:transparent calc(${Gr} * 1px) solid;height:calc((${hc} + 1) * 1px)}.positioning-region::before{content:"";display:block;width:var(--tree-item-nested-width);flex-shrink:0}.positioning-region:hover{background:${zl}}.positioning-region:active{background:${Ml}}.content-region{display:inline-flex;align-items:center;white-space:nowrap;width:100%;height:calc(${hc} * 1px);margin-inline-start:calc(${qr} * 2px + 8px);font-size:${Wr};line-height:${Xr};font-weight:400}.items{display:none;font-size:calc(1em + (${qr} + 16) * 1px)}.expand-collapse-button{background:none;border:none;outline:none;width:calc((${iu} + (${qr} * 2)) * 1px);height:calc((${iu} + (${qr} * 2)) * 1px);padding:0;display:flex;justify-content:center;align-items:center;cursor:pointer;margin-left:6px;margin-right:6px}.expand-collapse-glyph{width:16px;height:16px;transition:transform 0.1s linear;pointer-events:none;fill:currentcolor}.start,.end{display:flex;fill:currentcolor}::slotted(svg){width:16px;height:16px}.start{margin-inline-end:calc(${qr} * 2px + 2px)}.end{margin-inline-start:calc(${qr} * 2px + 2px)}:host([expanded]) > .items{display:block}:host([disabled]) .content-region{opacity:${Ur};cursor:${"not-allowed"}}:host(.nested) .content-region{position:relative;margin-inline-start:var(--expand-collapse-button-size)}:host(.nested) .expand-collapse-button{position:absolute}:host(.nested) .expand-collapse-button:hover{background:${ou}}:host([selected]) .positioning-region{background:${Fl}}:host([selected]) .expand-collapse-button:hover{background:${su}}:host([selected])::after{background:${wl};border-radius:calc(${Br} * 1px);content:"";display:block;position:absolute;top:calc((${hc} / 4) * 1px);width:3px;height:calc((${hc} / 2) * 1px)}::slotted(${t.tagFor(
      Rn
    )}){--tree-item-nested-width:1em;--expand-collapse-button-nested-width:calc(${hc} * -1px)}`.withBehaviors(
      new Cc(tu, eu),
      To(Dt`
            :host{forced-color-adjust:none;border-color:transparent;background:${go.Field};color:${go.FieldText}}:host .content-region .expand-collapse-glyph{fill:${go.FieldText}}:host .positioning-region:hover,:host([selected]) .positioning-region{background:${go.Highlight}}:host .positioning-region:hover .content-region,:host([selected]) .positioning-region .content-region{color:${go.HighlightText}}:host .positioning-region:hover .content-region .expand-collapse-glyph,:host .positioning-region:hover .content-region .start,:host .positioning-region:hover .content-region .end,:host([selected]) .content-region .expand-collapse-glyph,:host([selected]) .content-region .start,:host([selected]) .content-region .end{fill:${go.HighlightText}}:host([selected])::after{background:${go.Field}}:host(:${So}) .positioning-region{border-color:${go.FieldText};box-shadow:0 0 0 2px inset ${go.Field};color:${go.FieldText}}:host([disabled]) .content-region,:host([disabled]) .positioning-region:hover .content-region{opacity:1;color:${go.GrayText}}:host([disabled]) .content-region .expand-collapse-glyph,:host([disabled]) .content-region .start,:host([disabled]) .content-region .end,:host([disabled]) .positioning-region:hover .content-region .expand-collapse-glyph,:host([disabled]) .positioning-region:hover .content-region .start,:host([disabled]) .positioning-region:hover .content-region .end{fill:${go.GrayText}}:host([disabled]) .positioning-region:hover{background:${go.Field}}.expand-collapse-glyph,.start,.end{fill:${go.FieldText}}:host(.nested) .expand-collapse-button:hover{background:${go.Field}}:host(.nested) .expand-collapse-button:hover .expand-collapse-glyph{fill:${go.FieldText}}`)
    ),
  ru = Rn.compose({
    baseName: "tree-item",
    template: (t, e) =>
      rt`<template role="treeitem" slot="${(t) =>
        t.isNestedItem() ? "item" : void 0}" tabindex="${(t) =>
        t.disabled || !t.focusable ? void 0 : 0}" class="${(t) =>
        t.expanded ? "expanded" : ""} ${(t) =>
        t.selected ? "selected" : ""} ${(t) => (t.nested ? "nested" : "")} ${(
        t
      ) => (t.disabled ? "disabled" : "")}" aria-expanded="${(t) =>
        t.childItems && t.childItemLength() > 0
          ? t.expanded
          : void 0}" aria-selected="${(t) => t.selected}" aria-disabled="${(
        t
      ) => t.disabled}" @keydown="${(t, e) =>
        t.handleKeyDown(e.event)}" @click="${(t, e) =>
        t.handleClick(e.event)}" ${Zt({
        property: "childItems",
        filter: Kt(),
      })}><div class="positioning-region" part="positioning-region"><div class="content-region" part="content-region">${jt(
        (t) => t.childItems && t.childItemLength() > 0,
        rt`<div aria-hidden="true" class="expand-collapse-button" part="expand-collapse-button" @click="${(
          t,
          e
        ) => t.handleExpandCollapseButtonClick(e.event)}" ${Bt(
          "expandCollapseButton"
        )}><slot name="expand-collapse-glyph">${
          e.expandCollapseGlyph || ""
        }</slot></div>`
      )} ${ee}<slot></slot>${te}</div></div>${jt(
        (t) =>
          t.childItems &&
          t.childItemLength() > 0 &&
          (t.expanded || t.renderCollapsedChildren),
        rt`<div role="group" class="items" part="items"><slot name="item" ${Yt(
          "items"
        )}></slot></div>`
      )}</template>`,
    styles: nu,
    expandCollapseGlyph:
      '\n        <svg\n            viewBox="0 0 16 16"\n            xmlns="http://www.w3.org/2000/svg"\n            class="expand-collapse-glyph"\n        >\n            <path\n                d="M5.00001 12.3263C5.00124 12.5147 5.05566 12.699 5.15699 12.8578C5.25831 13.0167 5.40243 13.1437 5.57273 13.2242C5.74304 13.3047 5.9326 13.3354 6.11959 13.3128C6.30659 13.2902 6.4834 13.2152 6.62967 13.0965L10.8988 8.83532C11.0739 8.69473 11.2153 8.51658 11.3124 8.31402C11.4096 8.11146 11.46 7.88966 11.46 7.66499C11.46 7.44033 11.4096 7.21853 11.3124 7.01597C11.2153 6.81341 11.0739 6.63526 10.8988 6.49467L6.62967 2.22347C6.48274 2.10422 6.30501 2.02912 6.11712 2.00691C5.92923 1.9847 5.73889 2.01628 5.56823 2.09799C5.39757 2.17969 5.25358 2.30817 5.153 2.46849C5.05241 2.62882 4.99936 2.8144 5.00001 3.00369V12.3263Z"\n            />\n        </svg>\n    ',
  }),
  au = nu,
  lu = (t, e) => Dt`
    :host([hidden]){display:none}${Fo(
      "flex"
    )} :host{flex-direction:column;align-items:stretch;min-width:fit-content;font-size:0}:host:focus-visible{outline:none}`,
  cu = Ln.compose({
    baseName: "tree-view",
    template: (t, e) =>
      rt`<template role="tree" ${Bt("treeView")} @keydown="${(t, e) =>
        t.handleKeyDown(e.event)}" @focusout="${(t, e) =>
        t.handleBlur(e.event)}"><slot ${Yt(
        "slottedTreeItems"
      )}></slot></template>`,
    styles: lu,
  }),
  hu = lu,
  du = {
    fastAccordion: gc,
    fastAccordionItem: uc,
    fastAnchor: Ec,
    fastAnchoredRegion: Rc,
    fastAvatar: Hc,
    fastBadge: Nc,
    fastBreadcrumb: qc,
    fastBreadcrumbItem: jc,
    fastButton: Gc,
    fastCard: Yc,
    fastCheckbox: Jc,
    fastCombobox: oh,
    fastDataGrid: uh,
    fastDataGridCell: lh,
    fastDataGridRow: hh,
    fastDesignSystemProvider: xh,
    fastDialog: wh,
    fastDisclosure: Fh,
    fastDivider: Dh,
    fastFlipper: Rh,
    fastHorizontalScroll: zh,
    fastListbox: qh,
    fastOption: Nh,
    fastMenu: Xh,
    fastMenuItem: Gh,
    fastNumberField: td,
    fastProgress: nd,
    fastProgressRing: id,
    fastRadio: dd,
    fastRadioGroup: ld,
    fastSelect: pd,
    fastSkeleton: bd,
    fastSlider: Td,
    fastSliderLabel: wd,
    fastSwitch: Sd,
    fastTabs: Hd,
    fastTab: Rd,
    fastTabPanel: Vd,
    fastTextArea: Bd,
    fastTextField: Ud,
    fastTooltip: Zd,
    fastToolbar: Xd,
    fastTreeView: cu,
    fastTreeItem: ru,
    register(t) {
      if (t) for (const e in this) "register" !== e && this[e]().register(t);
    },
  };
function uu(t) {
  return je.getOrCreate(t).withPrefix("fast");
}
const pu = uu().register(du);
export {
  vo as Accordion,
  Xe as AccordionItem,
  Sc as Anchor,
  Oo as AnchoredRegion,
  Vc as Avatar,
  Lo as Badge,
  Vo as Breadcrumb,
  Ao as BreadcrumbItem,
  Uc as Button,
  Xc as Card,
  Go as Checkbox,
  os as Combobox,
  cs as DataGrid,
  us as DataGridCell,
  ls as DataGridRow,
  mh as DesignSystemProvider,
  Ls as Dialog,
  Cc as DirectionalStyleSheetBehavior,
  Th as Disclosure,
  Hs as Divider,
  pu as FASTDesignSystem,
  zs as Flipper,
  Hh as HorizontalScroll,
  Jo as Listbox,
  Zo as ListboxOption,
  Bs as Menu,
  Ns as MenuItem,
  Zh as NumberField,
  Ir as PaletteRGB,
  Ys as Progress,
  Ys as ProgressRing,
  tn as Radio,
  Qs as RadioGroup,
  nn as Select,
  an as Skeleton,
  gn as Slider,
  $d as SliderLabel,
  Ar as StandardLuminance,
  $r as SwatchRGB,
  mn as Switch,
  yn as Tab,
  vn as TabPanel,
  wn as Tabs,
  Nd as TextArea,
  _d as TextField,
  Wd as Toolbar,
  En as Tooltip,
  Rn as TreeItem,
  Ln as TreeView,
  al as accentFillActive,
  ga as accentFillActiveDelta,
  ll as accentFillFocus,
  fa as accentFillFocusDelta,
  rl as accentFillHover,
  pa as accentFillHoverDelta,
  sl as accentFillRecipe,
  nl as accentFillRest,
  ua as accentFillRestDelta,
  Cl as accentForegroundActive,
  va as accentForegroundActiveDelta,
  Tl as accentForegroundFocus,
  ya as accentForegroundFocusDelta,
  kl as accentForegroundHover,
  ma as accentForegroundHoverDelta,
  $l as accentForegroundRecipe,
  wl as accentForegroundRest,
  ba as accentForegroundRestDelta,
  qa as accentPalette,
  pc as accordionItemStyles,
  fc as accordionStyles,
  du as allComponents,
  Dc as anchorStyles,
  Lc as anchoredRegionStyles,
  zc as avatarStyles,
  Bc as badgeStyles,
  zr as baseHeightMultiplier,
  Mr as baseHorizontalSpacingMultiplier,
  Nr as baseLayerLuminance,
  Hr as bodyFont,
  Kc as buttonStyles,
  Qc as cardStyles,
  th as checkboxStyles,
  sh as comboboxStyles,
  Br as controlCornerRadius,
  ch as dataGridCellStyles,
  dh as dataGridRowStyles,
  ph as dataGridStyles,
  jr as density,
  yh as designSystemProviderStyles,
  vh as designSystemProviderTemplate,
  qr as designUnit,
  kh as dialogStyles,
  _r as direction,
  Ur as disabledOpacity,
  Ih as disclosureStyles,
  Eh as dividerStyles,
  gc as fastAccordion,
  uc as fastAccordionItem,
  Ec as fastAnchor,
  Rc as fastAnchoredRegion,
  Hc as fastAvatar,
  Nc as fastBadge,
  qc as fastBreadcrumb,
  jc as fastBreadcrumbItem,
  Gc as fastButton,
  Yc as fastCard,
  Jc as fastCheckbox,
  oh as fastCombobox,
  uh as fastDataGrid,
  lh as fastDataGridCell,
  hh as fastDataGridRow,
  xh as fastDesignSystemProvider,
  wh as fastDialog,
  Fh as fastDisclosure,
  Dh as fastDivider,
  Rh as fastFlipper,
  zh as fastHorizontalScroll,
  qh as fastListbox,
  Xh as fastMenu,
  Gh as fastMenuItem,
  td as fastNumberField,
  Nh as fastOption,
  nd as fastProgress,
  id as fastProgressRing,
  dd as fastRadio,
  ld as fastRadioGroup,
  pd as fastSelect,
  bd as fastSkeleton,
  Td as fastSlider,
  wd as fastSliderLabel,
  Sd as fastSwitch,
  Rd as fastTab,
  Vd as fastTabPanel,
  Hd as fastTabs,
  Bd as fastTextArea,
  Ud as fastTextField,
  Xd as fastToolbar,
  Zd as fastTooltip,
  ru as fastTreeItem,
  cu as fastTreeView,
  il as fillColor,
  Lh as flipperStyles,
  Ql as focusStrokeInner,
  Yl as focusStrokeInnerRecipe,
  Xl as focusStrokeOuter,
  Wl as focusStrokeOuterRecipe,
  Kr as focusStrokeWidth,
  pl as foregroundOnAccentActive,
  vl as foregroundOnAccentActiveLarge,
  gl as foregroundOnAccentFocus,
  yl as foregroundOnAccentFocusLarge,
  ul as foregroundOnAccentHover,
  ml as foregroundOnAccentHoverLarge,
  fl as foregroundOnAccentLargeRecipe,
  hl as foregroundOnAccentRecipe,
  dl as foregroundOnAccentRest,
  bl as foregroundOnAccentRestLarge,
  Pc as imgTemplate,
  Cr as isDark,
  _h as listboxStyles,
  Kh as menuItemStyles,
  Yh as menuStyles,
  Dl as neutralFillActive,
  wa as neutralFillActiveDelta,
  El as neutralFillFocus,
  ka as neutralFillFocusDelta,
  Sl as neutralFillHover,
  $a as neutralFillHoverDelta,
  Al as neutralFillInputActive,
  Ia as neutralFillInputActiveDelta,
  Vl as neutralFillInputFocus,
  Fa as neutralFillInputFocusDelta,
  Ll as neutralFillInputHover,
  Ta as neutralFillInputHoverDelta,
  Ol as neutralFillInputRecipe,
  Rl as neutralFillInputRest,
  Ca as neutralFillInputRestDelta,
  Gl as neutralFillLayerRecipe,
  Kl as neutralFillLayerRest,
  Pa as neutralFillLayerRestDelta,
  Il as neutralFillRecipe,
  Fl as neutralFillRest,
  xa as neutralFillRestDelta,
  Ml as neutralFillStealthActive,
  Ea as neutralFillStealthActiveDelta,
  Nl as neutralFillStealthFocus,
  Oa as neutralFillStealthFocusDelta,
  zl as neutralFillStealthHover,
  Da as neutralFillStealthHoverDelta,
  Pl as neutralFillStealthRecipe,
  Hl as neutralFillStealthRest,
  Sa as neutralFillStealthRestDelta,
  _l as neutralFillStrongActive,
  Aa as neutralFillStrongActiveDelta,
  Ul as neutralFillStrongFocus,
  Va as neutralFillStrongFocusDelta,
  ql as neutralFillStrongHover,
  La as neutralFillStrongHoverDelta,
  Bl as neutralFillStrongRecipe,
  jl as neutralFillStrongRest,
  Ra as neutralFillStrongRestDelta,
  Jl as neutralForegroundHint,
  Zl as neutralForegroundHintRecipe,
  tc as neutralForegroundRecipe,
  ec as neutralForegroundRest,
  Xa as neutralLayer1,
  Wa as neutralLayer1Recipe,
  Qa as neutralLayer2,
  Ya as neutralLayer2Recipe,
  Ja as neutralLayer3,
  Za as neutralLayer3Recipe,
  el as neutralLayer4,
  tl as neutralLayer4Recipe,
  Ua as neutralLayerCardContainer,
  _a as neutralLayerCardContainerRecipe,
  Ka as neutralLayerFloating,
  Ga as neutralLayerFloatingRecipe,
  ja as neutralPalette,
  nc as neutralStrokeActive,
  Ma as neutralStrokeActiveDelta,
  ac as neutralStrokeDividerRecipe,
  lc as neutralStrokeDividerRest,
  Ba as neutralStrokeDividerRestDelta,
  rc as neutralStrokeFocus,
  Na as neutralStrokeFocusDelta,
  sc as neutralStrokeHover,
  za as neutralStrokeHoverDelta,
  ic as neutralStrokeRecipe,
  oc as neutralStrokeRest,
  Ha as neutralStrokeRestDelta,
  Jh as numberFieldStyles,
  Bh as optionStyles,
  od as progressRingStyles,
  rd as progressStyles,
  uu as provideFASTDesignSystem,
  cd as radioGroupStyles,
  ud as radioStyles,
  gd as selectStyles,
  md as skeletonStyles,
  kd as sliderLabelStyles,
  Id as sliderStyles,
  Gr as strokeWidth,
  Dd as switchStyles,
  Pd as tabPanelStyles,
  Ld as tabStyles,
  zd as tabsStyles,
  jd as textAreaStyles,
  Gd as textFieldStyles,
  Yd as toolbarStyles,
  Jd as tooltipStyles,
  au as treeItemStyles,
  hu as treeViewStyles,
  Wr as typeRampBaseFontSize,
  Xr as typeRampBaseLineHeight,
  Yr as typeRampMinus1FontSize,
  Qr as typeRampMinus1LineHeight,
  Zr as typeRampMinus2FontSize,
  Jr as typeRampMinus2LineHeight,
  ta as typeRampPlus1FontSize,
  ea as typeRampPlus1LineHeight,
  ia as typeRampPlus2FontSize,
  oa as typeRampPlus2LineHeight,
  sa as typeRampPlus3FontSize,
  na as typeRampPlus3LineHeight,
  ra as typeRampPlus4FontSize,
  aa as typeRampPlus4LineHeight,
  la as typeRampPlus5FontSize,
  ca as typeRampPlus5LineHeight,
  ha as typeRampPlus6FontSize,
  da as typeRampPlus6LineHeight,
};
