import { Tee } from "./tee.js";
import { Round } from "./round.js";


export class GolfClub {
    id: string;
    name: string;
    description: string;
    photo: string;
    location?: {
        coordinates: {
            lat: number;
            lng: number;
        },
        address: string;
        country?: string;
        province?: string;    
    };

    telephone?: string;
    rating: number;
    rounds?: Round[];
    tees?: Tee[];

    constructor(data: any){
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.photo = data.photo
        this.location = data.location
        this.telephone = data.telephone
        this.rating = data.rating
        //this.coordinates = data.coordinates; // crear un objeto coordenadas tal vez
        this.rounds = data.rounds?.map((round:any) => new Round(round))
        this.tees = data.tees?.map(tee => new Tee(tee))
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
        }
    }
}

