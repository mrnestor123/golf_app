import { Game } from "./game.js";

export class User {
    id: string
    user_name?: string
    handicap?: number
    games?: Game[]

    constructor({
        id, user_name, handicap, games = []
    }){
        this.id = id
        this.user_name = user_name
        this.handicap = handicap
        this.games = games || []
    }
}
