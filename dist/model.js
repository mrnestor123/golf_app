class GolfClub {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.photo = data.photo;
        this.location = data.location;
        this.telephone = data.telephone;
        this.rating = data.rating;
        //this.coordinates = data.coordinates; // crear un objeto coordenadas tal vez
        this.laps = data.laps?.map((lap) => new Lap(lap));
        this.tees = data.tees?.map(tee => new Tee(tee));
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            photo: this.photo,
            location: this.location,
            telephone: this.telephone,
            rating: this.rating
        };
    }
}
class Lap {
    constructor({ id, name, club_id, holes, 
    // make number_of_holes optional
    number_of_holes = 18, handicaps, slopes, course_ratings }) {
        this.id = id;
        this.name = name;
        this.club_id = club_id;
        this.holes = holes?.map(hole => new Hole(hole));
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
            ...this.holes ? { holes: this.holes.map(hole => hole.id) } : {},
            ...this.handicaps ? { handicaps: this.handicaps } : {},
        };
    }
}
class Tee {
    // add all the elements
    constructor({ id, name, color, club_id }) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.club_id = club_id;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
        };
    }
}
class Hole {
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
            //...this.tee_id ? { tee_id: this.tee_id } : {}
        };
    }
}
class User {
    constructor({ id, name, email, handicap, rounds }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.handicap = handicap;
        this.rounds = rounds || [];
    }
}
class Round {
    constructor({ id, date, club_id, lap_id, tee_id, scores = Array(18).fill(0) }) {
        this.id = id;
        this.date = date;
        this.club_id = club_id;
        this.lap_id = lap_id;
        this.tee_id = tee_id;
        this.scores = scores || Array(18).fill(0);
    }
}
export { GolfClub, Lap, Tee, Hole, User, Round };
/*

*/ 
