
export class Tee {
    id: string;
    name: string
    color: string;
    club_id?: string;
    
    // add all the elements
    constructor({
        id, name, color,  club_id
    }){
        this.id = id
        this.name = name
        this.color = color
        this.club_id = club_id
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            ...this.club_id ? { club_id: this.club_id } : {}
        }
    }
}