import { FlexCol, FlexRow, Box } from "./layout.js";
import { Text } from "./texts.js";
import { Icon, Button } from './elements.js';
import { config } from "./config.js";
export { FormLabel, Input, TranslationInput, Dropdown, IntegerInput, Switch, InfoTooltip, Checkbox };
// repensar si añadir localize a estas funciones !!
function FormLabel() {
    let labelStyle = `font-weight:normal;display: block;
    color: black; font-size: 1em;font-family: ${config.fontFamily};
    margin-bottom: 0.15em;
    white-space: normal;`;
    return {
        view: (vnode) => {
            let { label, required, info } = vnode.attrs;
            return [
                m(FlexRow, m("label", { style: labelStyle }, vnode.children), required ? m("span", { style: "color:red; font-weight:bold;margin-left:0.5em;" }, '*') : null, info
                    ? m(InfoTooltip, { text: info })
                    : null)
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
            let { data, name, onchange, label, checked, vertical = false } = vnode.attrs;
            return [
                m(FlexRow, { alignItems: "center", flexDirection: vertical ? "column-reverse" : "row" }, m("input", {
                    type: 'checkbox',
                    checked: data && name ? data[name] : checked,
                    style: checkboxStyle,
                    onchange: (e) => {
                        if (data && name) {
                            data[name] = e.target.checked;
                        }
                        onchange ? onchange(e) : '';
                    }
                }), m(Box, { width: '0.5em' }), m("label", label))
            ];
        }
    };
}
function Input() {
    let inputStyle = `line-height: 1.21428571em;
        padding: .67857143em 1em;
        font-size: 1em;
        background: #fff;
        border: 1px solid rgba(34, 36, 38, .15);
        color: rgba(0, 0, 0, .87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 0 0 0 transparent inset;
        box-shadow: 0 0 0 0 transparent inset;
        font-family: ${config.fontFamily};
    `;
    return {
        view: (vnode) => {
            let { data, name, oninput, type, label, required, rows, readonly, pattern, title, onchange, placeholder, value, info, onkeyup } = vnode.attrs;
            return [
                m(FlexCol, { width: '100%' }, label ?
                    [
                        m(FormLabel, { required: required, info: info }, label),
                        // m(Box,{height:'0.2em'})
                    ] : null, m(type == 'textarea' ? "textarea" : "input", {
                    readonly: readonly || false,
                    rows: rows,
                    style: inputStyle + (vnode.attrs.style ? vnode.attrs.style : ''),
                    oninput: (e) => {
                        oninput ? oninput(e) : '';
                        data && name ? data[name] = e.target.value : '';
                    },
                    ...(value ? { value: value } : {}),
                    ...(data && data[name] ? { value: data[name] } : {}),
                    ...type && type != 'textarea' ? { type: type } : {},
                    ...vnode.attrs.min && vnode.attrs.max ? { min: vnode.attrs.min, max: vnode.attrs.max } : {},
                    ...vnode.attrs.minlength && vnode.attrs.maxlength ? { minlength: vnode.attrs.minlength, maxlength: vnode.attrs.maxlength } : {},
                    ...pattern ? { pattern: pattern } : {},
                    ...(vnode.attrs.id ? { id: vnode.attrs.id } : {}),
                    ...title ? { title: title } : {},
                    ...placeholder ? { placeholder: placeholder } : {},
                    ...onkeyup ? { onkeyup: onkeyup } : {},
                    onchange: (e) => {
                        if (onchange)
                            onchange(e);
                    },
                }))
            ];
        }
    };
}
function TranslationInput() {
    let languages = ['es', 'va'];
    let selectedlang = 0;
    return {
        oninit: (vnode) => {
            if (vnode.attrs.languages) {
                languages = vnode.attrs.languages.map((e) => e.id || e);
            }
            if (vnode.attrs.initialLang) {
                selectedlang = languages.findIndex((e) => e == vnode.attrs.initialLang) || 0;
            }
        },
        view: (vnode) => {
            let { data, name, label, required, type, rows, info } = vnode.attrs;
            if (!data)
                data = {};
            if (!name)
                name = 'translation';
            if (!data[name]) {
                data[name] = {};
            }
            else if (typeof data[name] == 'string') {
                data[name] = { 'es': data[name] };
            }
            return m(FlexCol, { width: '100%', }, label ? m(FormLabel, { required: required, info: info }, label) : null, m(FlexRow, m(Input, {
                style: "flex-grow:2;border-radius:0em;",
                rows: rows,
                required: required,
                data: data[name],
                name: languages[selectedlang],
                type: type,
            }), m(Button, {
                type: 'default',
                style: { borderRadius: '0em', border: '1px solid #22242626', flexGrow: 1, background: 'white' },
                onclick: (e) => {
                    selectedlang++;
                    if (selectedlang > languages.length - 1) {
                        selectedlang = 0;
                    }
                    if (vnode.attrs.changedLang)
                        vnode.attrs.changedLang(languages[selectedlang]);
                }
            }, languages[selectedlang])));
        }
    };
}
function Dropdown() {
    // beautiful dropdown style
    let dropdownStyle = {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight: '1.21429em',
        padding: '0.5em 1em',
        fontSize: '1em',
        background: 'rgb(255, 255, 255)',
        border: '1px solid rgba(34, 36, 38, 0.15)',
        color: 'rgba(0, 0, 0, 0.87)',
        borderRadius: '0.285714rem',
        boxShadow: 'transparent 0px 0px 0px 0px inset',
        fontFamily: config.fontFamily || ""
    };
    return {
        view: (vnode) => {
            let { data, name, label, onchange, info, required, value, style = {} } = vnode.attrs;
            return [
                m(FlexCol, label ? m(FormLabel, { info: info, required: required }, label) : null, m("select", {
                    style: {
                        ...dropdownStyle,
                        ...style
                    },
                    onchange: (e) => {
                        data && name != undefined ? data[name] = e.target.value : '';
                        onchange ? onchange(e.target.value) : '';
                        m.redraw();
                    }
                }, m("option", { disabled: true }, "Selecciona una opción"), vnode.children.map((o) => m("option", {
                    value: o.value != undefined ? o.value : o,
                    selected: data && name != undefined
                        ? typeof o == 'object'
                            ? data[name] == o.value
                            : data[name] == o
                        : value
                }, o.label || o))))
            ];
        }
    };
}
function Switch() {
    return {
        view: ({ attrs }) => {
            let { isActive, activeColor = '#47c', activeBg = '#c4d5f1', onchange, data, name, label } = attrs;
            return m(FlexRow, { gap: '0.5em', alignItems: 'center', marginTop: '0.5em' }, // tal vez se pueda quitar el margin
            m('div', {
                style: {
                    background: isActive || data && name && data[name] ? activeBg : '#eee',
                    width: '60px',
                    height: '30px',
                    padding: '5px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                },
                onclick: () => {
                    if (data && name) {
                        if (data[name] == undefined)
                            data[name] = false;
                        data[name] = !data[name];
                        isActive = data[name];
                    }
                    if (onchange && typeof onchange == "function")
                        onchange();
                }
            }, [
                m('input', {
                    style: { display: 'none' },
                    type: 'checkbox',
                    checked: isActive || data && name && data[name] ? true : false,
                }),
                m('label', {
                    style: {
                        width: '20px',
                        height: '20px',
                        background: isActive || data && name && data[name] ? activeColor : '#ccc',
                        display: 'flex',
                        cursor: 'pointer',
                        borderRadius: '50px',
                        transition: 'all 0.25s ease 0s',
                        marginLeft: isActive || data && name && data[name] ? '30px' : '0px',
                    }
                })
            ]), label && m(Text, label));
        }
    };
}
// input that only gets integers
function IntegerInput() {
    let inputStyle = `line-height: 1.21428571em;
        padding: .67857143em 1em;
        font-size: 1em;
        background: #fff;
        border: 1px solid rgba(34, 36, 38, .15);
        color: rgba(0, 0, 0, .87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 0 0 0 transparent inset;
        box-shadow: 0 0 0 0 transparent inset;`;
    let on = false;
    return {
        view: (vnode) => {
            let { data, name, max, min = 0, label, onchange, jump = 1, required } = vnode.attrs;
            return [
                m(FlexCol, label ? m(FormLabel, { required: required }, label) : null, m("div", { style: inputStyle }, m(FlexRow, { alignItems: 'center', justifyContent: 'space-between' }, m("div", data && name && data[name] ? data[name] : 0, 
                // se le puede pasar elementos dentro
                vnode.children), m(FlexRow, m(Icon, {
                    icon: 'remove',
                    color: data[name] && data[name] > 0 && data[name] > min ? 'black' : 'lightgrey',
                    onclick: (e) => {
                        if ((min == undefined || data[name] > min) && data[name] && data[name] > 0) {
                            data[name] -= jump;
                            if (onchange)
                                onchange(-1);
                        }
                    }
                }), m(Icon, {
                    icon: 'add',
                    color: max != undefined && (data[name] == max || max == 0) ? 'lightgrey' : 'black',
                    onclick: (e) => {
                        if (!data[name])
                            data[name] = 0;
                        console.log('MAX', max, data[name]);
                        if (max == undefined || data[name] < max) {
                            data[name] += jump;
                            if (onchange)
                                onchange(1);
                        }
                    }
                })))))
            ];
        }
    };
}
function InfoTooltip() {
    let showingInfo;
    let tooltipstyle = `pointer-events: none;
        position: absolute;
        text-transform: none;
        text-align: left;
        white-space: nowrap;
        font-size: 1rem;
        border: 1px solid #d4d4d5;
        line-height: 1.4285em;
        max-width: none;
        cursor:pointer;
        background: #fff;
        padding: .833em 1em;
        font-style: bold;
        color: rgba(0,0,0,.87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15);
        box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15);
        z-index: 1;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        bottom: 100%;
        margin-bottom: .5em;
    `;
    return {
        view: (vnode) => {
            let { text, inverted } = vnode.attrs;
            return [
                /** ANIMACIONES SCALEIN AND OUT */
                m("style", `
                    .fadein {
                        animation: fadein 0.3s;
                    }
                    .fadeout {
                        animation: fadeout 0.3s;
                    }
                    @keyframes fadein {
                        0% { opacity:0; }
                        100% { opacity:1; }
                    }
                    @keyframes scaleOut {
                        0% { opacity:1; }
                        100% { opacity:0; }
                    }
                `),
                // Cambiar esto por un icono de google  ??
                m("i.blue.question.circle.outline.link.icon.visible", {
                    class: showingInfo ? 'visible' : '',
                    onmouseover: (e) => showingInfo = true,
                    onmouseout: (e) => showingInfo = false,
                    style: "margin-left:5px; position:relative",
                }, m("div", {
                    class: showingInfo ? 'fadein' : showingInfo != undefined ? 'fadeout' : '',
                    style: showingInfo == undefined || !showingInfo ? 'display:none' :
                        tooltipstyle + (inverted ? 'background:#000000de; color:white;' : ''),
                    onmouseover: (e) => showingInfo = true,
                    onmouseout: (e) => showingInfo = false,
                }, m.trust(text || vnode.children)))
            ];
        }
    };
}
