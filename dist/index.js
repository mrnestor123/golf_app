// MODEL
import { App, AppBar, AppContent, LucideIcon, NavBar } from './components/app_elements.js';
import { setConfig } from './components/config.js';
import { Button } from './components/elements.js';
import { Box, FlexCol, FlexRow, Tappable } from './components/layout.js';
import { H2, SmallText, Text } from './components/texts.js';
import { getClub, getGolfClubs } from './controller.js';
import { GolfClub } from './model.js';
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
            borderBottom: '#2a4b3a solid 1px'
        }
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
    "/club/:clubId/:courseId": {
        render: function (vnode) {
            return m(ClubSelected, vnode.attrs);
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
                }), m(H2, club.name), m(Button, {
                    type: 'primary',
                    onclick: (e) => {
                        m.route.set(`/course/map/${club.id}`);
                    },
                    style: {
                        marginTop: '1rem'
                    }
                }, 'View Course on Map'))))
            ];
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
