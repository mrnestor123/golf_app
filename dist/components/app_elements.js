import { config } from './config.js';
import { FlexRow, FlexCol, Tappable } from './layout.js';
import { loadScript } from './util.js';
import { H2, Text, SmallText } from './texts.js';
// ELEMENTOS PARA APPS MÓVILES !!
export { App, AppBar, AppContent, NavBar, LucideIcon };
function AppBar() {
    return {
        view: (vnode) => {
            console.log('attrs', vnode.attrs);
            return m(FlexRow, {
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                ...config.app?.appBar,
                ...vnode.attrs
            }, vnode.attrs.leading ?
                m(Tappable, {
                    onclick: () => {
                        if (vnode.attrs.leading?.onclick) {
                            vnode.attrs.leading.onclick();
                        }
                        else {
                            window.history.back();
                        }
                    }
                }, m(LucideIcon, {
                    icon: vnode.attrs.leading.icon || 'chevron-left',
                    width: '24',
                    height: '24',
                    style: {
                        display: 'block',
                        color: config.app?.appBar?.color || 'white',
                        ...vnode.attrs.leading.style
                    }
                })) : null, vnode.attrs.title
                ? m(H2, vnode.attrs.title)
                : null, vnode.children);
        }
    };
}
function AppContent() {
    return {
        view: (vnode) => {
            return m(FlexCol, {
                flex: 1,
                background: config.background
            }, vnode.children);
        }
    };
}
function App() {
    return {
        view: (vnode) => {
            return m(FlexCol, {
                minHeight: '100vh',
                ...vnode.attrs
            }, [
                vnode.children
            ]);
        }
    };
}
function NavBar() {
    return {
        view: (vnode) => {
            let route = m.route.get() || '/';
            return m(FlexRow, { position: 'fixed', bottom: 0, left: 0, right: 0, height: '3.5rem', marginTop: '3.5em', background: '#060e07' }, vnode.attrs.icons.map((icon) => {
                return m(FlexCol, {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem',
                    gap: '0.2rem',
                    background: route === icon.link ? config.accentColor : 'transparent',
                    color: route === icon.link ? '#ffffff' : '#888888',
                    cursor: 'pointer',
                }, m(LucideIcon, {
                    icon: icon.icon,
                    style: {
                        color: route === icon.link ? '#ffffff' : '#888888',
                        display: 'block'
                    },
                    width: '24',
                    height: '24'
                }), m(SmallText, icon.name));
            }));
        }
    };
}
function LucideIcon() {
    let isLoaded = false;
    return {
        oninit: (vnode) => {
            // check if lucide is loaded
            if (!window.lucide) {
                console.log('loading lucide script...');
                loadScript('https://unpkg.com/lucide@latest');
            }
            else {
                isLoaded = true;
            }
        },
        oncreate: (vnode) => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        },
        view: (vnode) => {
            return m("i", {
                "data-lucide": vnode.attrs.icon,
                width: vnode.attrs.width || 24,
                height: vnode.attrs.height || 24,
                style: {
                    display: 'inline-block',
                    ...vnode.attrs.style
                }
            });
        }
    };
}
function AppButton() {
    return {
        view: (vnode) => {
            return [];
        }
    };
}
