import { App, AppBar, AppContent, mobileNavigator } from '../components/app_elements.js';
import { config } from '../components/config.js';
import { Div, FlexCol, FlexRow } from '../components/layout.js';
import { H2, SmallText, Text } from '../components/texts.js';
import { AppData, getGame } from './controller.js';
import { Img } from '../components/elements.js';
const m = window.m; // pasar a node-modules en algun momento !!
export function GameEnded() {
    let game = AppData.currentGame;
    let club = game?.club;
    let loading = false;
    async function getData({ id }) {
        try {
            if (!game) {
                loading = true;
                game = await getGame(id);
                AppData.currentGame = game;
                club = game.club;
                loading = false;
                m.redraw();
            }
        }
        catch (e) {
            loading = false;
            m.redraw();
        }
    }
    return {
        oninit: (vnode) => {
            getData(vnode.attrs);
        },
        view: (vnode) => {
            if (loading)
                return;
            let total_score = game && game.scores.filter(score => score.confirmed).reduce((total, score) => total + (score.strokes || 0), 0) -
                game.round.holes.filter((hole, i) => game.scores[i].confirmed).reduce((total, hole) => total + hole.par, 0);
            console.log('attrs', vnode.attrs);
            return m(App, m(AppBar, {
                leading: {
                    icon: 'x',
                    style: { color: 'black' },
                    onclick: (e) => {
                        AppData.currentGame = null;
                        mobileNavigator.pop();
                        if (vnode.attrs.past) {
                            m.route.set('/profile');
                        }
                        else {
                            m.route.set('/');
                        }
                    }
                },
            }), game && [
                m(Img, {
                    src: club.photo,
                    style: {
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover'
                    }
                }),
                m(AppContent, { style: { borderTop: '1px solid #ccc', padding: '1rem' } }, m(H2, club.name), m(SmallText, game.start ? `Played on ${new Date(game.start).toLocaleDateString()}` : ''), m(FlexRow, {
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                }, m(FlexCol, { alignItems: 'center' }, m(H2, (total_score > 0 ? `+` :
                    total_score < 0 ? `-` :
                        '')
                    + total_score), m(Text, 'Total Score')), m(FlexCol, { alignItems: 'center' }, m(H2, game.scores.reduce((total, score) => total + (score.green_in_regulation ? 1 : 0), 0)), m(Text, 'GIR')), m(FlexCol, { alignItems: 'center' }, m(H2, game.scores.reduce((total, score) => total + (score.up_and_down ? 1 : 0), 0)), m(Text, 'UP&DOWN')), m(FlexCol, { alignItems: 'center' }, m(H2, game.scores.reduce((total, score) => total + (score.fairway_hit ? 1 : 0), 0)), m(Text, 'Fairways'))), m(Div, {
                    marginTop: '1.5em',
                    background: 'grey'
                }), m(FlexCol, { gap: '0.5rem' }, m(Text, { marginTop: '1rem' }, 'Hole by Hole'), game.scores
                    .filter(score => score.confirmed)
                    .map((score, i) => {
                    let hole = game.round.holes[score.hole_index];
                    return m(FlexRow, {
                        background: config.app.card.background,
                        justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem'
                    }, m(Div, {
                        background: 'white', display: 'flex', borderRadius: '0.1em', width: '30px', height: '30px',
                        alignItems: 'center', justifyContent: 'center', padding: '0.2rem'
                    }, m(Text, score.hole_index + 1)), m(FlexRow, { gap: '0.5rem' }, m(SmallText, `Par ${hole.par}`), m(SmallText, '/'), m(SmallText, `${score.strokes || 0} strokes`), score.putts
                        ? m(SmallText, `putts ${score.putts} `)
                        : null));
                })))
            ]);
        }
    };
}
