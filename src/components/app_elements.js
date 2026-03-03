
import {config} from './config.js';
import { FlexRow, FlexCol, Tappable, Div } from './layout.js';
import { loadScript } from './util.js';
import { H2, Text, SmallText } from './texts.js';

// ELEMENTOS PARA APPS MÓVILES !!
export {
    App,
    AppBar,
    AppContent,
    NavBar,
    LucideIcon,
    mobileRouter, 
    mobileNavigator
}


function AppBar() {
    return {
        view: (vnode) => {
            return m(FlexRow, {
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background:'white',
                color: 'black',
                ...config.app?.appBar,
                ...vnode.attrs
            }, 

                vnode.attrs.leading ? 
                m(Tappable, {
                    onclick: ()=>{
                      if(vnode.attrs.leading?.onclick){
                        vnode.attrs.leading.onclick()
                      } else {
                        
                        if(mobileNavigator.pagestack.length > 1){
                            mobileNavigator.pop()
                        }

                        if(vnode.attrs.leading?.route){
                            m.route.set(vnode.attrs.leading.route)    
                        } else {
                            window.history.back();  
                        }
                      }
                    }
                },
                    m(LucideIcon, {
                        icon: vnode.attrs.leading.icon || 'move-left',
                        width: '24',
                        height: '24',
                        style: {
                            display: 'block',
                            color: config.app?.appBar?.color || 'white',
                            ...vnode.attrs.leading.style
                        }
                    })
                ) : m('div', {style: {width: '24px', height: '24px'}}),

            m(FlexCol,
                
              vnode.attrs.title 
              ? m(H2,{textAlign:'right'}, vnode.attrs.title ) 
              : null,

              vnode.attrs.subtitle 
              ? m(Text, {textAlign:'right'},  vnode.attrs.subtitle)
              : null
            ),
            
            vnode.children)
        }
    }  

}

function AppContent() {
    return {
      view: (vnode) => {
        return m(Div, {
            id: 'app-content',
            style: {
                flex: 1,
                display:'flex',
                flexDirection:'column',
                background: config.app?.background || config.background,
                paddingTop: '1rem',
                padding:'1rem',
                overflowY: 'auto',
                ...config.app?.content,
                ...vnode.attrs
            }
        },
          vnode.children
        )
      }
    }
}

function App() {

    return {
        view: (vnode) => {
            return m(FlexCol, {
                minHeight: '100dvh', // Use dynamic viewport height for mobile browsers
                height: '100dvh',
                ...vnode.attrs
            }, [
                vnode.children
            ]
         )
        }
    }
}


function NavBar() {

    function getLastHashSegment(url) {
        const hash = url.split('#')[1] || '';
        // Elimina el #! inicial y divide
        const parts = hash.replace(/^#?!?\/?/, '').split('/').filter(Boolean);
        return '/' + (parts.pop() || '');
    }

    return {
        view : (vnode) => {
            let route = m.route.get() ||  getLastHashSegment(window.location.href) || '/';

            return m(FlexRow, {
                position:'fixed', 
                bottom:0, 
                left:0, 
                right:0, 
                height: '3.5rem', 
                marginTop:'3.5em', 
                background: 'white', 
                color:'black',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                zIndex: '1000',
                ...config.app?.navBar
            },
                vnode.attrs.icons.map((icon)=> {
                    return m(Tappable, {
                        style: {
                            flex: 1,
                            display:'flex',
                            flexDirection:'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.5rem',
                            gap: '0.2rem',
                            color: route === icon.link ? config.primaryColor : '#888888',
                            cursor: 'pointer',
                            transform: route != icon.link ? 'scale(0.9)':  'scale(1)',
                            transition: 'all 0.2s ease-in-out'
                        },
                        onclick: ()=> {
                            //mobileNavigator.clearStack();
                            m.route.set(icon.link)
                        }
                    },  [
                            m(LucideIcon,{
                                icon: icon.icon,
                                style: {
                                    color: route === icon.link ? config.primaryColor : '#888888',
                                    display: 'block'
                                },
                                width: '24',
                                height: '24'
                            }),
                        ],
                        m(SmallText, icon.name)
                    )
                })
            )
        }
    }
}


function LucideIcon(){
    let isLoaded = false;

    return {
        oninit: (vnode) => {
          // check if lucide is loaded
          if(!window.lucide){
            console.log('loading lucide script...')
            loadScript(
                'https://unpkg.com/lucide@latest'
            )
          } else {
            isLoaded = true;
          }
        },
        oncreate: (vnode) => {
          if(window.lucide){
            window.lucide.createIcons();
          }
        },
        view: (vnode) => {
          return m("i", {
            "data-lucide": vnode.attrs.icon,
            width: vnode.attrs.width || 24,
            height: vnode.attrs.height || 24,
            onclick: vnode.attrs.onclick,
            style: {
              display: 'inline-block',
              ...vnode.attrs.style
            }
          })
        }
    }
}


function AppButton() {

    return {
        view: (vnode) => {
            return [
                
            ]
        }
    }
}



// ROUTER PARA MÓVILES 
var mobileNavigator = {
    pagestack: [],
    // PODRÍAMOS HACER  PUSH  DESDE AQUÍ TAMBIÉN !!
    // SOLO PONEMOS LA ÚLTIMA PÁGINA
    clearStack: ()=> mobileNavigator.pagestack = mobileNavigator.pagestack.slice(0,1),
    pop: () => mobileNavigator.wentback = true,
    push: (route) => mobileNavigator.pagestack.push(route),
    wentback: false
}



/*
    A LO MEJOR SE PUEDE UTILIZAR ALGÚN COMPONENTE DE JAVASCRIPT DE URLS/ROUTER PARA OPTIMIZAR EL ROUTER
*/
function mobileRouter(root, initialroute, routes, realRealm) {
    let transitions = {
        'slideup': { 'in': 'slideUpIn', 'out': 'slideOutUp' },
        'slideleft': { 'in': 'transitionleft', 'out': 'transitionleftout' },
        'no': { 'in': '', 'out': '' },
        'visible': 'position:absolute; inset:0px;'
    }

    const defaultTransition = 'slideup'
    let currentpage, lastpage;
    let pagestack = mobileNavigator.pagestack
    let attrs = {}
    let realm;
    let locationchanged = false;
    let firstroute = true;
    let popped = false;

    window.addEventListener('hashchange', function () {
        locationchanged = true;
        m.redraw()
    })

    m.mount(root, {
        view: function (vnode) {
            let route = window.location.hash
            //pagestack = mobileNavigator.pagestack

            if (locationchanged || firstroute) {
                firstroute = false;
                locationchanged = false;
                attrs = {}

                if (realm) { attrs['realm'] = realm; }

                popped = false;

                if (route.startsWith('#!')) {
                    route = route.substring(2)
                }

                // se podria utilizar route.indexOf('?')
                // sacamos los atributos de detrás del ?
                let questionparams = route.split('?')

                if (questionparams.length > 1) {
                    let params = questionparams[questionparams.length - 1].split('&')
                    for (var attr of params) {
                        if (attr.split('=')[0] == 'realm') {
                            // para pasar el realm a traves de la url en todos los sitios
                            realm = attr.split('=')[1]
                        }
                        attrs[attr.split('=')[0]] = decodeURIComponent(attr.split('=')[1])
                    }
                    route = route.split('?')[0]
                }


                let padParams = route.split('#')


                // sacamos los atributos de detrás del #
                if(padParams.length > 1){
                    let params = padParams[padParams.length - 1].split('&')

                    for (var attr of params) {
                        attrs[attr.split('=')[0]] = decodeURIComponent(attr.split('=')[1])
                    }

                    route = route.split('#')[0]
                }


                //hacemos pattern matching por si hay alguna ruta con :
                if (routes[route] ||  !route) {
                    currentpage = routes[route]
                } else {                        
                    let splittedroute = route.split('/')
                    let auxattrs = {}
                    let isFound = false


                    for (let r of Object.keys(routes)) {
                        let splittedsubroute = r.split('/')

                        let regex = new RegExp("^" + r.replace(/:[^\s/]+/g, '([\\w-]+)') + "$")

                        if (splittedsubroute.length == splittedroute.length && route.match(regex)) {
                            currentpage = routes[r]

                            splittedsubroute.forEach(function(sr, index) {
                                if (sr.startsWith(':')) {
                                    attrs[sr.substring(1)] = splittedroute[index]
                                }
                            })

                            //Object.assign(attrs, auxattrs)

                            break;
                            /*
                            splittedsubroute.forEach(function(sr, index) {
                                if (sr.startsWith(':')) {
                                    auxattrs[sr.substring(1)] = splittedroute[index]
                                    matchedcount++;
                                } else if (sr == splittedroute[index]) {
                                    matchedcount++;
                                }

                                if (matchedcount == splittedroute.length) {
                                    if (typeof routes[r]['onmatch'] != 'function' || routes[r]['onmatch'](auxattrs)) {
                                        Object.assign(attrs, auxattrs)
                                        currentpage = routes[r]
                                        console.log('CURRENTPAGE',)
                                        isFound = true
                                        return;
                                    }
                                }
                            })
                            if (isFound) break;*/
                        }
                        //let match = route.match(r.replace(/:[^\s/]+/g, '([\\w-]+)')) con regex
                    }


                    if (!isFound && currentpage == undefined) {
                        currentpage = routes['/404']
                    }
                }

                if (currentpage != undefined) {
                    if (!mobileNavigator.wentback) {
                        // telemetría
                        /*if (realRealm) {
                            if(navigator && navigator.sendBeacon) {
                                navigator.sendBeacon(`${TELEMETRIA}/${realRealm}/app/register/${encodeURIComponent(route)}`)
                            }
                            else {
                                fetch(`${TELEMETRIA}/${realRealm}/app/register/${encodeURIComponent(route)}`).catch(e => {})
                            }
                        }*/
                        // console.error(route)
                        if (currentpage['replace']) {
                            pagestack = [currentpage]
                        } else {
                            pagestack.push(currentpage)
                        }
                    } else {
                        setTimeout(() => { popped = true; pagestack.pop(); mobileNavigator.wentback = false; m.redraw(); }, 150) // tiene que ser menor que el tiempo de la animación
                    }
                }
            }

            mobileNavigator.pagestack = pagestack // para mantenerlo

            let transition;

            if (currentpage != undefined) {

                lastpage = pagestack[pagestack.length - 1] || {} // a veces lanza error donde lastpage es undefined
                transition = !popped 
                    ? mobileNavigator.wentback 
                        ? transitions[lastpage['transition'] || defaultTransition].out
                        : transitions[currentpage['transition'] || defaultTransition].in 
                    : ''

                if (!vnode.attrs) { vnode.attrs = {} }
                Object.assign(vnode.attrs, attrs)
            } else if (pagestack.length == 0 || currentpage == null) {
                m.route.set(initialroute);
                currentpage = routes[initialroute]
                return;
            }

            return m("div", { style: "height:100vh;width:100vw;position:relative" },
                pagestack.length > 0 ?
                pagestack.map((page, index) => {
                    const findPage = page['page'] ? page['page'] : page['view'] ? page['view'] : page
                    return m("div", {
                        style: `position:absolute; z-index:${index * 100};height:100dvh;width:100vw;background:white;inset:0px;`,
                        class: index == pagestack.length - 1 ? transition : ''
                    }, findPage(vnode))
                }) : 
                m("div", { 
                    style: `position:absolute; z-index: 0; height:100dvh; width:100vw; inset:0px;`,
                    class: ''
                },  
                    currentpage['page'] ? currentpage['page'](vnode) : 
                    currentpage['view'] ? currentpage['view'](vnode) : 
                    currentpage(vnode)
                )
            )
        }
    });
}