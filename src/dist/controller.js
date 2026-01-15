import { scrapGolfClubs, scrapRounds, scrapTees, } from "./scrap_data.js";
import { createClient } from '@supabase/supabase-js';
// controller se podría llamar server.js
export { getGolfClubs, getClub, saveGame, endGame, getUser, createUser, getGame, AppData };
const supabase = createClient('https://yzcarnnubrtaaswshopo.supabase.co', 'sb_publishable_yVJTdFY4Qlpb0eQ2V94nPA_rBjZ2VmK');
// TO DO ! FALTA HACER AUTENTICACIÓN REAL CON GOOGLE, IOS O SIMILAR
// crea o obtiene el usuario
async function createUser(email, password) {
    // find an user with this email
    let data = await supabase
        .from('Users')
        .select('*')
        .eq('email', email)
        .single();
    if (data.data) {
        // para sacar los games !!
        let user = await getUser(data.data.id);
        // user exists
        return Promise.resolve(user);
    }
    else {
        // create user
        let insertData = await supabase
            .from('Users')
            .insert([
            { email: email }
        ])
            .select();
        if (insertData.data && insertData.data.length > 0) {
            return Promise.resolve(insertData.data[0]);
        }
        else {
            return Promise.reject('Error creating user');
        }
    }
}
async function getUser(id) {
    let { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        return Promise.reject();
    }
    else {
        let games = await getUserGames(id);
        data.games = games;
        return Promise.resolve(data);
    }
}
async function getUserGames(id) {
    let { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', id);
    console.log('data', data);
    if (error) {
        return Promise.reject();
    }
    else {
        data.map((game) => {
            if (!game.round) {
                game.round = scrapRounds.find((round) => round.id === game.round_id);
            }
            if (!game.club) {
                game.club = scrapGolfClubs.find((club) => club.id === game.club_id);
            }
            if (!game.tee) {
                game.tee = scrapTees.find((tee) => tee.id === game.tee_id);
            }
        });
        return Promise.resolve(data);
    }
}
// Global data store for the app
const AppData = {
    user: null,
    selectedClub: null,
    golfClubs: [],
    currentGame: null,
    isLoading: false,
    cache: new Map()
};
function getGolfClubs() {
    scrapGolfClubs.map((course) => {
        course.rounds = scrapRounds.filter(round => round.club_id === course.id);
        course.tees = scrapTees.filter(tee => tee.club_id === course.id);
    });
    AppData.golfClubs = scrapGolfClubs;
    return Promise.resolve(scrapGolfClubs);
}
function getClub(id) {
    let club = scrapGolfClubs.find(club => club.id === id);
    console.log('club', club);
    club.rounds = scrapRounds.filter(round => round.club_id === club.id);
    club.tees = scrapTees.filter(tee => tee.club_id === club.id);
    return Promise.resolve(club);
}
function saveGame(game) {
    let games = JSON.parse(localStorage.getItem('games') || '[]');
    let existingIndex = games.findIndex((g) => g.id === game.id);
    if (existingIndex >= 0) {
        console.log('saving game', game);
        games[existingIndex] = game.toJSON();
    }
    else {
        games.push(game.toJSON());
    }
    localStorage.setItem('games', JSON.stringify(games));
}
async function endGame(game) {
    // upload to supabase
    game.end = new Date();
    if (!game.user_id) {
        game.user_id = AppData.user?.id || localStorage.getItem('user_cod') || '';
    }
    console.log('Attempting to insert game:', game.toJSON());
    let insertData = await supabase
        .from('games')
        .insert(game.toJSON())
        .select();
    if (insertData.error) {
        console.error('Supabase error:', insertData.error);
        return Promise.reject(insertData.error.message);
    }
    if (insertData.data && insertData.data.length > 0) {
        return Promise.resolve(insertData.data[0]);
    }
    else {
        return Promise.reject('Error creating game');
    }
}
async function getGame(id) {
    // get game from supabase
    let { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        console.log('error', error);
        return Promise.reject();
    }
    else {
        if (!data.round) {
            data.round = scrapRounds.find((round) => round.id === data.round_id);
        }
        if (!data.club) {
            data.club = scrapGolfClubs.find((club) => club.id === data.club_id);
        }
        if (!data.tee) {
            data.tee = scrapTees.find((tee) => tee.id === data.tee_id);
        }
        return Promise.resolve(data);
    }
}
function listGames(userId) {
    let games = JSON.parse(localStorage.getItem('games') || '[]');
    let userGames = games.filter((game) => game.user_id === userId);
    return Promise.resolve(userGames);
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
