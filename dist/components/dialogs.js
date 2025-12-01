import { Button, Icon } from "./elements.js";
import { Input } from "./forms.js";
import { Box, Div, FlexRow } from "./layout.js";
import { H2 } from "./texts.js";
export { alertDialog, confirmDialog, promptDialog, openDialog, Modal, ModalContent, ModalHeader, ModalFooter };
function localize(localized, lang = 'es') {
    if (!localized)
        return '';
    if (typeof localized == 'string' || typeof localized == 'number')
        return localized;
    if (typeof localized != 'object')
        return 'ERR translation:' + typeof localized; //???
    return localized[lang] || localized['es'] || localized['und'];
}
/*
*
* DIÁLOGOS
*
*/
function confirmDialog(options = { 'title': '', 'message': '', 'buttonLabels': [], 'then': () => { }, 'multiple': false, 'onSaveAnswer': () => { }, size: 'tiny' }) {
    var elem = document.createElement("div");
    elem.style = 'inset:0px;z-index:1000000;position:fixed';
    elem.id = Math.random() * 10000 + '';
    document.body.appendChild(elem);
    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
        onbeforeremove: () => {
            console.log('removing');
            return new Promise(function (resolve) {
                //console.log(vnode.attrs.transition)
                //console.log(vnode.dom.classList);
                vnode.dom.classList.add('fade', 'out');
                vnode.dom.children[0].classList.add('scale', 'out');
                setTimeout(resolve, 300);
            });
        },
        view: () => m(Modal, { size: options.size || 'tiny' }, m(ModalHeader, m(H2, options.title || 'Confirma la acción')), m(Div, { padding: '1em' }, m.trust(options.message)), m(ModalFooter, m(Button, {
            type: 'positive',
            onclick: () => { options.then ? options.then(true) : null; elem.remove(); }
        }, options.buttonLabels ? options.buttonLabels[1] : localize({ es: 'Aceptar', va: 'Acceptar' })), m(Box, { width: '10px' }), m(Button, {
            type: 'negative',
            onclick: () => { options.then ? options.then(false) : null; elem.remove(); }
        }, options.buttonLabels ? options.buttonLabels[0] : localize({ es: 'Cancelar', va: 'Cancel·lar' }))))
    });
}
// PARA LAS ALERTAS DE ERROR 
function alertDialog(options = {
    title: '',
    message: '',
    buttonLabels: [],
    type: "success",
    then: () => { },
    multiple: false,
    fluid: false,
    size: "tiny",
    dom: (el) => el // devuelve el elemento
}) {
    var elem = document.createElement("div");
    elem.style = 'inset:0px;z-index:100000' + (options.multiple ? ';position:absolute' : 'position:fixed');
    elem.id = Math.random() * 10000 + '';
    document.body.appendChild(elem);
    if (typeof options == 'string') {
        options = { message: options };
    }
    if (options.dom) {
        options.dom(elem);
    }
    let types = {
        'info': {
            icon: 'info',
        },
        'warning': {
            icon: 'warning',
        },
        'error': {
            icon: 'error',
            text: 'Error',
            color: '#db2828'
        },
        'success': {
            text: 'Éxito',
            icon: 'check_circle',
            color: '#00c853'
        }
    };
    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
        onbeforeremove: () => {
            console.log('removing');
            return new Promise(function (resolve) {
                //console.log(vnode.attrs.transition)
                //console.log(vnode.dom.classList);
                vnode.dom.classList.add('fade', 'out');
                vnode.dom.children[0].classList.add('scale', 'out');
                setTimeout(resolve, 300);
            });
        },
        view: () => m(Modal, { size: options.size || 'tiny' }, types[options.type] || options.title ?
            m(ModalHeader, m(Icon, { icon: types[options.type]?.icon, color: types[options.type]?.color }), m(Box, { width: '10px' }), m(H2, { marginTop: 0 }, options.title || types[options.type]?.text)) : null, m(ModalContent, m(Div, { padding: '1em' }, m.trust(options.message))), m(ModalFooter, m(Button, {
            onclick: (e) => {
                options.then ? options.then() : null;
                elem.remove();
            },
            fluid: options.fluid,
            type: 'negative'
        }, options.buttonLabels ? options.buttonLabels[0] : localize({ es: 'Cerrar', va: "Tancar" }))))
    });
}
// DIÁLOGO DE CONFIRMACIÓN CON SEMANTIC !
// PARA LAS ALERTAS DE ERROR ??
function promptDialog(options = {
    title: '',
    message: '',
    buttonLabels: [],
    type: "success",
    then: () => { },
    multiple: false,
    fluid: false,
    dom: (el) => el // devuelve el elemento
}) {
    var elem = document.createElement("div");
    elem.style = 'inset:0px;z-index:100000' + (options.multiple ? ';position:absolute' : 'position:fixed');
    elem.id = Math.random() * 10000 + '';
    document.body.appendChild(elem);
    if (typeof options == 'string') {
        options = { message: options };
    }
    if (options.dom) {
        options.dom(elem);
    }
    let data = options.data || {};
    let name = options.name || 'input';
    let types = {
        'info': {
            icon: 'info',
        },
        'warning': {
            icon: 'warning',
        },
        'error': {
            icon: 'error',
            text: 'Error',
            color: '#db2828'
        },
        'success': {
            text: 'Éxito',
            icon: 'check_circle',
            color: '#00c853'
        }
    };
    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
        onbeforeremove: () => {
            console.log('removing');
            return new Promise(function (resolve) {
                //console.log(vnode.attrs.transition)
                //console.log(vnode.dom.classList);
                vnode.dom.classList.add('fade', 'out');
                vnode.dom.children[0].classList.add('scale', 'out');
                setTimeout(resolve, 300);
            });
        },
        view: () => m(Modal, { size: 'tiny' }, types[options.type] || options.title ?
            m(ModalHeader, m(Icon, { icon: types[options.type]?.icon, color: types[options.type]?.color }), m(Box, { width: '10px' }), m(H2, { marginTop: 0 }, options.title || types[options.type]?.text)) : null, m(Div, { padding: '1em' }, m(Input, {
            label: options.message,
            type: options.type || 'text',
            data: data,
            name: name,
            onchange: options.onchange || (() => { }),
            placeholder: options.placeholder || localize({ es: 'Escribe aquí...', va: 'Escriu ací...' }),
            fluid: options.fluid || false,
        })), m(ModalFooter, m(Button, {
            onclick: (e) => {
                if (!data[name])
                    return;
                options.then ? options.then(data[name]) : null;
                elem.remove();
            },
            disabled: !data[name] || data[name] == '',
            fluid: options.fluid,
            type: 'positive'
        }, options.buttonLabels ? options.buttonLabels[0] : localize({ es: 'Aceptar', va: "Aceptar" })), m(Box, { width: '1em' }), m(Button, {
            onclick: (e) => {
                options.then ? options.then() : null;
                elem.remove();
            },
            fluid: options.fluid,
            type: 'negative'
        }, options.buttonLabels ? options.buttonLabels[0] : localize({ es: 'Cerrar', va: "Tancar" }))))
    });
}
// Crea un dialogo con un componente custom
function openDialog(Component, options = {}) {
    if (!Component)
        return;
    var elem = document.createElement("div");
    elem.style = 'position:fixed;inset:0px;z-index:100000';
    elem.id = Math.random() * 10000 + '';
    document.body.appendChild(elem);
    m.mount(elem, {
        onremove: () => {
            console.log("ELIMINAR");
        },
        view: () => m(Component, {
            ...(options.attrs ? options.attrs : {}),
            onCancel: (e) => {
                m.mount(elem, null);
                elem.remove();
            }
        })
    });
}
function Modal() {
    let modalStyle = {
        display: 'block',
        width: '850px',
        margin: 0,
        position: 'absolute',
        backgroundColor: 'white',
        margin: '0 auto',
        borderRadius: '1em',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '90%',
        transition: 'all 0.3s ease-out'
    };
    let sizes = {
        'small': '500px',
        'big': '850px',
        'tiny': '300px'
    };
    let dimmerStyle = {
        backgroundColor: '#000000a8',
        transition: 'animate ease-in',
        position: 'fixed',
        fontFamily: 'Poppins',
        inset: '0px',
        zIndex: '1000',
    };
    return {
        view: (vnode) => {
            if (vnode.attrs.size) {
                modalStyle.width = sizes[vnode.attrs.size];
                modalStyle.maxWidth = '90vw';
            }
            if (vnode.attrs.animate) {
                modalStyle.transform = 'translate(-50%,-30%) scale(0.7)';
            }
            return m("div", {
                style: dimmerStyle
            }, m("div", {
                style: { ...modalStyle, ...vnode.attrs.style },
                tabindex: -1,
                oncreate: ({ dom }) => {
                    if (vnode.attrs.animate) {
                        setTimeout(() => {
                            dom.style.transform = 'translate(-50%,-40%) scale(1)';
                        }, 100);
                    }
                    setTimeout(() => dom.focus(), 50);
                },
                onkeyup: (e) => {
                    if (e.key === "Escape" && vnode.attrs.close)
                        vnode.attrs.close();
                }
            }, vnode.attrs.header ?
                m(ModalHeader, { justifyContent: 'space-between', borderBottom: '2px solid lightgrey', padding: '1em', alignItems: 'center' }, m(H2, { marginBottom: 0 }, vnode.attrs.header), m(Icon, { size: 'large', style: "cursor:pointer", icon: 'cancel', onclick: vnode.attrs.close })) : null, vnode.children));
        }
    };
}
function ModalContent() {
    return {
        view: (vnode) => {
            return m("div", {
                style: {
                    padding: '1em',
                    overflowY: 'auto',
                    maxHeight: '50vh',
                    ...vnode.attrs
                }
            }, vnode.children);
        }
    };
}
function ModalHeader() {
    return {
        view: (vnode) => {
            return m(FlexRow, { borderBottom: '2px solid lightgrey', justifyContent: 'center', alignItems: 'center', padding: '1em', fontWeight: 'bold', ...vnode.attrs }, vnode.children);
        }
    };
}
function ModalFooter() {
    return {
        view: (vnode) => {
            return m(FlexRow, { borderTop: '2px solid lightgrey', justifyContent: 'end', padding: '1em' }, vnode.children);
        }
    };
}
