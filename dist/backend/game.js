import { Game } from '../model/game.js';
import { supabase } from './db.js';
export { getUserGames, saveGameToLocal, getGame, getSavedGame, uploadGame, deleteSavedGame };
async function getUserGames(id) {
    let { data, error } = await supabase
        .from('games')
        .select(`
      *,
      club:club_id(id, name, photo),
      tee:tee_id(*),
          round:round_id(*)
   `)
        .eq('user_id', id);
    if (error) {
        return Promise.reject();
    }
    else {
        return Promise.resolve(data);
    }
}
async function getGame(id) {
    const { data, error } = await supabase
        .from('games')
        .select(`
            *,
            club:club_id(id, name, photo),
            tee:tee_id(*),
            round:round_id(*, holes(*))
        `)
        .eq('id', id)
        .single();
    if (error) {
        console.error("Error fetching game:", error);
        return Promise.reject(error.message);
    }
    return new Game(data);
}
function getSavedGame(id) {
    let games = JSON.parse(localStorage.getItem('games') || '[]');
    let existingIndex = games.findIndex((g) => g.id === id);
    return new Game(games[existingIndex]);
}
function saveGameToLocal(game) {
    let games = JSON.parse(localStorage.getItem('games') || '[]');
    let existingIndex = games.findIndex((g) => g.id === game.id);
    if (existingIndex >= 0) {
        games[existingIndex] = game.toLocal();
    }
    else {
        games.push(game.toLocal());
    }
    localStorage.setItem('games', JSON.stringify(games));
}
function deleteSavedGame(id) {
    let games = JSON.parse(localStorage.getItem('games') || '[]');
    let existingIndex = games.findIndex((g) => g.id === id);
    if (existingIndex) {
        games.splice(existingIndex, 1);
        localStorage.setItem('games', JSON.stringify(games));
    }
}
async function uploadGame(game) {
    // find saved game
    deleteSavedGame(game.id);
    const { data, error } = await supabase
        .from('games')
        .upsert(game.toJSON());
    if (error) {
        console.error("Error uploading game:", error);
        return Promise.reject(error.message);
    }
    return data;
}
