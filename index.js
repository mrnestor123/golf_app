// MODEL
import {App, AppBar, AppContent, LucideIcon, NavBar} from './components/app_elements.js'
import { setConfig } from './components/config.js'
import { Button } from './components/elements.js'
import { Box, Div, FlexCol, FlexRow, Tappable } from './components/layout.js'
import { H2, H3, SmallText, Text } from './components/texts.js'


let Model = {
    messages: [],
    user: {
        location: {
            lat: null,
            lng: null
        },
    },
    googleKey:'AIzaSyCWmkjYRastjR3yvNxNVnEUPJ-y7zW6YjA',
    golfKey:'QTXWGJELZ7EC662ZUI2DRK55SA',
    conversations: [], 
    fields: [],
    golfCourses: [],
    userLocation: null,
    
    selectedCourse: null,

    loading: false,
    error: null
}

let Theme = {
    colorPalette: {
        primary: "#3498db",
        secondary: "#2ecc71",
        background: "#ecf0f1",
        text: "#2c3e50"
    }
}

let Controller = {

    sendMessage:(message) => {
        Model.messages.push(message)
    },

    loadCourses: async () => {
        
        Model.loading = true;
        m.redraw();

        const googleKey = Model.googleKey;

        try {
            // Get user location first
            // change model.userLocation to Model.user.location
            if (!Model.user.location.lat || !Model.user.location.lng) {
                try {
                    Model.user.location = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                resolve({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                });
                            },
                            (error) => {
                                console.warn('Geolocation error:', error);
                                // Use default location Valencia
                                resolve({
                                    lat: 39.4699,
                                    lng: -0.3763
                                });
                            },
                            { 
                                enableHighAccuracy: false,
                                timeout: 10000,
                                maximumAge: 300000
                            }
                        );
                    });
                } catch (geoError) {
                    console.warn('Geolocation not available, using default location');
                    // Fallback to Valencia, Spain
                    Model.user.location = {
                        lat: 39.4699,
                        lng: -0.3763
                    };
                }
            }

            // Load Google Maps Places library if not already loaded
            if (!window.google || !window.google.maps) {
                await loadGoogleMapsScript(googleKey);
            }

            // Use NEW Places API (google.maps.places.Place)
            const { Place } = await google.maps.importLibrary("places");
            
            // Search for nearby golf courses using searchNearby
            const request = {
                // add the field 'image' to get place images
                fields: ['displayName', 'location', 'photos', 'formattedAddress', 'rating', 
                        'userRatingCount', 'regularOpeningHours', 'id'],
                locationRestriction: {
                    center: {
                        lat: Model.user.location.lat,
                        lng: Model.user.location.lng
                    },
                    radius: 25000, // 25km in meters
                },
                includedTypes: ['golf_course'],
                maxResultCount: 20,
                language: 'en-US',
                region: 'es'
            };

            const { places } = await Place.searchNearby(request);

            if (places && places.length > 0) {
                console.log('places', places);
                
                Model.golfCourses = places.map(data => {
                    let place = data.Dg;
                    
                    // Create short address from full address (just city/neighborhood)
                    let shortAddress = place.formattedAddress;
                    if (shortAddress) {
                        // Get last part (usually city) or second to last
                        const parts = shortAddress.split(',').map(p => p.trim());
                        shortAddress = parts.length > 1 ? parts[parts.length - 2] : parts[0];
                    }
                    
                    return {
                        ...place,
                        shortAddress: shortAddress
                    };
                });
                
                console.log('Found courses:', Model.golfCourses);
            } else {
                Model.golfCourses = [];
            }

            Model.loading = false;
            m.redraw();

        } catch (error) {
            console.error('Error:', error);
            Model.error = error.message;
            Model.loading = false;
            m.redraw();
        }
    }
}

setConfig({
    background: '#102210',
    fontFamily: 'Lexend, sans-serif',
    primaryColor:'#013220',
    'text-light': '#333333',
    card: {
        background:'#00000033',
        border:' 1px solid #444444'
    },
    app: {
        appBar: {
            background: '#102210',
            borderBottom: '#2a4b3a solid 1px'
        }
    }
})

// Helper function to load Google Maps script
function loadGoogleMapsScript(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}


// Router
m.route(document.body, "/", {
    "/": {
        render: function(vnode) {
            return m(Layout, vnode.attrs, MainPage)
        }
    },
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
    }
})


function SplashPage() {
    return {
        view: (vnode)=> {
            return [

            ]
        }
    }
}


function Layout() {
    let routes = [{

    }]


    return {
        view: (vnode)=> {
            console.log('children', vnode.children)

            return m(App,
                m(AppBar, {
                    title:  'Play',
                    leading: [
                        
                    ]
                }),

                m(AppContent, 
                    vnode.children.map((child) => m(child)),

                    m(Box,{height:'4rem'})
                ),

                m(NavBar, {
                    icons: [
                        { icon: "land-plot", link: "/", name: 'Play'},
                        { icon: "dumbbell", link: "/train", name: 'Train'},
                        { icon: "user", link: "/club", name:'Club'}
                    ]
                })
            )
        }
    }
}



function MainPage(){
    return {
        oninit:(vnode)=> {
            Controller.loadCourses()
        },  
        view: (vnode)=> {
            return m('div', { 
                style: { 
                    padding: '1rem',
                    color: '#fff'
                } 
            }, [
                m('h3', 'Golf Courses Near You'),
                
                // Loading state
                Model.loading && m('p', 'Loading golf courses...'),
                
                m(FlexCol, { gap: '1rem' },
                    Model.golfCourses.map((course)=> {
                        let photo = course.photos?.[0] || '';
                        
                        return [
                            m(Tappable,{
                                onclick:(e)=> {
                                    Model.selectedCourse = course;
                                    localStorage.setItem('selectedCourse', JSON.stringify(course));
                                    m.route.set(`/course/${course.displayName}`)
                                }
                            },
                                m(FlexRow, {
                                    background:'#00000033',
                                    padding: '0.75rem',
                                    borderRadius:'0.5rem',
                                    alignItems: 'center',
                                    gap:'0.5rem'
                                },
                                    m(FlexRow, {flex:1, gap:'0.5rem'},
                                        m("img",{
                                            style: {
                                                width:'70px',
                                                height:'70px',
                                                borderRadius:'0.5rem'
                                            },
                                            src: `https://places.googleapis.com/v1/${photo.name}/media?key=${Model.googleKey}&maxHeightPx=400&maxWidthPx=800`
                                        }),

                                        m(FlexCol, {justifyContent:'space-between'},
                                            m(Text, course.displayName),

                                            m(FlexRow, {alignItems:'center', gap:'0.5rem'},
                                            //rating star
                                                m(LucideIcon,{  
                                                    icon: 'star',
                                                    width: '16',
                                                    height: '16'
                                                }),
                                                m(SmallText, course.rating || 'N/A')  
                                            )
                                        )
                                    ),

                                    m(LucideIcon, {
                                        icon: 'chevron-right',
                                        width: '24',
                                        height: '24'
                                    })
                                )
                            )
                        ]

                    })
                )
            ])
        }
    }
}


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


function CourseSelected() {
    let selectedCourse;

    let courseData= {};
    let tab = 'holes';
    let loading = false;

    let teeSelected = null;

    return {
        oninit:(vnode)=>{            
            selectedCourse = Model.selectedCourse || JSON.parse(localStorage.getItem('selectedCourse'));

            loading = false;
            /*
            fetch(`https://api.golfcourseapi.com/v1/search?search_query=${vnode.attrs.name}`,{
                method:'GET',
                headers: {
                    'Authorization': `Key ${Model.golfKey}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if(!data || !data.courses || data.courses.length == 0) return;
                courseData = data.courses[0];

                loading = false;
                console.log('courseData', courseData)

                m.redraw();
            }) */
        },
        view: (vnode) => {
            console.log(selectedCourse, courseData)
            let photo = selectedCourse.photos?.[0] || '';

            if(loading) return;

            return [
                m(App,
                    m(AppBar, {
                        leading: {
                            style: { color: 'white'},
                            icon: 'arrow-left',
                            onclick: () => m.route.set('/')
                        },
                    }),

                    m(AppContent,
                        m(FlexCol, {alignItems:'center', gap:'1rem', justifyContent:'center'},
                            m(Box,{height:'1em'}),
                            m("img", {
                                style: {
                                    width:'60%',
                                    height:'auto',
                                    borderRadius:'0.5rem'
                                },
                                src: `https://places.googleapis.com/v1/${photo.name}/media?key=${Model.googleKey}&maxHeightPx=400&maxWidthPx=800`
                                
                            }),

                            m(H2,{textAlign: 'center'} , selectedCourse.displayName),

                            
                            /*
                            m(FlexCol, {gap:'1rem', background: '#00000033', padding:'1em', width:'80%' },
                                m(H3,'Select the tee'),

                                courseData.tees.male?.map((tee)=>{
                                    console.log('tee', tee)
                                    return m(Tee,{tee:tee})
                                }),

                                courseData.tees.female?.map((tee)=>{
                                    console.log('tee', tee)
                                    return m(Tee,{tee:tee})
                                }),
                                
                                /*courseData.holes.map((hole, index) => {
                                    return m(FlexRow, {justifyContent:'space-between', padding:'0.5rem', background:'#00000033', borderRadius:'0.5rem'},
                                        m(SmallText, `Hole ${index + 1}`),
                                        m(SmallText, `Par ${hole.par}`),
                                        m(SmallText, `${hole.distance} yards`)
                                    )
                                })
                            ),*/


                            m(Button,{
                                type:'secondary',
                                style : {
                                    position: 'fixed',
                                    bottom: '1rem',
                                    width: '80%',
                                    maxWidth: '400px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                },
                                onclick: (e)=> {
                                    m.route.set(`/course/map/${selectedCourse.displayName}`)
                                }
                            },
                                "Start"
                            )
                        )
                    )
                )

            ]
        }
    }


    function Tee(){
        return {
            view: (vnode) => {
                let tee = vnode.attrs.tee;
                let selected = teeSelected && (teeSelected.tee_name === tee.tee_name);

                console.log('tee', tee)
                return [
                    m(Tappable,{
                        onclick:(e)=> {
                            teeSelected = tee;
                            m.redraw();
                        }
                    },
                        m(FlexRow, { flex:1, padding:'2em', justifyContent:'space-between', background:'#00000033', borderRadius:'0.5rem'},
                            m(FlexRow,{gap:'0.5rem', alignItems:'center'},
                                m(Div,{
                                    height:'15px',
                                    width:'15px',
                                    borderRadius:'50%',
                                    background: tee.color || tee.tee_name || '#ffffff33',
                                    border: '2px solid #fff',
                                    boxSizing: 'border-box',
                                    marginRight:'0.5rem'
                                }),
                                m(Text, `${tee.tee_name}`
                            )),


                            m(Div, {
                                height:'15px',
                                width:'15px',
                                borderRadius:'50%',
                                border: selected ? '4px solid #2ecc71' : '2px solid #ffffff88',
                                boxSizing: 'border-box',
                                cursor: 'pointer',
                                background:'transparent'
                            })
                        )
                    )
                ]
            }
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
}