import { Hole } from "./hole.js";
import { Tee } from "./tee.js";
// LAS VUELTAS DEL CAMPO !!
export class Round {
    constructor({ id, name, club_id, holes, 
    // make number_of_holes optional
    number_of_holes = 18, handicaps, slopes, course_ratings, tees }) {
        this.id = id;
        this.name = name;
        this.club_id = club_id;
        this.holes = holes?.map(hole => new Hole(hole));
        this.tees = tees?.map(tee => new Tee(tee));
        this.number_of_holes = number_of_holes;
        this.handicaps = handicaps;
        this.slopes = slopes;
        this.course_ratings = course_ratings;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            club_id: this.club_id,
            ...this.holes ? { holes: this.holes.map(hole => hole.toJSON()) } : {},
            //...this.tees ? { tees: this.tees.map(tee => tee.id) } : {},
            ...this.handicaps ? { handicaps: this.handicaps } : {},
        };
    }
    toFullJSON() {
        return {
            id: this.id,
            name: this.name,
            club_id: this.club_id,
            holes: this.holes ? this.holes.map(hole => hole.toJSON()) : [],
            tees: this.tees ? this.tees.map(tee => tee.toJSON()) : [],
            handicaps: this.handicaps,
            slopes: this.slopes,
            course_ratings: this.course_ratings
        };
    }
}
