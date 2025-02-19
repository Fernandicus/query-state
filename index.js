var q = Object.defineProperty;
var F = (s, t, e) => t in s ? q(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var S = (s, t, e) => F(s, typeof t != "symbol" ? t + "" : t, e);
import { useState as b, useEffect as A, useMemo as p, useCallback as f } from "react";
class y {
  constructor(t) {
    S(this, "queryName");
    S(this, "urlSearchParams");
    this.queryName = t.queryName, this.urlSearchParams = new URLSearchParams(t.searchParams);
  }
  set(t) {
    return this.urlSearchParams.set(this.queryName, t);
  }
  append(t) {
    return this.urlSearchParams.append(this.queryName, t);
  }
  get() {
    return this.urlSearchParams.get(this.queryName);
  }
  getAll() {
    return this.urlSearchParams.getAll(this.queryName);
  }
  delete() {
    return this.urlSearchParams.delete(this.queryName);
  }
  has() {
    return this.urlSearchParams.has(this.queryName);
  }
  entries() {
    return this.urlSearchParams.entries();
  }
  keys() {
    return this.urlSearchParams.keys();
  }
  sort() {
    return this.urlSearchParams.sort();
  }
  values() {
    return this.urlSearchParams.values();
  }
  toString() {
    return this.urlSearchParams.toString();
  }
}
class m {
  constructor(t) {
    this.props = t;
  }
  static build(t) {
    return new m(t);
  }
  static customValidation(t) {
    return new m({
      name: t.name,
      values: [],
      defaultValue: "",
      get: t.getState,
      set: t.setState
    });
  }
  getState(t) {
    const e = new y({ queryName: this.props.name, searchParams: t });
    if (this.props.get)
      return this.customGet(e);
    const r = e.get();
    if (!r) return this.props.defaultValue;
    const a = r.split(",");
    if (a.length > 1)
      return this.matchedValuesInArray(this.props.values, a);
    const u = this.props.values.find((i) => i === r);
    return u || this.props.defaultValue;
  }
  setState(t, e) {
    const r = new y({ queryName: this.props.name, searchParams: t });
    if (Array.isArray(e)) {
      if (this.props.set)
        return this.customSet(r, e);
      const a = this.matchedValuesInArray(this.props.values, e);
      return a.length > 0 && r.set(a.join(",")), r.toString();
    }
    return this.props.set ? this.customSet(r, e) : !e && !this.props.defaultValue ? (r.delete(), r.toString()) : e ? this.props.values.includes(e) ? (r.set(`${e}`), r.toString()) : (r.set(this.props.defaultValue.toString()), r.toString()) : (r.set(this.props.defaultValue.toString()), r.toString());
  }
  matchedValuesInArray(t, e) {
    const r = new Set(t), a = new Set(e).intersection(r);
    return Array.from(a);
  }
  customSet(t, e) {
    const r = this.props.set(t, e);
    return r === void 0 ? (t.set(e ? `${e}` : ""), t.toString()) : r.toString();
  }
  customGet(t) {
    const e = this.props.get(t);
    if (e === void 0)
      return t.get() ?? "";
    const r = e.split(",");
    return r.length > 1 ? r : e;
  }
}
function P(s) {
  throw new Error("Unhandled type " + s);
}
function N(s) {
  const { currentState: t, deleteValue: e, name: r, searchParams: a } = s;
  if (e === "all")
    return a.delete(r), a;
  const i = new Set([t].flat()).difference(new Set([e].flat()));
  return i.size === 0 ? (a.delete(r), a) : (a.set(r, Array.from(i).toString()), a);
}
class h {
  constructor(t) {
    this.props = t;
  }
  static buildComposed(t) {
    return new h(t);
  }
  static container(t) {
    return new h({
      name: "",
      ids: t
    });
  }
  getState(t, e) {
    return this.build(e).getState(t);
  }
  setState({ key: t, searchParams: e, value: r }) {
    return this.build(t).setState(e, r);
  }
  getAll(t) {
    const e = new URLSearchParams();
    return Object.entries(this.props.ids).forEach(([r, a]) => {
      const u = r, i = this.build(u).getState(t);
      i && e.set(this.buildNameFromKey(u), i.toString());
    }), e.toString();
  }
  build(t) {
    const e = this.props.ids[t], r = e.type;
    let a;
    switch (r) {
      case "custom":
        a = m.customValidation({
          name: this.buildNameFromKey(t),
          getState: e.params.getState,
          setState: e.params.setState
        });
        break;
      case "simple":
        a = m.build({
          name: this.buildNameFromKey(t),
          values: e.params.values,
          defaultValue: e.params.defaultValue
        });
        break;
      case "any":
        a = m.customValidation({
          name: this.buildNameFromKey(t),
          getState(u) {
            return u.get() ?? "";
          },
          setState(u, i) {
            return i ? (u.set(i), u) : (u.delete(), u);
          }
        });
        break;
      default:
        throw P(r);
    }
    return a;
  }
  buildNameFromKey(t) {
    const e = this.props.name;
    return e ? `${e}.${t}` : t;
  }
}
function U(s) {
  const { props: t, searchParams: e, updateSearchParams: r } = s, [a, u] = b(e);
  A(() => {
    u(e);
  }, [e]);
  const i = p(() => t.name ? h.buildComposed({
    ids: t.ids,
    name: t.name
  }) : h.container(t.ids), [t]), l = f(
    (n, o) => {
      const d = i.setState({
        searchParams: a,
        key: n,
        value: o
      }), g = new URLSearchParams(d);
      r(g), u(g);
    },
    [i]
  ), c = f((n) => i.getState(e, n), [e]);
  return {
    state: {
      value(n) {
        return i.getState(a, n);
      },
      is(n, o) {
        return this.value(n) === o;
      },
      has(n, o) {
        return c(n).includes(o);
      },
      isArray: V,
      firstElement(n) {
        const o = c(n);
        return V(o) ? o[0] : o;
      },
      validateAll() {
        return i.getAll(e);
      }
    },
    clean(n, o) {
      const d = N({
        currentState: c(n),
        deleteValue: o,
        name: v({
          name: t.name,
          id: n
        }),
        searchParams: e
      });
      r(d);
    },
    setState: l
  };
}
function V(s) {
  return Array.isArray(s);
}
function v(s) {
  return s.name ? `${s.name}.${s.id}` : s.id;
}
function E({ props: s, searchParams: t, updateSearchParams: e }) {
  const [r, a] = b(t);
  A(() => {
    a(t);
  }, [t]);
  const u = p(() => {
    const c = s.type;
    switch (c) {
      case "custom":
        return m.customValidation(s.params);
      case "simple":
        return m.build(s.params);
      case "any":
        return m.customValidation({
          name: s.params.name,
          getState(n) {
            return n.get() ?? "";
          },
          setState(n, o) {
            return o ? (n.set(o), n) : (n.delete(), n);
          }
        });
      default:
        throw P(c);
    }
  }, []), i = f(
    (c) => {
      const n = u.setState(r, c), o = new URLSearchParams(n);
      a(o), e(o);
    },
    [r]
  ), l = p(() => u.getState(r), [r]);
  return {
    state: {
      value: l,
      is(c) {
        return l === c;
      },
      has(c) {
        return l.includes(c);
      },
      isArray: w,
      firstElement() {
        return w(l) ? l[0] : l;
      }
    },
    setState: i,
    clean(c) {
      const n = N({
        currentState: l,
        deleteValue: c,
        name: s.params.name,
        searchParams: t
      });
      e(n);
    }
  };
}
function w(s) {
  return Array.isArray(s);
}
export {
  m as URLStateHandler,
  U as useUrlMultiState,
  E as useUrlState
};
