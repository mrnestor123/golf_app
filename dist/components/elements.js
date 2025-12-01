import { config } from "./config.js";
import { Div, FlexRow, Tappable, FlexCol, Animate, Box } from "./layout.js";
import { Text, SmallText } from "./texts.js";
export { Segment, Span, RippleEffect, Button, Icon, Img, Sidebar, Label, Message, Card, Checkbox, Spinner, BreadCrumb, Table, TableHead, TableBody, TableRow, TableCell };
function Img() {
    return {
        view: (vnode) => {
            return [
                m("img", {
                    src: vnode.attrs.src,
                    id: vnode.attrs.id,
                    style: vnode.attrs.style,
                    onload: vnode.attrs.onload,
                    alt: vnode.attrs.alt
                })
            ];
        }
    };
}
function Segment() {
    let types = {
        primary: {
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            color: '#1b1c1d'
        },
        secondary: {
            backgroundColor: '#f0f0f0',
            border: '1px solid #e5e7eb',
            color: '#4b5563'
        },
        tertiary: {
            backgroundColor: '#f5f5f5',
            border: '1px solid #d1d5db',
            color: '#6b7280'
        },
        inverted: {
            backgroundColor: '#374151',
            border: '1px solid #374151',
            color: 'white'
        }
    };
    let attach = {
        'topAttached': { borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px', borderBottom: '0px' },
        'bottomAttached': { borderTopLeftRadius: '0px', borderTopRightRadius: '0px' },
        'leftAttached': { borderBottomRightRadius: '0px', borderTopRightRadius: '0px', borderRight: '0px' },
        'rightAttached': { borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' },
        'attached': { borderRadius: '0px' },
    };
    return {
        view: (vnode) => {
            let { type = 'default' } = vnode.attrs || {};
            return m(Div, {
                padding: '1rem',
                borderRadius: '1em',
                transition: 'all .2s ease',
                ...types[type] || types.primary,
                ...(vnode.attrs?.basic && { border: 'none' }),
                ...(vnode.attrs?.attach && attach[vnode.attrs.attach]),
                ...(vnode.attrs?.raised && { boxShadow: '0 2px 4px rgba(34, 36, 38, .12), 0 2px 10px rgba(34, 36, 38, .15)' }),
                ...(vnode.attrs?.style || vnode.attrs)
            }, vnode.children);
        }
    };
}
function Table() {
    let tableStyle = {
        width: "100%",
        background: "#fff",
        margin: "1em 0",
        border: "1px solid rgba(34,36,38,.15)",
        boxShadow: "none",
        borderRadius: "0.28571429rem",
        textAlign: "left",
        color: "rgba(0,0,0,.87)",
        borderCollapse: "separate",
        borderSpacing: "0",
        borderRadius: '1em'
    };
    return {
        view: (vnode) => {
            return m("table", {
                style: { ...tableStyle, ...vnode.attrs.style },
            }, 
            // use rows and
            vnode.attrs.header ? m(TableHead, vnode.attrs.header.map((cell) => {
                return m(TableCell, {
                    header: true,
                    colspan: cell.colspan || 1,
                    style: cell.style || {},
                    onclick: cell.onclick || null,
                }, cell.label || cell);
            })) : null, vnode.attrs.body ? m(TableBody, vnode.attrs.body.map((row) => m(TableRow, row.map((cell) => m(TableCell, {
                header: cell.header || false,
                colspan: cell.colspan || 1,
                style: cell.style || {},
                onclick: cell.onclick || null,
            }, cell.content || cell.text || cell.label || cell.value || cell))))) : null, vnode.children);
        }
    };
}
function TableHead() {
    let style = {
        boxShadow: "none",
        padding: '1em',
        cursor: "auto",
        background: "#24303f",
        textAlign: "inherit",
        color: "white",
        borderTopRadius: '1em',
        verticalAlign: "middle",
        fontWeight: 700,
        textTransform: "none",
        borderBottom: "1px solid rgba(34,36,38,.1)",
        borderLeft: "none",
        // add borderRadius top
        borderTopLeftRadius: '1em',
        borderTopRightRadius: '1em',
        position: 'sticky',
        top: 0
    };
    return {
        view: (vnode) => {
            return m("thead", {
                style: style
            }, vnode.children);
        }
    };
}
function TableBody() {
    return {
        view: (vnode) => {
            return m("tbody", {
                style: {
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function TableRow() {
    return {
        view: (vnode) => {
            return m("tr", {
                style: {
                    ...vnode.attrs
                },
                onclick: vnode.attrs.onclick ? vnode.attrs.onclick : null,
                onmouseenter: vnode.attrs.onmouseenter ? vnode.attrs.onmouseenter : null,
                onmouseleave: vnode.attrs.onmouseleave ? vnode.attrs.onmouseleave : null,
            }, vnode.children);
        }
    };
}
function TableCell() {
    return {
        view: (vnode) => {
            let { header = false } = vnode.attrs;
            return m(header ? "th" : "td", {
                colspan: vnode.attrs.colspan,
                style: {
                    textAlign: 'left',
                    padding: '1em',
                    fontFamily: config.fontFamily,
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
// Div y Tappable son intercambiables ??
// mouseover, mouseout, clickout...
function RippleEffect() {
    let rippleEffect = false;
    let x, y;
    let type = 'dark';
    let background = {
        dark: 'rgb(0,0,0,0.2)',
        light: 'rgba(255,255,255,0.3)'
    };
    let time1, time2;
    function RippleSpan() {
        return {
            oncreate: (vnode) => {
                setTimeout(() => {
                    vnode.dom.style.transform = "scale(100)";
                    vnode.dom.style.opacity = "0";
                }, 1);
            },
            view: ({ attrs }) => {
                return m("span.ripple", {
                    style: {
                        borderRadius: "50%",
                        tranform: "scale(0)",
                        position: "absolute",
                        transition: "1s",
                        backgroundColor: background[type],
                        width: "10px",
                        height: "10px",
                        top: attrs.y,
                        left: attrs.x
                    }
                });
            }
        };
    }
    return {
        view: (vnode) => {
            type = vnode.attrs.type || 'dark';
            return m("div", {
                id: vnode.attrs.id || null,
                style: {
                    position: "relative",
                    overflow: "hidden",
                    ...vnode.attrs.style
                },
                onmousedown: (e) => {
                    //Datos para que el ripple aparezca donde se hace click
                    const item = e.currentTarget.getBoundingClientRect();
                    x = `${e.clientX - item.left}px`;
                    y = `${e.clientY - item.top}px`;
                    rippleEffect = true;
                    time1 = new Date().getTime();
                    setTimeout(() => {
                        rippleEffect = false;
                        m.redraw();
                    }, 1000);
                },
                //onmouseout:(e)=> rippleEffect = false,
                onmouseup: (e) => {
                    time2 = new Date().getTime();
                    if (vnode.attrs.onclick) {
                        setTimeout(() => {
                            vnode.attrs.onclick();
                            m.redraw();
                        }, time2 - time1 > 500 ? 0 : 500 - (time2 - time1));
                    }
                }
            }, vnode.children, 
            //Efecto ripple
            rippleEffect
                ? [m(RippleSpan, { x, y, key: rippleEffect })]
                : null);
        }
    };
}
/*
* type: primary, secondary, danger
*/
function Button() {
    let types = {
        primary: config.button.primary || {
            color: 'white',
            //border: '1px solid white',
            background: '#1b1c1d'
        },
        secondary: {
            color: '#4b4b4b',
            border: '1px solid #4b4b4b',
            background: 'white'
        },
        positive: {
            color: 'white',
            border: '1px solid #00c853',
            background: '#00c853'
        },
        negative: {
            color: '#db2828',
            border: '1px solid #db2828',
            background: 'transparent'
        },
        default: {
            color: '#4b4b4b',
            border: '1px solid #4b4b4b',
            background: 'transparent'
        },
        blue: {
            color: 'white',
            border: '1px solid #2185d0',
            background: '#2185d0'
        },
        danger: {
            color: 'red',
            border: '1px solid red',
            background: 'white'
        },
        glass: {
            color: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }
    };
    let sizes = {
        small: {
            paddingLeft: '0.3em',
            paddingRight: '0.3em',
            fontSize: '0.875em',
            minHeight: '30px',
            minWidth: '30px'
        },
        default: {
            paddingLeft: `1.5em`,
            paddingRight: '1.5em',
            fontSize: '1em',
            minHeight: '40px',
            minWidth: '40px'
        }
    };
    let brightness = 100;
    return {
        view: (vnode) => {
            let { type = 'primary', onclick, disabled, fluid, icon, size } = vnode.attrs;
            return m("div", {
                style: {
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: config.fontFamily,
                    minHeight: '40px',
                    width: fluid ? '100%' : 'auto',
                    userSelect: 'none',
                    filter: `brightness(${brightness}%)`,
                    borderRadius: '1em',
                    gap: "5px",
                    ...disabled && {
                        opacity: '0.5',
                        cursor: 'not-allowed',
                        boxShadow: 'none'
                    },
                    ...types[type] || types.primary,
                    ...sizes[vnode.attrs.size || 'default'],
                    ...vnode.attrs.style
                },
                onclick: !disabled && onclick,
                onmouseover: (e) => !disabled && (brightness = 80),
                onmouseout: (e) => (brightness = 100),
                onmousedown: (e) => (brightness = 60),
                onmouseup: (e) => (brightness = 100),
            }, icon ? [
                m(Icon, { icon: icon, size: size || 'small', color: "inherit" || types[type].color || "black" }),
                // m(Box, { width:'5px' })
            ] : null, vnode.children);
        }
    };
}
/**
 * @attrs
 * ICONOS DE GOOGLE
 * icon :(string)=> el nombre  del icono, ex: search
 *
 * color:(string)=> color para el icono. black[default]
 *
 * size:(string)=> small | medium[default] | large || huge
 *
 * opacity:(double) => 1 [default]. Va de 0 a 1
 *
 * El nombre del icono se saca de
 * https://fonts.google.com/icons
 *
 **/
function Icon() {
    let sizes = {
        'mini': 'font-size:14px',
        'tiny': 'font-size:16px',
        'small': 'font-size:18px;',
        'medium': '',
        'large': 'font-size:28px',
        'huge': 'font-size:32px',
        'massive': 'font-size:50px'
    };
    return {
        view: (vnode) => {
            let { onclick } = vnode.attrs;
            return m("span", {
                class: 'material-icons',
                onclick: vnode.attrs.onclick,
                style: `${sizes[vnode.attrs.size || 'medium']}; user-select: none;color:${vnode.attrs.color || 'black'};opacity:${vnode.attrs.opacity || 1};${onclick ? 'cursor:pointer' : ''}`,
            }, vnode.attrs.icon);
        }
    };
}
function Span() {
    return {
        view: (vnode) => {
            return m("span", {
                style: {
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function Message() {
    let messageStyle = {
        position: "relative",
        minHeight: "1em",
        margin: "0 0",
        background: "#f8ffff",
        padding: "1em 1.5em",
        lineHeight: "1.4285em",
        color: "#276f86",
        borderRadius: "1em",
        boxShadow: "0 0 0 2px #a9d5de inset,0 0 0 0 transparent"
    };
    // set different types 
    return {
        view: (vnode) => {
            return m("div", {
                style: messageStyle
            }, vnode.children);
        }
    };
}
function Label() {
    let types = {
        default: {
            backgroundColor: "#1b1c1d",
            color: "white",
            border: "1px solid #e8e8e8"
        },
        primary: {
            backgroundColor: "#1b1c1d",
            color: "white",
            border: "1px solid #1b1c1d"
        },
        secondary: {
            backgroundColor: "#4b5563",
            color: "white",
            border: "1px solid #4b5563"
        },
        tertiary: {
            backgroundColor: "#e8e8e8",
            color: "#00000099",
            border: "1px solid #e8e8e8",
        },
        positive: {
            backgroundColor: "#00c853",
            color: "white",
            border: "1px solid #00c853"
        },
        negative: {
            backgroundColor: "#db2828",
            color: "white",
            border: "1px solid #db2828"
        },
        blue: {
            backgroundColor: "#2185d0",
            color: "white",
            border: "1px solid #2185d0"
        },
        warning: {
            backgroundColor: "#f39c12",
            color: "white",
            border: "1px solid #f39c12"
        },
        info: {
            backgroundColor: "#17a2b8",
            color: "white",
            border: "1px solid #17a2b8"
        },
        light: {
            backgroundColor: "#f8f9fa",
            color: "#495057",
            border: "1px solid #f8f9fa"
        },
        dark: {
            backgroundColor: "#343a40",
            color: "white",
            border: "1px solid #343a40"
        }
    };
    // follow the fontSizes of H2, Text and SmallText
    let sizes = {
        'small': {
            fontSize: '0.6em',
        },
        'default': {
            fontSize: '0.875em',
        },
        'large': {
            fontSize: '1.1em',
            padding: ".75em 1em"
        }
    };
    return {
        view: (vnode) => {
            let { type = 'default', size = 'default' } = vnode.attrs;
            return [
                m("div", {
                    style: {
                        lineHeight: "1",
                        margin: "0 .14285714em",
                        backgroundImage: "none",
                        padding: ".5833em .833em",
                        textTransform: "none",
                        borderRadius: "2em",
                        transition: "background .1s ease",
                        cursor: vnode.attrs.onclick ? 'pointer' : 'default',
                        ...types[type],
                        ...(vnode.attrs.basic && {
                            backgroundColor: 'white',
                            color: types[type].backgroundColor || 'black'
                        }),
                        ...(sizes[size] || sizes['default']),
                        ...vnode.attrs.style
                    },
                    onclick: vnode.attrs.onclick
                }, vnode.attrs.icon || vnode.attrs.text ?
                    m(FlexRow, { gap: '0.5em', alignItems: 'center' }, vnode.attrs.icon && m(Icon, { icon: vnode.attrs.icon, size: 'small', color: types[type]?.color || 'white' }), vnode.attrs.text && m(SmallText, vnode.attrs.text)) : null, vnode.children)
            ];
        }
    };
}
function Checkbox() {
    let checkboxStyle = {
        width: '17px',
        height: '17px',
        cursor: 'pointer',
    };
    return {
        view: (vnode) => {
            let { data, name, onchange, label, checked } = vnode.attrs;
            return [
                m(FlexRow, { alignItems: 'center', gap: '0.5em' }, m("input", {
                    type: 'checkbox',
                    checked: data && name ? data[name] : checked,
                    style: checkboxStyle,
                    onchange: (e) => {
                        if (data && name) {
                            data[name] = e.target.checked;
                        }
                        onchange ? onchange(e) : '';
                    }
                }), label ? m(Text, label) : null
                //m("label", localize(label))
                )
            ];
        }
    };
}
function Card() {
    let shadow = 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px';
    return {
        view: (vnode) => {
            let { photo, title, type, description, borderColor = 'lightgrey', labels, style } = vnode.attrs;
            return [
                m("div", {
                    style: {
                        //height:'100%', width:'100%', // hay que meter la card siempre en un contenedor !!
                        border: '2px solid rgb(224, 224, 224)',
                        cursor: 'pointer', background: type == 'secondary' ? '#e0e0e0' : 'white', //border:'1px solid lightgrey',
                        borderRadius: '1em', position: 'relative', padding: !photo ? '1em' : '0em',
                        ...(style || vnode.attrs)
                    },
                    onclick: vnode.attrs.onclick,
                    onmouseenter: (e) => {
                        vnode.attrs.onclick ? shadow = 'rgba(0, 0, 0, 0.35) 0px 5px 15px' : null;
                    },
                    onmouseleave: (e) => {
                        shadow = 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px';
                    },
                }, m(FlexCol, { height: '100%', width: '100%', justifyContent: 'center', position: 'relative' }, labels ? [
                    m(FlexRow, { gap: '0.5em', position: 'absolute', top: '0.5em', left: '0.5em', zIndex: 1 }, labels.map((label) => m(Label, {
                        ...label,
                        size: 'small'
                    }))),
                    !photo && m(Div, { height: '2em' })
                ] : null, photo ?
                    [
                        m("img", {
                            "src": photo + '?w=300',
                            "style": {
                                "width": "100%", "height": "auto", "max-height": '150px',
                                "border-style": "none", "background": 'white',
                                'border-top-left-radius': '1em', 'border-top-right-radius': '1em',
                                willChange: 'transform',
                                ...vnode.attrs.imgStyle
                            }
                        }),
                        borderColor &&
                            m(Div, {
                                height: '2px',
                                background: `${borderColor}`,
                                width: '90%',
                                margin: '0 auto',
                            })
                    ]
                    : null, description || title ?
                    m(FlexCol, { flex: 2, padding: '1em', justifyContent: 'center' }, m(Text, { fontWeight: 'bold', width: '90%', marginTop: '0.5em', marginBottom: '0.5em' }, title), description ? m(SmallText, {
                        display: "-webkit-box",
                        "-webkit-box-orient": "vertical",
                        "-webkit-line-clamp": 4, // esto debe de ser configurable !!
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        'color': 'grey'
                    }, m.trust(description)) : null, m(Box, { height: '0.5em' })) : null, vnode.children))
            ];
        }
    };
}
function BreadCrumb() {
    return {
        view: (vnode) => {
            let { style, onclick } = vnode.attrs;
            return [
                m(FlexRow, { gap: '1em', alignItems: 'center', ...style }, vnode.children.map((item, i) => {
                    let active = i == vnode.children.length - 1;
                    return [
                        m(Tappable, {
                            onclick: (e) => {
                                if (!active)
                                    onclick(i);
                            }
                        }, m(Text, {
                            fontWeight: active ? 'bold' : 'normal',
                            ...style
                        }, item.label || item)),
                        !active && m(Icon, { icon: 'chevron_right' })
                    ];
                }))
            ];
        }
    };
}
function Spinner() {
    // can you create different sizes, only sizes
    let sizes = {
        small: {
            width: 20,
            height: 20
        },
        medium: {
            width: 40,
            height: 40
        },
        large: {
            width: 60,
            height: 60
        }
    };
    let spinStyle = {
        "box-sizing": "border-box",
        "display": "block",
        "position": "absolute",
        "margin": "8px",
        "border": "8px solid transparent",
        "border-radius": "50%",
        "animation": "lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "border-top": "8px solid currentColor"
    };
    return {
        view: (vnode) => {
            let { color, size = 'small' } = vnode.attrs;
            return [
                // código copiado de stackoverflow, habrá que pasarlo a nuestro modelo
                // cambia la clase por id
                m(`style`, `
                @keyframes lds-ring {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }`),
                m(Div, {
                    "display": "inline-flex",
                    justifyContent: "center",
                    "position": "relative",
                    "width": `${sizes[size].width * 2}px`,
                    "height": `${sizes[size].height * 2}px`,
                }, m(Div, {
                    style: {
                        ...spinStyle,
                        color: color || '#1c4c5b',
                        width: `${sizes[size].width}px`,
                        height: `${sizes[size].height}px`,
                        "animation-delay": "-0.45s"
                    }
                }), m(Div, {
                    style: {
                        ...spinStyle,
                        color: color || '#1c4c5b',
                        width: `${sizes[size].width}px`,
                        height: `${sizes[size].height}px`,
                        "animation-delay": "-0.3s"
                    }
                }))
            ];
        }
    };
}
//FUNCIÓN DE SIDEBAR PARA UTILIZAR EN OTROS SITIOS
function Sidebar() {
    let transitions = { in: '.transition.animating.in.slide.left', out: '.transition.animating.out.slide.left' };
    let transition;
    return {
        oninit: () => {
            transition = transitions.in;
        },
        view: (vnode) => {
            //también podrías sarle tu la posición. Right,left,top...
            return m(`.ui.right.sidebar${transition}`, // quitar css de semantic
            {
                tabindex: '0',
                oncreate: ({ dom }) => {
                    dom.focus();
                },
                onkeyup: (e) => {
                    console.log('ONKEYUP');
                    if (e.key === 'Escape' && vnode.attrs.close) {
                        vnode.attrs.close();
                    }
                },
                style: vnode.attrs.style,
                class: vnode.attrs.class
            }, vnode.children);
        },
        onbeforeremove: (vnode) => {
            return new Promise(function (resolve) {
                vnode.dom.classList.add('transition', 'animating', 'out', 'slide', 'left');
                setTimeout(resolve, 300);
            });
        }
    };
}
