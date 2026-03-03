import { supabase } from "./db.js";
import { GolfClub } from "../model/golf_club.js";
export { getGolfClubs, getClub,
// aquí podría poner lo de game !!
 };
async function getGolfClubs() {
    const { data, error } = await supabase
        .from('golf_clubs')
        .select(`*`);
    if (error) {
        console.error("Error fetching clubs:", error);
        return Promise.reject(error.message);
    }
    console.log('golf clubs', data);
    return data.map((d) => new GolfClub(d));
}
async function getClub(id) {
    const { data, error } = await supabase
        .from('golf_clubs')
        .select(`
            *,
            rounds (
                *,
                tees (*),
                holes (*)
            )
        `)
        .eq('id', id)
        .single(); // .single() devuelve un objeto, no un array
    if (error) {
        console.error(`Error fetching club ${id}:`, error);
        return Promise.reject(error.message);
    }
    console.log('data', data);
    // Ordenamos los hoyos por número para asegurar que el array esté correcto para el frontend
    // Sort holes per round
    // tal vez sea mejor hacerlo después !!
    data.rounds?.forEach(round => {
        round.holes?.sort((a, b) => a.number - b.number);
    });
    return data;
}
/**
 * Guarda la partida en Supabase.
 */
async function endGame(game) {
    // 1. Preparar datos
    game.end = new Date().toISOString(); // Supabase prefiere ISO Strings para fechas
    // Si no viene user_id en el objeto, intentar recuperarlo (aunque idealmente debería venir del Auth)
    if (!game.user_id) {
        game.user_id = localStorage.getItem('user_cod') || null;
    }
    // Validación básica
    if (!game.user_id) {
        return Promise.reject("User ID is required to save the game.");
    }
    // Convertimos a JSON plano para la BD si es una instancia de clase
    const gameData = (typeof game.toJSON === 'function') ? game.toJSON() : game;
    // 2. Insertar en Supabase
    const { data, error } = await supabase
        .from('games')
        .insert(gameData)
        .select() // Importante: select() devuelve el registro creado
        .single();
    if (error) {
        console.error("Error saving game:", error);
        return Promise.reject(error.message);
    }
    return data;
}
/**
 * Obtiene una partida y rellena los datos del Club y el Tee automáticamente.
 */
async function getGame(id) {
    const { data, error } = await supabase
        .from('games')
        .select(`
            *,
            club:clubs (*),
            tee:tees (*)
        `)
        .eq('id', id)
        .single();
    if (error) {
        console.error("Error fetching game:", error);
        return Promise.reject(error.message);
    }
    // NOTA: Si en tu base de datos 'holes' cuelgan de 'clubs', 
    // tal vez quieras traer también los hoyos para pintar la tarjeta.
    // Si necesitas eso, modifica el select de club así:
    // club:clubs (*, holes(*))
    return data;
}
async function listGames(userId) {
    const { data, error } = await supabase
        .from('games')
        .select(`
            *,
            club:clubs (name) 
        `) // Solo traemos el nombre del club para el listado, optimiza rendimiento
        .eq('user_id', userId)
        .order('created_at', { ascending: false }); // Ordenar por fecha, más reciente primero
    if (error) {
        console.error("Error listing games:", error);
        return Promise.reject(error.message);
    }
    return data;
}
