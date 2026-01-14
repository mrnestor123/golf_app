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
            ...this.holes ? { holes: this.holes.map(hole => hole.id) } : {},
            ...this.tees ? { tees: this.tees.map(tee => tee.id) } : {},
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
            ...this.club_id ? { club_id: this.club_id } : {}
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
    constructor({ id, name, email, user_name, handicap, games = [] }) {
        this.id = id;
        this.user_name = user_name;
        this.email = email;
        this.handicap = handicap;
        this.games = games || [];
    }
}
class Game {
    constructor({ id = createDateId('game'), club, scores = Array.from({ length: 18 }, (_, i) => new Score({ hole_index: i })) }) {
        this.players = []; // for multiplayer games
        this.id = id;
        this.start = new Date();
        this.club = club;
        this.scores = scores.map(score => new Score(score));
    }
    toJSON() {
        return {
            //id: this.id,
            id: this.id,
            start: this.start.toISOString(),
            end: this.end ? this.end.toISOString() : null,
            club_id: this.club.id,
            user_id: this.user_id,
            round_id: this.round.id,
            tee_id: this.tee.id,
            scores: this.scores.map((score) => score.toJSON()),
            //game_id: this.id
            //scores: this.scores.map(score => score.toJSON())
            // club_id: this.club?.id || this.club,
            // round_id: this.round?.id || this.round,
            // tee_id: this.tee?.id || this.tee,
            //scores: this.scores.map(score => score.toJSON())
        };
    }
}
class Score {
    constructor({ strokes = 0, putts = 0, penalties = 0, green_in_regulation = false, fairway_hit = false, hole_index = 0, up_and_down = false, start = null, end = null, confirmed = false }) {
        this.confirmed = false;
        this.strokes = strokes;
        this.putts = putts;
        this.penalties = penalties;
        this.green_in_regulation = green_in_regulation;
        this.fairway_hit = fairway_hit;
        this.up_and_down = up_and_down;
        this.hole_index = hole_index;
        this.start = start;
        this.end = end;
        this.confirmed = confirmed;
    }
    toJSON() {
        return {
            strokes: this.strokes,
            putts: this.putts,
            penalties: this.penalties,
            green_in_regulation: this.green_in_regulation,
            fairway_hit: this.fairway_hit,
            up_and_down: this.up_and_down,
            start: this.start ? this.start.toISOString() : null,
            end: this.end ? this.end.toISOString() : null,
            hole_index: this.hole_index,
            confirmed: this.confirmed
        };
    }
}
export { GolfClub, Round, Tee, Hole, User, Score, Game };
// Utility function for date-based IDs
function createDateId(prefix = '') {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    const dateStr = `${year}${month}${day}${hours}${minutes}${seconds}${ms}`;
    return prefix ? `${prefix}_${dateStr}` : dateStr;
}
/*

*/ 
