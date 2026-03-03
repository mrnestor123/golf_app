import { getSession, getUser } from './backend/user.js';
import { mobileRouter } from './components/app_elements.js';
import { setConfig } from './components/config.js';
import { AppData } from './pages/controller.js';
import { GameConfig, GameEnded, GameStart } from './pages/game_pages.js';
import { LoginPage, PopUpCallBack } from './pages/login.js';
import { Courses, ProfilePage } from './pages/main_pages.js';
import { SplashPage } from './pages/splash.js';
const m = window.m;
setConfig({
    background: 'white',
    fontFamily: 'Manrope',
    primaryColor: '#1a1a1a',
    secondaryColor: '#013220',
    borderRadius: '0.2em',
    colors: {
        text: 'rgba(0, 0, 0, .87)',
        secondaryText: 'rgba(0, 0, 0, .54)',
        lightgrey: '#f3f4f6',
        grey: '#e5e7eb'
    },
    form: {
        formLabel: {
            color: 'black',
            fontFamily: 'Manrope'
        },
        baseStyle: {
            lineHeight: 1.4,
            minHeight: '30px'
        },
        focusStyle: {
            outline: '#1a1a1a auto 1px',
            boxShadow: '0 0 0 0 transparent inset, 0 0 0 0 transparent'
        }
    },
    fonts: {
        h1: {
            userSelect: 'none'
        },
        h2: {
            fontWeight: 'normal',
            userSelect: 'none',
        },
        text: {
            userSelect: 'none'
        },
        small: {
            userSelect: 'none'
        }
    },
    spinner: {
        color: 'white'
    },
    app: {
        navBar: {
            background: 'white'
        },
        content: {
            padding: '1rem'
        },
        appBar: {
            background: 'white',
            color: 'black'
        },
        card: {
            background: '#F3F3F3'
        }
    },
    elements: {
        label: {
            secondary: {
                border: '1px solid #ccc',
                borderRadius: '0.1rem',
                padding: '1rem',
                margin: 0,
                backgroundColor: "white",
                color: 'black',
                textAlign: 'center'
            },
            primary: {
                background: '#1a1a1a',
                color: 'white',
                padding: '1rem',
                lineHeight: 1.4,
                borderRadius: '0.2rem',
                textAlign: 'center'
            },
        },
        button: {
            primary: {
                background: '#1a1a1a',
                color: 'white',
                padding: '0.75rem 1.5rem',
                lineHeight: 1.4,
                borderRadius: '0.2rem',
            },
            secondary: {
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
            }
        },
        card: {
            background: '#00000033',
            border: ' 1px solid #444444'
        },
    }
});
startUser().then((r) => {
    // Router
    mobileRouter(document.body, "/splash", {
        "/splash": {
            view: function (vnode) {
                return m(SplashPage, vnode.attrs);
            },
            'transition': 'no'
        },
        "/login": {
            view: function (vnode) {
                return m(LoginPage, vnode.attrs);
            },
            'transition': 'no'
        },
        "/popup-callback": {
            view: function (vnode) {
                return m(PopUpCallBack, vnode.attrs);
            },
            'replace': true,
            'transition': 'no'
        },
        "/": {
            view: function (vnode) {
                return m(Courses);
            },
            'transition': 'no',
            'replace': true
        },
        "/profile": {
            view: function (vnode) {
                return m(ProfilePage);
            },
            'transition': 'no',
            'replace': true
        },
        "/club/:id": {
            view: function (vnode) {
                return m(GameConfig, vnode.attrs);
            }
        },
        "/game/:id": {
            view: function (vnode) {
                return m(GameStart, vnode.attrs);
            }
        },
        "/game/end/:id": {
            'replace': true,
            view: function (vnode) {
                return m(GameEnded, vnode.attrs);
            }
        }
    });
});
async function startUser() {
    let session = await getSession();
    if (session && session.id) {
        const user = await getUser(session.id);
        if (user) {
            AppData.user = user;
        }
    }
    else {
        if (document.location) {
            const path = document.location.hash;
            if (!path.includes('popup-callback') && !path.includes('/splash') && !path.includes('/login')) {
                document.location.hash = '#!/login';
            }
        }
    }
}
