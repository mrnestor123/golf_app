export class Hole {
    constructor({ id, par, club_id, tees }) {
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
                ? { tees: this.tees }
                : {}
            //...this.tee_id ? { tee_id: this.tee_id } : {}
        };
    }
}
