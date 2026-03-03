

export class Hole {
    id: string;
    par: number;
    club_id: string;
    round_id: string;
    tee_id:string;
    tees?: {
        id: {
            distance: string;
            par?: number;
            stroke_index?: number;
        },
    }

    constructor({
        id, par,
        club_id, tees
    }){
        this.id = id;
        this.par = par;
        this.club_id = club_id;
        this.tees = tees;
    }

    toJSON() {
        return {
            id: this.id,
            par: this.par,
            club_id: this.club_id,
            ...this.tees 
                ? { tees: this.tees} 
                : {}
            //...this.tee_id ? { tee_id: this.tee_id } : {}
        }
    }
}
