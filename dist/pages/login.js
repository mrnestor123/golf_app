import { App, AppContent, LucideIcon } from '../components/app_elements.js';
import { config } from '../components/config.js';
import { Button, Spinner, SVGIcon } from '../components/elements.js';
import { Input } from '../components/forms.js';
import { Animate, Div, FlexCol, FlexRow, Tappable } from '../components/layout.js';
import { H2, SmallText, Text } from '../components/texts.js';
import * as UserServer from "../backend/user.js";
import { AppData } from './controller.js';
import { openPopup } from '../components/dialogs.js';
import { User } from '../model/user.js';
const m = window.m;
const AUTH_ERROR_MESSAGES = {
    invalid_credentials: 'Invalid email or password',
    user_not_found: 'User not found',
    too_many_requests: 'Too many attempts. Please try again later.',
    email_not_confirmed: 'Please confirm your email and log in again',
};
function mapAuthError(code) {
    if (!code)
        return 'Something went wrong. Please try again.';
    return AUTH_ERROR_MESSAGES[code] || 'User not found. Please register first';
}
export function LoginPage() {
    let loading = false;
    let provider = 'google';
    let data = {
        email: '',
        password: '',
        confirmpassword: ''
    };
    let fieldErrors = {
        email: '',
        password: '',
        confirmpassword: ''
    };
    let activemode = 'login';
    let error = '';
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    function validateField(fieldName) {
        if (fieldName == 'email') {
            if (!data.email) {
                fieldErrors.email = 'Please enter an email';
                return false;
            }
            if (!validateEmail(data.email)) {
                fieldErrors.email = 'Please enter a valid email address';
                return false;
            }
            fieldErrors.email = '';
            return true;
        }
        if (fieldName == 'password') {
            if (!data.password) {
                fieldErrors.password = 'Please enter a password';
                return false;
            }
            if (activemode == 'register') {
                if (data.password.length < 6) {
                    fieldErrors.password = 'Password must be at least 6 characters long';
                    return false;
                }
                const re = /^(?=.*[A-Z])(?=.*\d).+$/;
                if (!re.test(data.password)) {
                    fieldErrors.password = 'Password must contain at least one uppercase and one number';
                    return false;
                }
            }
            fieldErrors.password = '';
            return true;
        }
        if (activemode != 'register') {
            fieldErrors.confirmpassword = '';
            return true;
        }
        if (!data.confirmpassword) {
            fieldErrors.confirmpassword = 'Please confirm your password';
            return false;
        }
        if (data.password != data.confirmpassword) {
            fieldErrors.confirmpassword = 'Passwords do not match';
            return false;
        }
        fieldErrors.confirmpassword = '';
        return true;
    }
    function validateForm() {
        let isValid = true;
        if (!validateField('email'))
            isValid = false;
        if (!validateField('password'))
            isValid = false;
        if (activemode == 'register' && !validateField('confirmpassword'))
            isValid = false;
        return isValid;
    }
    function renderFieldError(fieldName) {
        return fieldErrors[fieldName]
            ? m(SmallText, { color: 'red', textAlign: 'left' }, fieldErrors[fieldName])
            : null;
    }
    return {
        view: () => {
            return [
                m(App, error ? m(BottomToolbar, { text: error }) : null, m(AppContent, { alignItems: 'center', padding: '1rem', paddingTop: '2rem', gap: '1.5rem', textAlign: 'center' }, m(Div, {
                    background: config.colors.lightgrey,
                    padding: '0.5em',
                    border: config.colors.grey + ' 1px solid',
                    borderRadius: config.borderRadius
                }, m(LucideIcon, {
                    width: '30',
                    height: '30',
                    style: { color: config.primaryColor },
                    icon: 'land-plot'
                })), m(H2, "LOGO"), m(Switch), m(FlexCol, {
                    padding: '1rem',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }, activemode == 'login' ? m(LoginForm) : m(RegisterForm)), m(Div, { flex: 1 }), m(FlexRow, { width: '100%' }, m(GoogleLogin))))
            ];
        }
    };
    function GoogleLogin() {
        let interval;
        return {
            onremove: () => {
                if (interval)
                    clearInterval(interval);
            },
            view: () => m(Button, {
                type: 'secondary',
                disabled: loading,
                onclick: async () => {
                    if (loading)
                        return;
                    loading = true;
                    provider = 'google';
                    error = '';
                    try {
                        let { url } = await UserServer.signInWithGoogle();
                        let popup = openPopup(url);
                        console.log('url', url);
                        if (interval)
                            clearInterval(interval);
                        interval = setInterval(async () => {
                            try {
                                if (popup.closed) {
                                    let session = await UserServer.getSession();
                                    if (session) {
                                        let user = await UserServer.getUser(session.id);
                                        if (!user) {
                                            user = await UserServer.createUser(session.id);
                                        }
                                        if (user) {
                                            AppData.user = user;
                                        }
                                        m.route.set('/');
                                    }
                                    else {
                                        loading = false;
                                        provider = '';
                                        error = 'Google login canceled or failed. Please try again.';
                                        m.redraw();
                                    }
                                    clearInterval(interval);
                                    return;
                                }
                            }
                            catch (e) {
                                loading = false;
                                provider = '';
                                error = mapAuthError(e?.message);
                                clearInterval(interval);
                                m.redraw();
                            }
                        }, 500);
                    }
                    catch (e) {
                        loading = false;
                        provider = '';
                        error = mapAuthError(e?.message);
                        m.redraw();
                    }
                },
                style: { width: '100%', position: 'relative', justifyContent: 'center', gap: '1rem' }
            }, loading && provider == 'google'
                ? m(Spinner)
                : [
                    m(SVGIcon, { icon: 'google' }),
                    m(Text, { textAlign: 'center' }, "Continue with Google")
                ])
        };
    }
    function BottomToolbar() {
        return {
            view: (vnode) => {
                let { text } = vnode.attrs;
                return m(Animate, {
                    from: { transform: 'translateY(100%)' },
                    to: { transform: 'translateY(0%)' },
                    duration: 500,
                    oncreate: (vnode) => {
                        setTimeout(() => {
                            vnode.dom.style.transform = 'translateY(100%)';
                            setTimeout(() => {
                                error = '';
                                m.redraw();
                            }, 300);
                        }, 3500);
                    },
                    style: {
                        background: config.primaryColor,
                        padding: '1rem',
                        position: 'fixed',
                        bottom: 0,
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        left: 0,
                        right: 0
                    }
                }, m(FlexRow, { alignItems: 'center', justifyContent: 'center', gap: '2rem' }, m(LucideIcon, { icon: 'alert-circle', width: '20', height: '20', style: { color: 'white' } }), m(Text, { color: 'white', flex: 1, width: '80%' }, text)));
            }
        };
    }
    function Switch() {
        let modes = ['login', 'register'];
        return {
            view: () => {
                return [
                    m(FlexRow, { padding: '0.5em', background: config.colors.lightgrey, borderRadius: config.borderRadius, width: '80%', margin: '0 auto' }, modes.map((mode) => {
                        let isActive = activemode == mode;
                        return m(Tappable, {
                            style: {
                                flex: 1,
                                lineHeight: 1.4,
                                padding: '0.5rem',
                                borderRadius: config.borderRadius,
                                textAlign: 'center',
                                background: isActive ? config.primaryColor : 'transparent',
                                borderBottom: activemode == mode ? `2px solid ${config.primaryColor}` : '2px solid transparent',
                                opacity: loading ? 0.6 : 1,
                            },
                            onclick: () => {
                                if (loading)
                                    return;
                                activemode = mode;
                                fieldErrors.email = '';
                                fieldErrors.password = '';
                                fieldErrors.confirmpassword = '';
                                error = '';
                                m.redraw();
                            }
                        }, m(Text, {
                            color: isActive ? 'white' : 'black',
                        }, mode.charAt(0).toUpperCase() + mode.slice(1)));
                    }))
                ];
            }
        };
    }
    function LoginForm() {
        return {
            view: () => {
                return [
                    m(Input, {
                        icon: 'mail',
                        label: "Email",
                        type: 'email',
                        data: data,
                        name: 'email',
                        placeholder: 'example@gmail.com',
                        oninput: () => {
                            fieldErrors.email = '';
                        },
                        onblur: () => {
                            validateField('email');
                        }
                    }),
                    renderFieldError('email'),
                    m(Input, {
                        icon: 'lock',
                        label: "Password",
                        type: 'password',
                        data: data,
                        name: 'password',
                        placeholder: '••••••••',
                        oninput: () => {
                            fieldErrors.password = '';
                        },
                        onblur: () => {
                            validateField('password');
                        }
                    }),
                    renderFieldError('password'),
                    m(FlexRow, { width: '100%' }, m(Button, {
                        type: 'primary',
                        disabled: loading,
                        fluid: true,
                        style: { flex: 1 },
                        onclick: () => {
                            if (loading)
                                return;
                            error = '';
                            if (!validateForm())
                                return;
                            login();
                        }
                    }, loading && provider == 'mail'
                        ? m(Spinner, { color: 'white' })
                        : m(Text, { color: 'white' }, "Login")))
                ];
            }
        };
        async function login() {
            if (loading)
                return;
            loading = true;
            provider = 'mail';
            try {
                let authData = await UserServer.signInEmail(data.email, data.password);
                console.log('data', authData);
                let user = await UserServer.getUser(authData.user.id);
                if (!user) {
                    user = await UserServer.createUser(authData.user.id);
                }
                if (user) {
                    AppData.user = user;
                    m.route.set('/');
                }
                else {
                    error = 'No user found for this data';
                    m.redraw();
                }
            }
            catch (signInError) {
                loading = false;
                provider = '';
                error = mapAuthError(signInError?.message);
                m.redraw();
            }
        }
    }
    function RegisterForm() {
        return {
            view: () => {
                return [
                    m(Input, {
                        label: "Email",
                        type: 'email',
                        icon: 'mail',
                        data: data,
                        name: 'email',
                        placeholder: 'example@gmail.com',
                        oninput: () => {
                            fieldErrors.email = '';
                        },
                        onblur: () => {
                            validateField('email');
                        }
                    }),
                    renderFieldError('email'),
                    m(Input, {
                        icon: 'lock',
                        label: "Password",
                        type: 'password',
                        data: data,
                        name: 'password',
                        placeholder: '••••••••',
                        oninput: () => {
                            fieldErrors.password = '';
                        },
                        onblur: () => {
                            validateField('password');
                        }
                    }),
                    renderFieldError('password'),
                    m(Input, {
                        icon: 'lock',
                        label: "Confirm Password",
                        type: 'password',
                        data: data,
                        name: 'confirmpassword',
                        placeholder: '••••••••',
                        oninput: () => {
                            fieldErrors.confirmpassword = '';
                        },
                        onblur: () => {
                            validateField('confirmpassword');
                        }
                    }),
                    renderFieldError('confirmpassword'),
                    m(FlexRow, { width: '100%' }, m(Button, {
                        type: 'primary',
                        disabled: loading,
                        fluid: true,
                        style: { flex: 1 },
                        onclick: () => {
                            if (loading)
                                return;
                            error = '';
                            if (!validateForm())
                                return;
                            register();
                        }
                    }, loading && provider == 'mail'
                        ? m(Spinner, { color: 'white' })
                        : m(Text, { color: 'white' }, "Register")))
                ];
            }
        };
        async function register() {
            if (loading)
                return;
            loading = true;
            provider = 'mail';
            try {
                let authData = await UserServer.signUpEmail(data.email, data.password);
                if (!authData.session) {
                    // Email confirmation required — switch to login tab so user can log in after confirming
                    loading = false;
                    provider = '';
                    activemode = 'login';
                    error = 'Confirmation email sent! Please confirm your email and log in.';
                    m.redraw();
                    return;
                }
                let user = await UserServer.createUser(authData.user.id);
                AppData.user = new User(user);
                m.route.set('/');
            }
            catch (signInError) {
                loading = false;
                provider = '';
                error = mapAuthError(signInError?.message);
                m.redraw();
            }
        }
    }
}
export function PopUpCallBack() {
    let popupLoading = true;
    let popupError = '';
    return {
        oninit: async (vnode) => {
            popupLoading = true;
            popupError = '';
            try {
                await UserServer.createSession(vnode.attrs.access_token, vnode.attrs.refresh_token);
                setTimeout(() => {
                    window.close();
                }, 1000);
            }
            catch (e) {
                popupLoading = false;
                popupError = mapAuthError(e?.message);
                m.redraw();
            }
        },
        view: () => {
            return [
                m("div", {
                    style: {
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        zIndex: 1000
                    }
                }, popupLoading
                    ? m(FlexCol, { alignItems: 'center', gap: '0.8rem' }, m(Spinner), m(Text, 'Signing you in...'))
                    : m(FlexCol, { alignItems: 'center', gap: '0.8rem', padding: '1rem', textAlign: 'center' }, m(LucideIcon, { icon: 'alert-circle' }), m(Text, popupError || 'Sign in failed. Please try again.')))
            ];
        }
    };
}
