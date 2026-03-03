import { App, AppBar, AppContent, LucideIcon } from '../components/app_elements.js';
import { config } from '../components/config.js';
import { Button, Label } from '../components/elements.js';
import { Div, FlexCol, Tappable, FlexRow, Box } from '../components/layout.js';
import { H2, H3, SmallText, Text } from '../components/texts.js';
import { AppData, getGame, endGame } from './controller.js';
import { Hole } from '../model/hole.js';
import { openDialog } from '../components/dialogs.js';
const m = window.m; // pasar a node-modules en algun momento !!
export function GameStart() {
    let game = AppData.currentGame;
    let holes = game?.round?.holes.map((hole) => new Hole(hole));
    let hole_index = 0;
    let loading = false;
    async function getData({ id }) {
        try {
            if (!game) {
                loading = true;
                game = await getGame(id);
                holes = game.round.holes.map((hole) => new Hole(hole));
                AppData.currentGame = game;
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
            return m(App, m(AppBar, {
                leading: {
                    icon: 'x',
                    onclick: (e) => {
                        openDialog(ExitDialog);
                    },
                    style: { color: 'black' }
                },
                title: game && game.round.name,
                subtitle: game && game.club.name,
            }), !game ?
                null :
                m(AppContent, { borderTop: '1px solid #ccc' }, [
                    m(HoleInfo, {
                        hole: holes[hole_index],
                        key: hole_index,
                        score: game.scores[hole_index],
                        teeId: vnode.attrs.teeId
                    }),
                ], m(TotalScore), m(Div, {
                    position: 'fixed',
                    bottom: '0px',
                    left: '0px',
                    right: '0px',
                    padding: '1rem',
                    background: 'white',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'space-between'
                }, m(Button, {
                    disabled: hole_index == 0,
                    type: 'secondary',
                    style: {
                        minWidth: 'fit-content'
                    },
                    onclick: () => {
                        m.redraw();
                        if (hole_index > 0) {
                            hole_index--;
                        }
                    }
                }, m(LucideIcon, {
                    icon: 'arrow-left',
                    style: {
                        color: 'black'
                    },
                    width: '16',
                    height: '16'
                })), m(Button, {
                    onclick: () => {
                        if (hole_index >= holes.length - 1) {
                            endGame(game);
                            m.route.set(`/game/end/${game.id}`);
                        }
                        else {
                            game.scores[hole_index].confirmed = true;
                            game.scores[hole_index].end = new Date();
                            hole_index++;
                        }
                        m.redraw();
                    },
                    style: {
                        flex: 1
                    }
                }, hole_index >= holes.length - 1 ? "End Round" : "Add score"), m(Button, {
                    type: 'secondary',
                    style: {
                        minWidth: 'fit-content'
                    },
                    onclick: () => {
                        m.redraw();
                        if (hole_index < holes.length - 1) {
                            if (game.scores[hole_index].strokes && !game.scores[hole_index].end) {
                                game.scores[hole_index].end = new Date();
                            }
                            hole_index++;
                        }
                    }
                }, m(LucideIcon, {
                    icon: 'arrow-right',
                    style: {
                        color: 'black'
                    },
                    width: '16',
                    height: '16'
                })))));
        }
    };
    function ExitDialog() {
        return {
            view: (vnode) => {
                return m(FlexCol, { inset: '0', position: 'fixed', background: '#00000088', zIndex: 1000 }, m(FlexCol, {
                    border: '1px solid #ccc', borderRadius: '0.1rem', flex: 1,
                    gap: '1rem', alignItems: 'center', background: 'white', padding: '0.5rem', width: '80%',
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                }, m(H3, "Are you sure?"), m(Text, "You are going to end the game"), m(FlexCol, { gap: '0.5rem' }, m(Button, {
                    type: 'primary',
                    onclick: (e) => {
                        m.route.set(`/`);
                        console.log('closing');
                        vnode.attrs.close();
                    }
                }, "Discard session"), game.scores.some((score) => score.confirmed) &&
                    m(Button, {
                        type: 'primary',
                        onclick: (e) => {
                            endGame(game);
                            m.route.set(`/game/end/${game.id}`);
                            vnode.attrs.close();
                        }
                    }, "End and save session"), m(Button, {
                    type: "secondary",
                    onclick: (e) => {
                        vnode.attrs.close();
                    }
                }, "Cancel"))));
            }
        };
    }
    function HoleInfo() {
        let expandMore = false;
        let hole;
        let score;
        return {
            oninit: (vnode) => {
                hole = vnode.attrs.hole;
                score = vnode.attrs.score;
                if (!score.confirmed) {
                    score.strokes = hole.par;
                    score.start = new Date();
                }
            },
            view: (vnode) => {
                hole = vnode.attrs.hole;
                score = vnode.attrs.score;
                if (!hole)
                    return;
                if (!score.start)
                    score.start = new Date();
                let green_score = (hole.par - 2);
                score.green_in_regulation = score.confirmed && score.strokes && score.putts ? score.strokes - (score.putts || 0) <= green_score : false;
                score.up_and_down = score.confirmed && score.strokes && !score.green_in_regulation ? hole.par >= score.strokes : false;
                return m(FlexCol, {
                    background: 'white',
                    gap: '1rem', color: 'black'
                }, m(FlexRow, { alignItems: 'center', justifyContent: 'space-between', width: '100%' }, m(H2, `Hole ${hole_index + 1}`), m(FlexRow, { gap: '0.5rem', alignItems: 'center' }, m(LucideIcon, {
                    icon: 'land-plot',
                    width: '20',
                    height: '20',
                }), m(SmallText, hole.tees[game.tee.id] + ' m'))
                /*
                m(Label, {
                  type: 'secondary',
                  style: { border:`1px solid ${tee.color}`, color: tee.color, background:'white'}
                }, m(SmallText, tee.name )*/
                ), m(FlexRow, { justifyContent: 'space-between', alignItems: 'center', flex: 1 }, [
                    'Par ' + hole.par,
                    'Hcp ' + game.round.handicaps[hole_index],
                ].map((text, i) => {
                    return [
                        m(Label, {
                            type: 'secondary',
                            style: { flex: 1 }
                        }, m(Text, text)),
                        i == 0 ? m(Box, { width: '1rem' }) : null
                    ];
                }), m(FlexRow, { alignItems: 'center', gap: '0.5rem' })), m(NumberPut, {
                    data: score,
                    name: 'strokes',
                    text: 'Total Strokes',
                }), m(NumberPut, {
                    data: score,
                    name: 'putts',
                    text: 'Putts'
                }), m(NumberPut, {
                    data: score,
                    name: 'chip',
                    text: 'Approach shots'
                }), m(NumberPut, {
                    data: score,
                    name: 'penalties',
                    text: 'Penalties'
                }), m(Fairway, {
                    data: score,
                    name: 'fairway',
                    text: 'Fairways Hit'
                }), m(FlexRow, { alignItems: 'center' }, m(Label, {
                    style: { flex: 1 },
                    type: score.green_in_regulation ? 'primary' : 'secondary',
                }, m(Text, { color: score.green_in_regulation ? 'white' : 'black' }, "GIR")), m(Box, { width: '1rem' }), m(Label, {
                    style: { flex: 1 },
                    type: score.up_and_down ? 'primary' : 'secondary',
                }, m(Text, { color: score.up_and_down ? 'white' : 'black' }, "UP & DOWN"))));
            }
        };
        function NumberPut() {
            return {
                view: (vnode) => {
                    let { text, data, name } = vnode.attrs;
                    return [
                        m(FlexRow, {
                            style: {
                                flex: 1, alignItems: 'center',
                                borderRadius: '0.5rem', justifyContent: 'space-between'
                            }
                        }, m(Text, text), m(FlexRow, { minWidth: '30%', alignItems: 'center', justifyContent: 'space-between', background: config.app.card.background, padding: '1rem', borderRadius: '0.5rem' }, m(Tappable, {
                            style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                            onclick: (e) => {
                                if (data[name] == 0)
                                    return;
                                score.confirmed = true;
                                data[name] = (data[name] || 0) - 1;
                                m.redraw();
                            },
                        }, m(LucideIcon, { icon: 'minus', width: '24', height: '24' })), m(H2, { color: score.confirmed ? 'black' : 'grey' }, data[name] || 0), m(Tappable, {
                            style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                            onclick: (e) => {
                                score.confirmed = true;
                                data[name] = (data[name] || 0) + 1;
                                m.redraw();
                            },
                        }, m(LucideIcon, {
                            icon: 'plus',
                            width: '24',
                            height: '24'
                        }))))
                    ];
                }
            };
        }
        function Fairway() {
            return {
                view: (vnode) => {
                    let { text, data, name } = vnode.attrs;
                    return [
                        m(FlexRow, {
                            style: {
                                flex: 1, alignItems: 'center',
                                borderRadius: '0.5rem', justifyContent: 'space-between'
                            }
                        }, m(Text, text), m(FlexRow, { alignItems: 'center', background: config.app.card.background, padding: '1rem', borderRadius: '0.5rem' }, m(FlexRow, { alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }, [
                            { icon: 'arrow-left', name: 'left' },
                            { icon: 'circle-dot', name: 'middle' },
                            { icon: 'arrow-right', name: 'right' },
                        ].map((item) => {
                            return m(Tappable, {
                                style: {
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: data[name] === item.name ? `1.5px solid ${config.primaryColor}` : '1px solid #ccc'
                                    //background: data[name] === item.name ? config.background : 'transparent',
                                },
                                onclick: (e) => {
                                    data[name] = item.name;
                                    m.redraw();
                                },
                            }, m(LucideIcon, { icon: item.icon, width: '16', height: '16' }));
                        }))))
                    ];
                }
            };
        }
    }
    function TotalScore() {
        return {
            view: (vnode) => {
                return [];
            }
        };
    }
}
/*
function CourseMap() {
    let selectedCourse;
    let map;
    


// This function draws the OSM features onto the map
    function renderOsmFeatures(features) {
        if (!features || features.length === 0) {
            console.log("No OSM features to render.");
            return;
        }

        // Filter for 'way' types only
        const holes = features.filter(f => f.type === 'way' && f.geometry && f.tags?.golf=='hole');

        holes.forEach(way => {
            const points = way.geometry.map(p => [p.lat, p.lon]);
            
            // Draw the polygon on the map
            const polygon = L.polygon(points, {
                color: 'grey', // Green outline
                weight: 2,
                fillColor: '#ffffff', // White fill
                fillOpacity: 0.3
            }).addTo(map);

            // Add a popup to show the tags associated with this 'way'
            const popupContent = `<pre>${JSON.stringify(way.tags, null, 2)}</pre>`;
            polygon.bindPopup(popupContent);
            
        });

        // now i have the polygons of the hole, i'd like to add a marker for the tee and the pins
        const pins = features.filter(f => f.type === 'node' && f.tags?.golf === 'pin');

        pins.forEach(pin => {
            L.marker([pin.lat, pin.lon], {
                icon: L.divIcon({
                    className: 'custom-pin-icon',
                    html: '🚩', // Using a flag emoji as the icon
                    iconSize: [30, 30],
                    iconAnchor: [0, 30], // Anchor point of the icon
                })
            })
            .addTo(map)
            .bindPopup(JSON.stringify(pin));
        });

        const tees = features.filter(f => f.type === 'node' && f.tags?.golf === 'tee');

        tees.forEach(tee => {
            if (tee.type === 'way' && tee.geometry) {
                // Draw tee areas (polygons) as light green
                const points = tee.geometry.map(p => [p.lat, p.lon]);
                L.polygon(points, {
                    color: '#90EE90', // Light green
                    weight: 1,
                    fillOpacity: 0.7
                }).addTo(map).bindPopup(`Tee Area (Hole ${tee.tags.ref || '?'})`);
            } else if (tee.type === 'node') {
                // Draw tee points (nodes) with an icon
                L.marker([tee.lat, tee.lon], {
                    icon: L.divIcon({
                        className: 'custom-tee-icon',
                        html: '⛳', // Using a flag emoji as the icon
                        iconSize: [30, 30],
                        iconAnchor: [0, 30], // Anchor point of the icon
                    })
                })
                .addTo(map)
                .bindPopup(`${JSON.stringify(tee)}`);
            }
        });

        // Find and draw greens
        const greens = features.filter(f => f.type === 'way' && f.geometry && f.tags?.golf=='green');
        greens.forEach(green => {
            const points = green.geometry.map(p => [p.lat, p.lon]);
            L.polygon(points, {
                color: '#90EE90', // Light green
                weight: 2,
                fillOpacity: 0.5
            }).addTo(map).bindPopup(`${JSON.stringify(green)}`);
        });


    }


    function initMap(lat, lng) {
        if (map) map.remove();

        map = L.map('map-container').setView([lat, lng], 16);

        // Use a satellite view, which is best for golf courses
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 19
        }).addTo(map);

        // Add a marker for the course's main location
        // L.marker([lat, lng]).addTo(map).bindPopup(`<b>${selectedCourse.displayName}</b>`);

        // Fetch and render detailed OSM data
        fetchOsmCourseDetails(lat, lng).then(renderOsmFeatures);
    }


    // This function queries OpenStreetMap for detailed golf features.
    async function fetchOsmCourseDetails(lat, lng) {
        // We search in a 1km radius around the course's center point.
        const radius = 1000;
        const query = `
            [out:json][timeout:25];
            (
            // Query for nodes, ways, and relations related to golf features
            node["golf"](around:${radius},${lat},${lng});
            way["golf"](around:${radius},${lat},${lng});
            relation["golf"](around:${radius},${lat},${lng});

            // Also query for common natural features on a course
            way["natural"="sand"](around:${radius},${lat},${lng});
            way["natural"="water"](around:${radius},${lat},${lng});
            );
            out geom; // 'geom' provides coordinates for rendering
        `;

        try {
            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query
            });

            console.log('response', response)

            if (!response.ok) {
                throw new Error(`Overpass API request failed: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("OSM Data Found:", data.elements);
            return data.elements;
        } catch (error) {
            console.error("Error fetching OSM data:", error);
            return []; // Return an empty array on failure
        }
    }


    return {
        oninit: (vnode) => {
            selectedCourse = Model.selectedCourse || JSON.parse(localStorage.getItem('selectedCourse'));


            console.log('course', selectedCourse)
        },

        oncreate: (vnode) => {
            setTimeout(() => {
                if (selectedCourse && selectedCourse.location) {
                    const lat = selectedCourse.location.lat;
                    const lng = selectedCourse.location.lng;
                    initMap(lat, lng);
                }
            }, 100);
        },

        onremove: () => {
            if (map) {
                map.remove();
                map = null;
            }
        },

        view: (vnode) => {
            return [
                m("style",
                    `
                    .leaflet-bottom.leaflet-right {
                        display: none;
                    }
                `),


                m(App,
                    m(AppBar, {
                        leading: {
                            style: { color: 'white'},
                            icon: 'arrow-left',
                            onclick: () => m.route.set(`/course/${selectedCourse.displayName}`)
                        },
                    }),

                    m(AppContent,
                        m(FlexCol, {height:'100%'},
                            // Contenedor del mapa
                            m('div#map-container', {
                                style: {
                                    display:'flex',
                                    flexDirection:'column',
                                    flex: 1,
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '90vh',
                                    flex: 1
                                }
                            }),
                        )
                    )

                )
            ]
        }
    }
}*/ 
