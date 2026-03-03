import { Score } from "./score.js";
export class Game {
    constructor({ id = crypto.randomUUID(), scores = Array.from({ length: 18 }, (_, i) => new Score({ hole_index: i })), total_score = 0, user_id, round = null, club = null, tee = null, }) {
        this.players = []; // for multiplayer games
        this.id = id;
        this.start = new Date();
        this.scores = scores.map(score => new Score(score));
        this.total_score = total_score;
        this.user_id = user_id;
        if (round)
            this.round = round;
        if (club)
            this.club = club;
        if (tee)
            this.tee = tee;
    }
    toJSON() {
        return {
            id: this.id,
            start: this.start.toISOString(),
            end: this.end ? this.end.toISOString() : null,
            club_id: this.club.id,
            user_id: this.user_id,
            tee_id: this.tee.id,
            round_id: this.round.id,
            scores: this.scores.filter((s) => s.confirmed),
            //scores: this.scores.map(score => score.toJSON())
            // club_id: this.club?.id || this.club,
            // round_id: this.round?.id || this.round,
            // tee_id: this.tee?.id || this.tee,
            //scores: this.scores.map(score => score.toJSON())
        };
    }
    toLocal() {
        console.log('this', this);
        return {
            //id: this.id,
            id: this.id,
            start: this.start.toISOString(),
            end: this.end ? this.end.toISOString() : null,
            scores: this.scores.map((score) => score.toLocal()),
            user_id: this.user_id,
            club: this.club,
            round: this.round,
            tee: this.tee,
            //game_id: this.id
            //scores: this.scores.map(score => score.toJSON())
            // club_id: this.club?.id || this.club,
            // round_id: this.round?.id || this.round,
            // tee_id: this.tee?.id || this.tee,
            //scores: this.scores.map(score => score.toJSON())
        };
    }
}
