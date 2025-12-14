import { GolfClub, Lap, Tee } from "./model.js";
// HOLES - 18 hoyos del course_masia
// TEES - 7 diferentes salidas
let scrapTees = [
    // Tee Negras (Black)
    new Tee({
        id: 'tee_negras',
        name: 'Negras',
        color: 'black',
        club_id: 'escorpion_1'
    }),
    // Tee Doradas (Gold)
    new Tee({
        id: 'tee_doradas',
        name: 'Doradas',
        color: 'gold',
        club_id: 'escorpion_1'
    }),
    // Tee Azules (Blue)
    new Tee({
        id: 'tee_azules',
        name: 'Azules',
        color: 'blue',
        club_id: 'escorpion_1'
    }),
    // Tee Amarillas (Yellow)
    new Tee({
        id: 'tee_amarllas',
        name: 'Amarillas',
        color: 'yellow',
        club_id: 'escorpion_1'
    }),
    // Tee Naranjas (Orange)
    new Tee({
        id: 'tee_naranjas',
        name: 'Naranjas',
        color: 'orange',
        club_id: 'escorpion_1'
    }),
    // Tee Rojas (Red)
    new Tee({
        id: 'tee_rojas',
        name: 'Rojas',
        color: 'red',
        club_id: 'escorpion_1'
    }),
    // Tee Verdes (Green)
    new Tee({
        id: 'tee_verdes',
        name: 'Verdes',
        color: 'green',
        club_id: 'escorpion_1'
    })
];
let scrapLaps = [
    new Lap({
        "id": "20251208174706",
        "club_id": "escorpion_1",
        "name": "Masia + Masia",
        "holes": [
            {
                "par": 5,
                "tees": {
                    "tee_negras": "470",
                    "tee_doradas": "455",
                    "tee_azules": "442",
                    "tee_amarllas": "431",
                    "tee_naranjas": "421",
                    "tee_rojas": "392",
                    "tee_verdes": "360"
                },
                "club_id": "gf_escorpion",
                "number": "1"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "334",
                    "tee_doradas": "325",
                    "tee_azules": "313",
                    "tee_amarllas": "303",
                    "tee_naranjas": "280",
                    "tee_rojas": "260",
                    "tee_verdes": "233"
                },
                "club_id": "gf_escorpion",
                "number": "2"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "374",
                    "tee_doradas": "355",
                    "tee_azules": "344",
                    "tee_amarllas": "318",
                    "tee_naranjas": "304",
                    "tee_rojas": "283",
                    "tee_verdes": "256"
                },
                "club_id": "gf_escorpion",
                "number": "3"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "417",
                    "tee_doradas": "384",
                    "tee_azules": "377",
                    "tee_amarllas": "368",
                    "tee_naranjas": "333",
                    "tee_rojas": "313",
                    "tee_verdes": "282"
                },
                "club_id": "gf_escorpion",
                "number": "4"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "373",
                    "tee_doradas": "359",
                    "tee_azules": "340",
                    "tee_amarllas": "332",
                    "tee_naranjas": "323",
                    "tee_rojas": "294",
                    "tee_verdes": "252"
                },
                "club_id": "gf_escorpion",
                "number": "5"
            },
            {
                "par": 3,
                "tees": {
                    "tee_negras": "161",
                    "tee_doradas": "147",
                    "tee_azules": "138",
                    "tee_amarllas": "136",
                    "tee_naranjas": "124",
                    "tee_rojas": "111",
                    "tee_verdes": "103"
                },
                "club_id": "gf_escorpion",
                "number": "6"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "369",
                    "tee_doradas": "355",
                    "tee_azules": "339",
                    "tee_amarllas": "333",
                    "tee_naranjas": "315",
                    "tee_rojas": "292",
                    "tee_verdes": "244"
                },
                "club_id": "gf_escorpion",
                "number": "7"
            },
            {
                "par": 3,
                "tees": {
                    "tee_negras": "178",
                    "tee_doradas": "166",
                    "tee_azules": "154",
                    "tee_amarllas": "143",
                    "tee_naranjas": "134",
                    "tee_rojas": "129",
                    "tee_verdes": "112"
                },
                "club_id": "gf_escorpion",
                "number": "8"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "389",
                    "tee_doradas": "361",
                    "tee_azules": "346",
                    "tee_amarllas": {
                        "distance": "429",
                        "par": 5
                    },
                    "tee_naranjas": "300",
                    "tee_rojas": {
                        "distance": "379",
                        "par": 5
                    },
                    "tee_verdes": {
                        "distance": "337",
                        "par": 5
                    }
                },
                "club_id": "gf_escorpion",
                "number": "9"
            },
            {
                "par": 5,
                "tees": {
                    "tee_negras": "470",
                    "tee_doradas": "455",
                    "tee_azules": "442",
                    "tee_amarllas": "431",
                    "tee_naranjas": "421",
                    "tee_rojas": "392",
                    "tee_verdes": "360"
                },
                "club_id": "gf_escorpion",
                "number": "10"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "334",
                    "tee_doradas": "325",
                    "tee_azules": "313",
                    "tee_amarllas": "303",
                    "tee_naranjas": "280",
                    "tee_rojas": "260",
                    "tee_verdes": "233"
                },
                "club_id": "gf_escorpion",
                "number": "11"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "374",
                    "tee_doradas": "355",
                    "tee_azules": "344",
                    "tee_amarllas": "318",
                    "tee_naranjas": "304",
                    "tee_rojas": "283",
                    "tee_verdes": "256"
                },
                "club_id": "gf_escorpion",
                "number": "12"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "417",
                    "tee_doradas": "384",
                    "tee_azules": "377",
                    "tee_amarllas": "368",
                    "tee_naranjas": "333",
                    "tee_rojas": "313",
                    "tee_verdes": "282"
                },
                "club_id": "gf_escorpion",
                "number": "13"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "373",
                    "tee_doradas": "359",
                    "tee_azules": "340",
                    "tee_amarllas": "332",
                    "tee_naranjas": "323",
                    "tee_rojas": "294",
                    "tee_verdes": "252"
                },
                "club_id": "gf_escorpion",
                "number": "14"
            },
            {
                "par": 3,
                "tees": {
                    "tee_negras": "161",
                    "tee_doradas": "147",
                    "tee_azules": "138",
                    "tee_amarllas": "136",
                    "tee_naranjas": "124",
                    "tee_rojas": "111",
                    "tee_verdes": "103"
                },
                "club_id": "gf_escorpion",
                "number": "15"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "369",
                    "tee_doradas": "355",
                    "tee_azules": "339",
                    "tee_amarllas": "333",
                    "tee_naranjas": "315",
                    "tee_rojas": "292",
                    "tee_verdes": "244"
                },
                "club_id": "gf_escorpion",
                "number": "16"
            },
            {
                "par": 3,
                "tees": {
                    "tee_negras": "178",
                    "tee_doradas": "166",
                    "tee_azules": "154",
                    "tee_amarllas": "143",
                    "tee_naranjas": "134",
                    "tee_rojas": "129",
                    "tee_verdes": "112"
                },
                "club_id": "gf_escorpion",
                "number": "17"
            },
            {
                "par": 4,
                "tees": {
                    "tee_negras": "389",
                    "tee_doradas": "361",
                    "tee_azules": "346",
                    "tee_amarllas": {
                        "distance": "429",
                        "par": 5
                    },
                    "tee_naranjas": "300",
                    "tee_rojas": {
                        "distance": "379",
                        "par": 5
                    },
                    "tee_verdes": {
                        "distance": "337",
                        "par": 5
                    }
                },
                "club_id": "gf_escorpion",
                "number": "18"
            }
        ],
        number_of_holes: 18,
        "handicaps": [
            5,
            15,
            9,
            1,
            3,
            17,
            7,
            13,
            11,
            6,
            16,
            10,
            2,
            4,
            18,
            8,
            14,
            12
        ],
        "slopes": {
            "tee_negras": 130,
            "tee_doradas": 127,
            "tee_azules": 125,
            "tee_amarllas": 123,
            "tee_naranjas": 119,
            "tee_rojas": 112,
            "tee_verdes": 104
        },
        "course_ratings": {
            "tee_negras": 71.8,
            "tee_doradas": 70.4,
            "tee_azules": 69.0,
            "tee_amarllas": 68.0,
            "tee_naranjas": 66.6,
            "tee_rojas": 64.6,
            "tee_verdes": 60.8
        }
    })
];
let scrapGolfClubs = [
    new GolfClub({
        id: 'escorpion_1',
        name: 'Club de Golf Escorpión',
        description: 'Club de Golf Escorpión en Valencia',
        telephone: '+34 961 60 12 11',
        photo: './assets/club_escorpion.webp',
        rating: 4.4,
        location: {
            coordinates: {
                lat: 39.5296,
                lng: -0.3964
            },
            address: 'Ctra. San Antonio de Benagéber a Bétera s/n, 46117 Bétera, Valencia, Spain',
            country: 'Spain',
            province: 'Valencia'
        }
    })
];
export { scrapGolfClubs, scrapTees, scrapLaps };
