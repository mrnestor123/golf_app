import { getData, AppData } from './controller.js';
import { GolfClub } from "../model/golf_club.js";
import { LucideIcon } from '../components/app_elements.js';
import { Box, FlexCol, FlexRow, Tappable } from '../components/layout.js';
import { H2, SmallText, Text } from '../components/texts.js';
const m = window.m;
export function Courses() {
    let golfClubs = [];
    return {
        oninit: (vnode) => {
            getData()
                .then((res) => {
                res.forEach((club) => {
                    golfClubs.push(new GolfClub(club));
                });
                m.redraw();
            })
                .catch((error) => {
                console.error('Error loading golf clubs:', error);
            });
        },
        view: (vnode) => {
            return m('div', {
                style: {
                    color: '#fff'
                }
            }, [
                m(H2, 'Golf Courses Near You'),
                m(Box, { height: '1rem' }),
                m(FlexCol, { gap: '1rem' }, AppData.golfClubs.map((club) => {
                    const photo = club.photo;
                    return m(Tappable, {
                        rippleEffect: true,
                        onclick: (e) => {
                            AppData.selectedClub = club;
                            m.route.set(`/club/${club.id}`);
                        }
                    }, m(FlexRow, {
                        background: '#F8F8F8',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        alignItems: 'center',
                        boxShadow: ' 0 2px 4px rgba(0,0,0,0.1)',
                        color: 'black',
                        gap: '0.5rem'
                    }, m(FlexRow, { flex: 1, gap: '0.5rem' }, photo && m("img", {
                        style: {
                            width: '70px',
                            height: '90px',
                            borderRadius: '0.5rem',
                            objectFit: 'cover'
                        },
                        src: photo
                    }), m(FlexCol, { justifyContent: 'space-between', padding: '0.5rem' }, m(Text, club.name), m(FlexRow, { alignItems: 'center', gap: '1rem' }, m(FlexRow, { alignItems: 'center', gap: '0.5rem' }, m(LucideIcon, {
                        icon: 'star',
                        width: '16',
                        height: '16',
                        style: { color: 'black' }
                    }), m(SmallText, club.rating || 'N/A')), m(FlexRow, { alignItems: 'center', gap: '0.5rem' }, m(LucideIcon, {
                        icon: 'map-pin',
                        width: '16',
                        height: '16',
                        style: { color: 'black' }
                    }), m(SmallText, '100 m'))))), m(LucideIcon, {
                        icon: 'chevron-right',
                        width: '24',
                        height: '24',
                        style: { color: 'black' }
                    })));
                }))
            ]);
        }
    };
}
