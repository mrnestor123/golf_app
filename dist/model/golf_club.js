import { Tee } from "./tee.js";
import { Round } from "./round.js";
export class GolfClub {
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
