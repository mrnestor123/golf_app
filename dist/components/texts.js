import { config } from "./config.js";
export { H1, H2, H3, H4, Text, SmallText, TinyText };
/*
*
* TEXTOS
*
*/
function H1() {
    return {
        view: (vnode) => {
            return m("h1", {
                style: {
                    fontSize: '2.5rem',
                    lineHeight: '2.25',
                    fontFamily: config.fontFamily,
                    //fontWeight:'lighter', 
                    marginTop: 0,
                    marginBottom: 0,
                    ...vnode.attrs?.style || vnode.attrs
                },
                //class: vnode.attrs.class
            }, vnode.children);
        }
    };
}
function H2() {
    return {
        view: (vnode) => {
            return m("h2", {
                style: {
                    fontSize: '1.5rem',
                    lineHeight: '1.5',
                    marginBottom: 0,
                    fontFamily: config.fontFamily,
                    marginTop: 0,
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function H3() {
    return {
        view: (vnode) => {
            return m("h3", {
                style: {
                    marginTop: 0,
                    marginBottom: 0,
                    fontFamily: config.fontFamily,
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function H4() {
    return {
        view: (vnode) => {
            return m("h4", {
                style: {
                    marginTop: 0,
                    marginBottom: 0,
                    fontFamily: config.fontFamily,
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function Text() {
    return {
        view: (vnode) => {
            return m("p", {
                style: {
                    fontSize: '1rem',
                    lineHeight: '1.4',
                    margin: 0,
                    fontFamily: config.fontFamily,
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function SmallText() {
    return {
        view: (vnode) => {
            return m("p", {
                style: {
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    margin: 0,
                    fontFamily: config.fontFamily,
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function TinyText() {
    return {
        view: (vnode) => {
            return m("p", {
                style: {
                    fontSize: '0.75rem',
                    //fontSize: '0.8em', utilizar em o px ??
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
