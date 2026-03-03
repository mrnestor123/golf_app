/**
 * Main Controller - Single point of connection between pages and backend
 * Flow: Pages -> Controller -> Backend (Server)
 */
// Backend (Server) imports
import * as GolfServer from "../backend/golf.js";
/**
 * Global AppData instance
 * Pages access this directly for reading state
 */
export const AppData = {
    user: null,
    selectedClub: null,
    golfClubs: [],
    currentGame: null,
    loginProvider: null,
    isLoading: false,
    cache: new Map()
};
async function fetchServer(operation) {
    try {
        AppData.isLoading = true;
        const result = await operation();
        return result;
    }
    finally {
        AppData.isLoading = false;
        // aquí añadir un diálogo de error si hace falta
    }
}
export async function getData(clubId) {
    return fetchServer(async () => {
        const clubs = await GolfServer.getGolfClubs();
        AppData.golfClubs = clubs;
        if (clubId) {
            const club = await GolfServer.getClub(clubId);
            AppData.selectedClub = club;
        }
        return clubs;
    });
}
