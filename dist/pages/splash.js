// MODEL
import { AppData } from './controller.js';
import { App, AppContent } from '../components/app_elements.js';
import { Animate } from '../components/layout.js';
import { H2 } from '../components/texts.js';
import { getSession, getUser } from '../backend/user.js';
const m = window.m; // pasar a node-modules en algun momento !!
export function SplashPage() {
    let animation;
    return {
        oninit: (vnode) => {
            //getData()
            setTimeout(async () => {
                try {
                    let session = await getSession();
                    if (session) {
                        const user = await getUser(session.id);
                        if (user) {
                            AppData.user = user;
                            m.route.set('/');
                        }
                        else {
                            m.route.set('/login');
                        }
                    }
                    else {
                        m.route.set('/login');
                    }
                }
                catch {
                    m.route.set('/login');
                }
            }, 5000);
        },
        view: (vnode) => {
            return [
                m(App, m(AppContent, { justifyContent: 'center', alignItems: 'center', padding: '1rem', textAlign: 'center' }, m(Animate, {
                    duration: 2000,
                    from: { opacity: 0, transform: 'scale(0.5)' },
                    to: { opacity: 1, transform: 'scale(1)' }
                }, m(H2, "Welcome"))))
            ];
        }
    };
}
