// MODEL
import { App, AppBar, AppContent, LucideIcon, NavBar } from './components/app_elements.js';
import { setConfig } from './components/config.js';
import { Button } from './components/elements.js';
import { HtmlIntegerInput } from './components/forms.js';
import { Box, Div, FlexCol, FlexRow, Tappable } from './components/layout.js';
import { H2, H3, SmallText, Text } from './components/texts.js';
import { getClub, getGolfClubs } from './controller.js';
import { GolfClub, Hole, Round } from './model.js';
const m = window.m;
setConfig({
    background: '#102210',
    fontFamily: 'Lexend, sans-serif',
    primaryColor: '#013220',
    'text-light': '#333333',
    card: {
        background: '#00000033',
        border: ' 1px solid #444444'
    },
    app: {
        appBar: {
            background: '#102210',
            borderBottom: '#2a4b3a solid 1px',
            leading: 'white'
        }
    },
    form: {
        formLabel: {
            color: 'white'
        }
    },
    button: {
        primary: {
            background: '#014d26',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
        },
    }
});
// Router
m.route(document.body, "/", {
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, MainPage);
        }
    },
    "/club/:id": {
        render: function (vnode) {
            return m(ClubSelected, vnode.attrs);
        }
    },
    "/club/:clubId/:lapId/:teeId": {
        render: function (vnode) {
            return m(LapStart, vnode.attrs);
        }
    },
    /*
    "/profile": {
        render: function(vnode) {
            return m(Layout, vnode.attrs, Profile)
        }
    },

    "/course/:name": {
        render: function(vnode) {
            return m(CourseSelected, vnode.attrs)
        }
    },

    "/course/map/:name": {
        render: function(vnode) {
            return m(CourseMap, vnode.attrs)
        }
    },

    "/profile": {
        render: function(vnode) {
            return m(Profile, vnode.attrs)
        }
    },

    "/conversations": {
        render: function(vnode) {
            return m(Conversations, vnode.attrs)
        }
    }*/
});
function SplashPage() {
    return {
        view: (vnode) => {
            return [];
        }
    };
}
function Layout() {
    let routes = [{}];
    return {
        view: (vnode) => {
            return m(App, m(AppBar, {
                title: 'Play'
            }), m(AppContent, vnode.children.map((child) => m(child)), m(Box, { height: '4rem' })), m(NavBar, {
                icons: [
                    { icon: "land-plot", link: "/", name: 'Play' },
                    { icon: "dumbbell", link: "/train", name: 'Train' },
                    { icon: "user", link: "/club", name: 'Club' }
                ]
            }));
        }
    };
}
function MainPage() {
    let golfClubs = [];
    return {
        oninit: (vnode) => {
            getGolfClubs()
                .then((res) => {
                res.map((club) => {
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
                    padding: '1rem',
                    color: '#fff'
                }
            }, [
                m('h3', 'Golf Courses Near You'),
                m(FlexCol, { gap: '1rem' }, golfClubs.map((club) => {
                    const photo = club.photo;
                    return m(Tappable, {
                        onclick: (e) => {
                            m.route.set(`/club/${club.id}`);
                        }
                    }, m(FlexRow, {
                        background: '#00000033',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }, m(FlexRow, { flex: 1, gap: '0.5rem' }, photo && m("img", {
                        style: {
                            width: '70px',
                            height: '70px',
                            borderRadius: '0.5rem'
                        },
                        src: photo
                    }), m(FlexCol, { justifyContent: 'space-between' }, m(Text, club.name), m(FlexRow, { alignItems: 'center', gap: '0.5rem' }, m(LucideIcon, {
                        icon: 'star',
                        width: '16',
                        height: '16'
                    }), m(SmallText, club.rating || 'N/A')))), m(LucideIcon, {
                        icon: 'chevron-right',
                        width: '24',
                        height: '24'
                    })));
                }))
            ]);
        }
    };
}
function ClubSelected() {
    let club = null;
    let loading = false;
    let selectedLap = null;
    let selectedTee = null;
    return {
        oninit: (vnode) => {
            let clubId = vnode.attrs.id;
            console.log('Selected club ID:', clubId);
            loading = true;
            getClub(clubId)
                .then((res) => {
                club = new GolfClub(res);
                loading = false;
                m.redraw();
            })
                .catch((error) => {
                console.error('Error loading club details:', error);
            });
        },
        view: (vnode) => {
            if (loading)
                return;
            return [
                m(App, m(AppBar, {
                    leading: true
                }), m(AppContent, m(FlexCol, { padding: '1em', alignItems: 'center' }, m("img", {
                    style: {
                        width: '80%',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                    },
                    src: club.photo
                }), m(H2, club.name), club.laps?.length
                    ? [
                        m(Text, { marginTop: '1rem' }, 'Select a lap'),
                        club.laps.map((lap) => m(Tappable, {
                            onclick: (e) => {
                                selectedLap = lap;
                            },
                            style: {
                                background: '#00000033',
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                marginTop: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%'
                            },
                        }, m(FlexCol, m(H3, lap.name), m(SmallText, `Holes: ${lap.number_of_holes || 'N/A'}`)), m(Div, {
                            height: '12px',
                            width: '12px',
                            borderRadius: '50%',
                            background: selectedLap && selectedLap.id === lap.id ? 'white' : '#ffffff55',
                            border: '1px solid white',
                            padding: '4px',
                            marginLeft: 'auto',
                        })
                        /*
                        m(FlexRow, {alignItems:'center', gap:'0.5rem', marginTop:'0.5rem'},
                            m(LucideIcon,{
                                icon: 'star',
                                width: '16',
                                height: '16'
                            }),
                            m(SmallText, `Rating: ${lap.course_ratings['blue'] || 'N/A'}`)
                        ),

                        m(FlexRow, {alignItems:'center', gap:'0.5rem', marginTop:'0.5rem'},
                            m(LucideIcon,{
                                icon: 'sliders',
                                width: '16',
                                height: '16'
                            }),
                            m(SmallText, `Slope: ${lap.slopes['blue'] || 'N/A'}`)
                        ),*/
                        ))
                    ]
                    : null, club.tees?.length ?
                    [
                        m(Text, { marginTop: '1rem' }, 'Tee Options'),
                        m(FlexRow, { flexWrap: 'wrap', gap: '0.1rem' }, club.tees.map((tee) => m(Tappable, {
                            onclick: (e) => {
                                selectedTee = tee;
                            },
                            style: {
                                display: 'flex',
                                background: '#00000033',
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                marginTop: '1rem',
                                //border: `0.5px solid ${tee.color}`,
                                width: '40%',
                                alignItems: 'center'
                            }
                        }, m(Div, {
                            height: '24px',
                            width: '24px',
                            borderRadius: '50%',
                            background: tee.color || '#ffffff55',
                            border: '1px solid white',
                            marginRight: '1rem',
                        }), m(FlexCol, m(Text, tee.name)), m(Div, {
                            height: '12px',
                            width: '12px',
                            borderRadius: '50%',
                            background: selectedTee && selectedTee.id === tee.id ? 'white' : '#ffffff55',
                            border: '1px solid white',
                            padding: '4px',
                            marginLeft: 'auto',
                        }))))
                    ] : null, m(Button, {
                    type: 'primary',
                    disabled: !selectedLap || !selectedTee,
                    onclick: (e) => {
                        m.route.set(`/club/${club.id}/${selectedLap.id}/${selectedTee.id}`);
                    },
                    style: {
                        marginTop: '1rem',
                        position: 'fixed',
                        bottom: '2em',
                        width: '80%',
                        maxWidth: '400px'
                    }
                }, 'Start'))))
            ];
        }
    };
}
function LapStart() {
    let lap;
    let tee;
    let holes = [];
    let club;
    let hole_index = 0;
    let round;
    return {
        oninit: (vnode) => {
            getClub(vnode.attrs.clubId).then((res) => {
                club = res;
                lap = res.laps.find((l) => l.id === vnode.attrs.lapId);
                holes = lap.holes.map((hole) => new Hole(hole));
                tee = res.tees.find((t) => t.id === vnode.attrs.teeId);
                m.redraw();
            });
            round = new Round({
                id: 'round_ ' + Date.now(),
                date: new Date(),
                lap_id: vnode.attrs.lapId,
                club_id: vnode.attrs.clubId,
                tee_id: vnode.attrs.teeId
            });
        },
        view: (vnode) => {
            return m(App, m(AppBar, {
                leading: true,
                title: lap?.name
            }), m(AppContent, m(FlexCol, { padding: '1em' }, m(Text, `Club ID: ${vnode.attrs.clubId}`), m(Text, `Lap ID: ${vnode.attrs.lapId}`), m(Text, `Tee ID: ${vnode.attrs.teeId}`)), m(HoleInfo, {
                hole: holes[hole_index],
                teeId: vnode.attrs.teeId
            }), m(Div, {
                position: 'fixed',
                bottom: '0px',
                left: '0px',
                right: '0px',
                padding: '1rem',
                background: 'white',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }, m(Tappable, {
                onclick: () => {
                    if (hole_index > 0) {
                        hole_index--;
                    }
                }
            }, m(LucideIcon, {
                icon: 'circle-chevron-left',
                width: '48',
                height: '48',
            })), m(Text, "Hoyo " + (hole_index + 1)), m(Tappable, {
                onclick: () => {
                    console.log('onclick');
                    m.redraw();
                    if (hole_index < holes.length - 1) {
                        hole_index++;
                    }
                }
            }, m(LucideIcon, {
                icon: 'circle-chevron-right',
                width: '48',
                height: '48',
            })))));
        }
    };
    function HoleInfo() {
        return {
            view: (vnode) => {
                let hole = vnode.attrs.hole;
                if (!hole)
                    return;
                console.log('round', round.scores, round.scores[hole_index]);
                return m(Div, { margin: '0 auto', borderRadius: '8px', width: '90%', maxWidth: '400px', background: 'white', padding: '0.2em', color: 'black' }, m(FlexCol, { padding: '1em' }, m(H2, `Hole ${hole_index + 1}`), m(Text, `Distance: ${hole.tees[vnode.attrs.teeId] || 'N/A'} yards`), m(Text, `Par ${holes[hole_index].par},  Hcp ${lap.handicaps[hole_index]}`)), m(Text, "Strokes"), m(HtmlIntegerInput, {
                    type: 'number',
                    min: 1,
                    data: round?.scores || {},
                    name: hole_index,
                    onchange: (e) => {
                        //round.scores[hole_index] += e;
                        m.redraw();
                    }
                }));
            }
        };
    }
}
function LapEnded() {
    return {
        view: (vnode) => {
            return m(App, m(AppBar, {
                leading: true,
                title: 'Lap Ended'
            }), m(AppContent, m(FlexCol, { padding: '1em' }, m(H2, 'Congratulations!'), m(Text, 'You have completed the lap.'))));
        }
    };
}
/*
function Profile() {
    return {
        view:(vnode)=> {
            return [

            ]
        }
    }
}


function Conversations() {

    return {
        view: (vnode)=> {
            return [
                
            ]
        }
    }
}




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
