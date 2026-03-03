import { getClub } from '../backend/golf.js';
import { searchUsers } from '../backend/user.js';
import { App, AppBar, AppContent, LucideIcon } from '../components/app_elements.js';
import { config } from '../components/config.js';
import { Button } from '../components/elements.js';
import { Input } from '../components/forms.js';
import { Animate, Div, FlexCol, FlexRow, Tappable } from '../components/layout.js';
import { H2, SmallText, Text } from '../components/texts.js';
import { Game } from '../model/game.js';
import { AppData, saveGame } from './controller.js';
const m = window.m;
export function GameConfig() {
    let club = AppData.selectedClub || null;
    let loading = false;
    let activeModal = null;
    let game;
    return {
        oninit: (vnode) => {
            if (!club || !club.rounds?.length) {
                getClub(vnode.attrs.id)
                    .then((r) => {
                    club = AppData.selectedClub = r;
                    game = new Game({
                        club: { id: club.id, name: club.name, description: club.description }
                    });
                    loading = false;
                    console.log(club);
                    m.redraw();
                });
            }
            // siempre lo creo para simplificar el código y no hacer mucho if
            game = new Game({
                club: club
            });
        },
        view: (vnode) => {
            return [
                m(App, m(AppBar, {
                    leading: {
                        route: '/'
                    }
                }), 
                /*
                m("img", {
                  style: {
                    width:'100%',
                    height: '200px',
                    objectFit:'cover',
                  },
                  src: club.photo
                }),
                */
                m(AppContent, { gap: '1rem', borderTop: '1px solid lightgrey' }, m(FlexCol, { gap: '0.5rem' }, club?.name
                    ? m(H2, club.name)
                    : m(H2, { opacity: 0 }, "TEXT"), m(Text, "Select the different options to start a new game")), m(ButtonModal, {
                    id: 'round',
                    left: 'Round',
                    icon: 'route',
                    right: game?.round ? game.round?.name : 'Select',
                    emptyText: "There is no saved rounds for this golf club",
                    selected: game?.round,
                    modal: club?.rounds?.map((round) => {
                        return {
                            title: round.name,
                            //description: round.holes.length + ' holes',
                            onclick: (e) => {
                                game.round = round;
                                console.log(round.tees, 'round', round);
                            }
                        };
                    })
                }), m(ButtonModal, {
                    id: 'tee',
                    left: 'Tee',
                    icon: 'land-plot',
                    selected: game?.tee,
                    right: game?.tee ? game.tee.name : 'Select',
                    modal: game?.round?.tees?.map((tee) => {
                        let course_ratings = game.round.course_ratings;
                        let slopes = game.round.slopes;
                        let descriptionText = '';
                        if (course_ratings) {
                            descriptionText += 'CR ';
                            let menCR = course_ratings['men']?.[tee.id];
                            if (menCR) {
                                descriptionText += 'M ' + menCR.split('/')[0];
                            }
                            let womenCR = course_ratings['women']?.[tee.id];
                            if (womenCR) {
                                descriptionText += ' W ' + womenCR.split('/')[0];
                            }
                        }
                        if (slopes) {
                            descriptionText += '// SL';
                            if (slopes['men'] && slopes['men'][tee.id]) {
                                descriptionText += ' M ' + slopes['men'][tee.id].split('/')[0];
                            }
                            if (slopes['women'] && slopes['women'][tee.id]) {
                                descriptionText += ' W ' + slopes['women'][tee.id].split('/')[0];
                            }
                        }
                        return {
                            title: tee.name,
                            description: descriptionText,
                            onclick: (e) => {
                                game.tee = tee;
                            }
                        };
                    }),
                    emptyText: "Please select a round first"
                }), 
                /*
                m(ButtonModal, {
                  left: 'Scoring',
                  icon:'arrow-down-1-0',
                  selected: game.scoring_method,
                  right: game.scoring_method ? game.scoring_method : 'Stroke Play',
                  modal: [
                    {
                      title: 'Stroke Play',
                      description: 'Standard scoring method. Lowest total strokes wins.',
                      onclick:(e)=>{
                        game.scoring_method = 'Stroke play';
                      }
                    },
                    {
                      title: "Stableford",
                      description: 'Points-based system rewarding scoring relative to par.',
                      onclick:(e)=>{
                        game.scoring_method = 'Stableford';
                      }
                    }
                  ]
                }),*/
                /*
                m(ButtonModal, {
                  id: 'players',
                  left: 'Players',
                  right: game.players.length || '1',
                  icon:'users-round'
                },
                  m(SearchPlayers)
                ),*/
                m("div", { style: { flex: 1 } }), m(Button, {
                    type: 'primary',
                    disabled: game?.round == null || game?.tee == null,
                    onclick: (e) => {
                        game.start = new Date();
                        console.log('GAME', game);
                        saveGame(game);
                        AppData.currentGame = game;
                        m.route.set(`/game/${game.id}`);
                    },
                    style: {
                        marginTop: '1rem',
                        maxWidth: '400px'
                    }
                }, 'Start')))
            ];
        }
    };
    function ButtonModal() {
        return {
            view: (vnode) => {
                let { id, left, right, modal, emptyText } = vnode.attrs;
                const isOpen = activeModal === id;
                return [
                    isOpen && [
                        // dimmer overlay
                        m(Tappable, {
                            style: {
                                position: 'fixed',
                                inset: 0,
                                background: '#00000088',
                                zIndex: 1000
                            },
                            onclick: (e) => {
                                activeModal = null;
                                e.stopPropagation();
                            }
                        }, m("div", { onclick: (e) => e.stopPropagation() }, m(Animate, {
                            duration: 300,
                            from: { transform: 'translateY(20%)' },
                            to: { transform: 'translateY(0%)' },
                            exit: { transform: 'translateY(20%)' },
                            style: {
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '1em',
                                background: 'white',
                                borderTopLeftRadius: '1rem',
                                borderTopRightRadius: '1rem',
                                maxHeight: '50vh',
                                overflowY: 'auto'
                            },
                        }, m(FlexCol, { gap: '1rem' }, m(Div, { width: '40px', height: '4px', background: '#ccc', borderRadius: '2px', margin: '0 auto', marginBottom: '1rem' }), modal && modal.length ?
                            modal.map((item) => m(TapButton, {
                                item: item,
                                onclick: (e) => {
                                    activeModal = null;
                                    item.onclick();
                                }
                            }))
                            : emptyText ?
                                m(Text, { padding: '1em', color: 'grey' }, emptyText)
                                : vnode.children))))
                    ],
                    m(Tappable, {
                        onclick: (e) => {
                            activeModal = id;
                        },
                        rippleEffect: true,
                        style: {
                            background: config.colors.lightgrey,
                            padding: '0.75rem',
                            border: '1px solid ' + config.colors.grey,
                            borderRadius: '0.5rem',
                            display: 'flex',
                            //flex:'1 1 100%',
                            alignItems: 'center'
                        },
                    }, m(FlexRow, { flex: 1, alignItems: 'center', justifyContent: 'space-between' }, m(FlexRow, { gap: '1rem', alignItems: 'center' }, m(Div, { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', padding: '0.6rem', borderRadius: '0.5rem' }, m(LucideIcon, {
                        icon: vnode.attrs.icon,
                        width: '20',
                        height: '20',
                        style: { color: 'black', margin: '0 auto' }
                    })), m(Text, left)), m(SmallText, right)))
                ];
            }
        };
        function TapButton() {
            return {
                view: (vnode) => {
                    let { onclick, item } = vnode.attrs;
                    return [
                        m(Tappable, {
                            onclick: (e) => {
                                onclick(e);
                            },
                            rippleEffect: true,
                            style: {
                                padding: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: '#f0f0f0',
                                borderRadius: '0.5rem',
                                alignItems: 'center',
                            }
                        }, m(FlexCol, { color: 'black', gap: '0.25rem' }, m(Text, item.title), item.description && m(SmallText, item.description)), m(LucideIcon, {
                            icon: 'chevron-right',
                            width: '20',
                            height: '20',
                            style: {
                                display: 'block',
                                color: 'black'
                            }
                        }))
                    ];
                }
            };
        }
    }
    function SearchPlayers() {
        let query = '';
        let results = [];
        let searching = false;
        let debounceTimer = null;
        function onInput(value) {
            query = value;
            clearTimeout(debounceTimer);
            if (query.length < 2) {
                results = [];
                return;
            }
            searching = true;
            debounceTimer = setTimeout(() => {
                searchUsers(query).then((users) => {
                    results = users.filter(u => !game.players.find(p => p.id === u.id));
                    searching = false;
                    m.redraw();
                });
            }, 300);
        }
        return {
            view: () => [
                // added players
                game.players.length > 0 && m(FlexCol, { gap: '0.5rem' }, game.players.map((player, index) => m(FlexRow, { alignItems: 'center', justifyContent: 'space-between',
                    style: { background: '#f0f0f0', borderRadius: '0.5rem', padding: '0.75rem 1rem' }
                }, m(FlexCol, { gap: '0.15rem' }, m(Text, { fontWeight: 'bold' }, player.user_name || `Player ${index + 1}`), player.handicap != null && m(SmallText, `HCP: ${player.handicap}`)), m(Tappable, {
                    onclick: () => { game.players.splice(index, 1); }
                }, m(LucideIcon, { icon: 'x', width: '18', height: '18', style: { color: '#999' } }))))),
                // search input
                m(Input, {
                    type: 'text',
                    icon: 'search',
                    placeholder: 'Search by username...',
                    value: query,
                    oninput: (e) => onInput(e.target.value),
                }),
                // results
                searching && m(SmallText, { style: { padding: '0.5rem 0', color: '#999' } }, 'Searching...'),
                results.length > 0 && m(FlexCol, { gap: '0.5rem' }, results.map((user) => m(Tappable, {
                    rippleEffect: true,
                    onclick: () => {
                        console.log('ONCLICK ONCLICK');
                        game.players.push(user);
                        results = results.filter(r => r.id !== user.id);
                        query = '';
                        results = [];
                    },
                    style: { background: '#f0f0f0', borderRadius: '0.5rem', padding: '0.75rem 1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
                }, m(FlexCol, { gap: '0.15rem' }, m(Text, { fontWeight: 'bold' }, user.user_name), user.handicap != null && m(SmallText, `HCP: ${user.handicap}`)), m(LucideIcon, { icon: 'plus', width: '18', height: '18', style: { color: '#555' } })))),
                query.length >= 2 && !searching && results.length === 0 &&
                    m(SmallText, { style: { padding: '0.5rem 0', color: '#999' } }, 'No players found'),
                // done button
                m(Button, {
                    type: 'primary',
                    onclick: () => { activeModal = null; }
                }, 'Done')
            ]
        };
    }
}
