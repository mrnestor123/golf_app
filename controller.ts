import { 
    scrapGolfClubs, 
    scrapLaps,
    scrapTees,
    
} from "./scrap_data.js";

export {
    getGolfClubs,
    getClub,
}


function getGolfClubs(){

    scrapGolfClubs.map((course)=> {
        course.laps = scrapLaps.filter(lap => lap.club_id === course.id);
        course.tees = scrapTees.filter(tee => tee.club_id === course.id);
    })

    console.log('scrapGolfClubs', scrapGolfClubs);

    return Promise.resolve(scrapGolfClubs);
}


function getClub(id:string){
    let course = scrapGolfClubs.find(club => club.id === id);
    course.laps = scrapLaps.filter(lap => lap.club_id === course.id);
    course.tees = scrapTees.filter(tee => tee.club_id === course.id);

    return Promise.resolve(course);
} 






/*
let googleKey  = 'AIzaSyCWmkjYRastjR3yvNxNVnEUPJ-y7zW6YjA'
let golfKey = 'QTXWGJELZ7EC662ZUI2DRK55SA'




let Model = {
    messages: [],
    user: {
        location: {
            lat: null,
            lng: null
        },
    },
    
    conversations: [], 
    fields: [],
    golfCourses: [],
    userLocation: null,
    
    selectedCourse: null,

    loading: false,
    error: null
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
}*/
