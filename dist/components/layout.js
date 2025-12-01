export { Container, Grid, FlexCol, FlexRow, Div, Animate, Tappable, Draggable, Box, CssStyle };
function Container() {
    return {
        view: (vnode) => {
            return [
                m("style", `.container {
                        @media (width < 576px ) {
                            width: 95% !important;
                        }

                        @media (width >= 576px ) {
                            width: 90% !important;
                        }
                        
                        /*
                        @media (width>=768px) {
                            width: 720px !important;
                        }

                        @media (width>=992px) {
                            width: 960px !important;
                        }*/

                        @media (width>=1200px ) {
                            width: 80% !important;
                        }
                    }
                    .container {
                        margin:0 auto !important;
                    }
                `),
                m("div", {
                    class: "container",
                }, m(Div, {
                    //width: getWidth(),
                    paddingTop: '1em',
                    paddingBottom: '1em',
                    margin: '0 auto',
                    ...vnode.attrs
                }, vnode.children))
            ];
        }
    };
}
/*
*
* COMPONENTES LAYOUT
*
*/
/**
 * Anima un componente
 * @param {String} alignItems
 * @param {String} justifyContent
 */
function FlexCol() {
    return {
        view: (vnode) => {
            /// let {justifyContent, alignItems} = vnode.attrs
            return m("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    ...vnode.attrs?.style || vnode.attrs
                },
            }, vnode.children);
        }
    };
}
// POR DEFECTO LAS COLUMNAS Y ROWS ESTAN EN EL CENTRO
function FlexRow() {
    return {
        view: (vnode) => {
            return m("div", {
                style: {
                    display: 'flex',
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function Grid() {
    let columns = 1;
    let lastColumns = 1;
    let mobileColumns;
    let tabletColumns;
    let computerColumns;
    let id;
    return {
        oninit: (vnode) => {
            if (typeof vnode.attrs.columns == "object") {
                columns = vnode.attrs.columns?.computer;
                computerColumns = vnode.attrs.columns?.computer;
                mobileColumns = vnode.attrs.columns?.mobile;
                tabletColumns = vnode.attrs.columns?.tablet;
            }
            else {
                columns = vnode.attrs.columns;
                computerColumns = vnode.attrs.columns;
                if (vnode.attrs.mobileColumns)
                    mobileColumns = vnode.attrs.mobileColumns;
            }
            id = vnode.attrs.id || `grid-${Math.random().toString(36).substring(2, 9)}`;
        },
        view: (vnode) => {
            return [
                m("style", `#${id} {
                        display: grid;
                        grid-template-columns: repeat(${columns}, minmax(0, 1fr));
                        gap: 1em;
                    }  `
                    // add styles for mobile and tablet with media queries
                    + (mobileColumns ? `@media (max-width: 768px) { #${id} { grid-template-columns: repeat(${mobileColumns}, minmax(0, 1fr)); } }` : '')
                    + (tabletColumns ? `@media (min-width: 769px) and (max-width: 992px) { #${id} { grid-template-columns: repeat(${tabletColumns}, minmax(0, 1fr)); } }` : '')
                    + (computerColumns ? `@media (min-width: 993px) { #${id} { grid-template-columns: repeat(${computerColumns}, minmax(0, 1fr)); } }` : '')),
                m("div", {
                    id: id,
                    style: {
                        ...vnode.attrs.style || vnode.attrs,
                    }
                }, vnode.children)
            ];
        }
    };
}
// UN DIV AL QUE SE LE PUEDE METER DE TODOS
function Box() {
    return {
        view: (vnode) => {
            return m("div", {
                style: {
                    height: vnode.attrs.height,
                    width: vnode.attrs.width
                }
            });
        }
    };
}
/**
 ** @param {Object} style - Estilos base
 ** @param {String} id - Id del div
*/
function Div() {
    return {
        view: (vnode) => {
            return m("div", {
                style: {
                    ...vnode.attrs.style
                        ? vnode.attrs.style
                        : vnode.attrs,
                },
                ...vnode.attrs.id && {
                    id: vnode.attrs.id
                },
            }, vnode.children);
        }
    };
}
/**
 * Anima un componente
 * @param {Object} style - Estilos base del componente
 * @param {Object} hover - Estilos para animar al hacer hover
 * @param {Object} click - Estilos para animar al hacer click
 * @param {Function} onhover - Funcion que se ejecuta al hacer hover
 * @param {Function} onclick - Funcion que se ejecuta al hacer click
 * @param {Function} onmousedown - Funcion que se ejecuta al hacer mousedown
 * @param {Function} onmouseup - Funcion que se ejecuta al hacer mouseup
*/
function Tappable() {
    let elem;
    let clickout;
    function checkclickout(e) {
        if (!elem.contains(e.target)) {
            clickout();
        }
    }
    return {
        view: (vnode) => {
            return m("div", {
                oncreate: ({ dom }) => {
                    elem = dom;
                    if (vnode.attrs.clickout) {
                        clickout = vnode.attrs.clickout;
                        document.body.removeEventListener('click', checkclickout);
                        document.body.addEventListener("click", checkclickout);
                    }
                },
                onremove: (e) => document.body.removeEventListener('click', checkclickout),
                onmouseenter: (e) => {
                    if (vnode.attrs.hover) {
                        Object.keys(vnode.attrs.hover).forEach(h => elem.style[h] = vnode.attrs.hover[h]);
                    }
                    if (vnode.attrs.onhover) {
                        vnode.attrs.onhover(true);
                    }
                },
                onmouseleave: (e) => {
                    if (vnode.attrs.hover) {
                        Object.keys(vnode.attrs.hover).forEach(h => elem.style[h] = vnode.attrs.style && vnode.attrs.style[h] || '');
                    }
                    if (vnode.attrs.onhover) {
                        vnode.attrs.onhover(false);
                    }
                },
                onmousedown: (e) => {
                    if (vnode.attrs.onmousedown) {
                        Object.keys(vnode.attrs.onmousedown).forEach(h => elem.style[h] = vnode.attrs.onmousedown[h]);
                    }
                },
                onmouseup: (e) => {
                    if (vnode.attrs.onmousedown) {
                        Object.keys(vnode.attrs.onmousedown).forEach(h => elem.style[h] = vnode.attrs.style && vnode.attrs.style[h] || '');
                    }
                },
                style: { cursor: 'pointer', ...vnode.attrs.style },
                id: vnode.attrs.id,
                onclick: vnode.attrs.onclick
            }, vnode.children);
        }
    };
}
/**
 * Componente con funcionalidad drag and drop
 * @param {Function} ondrop - Funcion que se ejecuta al hacer drop
 * @param {*} data - Datos que se pasan de un elemento a otro al hacer drop
*/
function Draggable() {
    function getTarget(e) {
        if (e.target.draggable)
            return e.target;
        else
            return e.target.closest("[draggable]");
    }
    return {
        view: ({ attrs, children }) => {
            let { style = {}, data, ondrop } = attrs;
            return m("div", {
                style: {
                    ...style,
                    cursor: "grab"
                },
                draggable: true,
                ondrag: (e) => e.target.style['border'] = "1px solid #2878C1",
                ondragstart: (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('data', data);
                },
                ondragend: (e) => {
                    e.preventDefault();
                    e.target.style["border"] = style.border || "none";
                },
                ondrop: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let _data = e.dataTransfer.getData('data');
                    let target = getTarget(e);
                    target.style["border"] = style.border || "none";
                    target.style["filter"] = "none";
                    if (ondrop && typeof ondrop == "function")
                        ondrop(_data);
                },
                ondragover: (e) => {
                    e.preventDefault();
                    let target = getTarget(e);
                    target.style["filter"] = "brightness(0.8)";
                },
                ondragleave: (e) => {
                    e.preventDefault();
                    let target = getTarget(e);
                    target.style["filter"] = "none";
                }
            }, children);
        }
    };
}
/**
 * Anima un componente
 * @param {Object} from - Estilos iniciales para la animacion de entrada
 * @param {Object} to - Estilos finales de la animacion de entrada
 * @param {Object} exit - Estilos de la animacion de salida
 * @param {Object} style - Estilos base del componente
 * @param {Object} hover - Estilos para animar al hacer hover
 * @param {Object} click - Estilos para animar al hacer click
 * @param {Integer} delay - Segundos de espera para la animación
 * @param {bool} animateOnScroll - Si la animación debe activarse al hacer scroll
 * @param {Integer} duration - milisegundos
 *
 */
function Animate() {
    let duration;
    let styleTimeout;
    let animations = {
        'scaleIn': {
            from: { transform: 'scale(0)' },
            to: { transform: 'scale(1)' }
        },
        'fadeUpIn': {
            from: {
                opacity: 0,
                transform: 'translateY(20px)'
            },
            to: {
                opacity: 1,
                transform: 'translateY(0)'
            }
        },
        'fadeIn': {
            from: {
                opacity: 0,
            },
            to: {
                opacity: 1,
            }
        },
        'opacity': {
            from: { opacity: 0 },
            to: { opacity: 1 }
        }
    };
    let observer;
    return {
        oncreate: ({ attrs, dom }) => {
            let { animate = {}, to = {}, style = {}, name = {}, animateOnScroll, delay = 10 } = attrs;
            if (Object.keys(animate).length == 0) {
                animate = to;
            }
            if (animateOnScroll) {
                observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                // Animacion de entrada
                                Object.keys(animate).forEach(a => {
                                    dom.style[a] = animate[a];
                                });
                            }, delay);
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(dom);
            }
            else {
                setTimeout(() => {
                    // Animacion de entrada
                    Object.keys(animate).forEach(a => {
                        dom.style[a] = animate[a];
                    });
                }, delay);
            }
            // porque los estilos default se añaden al animar ??
            /*if(style && Object.keys(style).length > 0){
                styleTimeout=setTimeout(()=> {
                    Object.keys(style).forEach(a => {
                        dom.style[a] = style[a]
                    })
                }, duration)
            }*/
        },
        onbeforeremove: ({ attrs, dom }) => {
            let { exit = {} } = attrs;
            clearTimeout(styleTimeout);
            // Animacion de salida
            Object.keys(exit).forEach(a => {
                dom.style[a] = exit[a];
            });
            return new Promise(function (resolve) {
                setTimeout(resolve, attrs.duration || 500);
            });
        },
        view: ({ attrs, children }) => {
            duration = attrs.duration || 500;
            if (attrs.animation) {
                attrs.from = animations[attrs.animation]?.from || {};
                attrs.to = animations[attrs.animation]?.to || {};
            }
            return m("div", {
                // Animacion Hover, hace falta aquí ???
                ...(attrs.hover && {
                    onmouseenter: (e) => {
                        Object.keys(attrs.hover).forEach(a => {
                            e.target.style[a] = attrs.hover[a];
                        });
                        if (attrs.onmouseenter && typeof attrs.onmouseenter == "function")
                            attrs.onmouseenter();
                    },
                    onmouseleave: (e) => {
                        Object.keys(attrs.hover).forEach(a => {
                            e.target.style[a] = attrs?.style?.[a] || "";
                        });
                        if (attrs.onmouseleave && typeof attrs.onmouseleave == "function")
                            attrs.onmouseleave();
                    }
                }),
                // Animacion click
                ...(attrs.click && {
                    onmousedown: (e) => {
                        Object.keys(attrs.click).forEach(a => {
                            e.target.style[a] = attrs.click[a];
                        });
                    },
                    onmouseup: (e) => {
                        Object.keys(attrs.click).forEach(a => {
                            e.target.style[a] = attrs?.style?.[a] || "";
                        });
                    }
                }),
                onclick: () => {
                    if (attrs.onclick && typeof attrs.onclick == "function")
                        attrs.onclick();
                },
                style: {
                    ...attrs?.style,
                    ...attrs?.from,
                    transition: `${duration}ms`
                },
                class: attrs?.class || attrs?.className || ''
            }, children);
        }
    };
}
function CssStyle() {
    return {
        view: (vnode) => {
            return m("style", `
               #${vnode.attrs.id} {
                ${vnode.attrs.style.computer || ''}
              };

              @media (min-width: 1100px) {
                #${vnode.attrs.id} {
                  ${vnode.attrs.style.largeComputer}
                }
              }
                
              @media (max-width: 1000px) {
                #${vnode.attrs.id} {
                  ${vnode.attrs.style.tablet}
                }
              }
              @media (max-width: 600px) {
                #${vnode.attrs.id} {
                  ${vnode.attrs.style.mobile}
                }
              }
              `);
        }
    };
}
