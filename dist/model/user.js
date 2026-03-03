export class User {
    constructor({ id, user_name, handicap, games = [] }) {
        this.id = id;
        this.user_name = user_name;
        this.handicap = handicap;
        this.games = games || [];
    }
}
