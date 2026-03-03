/**
 * Main Controller - Single point of connection between pages and backend
 * Flow: Pages -> Controller -> Backend (Server)
 */

import { Game } from "../model/game.js";
import { GolfClub } from "../model/golf_club.js";
import { User } from "../model/user.js";

// Backend (Server) imports
import * as GolfServer from "../backend/golf.js";
import * as UserServer from "../backend/user.js";


/**
 * AppData - Shared state accessible by all pages
 * This is the single source of truth for application state
 */
export interface AppData {
    user: User | null;
    selectedClub: GolfClub | null;
    golfClubs: GolfClub[];
    currentGame: Game | null;
    isLoading: boolean;
    loginProvider: string | null;
    cache: Map<string, any>;
}

/**
 * Global AppData instance
 * Pages access this directly for reading state
 */
export const AppData: AppData = {
    user: null,
    selectedClub: null,
    golfClubs: [],
    currentGame: null,
    loginProvider: null,
    isLoading: false,
    cache: new Map<string, any>()
};



async function fetchServer<T>(operation: () => Promise<T>): Promise<T> {
    try {
        AppData.isLoading = true;
        const result = await operation();
        return result;
    } finally {
        AppData.isLoading = false;
        // aquí añadir un diálogo de error si hace falta
    }
}


export async function getData(clubId?: string): Promise<GolfClub[]> {
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









