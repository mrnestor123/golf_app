import { Game, GolfClub, User } from "./model.js";
import { 
    scrapGolfClubs, 
    scrapRounds,
    scrapTees,
    
} from "./scrap_data.js";

import { createClient } from '@supabase/supabase-js'



// controller se podría llamar server.js
export {
    getGolfClubs,
    getClub,
    saveGame,
    endGame, 
    getUser,
    createUser,
    getGame,
    Data,
    AppData
}


const supabase = createClient('https://yzcarnnubrtaaswshopo.supabase.co', 'sb_publishable_yVJTdFY4Qlpb0eQ2V94nPA_rBjZ2VmK')




// TO DO ! FALTA HACER AUTENTICACIÓN REAL CON GOOGLE, IOS O SIMILAR
// crea o obtiene el usuario
async function createUser(email:string, password:string){

    // find an user with this email
    let data = await supabase
    .from('Users')
    .select('*')
    .eq('email', email)
    .single();

    console.log('data', data)

    if (data.data ){
        // user exists
        return Promise.resolve(data.data);
    } else {
        // create user
        let insertData = await supabase
        .from('Users')
        .insert([
            { email: email, password: password }
        ])
        .select();

        if (insertData.data && insertData.data.length > 0){
            return Promise.resolve(insertData.data[0]);
        } else {
            return Promise.reject('Error creating user');
        }
    }
}


async function getUser(id:string){

    let { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', id)
    .single();

    if (error){
        return Promise.reject();
    } else {
        return Promise.resolve(data);
    }
}





interface Data {
    user: User | null;
    golfClubs: GolfClub[];
    selectedClub: GolfClub | null;
    currentGame: Game | null;
    isLoading: boolean;
    cache: Map<string, any>;
}

// Global data store for the app
const AppData: Data = {
    user: null,
    selectedClub: null,
    golfClubs: [],
    currentGame: null,
    isLoading: false,
    cache: new Map()
};


function getGolfClubs(){

    scrapGolfClubs.map((course)=> {
        course.rounds = scrapRounds.filter(round => round.club_id === course.id);
        course.tees = scrapTees.filter(tee => tee.club_id === course.id);
    })

    AppData.golfClubs = scrapGolfClubs;


    return Promise.resolve(scrapGolfClubs);
}


function getClub(id:string){
    let club = scrapGolfClubs.find(club => club.id === id);

    console.log('club', club)

    club.rounds = scrapRounds.filter(round => round.club_id === club.id);
    club.tees = scrapTees.filter(tee => tee.club_id === club.id);

    return Promise.resolve(club);
} 


function saveGame(game:Game){

    let games = JSON.parse(localStorage.getItem('games') || '[]');

    let existingIndex = games.findIndex((g:any) => g.id === game.id);
    if (existingIndex >= 0){
        games[existingIndex] = game.toJSON();
    } else {
        games.push(game.toJSON());
    }

    localStorage.setItem('games', JSON.stringify(games));
}


function endGame(game:Game){
    saveGame(game);
}


function getGame(id:string){
    let games = JSON.parse(localStorage.getItem('games') || '[]');
    let gameData = games.find((game:any) => game.id === id);
    if (gameData){
        let game = new Game(gameData);

        if(!game.round){
            game.round = scrapRounds.find((round) => round.id === gameData.round_id);
        }

        if(!game.tee){
            game.tee = scrapTees.find((tee) => tee.id === gameData.tee_id);
        }

        return Promise.resolve(game);
    } else {
        return Promise.resolve(null);
    }

}


function listGames(userId:string){
    let games = JSON.parse(localStorage.getItem('games') || '[]');
    let userGames = games.filter((game:any) => game.user_id === userId);
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
