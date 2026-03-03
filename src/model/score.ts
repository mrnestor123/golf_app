import { Hole } from "./hole";

export class Score {
    strokes: number;
    putts: number;
    penalties: number;

    green_in_regulation: boolean;
    fairway_hit: boolean;
    up_and_down: boolean;
    start?: Date | null;
    end?: Date | null;
    hole_index?: number; // PODRÍA TENER UN HOLE_ID ??
    hole: Hole;

    confirmed: boolean = false;
    game_id: string;

    constructor({
        strokes = 0,
        putts = 0,
        penalties = 0,
        green_in_regulation = false,
        fairway_hit = false,
        hole_index = 0,
        up_and_down = false,
        start = null,
        end = null,
        confirmed = false
    }){
        this.strokes = strokes
        this.putts = putts
        this.penalties = penalties
        this.green_in_regulation = green_in_regulation
        this.fairway_hit = fairway_hit
        this.up_and_down = up_and_down
        this.hole_index = hole_index
        this.start = start
        this.end = end
        this.confirmed = confirmed
        this.game_id = ''
    }

    toJSON(local = false) {
        return {
            game_id: this.game_id,
            strokes: this.strokes,
            putts: this.putts,
            penalties: this.penalties,
            green_in_regulation: this.green_in_regulation,
            fairway_hit: this.fairway_hit,
            up_and_down: this.up_and_down,
            start: this.start ? this.start.toISOString() : null, 
            end: this.end ? this.end.toISOString() : null,
            hole_index: this.hole_index,
            ...local && {confirmed: this.confirmed}
        }
    }


    toLocal() {
        return {
            game_id: this.game_id,
            strokes: this.strokes,
            putts: this.putts,
            penalties: this.penalties,
            green_in_regulation: this.green_in_regulation,
            fairway_hit: this.fairway_hit,
            up_and_down: this.up_and_down,
            start: this.start ? new Date(this.start).toISOString() : null, 
            end: this.end ? new Date(this.end).toISOString() : null,
            hole_index: this.hole_index,
            confirmed: this.confirmed
        }
    }
}
