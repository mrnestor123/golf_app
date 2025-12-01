import { Course } from "./model";



let scrapHoles = [

]


let scrapTees= [
    {
        id: 'course_1',
        name: 'Tee de Prueba',
        club_id: 'escorpion_1',
        difficulty: 'medium'
    },

    


];



let scrapGolfClubs = [{
    id:'escorpion_1',
    name: 'Club de Golf Escorpión',
    country: 'Spain',
    province: 'Valencia',
    community: 'Comunidad Valenciana',
    address: 'Ctra. San Antonio de Benagéber a Bétera s/n, 46117 Bétera, Valencia, Spain',
    telephone: '+34 961 60 12 11',
    photo: './assets/club_escorpion.webp',
    rating: 4.4,
    location: {
        lat: 39.5296,
        lng: -0.3964
    }
}]




let scrapCourses = []


export {
    scrapHoles,
    scrapGolfClubs,
    scrapTees,
    scrapCourses
}