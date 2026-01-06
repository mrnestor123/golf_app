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
        this.rounds = data.rounds?.map((round) => new Round(round));
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
// LAS VUELTAS DEL CAMPO !!
class Round {
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
class Game {
    constructor({ id = 'game ' + Math.random().toString(36).substring(2, 9), date, club, round, tee, scores = Array.from({ length: 18 }, () => new Score({})) }) {
        this.id = id;
        this.date = date;
        this.club = club;
        this.round = round;
        this.tee = tee;
        this.scores = scores;
    }
    toJSON() {
        return {
            id: this.id,
            date: this.date,
            club_id: this.club.id,
            round_id: this.round.id,
            tee_id: this.tee.id,
            //scores: this.scores.map(score => score.toJSON())
            // club_id: this.club?.id || this.club,
            // round_id: this.round?.id || this.round,
            // tee_id: this.tee?.id || this.tee,
            //scores: this.scores.map(score => score.toJSON())
        };
    }
}
class Score {
    constructor({ strokes = 0, putts = 0, penalties = 0, green_in_regulation = false, fairway_hit = false, up_and_down = false, start = null, end = null }) {
        this.strokes = strokes;
        this.putts = putts;
        this.penalties = penalties;
        this.green_in_regulation = green_in_regulation;
        this.fairway_hit = fairway_hit;
        this.up_and_down = up_and_down;
        this.start = start;
        this.end = end;
    }
}
export { GolfClub, Round, Tee, Hole, User, Score, Game };
/*

*/ 
