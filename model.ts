

class GolfClub {
    id: string;
    name: string;
    description: string;
    photo: string;
    location: {
        lat: number;
        lng: number;
    };
    telephone: string;
    rating: number;
    coordinates: string;
    courses?: Course[];
    country?: string;
    province?: string;

    constructor(data: any){
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.photo = data.photo
        this.location = data.location
        this.telephone = data.telephone
        this.rating = data.rating
        this.coordinates = data.coordinates; // crear un objeto coordenadas tal vez
        this.courses = data.courses?.map((course:any) => new Course(course))
    }


    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            photo: this.photo,
            location: this.location,
            telephone: this.telephone,
            rating: this.rating,
            coordinates: this.coordinates
        }
    }
}


class Course {
    id: string;
    name: string;
    club_id: string;


    constructor(data: any){
        this.id = data.id
        this.name = data.name
        this.club_id = data.club_id
//        this.holes = data.holes.map(hole => new Hole(hole))
  //      this.tees = data.tees.map(tee => new Tee(tee))
   //     this.club_id = data.club_id
    }


    toJSON() {
        return {
            id: this.id,
            name: this.name,
            club_id: this.club_id
        }
    }
}

export {
    GolfClub,
    Course
}



/*
class Tee {

    constructor({object}){
        this.id = object.id
        this.name = object.name
        this.color = object.color
        this.course_rating = object.course_rating
        this.slope = object.slope
        this.distances = object.distances // array of distances for each hole
        this.holes = object.holes || [] // array of pars for each hole
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            course_rating: this.course_rating,
            slope: this.slope,
            distances: this.distances,
            pars: this.holes
        }
    }
}


class Hole {
    
    constructor({object}){
        this.number = object.number
        this.men_par = object.men_par
        this.men_handicap = object.men_handicap
        this.women_par = object.women_par
        this.women_handicap = object.women_handicap
        this.course_id = object.course_id
        this.club_id = object.club_id
        this.tee_id = object.tee_id
    }

    toJSON() {
        return {
            number: this.number,
            men_par: this.men_par,
            men_handicap: this.men_handicap,
            women_par: this.women_par,
            women_handicap: this.women_handicap,
            course_id: this.course_id,
            club_id: this.club_id,
            ...this.tee_id ? { tee_id: this.tee_id } : {}
        }
    }
}*/