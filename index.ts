// MODEL
import { App, AppBar, AppContent, LucideIcon, NavBar} from './components/app_elements.js'
import { setConfig, config } from './components/config.js'
import { Button, Img, Label } from './components/elements.js'
import { Animate, Box,  Div,  FlexCol, FlexRow, Tappable } from './components/layout.js'
import { H2, H3, SmallText, Text } from './components/texts.js'
import { getClub, getGolfClubs, Data, AppData, endGame, getGame } from './controller.js'
import { Game, GolfClub, Hole, Round, Score, Tee } from './model.js'

const m = (window as any).m;


setConfig({
<<<<<<< HEAD
  fontFamily: 'Lexend, sans-serif',
  primaryColor:'#013220',
  'text-light': '#333333',
  background: '#102210',

  app: {
    appBar: {
      background: '#102210',
      borderBottom: '#2a4b3a solid 1px',
      leading: 'white'
=======
    background: '#',
    fontFamily: 'Lexend, sans-serif',
    primaryColor:'#013220',
    'text-light': '#333333',
    card: {
        background:'#00000033',
        border:' 1px solid #444444'
>>>>>>> dd95925f8936f15964d2a1a2cee1ea37a01ff087
    },
    navBar: {
      background:'#0a1b0b'
    }
  },
  form: {
      formLabel: {
          color: 'white'
      }
  },
  button: {
    primary: {
      background: '#014d26',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
    },
    secondary : {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
    }
  },
  elements: {
    label: {
      secondary: {
        backgroundColor: "white",
        color:'black'
      }
    }
  }
})


// Router
m.route(document.body, "/", {
    "/": {
      render: function(vnode:any) {
        return m(Layout, vnode.attrs, MainPage)
      }
    },

    "/club/:id": {
      render: function(vnode) {
        return m(ClubSelected, vnode.attrs)
      }
    },

    "/club/:clubId/:roundId/:teeId": {
      render: function(vnode: any){
        return m(RoundStart, vnode.attrs)
      }
    },

    "/round/:roundId": {
      render: function(vnode: any){
        return m(RoundEnded, vnode.attrs)
      }
    }

    /*
    "/profile": {
        render: function(vnode) {
            return m(Layout, vnode.attrs, Profile)
        }
    },

    "/course/:name": {
        render: function(vnode) {
            return m(CourseSelected, vnode.attrs)
        }
    },

    "/course/map/:name": {
        render: function(vnode) {
            return m(CourseMap, vnode.attrs)
        }
    },

    "/profile": {
        render: function(vnode) {
            return m(Profile, vnode.attrs)
        }
    },

    "/conversations": {
        render: function(vnode) {
            return m(Conversations, vnode.attrs)
        }
    }*/
})


function SplashPage() {
    return {
        view: (vnode)=> {
            return [

            ]
        }
    }
}


function Layout() {
  let routes = [{

  }]

  return {
    view: (vnode:any)=> {
      return m(App,

        m(AppBar, {
          title:  'Golfing'
        },
          m(Tappable, {
            style: {
              background: 'white',
              borderRadius:'50%',
              padding:'0.3rem',
              display:'flex',
              alignItems:'center',
              justifyContent:'center'
            },
            onclick: (e: Event) => {
              m.route.set('/profile');
            }
          },
            m(LucideIcon,{
              width:'28',
              height:'28',
              icon:'circle-user-round'
            })
          )
        ),

        m(AppContent, 
          vnode.children.map((child:any) => m(child)),
          m(Box,{height:'4rem'})
        ),

        m(NavBar, {
          icons: [
            { icon: "land-plot", link: "/", name: 'Play'},
            // { icon: "land-plot", link: "/", name: 'Play'},
            // { icon: "dumbbell", link: "/train", name: 'Train'},
            //{ icon: "user", link: "/profile", name:'Profile'}
          ]
        })
      )
    }
  }
}


function MainPage(){
  let golfClubs: GolfClub[] = [];

  return {
    oninit:(vnode:any)=> {
      getGolfClubs()
      .then((res:any[])=>{
        res.forEach((club:any)=>{
          golfClubs.push(new GolfClub(club));    
        })

        m.redraw();
      })
      .catch((error: Error) => {
        console.error('Error loading golf clubs:', error);
      })
    },  
    view: (vnode:any)=> {
      return m('div', { 
        style: { 
          padding: '1rem',
          color: '#fff'
        } 
      }, [
        
        m('h3', 'Golf Courses Near You'),
        
        m(FlexCol, { gap: '1rem' },
          AppData.golfClubs.map((club: GolfClub)=> {
            const photo = club.photo; 
            
            return m(Tappable,{
              onclick:(e:Event)=> {
                AppData.selectedClub = club;
                m.route.set(`/club/${club.id}`) 
              }
            },
                m(FlexRow, {
                  background:'#00000033',
                  padding: '0.75rem',
                  borderRadius:'0.5rem',
                  alignItems: 'center',
                  gap:'0.5rem'
                },

                  m(FlexRow, {flex:1, gap:'0.5rem'},
                    
                    photo && m("img",{
                        style: {
                            width:'70px',
                            height:'70px',
                            borderRadius:'0.5rem'
                        },
                        src: photo 
                    }),

                    m(FlexCol, {justifyContent:'space-between'},
                        m(Text, club.name),

                        m(FlexRow, {alignItems:'center', gap:'0.5rem'},
                          m(LucideIcon,{  
                            icon: 'star',
                            width: '16',
                            height: '16',
                            style: { color:'white'}
                          }),
                          m(SmallText, club.rating || 'N/A')  
                        )
                    )
                  ),

                  m(LucideIcon, {
                    icon: 'chevron-right',
                    width: '24',
                    height: '24',
                    style: { color:'white' }
                  })
                )
            )
          })
        )
      ])
    }
  }
}


function ClubSelected() {

  let club: GolfClub | null = null;
  let loading = false;

  let selectedRound: any = AppData.selectedRound;
  let selectedTee: any = AppData.selectedTee;
  
  return {
    oninit:(vnode:any)=> {
      let clubId = vnode.attrs.id;

      if(!AppData.selectedClub){
        loading = true;

        getClub(clubId)
        .then((res:any)=>{
          club = new GolfClub(res);

          if(club.rounds && club.rounds.length == 1){
            selectedRound = club.rounds[0];
          }

          if(club.tees && club.tees.length == 1){
            selectedTee = club.tees[0];
          }

          loading = false;
          m.redraw();
        })
        .catch((error: Error) => {
          console.error('Error loading club details:', error);
        })
      } else {
        club = AppData.selectedClub;
        m.redraw();
      }

    },
    view: (vnode:any)=> {
      if(loading) return;

      console.log('data', AppData);

      return [
        m(App,
          m(AppBar, {
            leading: {
              route: '/'
            }
          }),

          m(AppContent,
            m(FlexCol, {padding:'1em', alignItems:'center'},
              m("img", {
                style: {
                  width:'80%',
                  borderRadius:'0.5rem',
                  marginBottom:'1rem'
                },
                src: club.photo
              }),

              m(H2, club.name),

              
              m(ButtonModal, {
                left: 'Select Round',
                right: selectedRound ? selectedRound.name : 'Select',
                modal: club.rounds.map((round:Round)=>{
                  return {
                    title: round.name,
                    description: round.number_of_holes + ' holes',
                    onclick: (e: Event) => {
                      selectedRound = round;
                      AppData.selectedRound = round;
                    }
                  }
                }) 
              }),

              m(ButtonModal, {
                left: 'Select Tee',
                right: selectedTee ? selectedTee.name : 'Select',
                modal: club.tees.map((tee:Tee)=>{
                  return {
                    title: tee.name,
                    description: selectedRound && selectedRound.course_ratings[tee.id]  
                      ? `CR: ${selectedRound.course_ratings[tee.id]}, Slope: ${selectedRound.slopes[tee.id]}`
                      : 'Select a round first',
                    onclick: (e: Event) => {
                      selectedTee = tee;
                      AppData.selectedTee = tee;
                    }
                  }
                }) 
              }),


              /*
              m(ButtonModal, {
                  left: 'Select Players',
                  right: selectedTee ? selectedTee.name : 'Select',
                  modal: club.tees.map((tee:Tee)=>{
                      return {
                          title: tee.name,
                          description: tee.color,
                          onclick: (e: Event) => {
                              selectedTee = tee;
                          }
                      }
                  }) 
              }),*/


              m(Button, {
                type:'primary',
                disabled: !selectedRound || !selectedTee,
                onclick:(e: Event) => {                  
                  AppData.currentGame = new Game({
                    id: 'game_' + Date.now(),
                    date: new Date(),
                    club: club,
                    round: selectedRound,
                    tee: selectedTee
                  })

                  m.route.set(`/club/${club.id}/${selectedRound.id}/${selectedTee.id}`);
                },
                style: {
                  marginTop:'1rem',
                  position:'fixed',
                  bottom:'2em',
                  width:'80%',
                  maxWidth:'400px'
                }
              }, 'Start')
            )
          )
        )
      ]
    }
  }

  function ButtonModal(){
      let openModal = false;

      return {
        view:(vnode)=> {
          let { left, right, modal } = vnode.attrs;

          return [
            openModal && [
              // dimmer overlay
              m(Tappable, {
                style: {
                  position: 'fixed',
                  inset: 0,
                  background: '#00000088',
                  zIndex: 1000
                },
                onclick: (e: Event) => {
                  openModal = false;
                  e.stopPropagation();
                }
              },
                m(Animate, {
                  duration: 300,
                  from: { translateY: '100%' },
                  to: { translateY: '0%' },
                  style: {
                    position:'fixed',
                    bottom:0,
                    left: 0,
                    right:0,
                    padding:'1em',
                    background:'white',
                    borderTopLeftRadius:'1rem',
                    borderTopRightRadius:'1rem',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
                  },
                }, 
                  m(FlexCol, {gap:'1rem'},
                    m(Div, {width:'40px', height:'4px', background:'#ccc', borderRadius:'2px', margin:'0 auto', marginBottom:'1rem'}),

                    modal.map((item:any) => 
                      m(Tappable,{
                        onclick:(e: Event) => {
                          item.onclick(e);
                          openModal = false;
                        },
                        rippleEffect: true,
                        style: {
                          padding:'1rem',
                          display:'flex',
                          justifyContent:'space-between',
                          background: '#f0f0f0',
                          borderRadius: '0.5rem',
                          alignItems:'center',
                        }
                      },
                        m(FlexCol, {color: 'black', gap:'0.25rem'},
                          m(Text, {fontWeight:'bold'}, item.title),
                          m(SmallText, item.description)
                        ),
                        m(LucideIcon, {
                          icon: 'chevron-right',
                          width: '20',
                          height: '20',
                          style: {
                            display: 'block',
                            color: 'black'
                          }
                        })
                      )
                    )
                  )
                )
              )
            ],


            m(Tappable,{
              onclick:(e: Event) => {
                openModal = true;
              },
              rippleEffect: true,
              style: {
                background: '#00000033',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                margin:'1rem ',
                display:'flex',
                alignItems:'center',
                width: '100%'
              },
            },    
              m(FlexRow, {flex:1, alignItems:'center', justifyContent:'space-between'},
                m(Text, {fontWeight:'bold'}, left),
                m(SmallText, right)
              )
            )
          ]
        }
      }
  }
}


function RoundStart(){ 
  

  

  let club: GolfClub = AppData.selectedClub;
  let game: Game = AppData.currentGame;
  let round: Round = game?.round;
  let tee: Tee = game?.tee;
  let holes: Hole[] = round?.holes.map((hole:any) => new Hole(hole));
  let hole_index = 0;

  let loading = false;
  
  return {
    oninit:(vnode:any)=> {
      if(!game ){
        loading = true;

        getClub(vnode.attrs.clubId).then((res:any)=>{
          club = res;
          round = res.rounds.find((r:any) => r.id === vnode.attrs.roundId);
          holes = round.holes.map((hole:any) => new Hole(hole));
          tee = res.tees.find((t:any) => t.id === vnode.attrs.teeId);
          
          game = new Game({
            date: new Date(),
            club: club,
            round: round,
            tee: tee
          });
          loading =false;
          m.redraw();
        })
      }
    },
    view : (vnode:any) => {
      if(loading) return;

      console.log('game', game)

      return m(App,

        m(AppBar, {
          leading: {
            icon: 'x',
            style: { color: 'white'},
            onclick: () => m.route.set(`/club/${vnode.attrs.clubId}`)
          },
          title: round?.name,
          subtitle: club?.name,
        }),

        m(AppContent,
          
          m(HoleInfo, {
            hole: holes[hole_index], 
            score: game.scores[hole_index],
            teeId: vnode.attrs.teeId
          }),

          m(TotalScore),

          m(Div,{ 
            position: 'fixed',
            bottom:'0px',
            left:'0px',
            right:'0px',
            padding:'1rem',
            background: 'white',
            color:'black',
            display:'flex',
            alignItems:'center',
            gap:'0.5rem',
            justifyContent:'space-between'
          },

            m(Button, {
              type:'secondary',
              onclick: () => {
                endGame(game)
                m.route.set(`/round/${round.id}`)
                m.redraw();
              }
            }, "END"),
            
             m(Button,{
              disabled: hole_index == 0,
              onclick: () => {
                m.redraw();
                if(hole_index > 0){
                  hole_index--;
                }
              },
              style: {
                flex: 1
              }
            },  
              m(LucideIcon,{
                icon:'arrow-left',
                style: {
                  color:'white'
                },
                width: '16',
                height: '16'
              })
            ),

            m(Button,{
              onclick: () => {
                m.redraw();
                if(hole_index < holes.length -1){
                  
                  if(game.scores[hole_index].strokes && !game.scores[hole_index].end){
                    game.scores[hole_index].end = new Date();
                  }

                  hole_index++;
                  
                }
              },
              style: {
                flex: 1
              }
            }, 
              m(LucideIcon,{
                icon:'arrow-right',
                style: {
                  color:'white'
                },
                width: '16',
                height: '16'
              })  
            )
          )
        )
      )
    }
  }


  function HoleInfo(){

    let expandMore = false;
    let hole: Hole ;
    let score: Score ;

    return {
      view: (vnode)=> {
        hole = vnode.attrs.hole
        score = vnode.attrs.score

        if(!hole) return;

        if(!score.start) score.start = new Date();

        let green_score = (hole.par - 2);
        score.green_in_regulation = score.strokes && score.putts ? score.strokes - (score.putts || 0) <= green_score: false;
        score.up_and_down = score.strokes && !score.green_in_regulation ? hole.par >= score.strokes : false;


        return m(FlexCol,{ 
          margin:'0 auto', padding:'1rem', borderRadius:'8px', 
          width:'90%', maxWidth:'400px', background:'white',
          gap: '1rem', color:'black'
        },
            
          m(FlexRow, { alignItems:'center', justifyContent:'space-between'}, 
            m(H2, `Hole ${hole_index + 1}`),

            m(Label, {
              type: 'secondary',
              style: { border:`1px solid ${tee.color}`, color: tee.color, background:'white'}
            }, m(SmallText, tee.name )
          )),

          m(FlexRow, {justifyContent:'space-between', alignItems:'center'},
            m(FlexRow, { alignItems:'center', gap:'0.5rem'},
              [
                'Par ' + hole.par,
                'Hcp ' + round.handicaps[hole_index],
                hole.tees[vnode.attrs.teeId] + ' m',
              ].map((text)=>{
                return m(SmallText, {
                  type:'default'
                }, text)
              }),

            ),


             m(FlexRow, {gap:'1rem', alignItems:'center'},
              m(Label, {
                type: score.green_in_regulation ?'primary' : 'secondary',
              }, "GIR"),

              m(Label, {
                type: score.up_and_down ?'primary' : 'secondary',
              }, "UP & DOWN")
            ),
          ),

          m(NumberPut,{
            data: score,
            name: 'strokes',
            text: 'Total Strokes'
          }),

           

          

          expandMore ? 
          [
            m(NumberPut,{
              data: score,
              name: 'putts',
              text: 'Putts'
            }),

            m(NumberPut,{
              data: score,
              name: 'chip',
              text: 'Approach shots'
            }),

            m(NumberPut,{
              data: score,
              name: 'penalties',
              text: 'Penalties'
            }),

            m(Fairway, {
              data: score,
              name: 'fairway',
              text: 'Fairways Hit'
            })
          ] : null,


          m(Tappable,{
            onclick:(e: Event) => {
              expandMore = !expandMore;
              m.redraw()
            }
          },
           
            m(LucideIcon, {
              icon: 'chevron-down',
              width: '24',
              height: '24',
              style: {
                display: 'block',
                margin: '0 auto',
                transition: 'transform 0.3s',
                transform: expandMore ? 'rotate(180deg)' : 'rotate(0deg)'
              }
            })

          ),
            
            /*m(HtmlIntegerInput,{
                type:'number',
                min: 1,
                data: playRound?.scores || {},
                name: hole_index,
                onchange: (e) => {
                    //playRound.scores[hole_index] += e;
                    m.redraw()
                }
            })*/
          )

      }
    }
  


    function NumberPut() {
      return {
        view: (vnode) => {
          let { text, data, name } = vnode.attrs;

          return [
            m(FlexRow, {
              style: {
                padding: '1rem', background: '#f0f0f0', flex:1, alignItems: 'center',
                borderRadius: '0.5rem', justifyContent: 'space-between'
              }
            },
              
              m(Text, text),  


              m(FlexRow, {alignItems:'center'},
                m(Text, data[name] || 0),

                m(FlexRow,{alignItems:'center', gap:'0.5rem', marginLeft:'1rem'},
                  m(Tappable, {
                    style: {
                      border: '1px solid #ccc',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem'
                    },
                    onclick: (e: Event) => {
                      if(data[name] == 0) return;

                      data[name] = (data[name] || 0) - 1;
                      m.redraw();
                    },
                  }, 
                    m(LucideIcon, {icon:'minus', width: '16', height: '16'})
                  ),

                  m(Tappable, {
                    style: {
                      padding: '0.5rem 1rem',
                      border: '1px solid #ccc',
                      borderRadius: '0.5rem',
                    },
                    onclick: (e: Event) => {
                      data[name] = (data[name] || 0) + 1;
                      m.redraw();
                    },
                  }, 
                    m(LucideIcon, {
                      icon:'plus',
                      width: '16',
                      height: '16'
                    })
                  )
                )
              )
            )

          ]
        }
      }
    }


    function Fairway() {
      return {
        view: (vnode) => {

          let {text, data, name } = vnode.attrs;


          return [
            m(FlexRow, {
              style: {
                padding: '1rem', background: '#f0f0f0', flex:1, alignItems: 'center',
                borderRadius: '0.5rem', justifyContent: 'space-between'
              }
            },
              
              m(Text, text),  


              m(FlexRow, {alignItems:'center'},
                m(FlexRow,{alignItems:'center', gap:'0.5rem', marginLeft:'1rem'},
                  [
                    {icon:'arrow-left', name:'left'},
                    {icon:'circle-dot', name:'middle'},
                    {icon:'arrow-right', name:'right'},
                  ].map((item)=>{
                    return m(Tappable, {
                      style: {
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1rem',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        border: data[name] === item.name ? `1.5px solid ${config.primaryColor}` : '1px solid #ccc'
                        //background: data[name] === item.name ? config.background : 'transparent',
                      },
                      onclick: (e: Event) => {
                        data[name] = item.name;
                        m.redraw();
                      },
                    }, 
                      m(LucideIcon, {icon: item.icon, width: '16', height: '16'})
                    )
                  })
                )
              )
            )
          ]
        }
      }
    }
  }


  function TotalScore(){

    return {
      view:(vnode) => {
        return [

        ]
      }
    }
  } 

}


function RoundEnded(){
  let game = AppData.currentGame;
  let club: GolfClub = game?.club;
  let round: Round = game?.round;
  let tee: Tee = game?.tee;
  

  return {
    oninit:(vnode:any)=> {
      if(!game){
        getGame(vnode.attrs.roundId)
        .then((res)=>{
          if(!res) return;

          game = res;
          club = game.club;
          round = game.round;
          tee = game.tee;
          m.redraw();
        })
      }
    },
    view: (vnode:any)=> {
      console.log('game', game)
      return m(App,
        m(AppBar, {
          leading: {
            icon: 'x',
            style: { color: 'white'},
            onclick: () => m.route.set(`/`)
          },
          title: 'Round Ended'
        }),
        
        m(AppContent,
          !game 
          ? null
          :
          m(FlexCol, {padding:'1em'},
            m(Img, {
              src: club.photo,
              style: {
                borderRadius:'0.5rem',
                width:'85%',
                maxHeight:'200px',
                objectFit:'cover'
              }
            }),

            m(H2, club.name),

            m(FlexRow, {
              justifyContent:'space-between',
              alignItems:'center',
              marginTop:'1rem',
            },
              m(Text, round.name),
              m(Text, tee.name)
            ),

            m(Div, {
              marginTop:'1.5em',
              background:'grey'
            },

            ),



            m(Text, 'You have completed the round.'),
          )
        )
      )
    }
  }
}


/*
function Profile() {
    return {
        view:(vnode)=> {
            return [

            ]
        }
    }
}


function Conversations() {

    return {
        view: (vnode)=> {
            return [
                
            ]
        }
    }
}




function CourseMap() {
    let selectedCourse;
    let map;
    


// This function draws the OSM features onto the map
    function renderOsmFeatures(features) {
        if (!features || features.length === 0) {
            console.log("No OSM features to render.");
            return;
        }

        // Filter for 'way' types only
        const holes = features.filter(f => f.type === 'way' && f.geometry && f.tags?.golf=='hole');

        holes.forEach(way => {
            const points = way.geometry.map(p => [p.lat, p.lon]);
            
            // Draw the polygon on the map
            const polygon = L.polygon(points, {
                color: 'grey', // Green outline
                weight: 2,
                fillColor: '#ffffff', // White fill
                fillOpacity: 0.3
            }).addTo(map);

            // Add a popup to show the tags associated with this 'way'
            const popupContent = `<pre>${JSON.stringify(way.tags, null, 2)}</pre>`;
            polygon.bindPopup(popupContent);
            
        });

        // now i have the polygons of the hole, i'd like to add a marker for the tee and the pins
        const pins = features.filter(f => f.type === 'node' && f.tags?.golf === 'pin');

        pins.forEach(pin => {
            L.marker([pin.lat, pin.lon], {
                icon: L.divIcon({
                    className: 'custom-pin-icon',
                    html: '🚩', // Using a flag emoji as the icon
                    iconSize: [30, 30],
                    iconAnchor: [0, 30], // Anchor point of the icon
                })
            })
            .addTo(map)
            .bindPopup(JSON.stringify(pin));
        });

        const tees = features.filter(f => f.type === 'node' && f.tags?.golf === 'tee');

        tees.forEach(tee => {
            if (tee.type === 'way' && tee.geometry) {
                // Draw tee areas (polygons) as light green
                const points = tee.geometry.map(p => [p.lat, p.lon]);
                L.polygon(points, {
                    color: '#90EE90', // Light green
                    weight: 1,
                    fillOpacity: 0.7
                }).addTo(map).bindPopup(`Tee Area (Hole ${tee.tags.ref || '?'})`);
            } else if (tee.type === 'node') {
                // Draw tee points (nodes) with an icon
                L.marker([tee.lat, tee.lon], {
                    icon: L.divIcon({
                        className: 'custom-tee-icon',
                        html: '⛳', // Using a flag emoji as the icon
                        iconSize: [30, 30],
                        iconAnchor: [0, 30], // Anchor point of the icon
                    })
                })
                .addTo(map)
                .bindPopup(`${JSON.stringify(tee)}`);
            }
        });

        // Find and draw greens
        const greens = features.filter(f => f.type === 'way' && f.geometry && f.tags?.golf=='green');
        greens.forEach(green => {
            const points = green.geometry.map(p => [p.lat, p.lon]);
            L.polygon(points, {
                color: '#90EE90', // Light green
                weight: 2,
                fillOpacity: 0.5
            }).addTo(map).bindPopup(`${JSON.stringify(green)}`);
        });


    }


    function initMap(lat, lng) {
        if (map) map.remove();

        map = L.map('map-container').setView([lat, lng], 16);

        // Use a satellite view, which is best for golf courses
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 19
        }).addTo(map);

        // Add a marker for the course's main location
        // L.marker([lat, lng]).addTo(map).bindPopup(`<b>${selectedCourse.displayName}</b>`);

        // Fetch and render detailed OSM data
        fetchOsmCourseDetails(lat, lng).then(renderOsmFeatures);
    }


    // This function queries OpenStreetMap for detailed golf features.
    async function fetchOsmCourseDetails(lat, lng) {
        // We search in a 1km radius around the course's center point.
        const radius = 1000; 
        const query = `
            [out:json][timeout:25];
            (
            // Query for nodes, ways, and relations related to golf features
            node["golf"](around:${radius},${lat},${lng});
            way["golf"](around:${radius},${lat},${lng});
            relation["golf"](around:${radius},${lat},${lng});

            // Also query for common natural features on a course
            way["natural"="sand"](around:${radius},${lat},${lng});
            way["natural"="water"](around:${radius},${lat},${lng});
            );
            out geom; // 'geom' provides coordinates for rendering
        `;

        try {
            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query
            });

            console.log('response', response)

            if (!response.ok) {
                throw new Error(`Overpass API request failed: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("OSM Data Found:", data.elements);
            return data.elements;
        } catch (error) {
            console.error("Error fetching OSM data:", error);
            return []; // Return an empty array on failure
        }
    }


    return {
        oninit: (vnode) => {
            selectedCourse = Model.selectedCourse || JSON.parse(localStorage.getItem('selectedCourse'));


            console.log('course', selectedCourse)
        },

        oncreate: (vnode) => {
            setTimeout(() => {
                if (selectedCourse && selectedCourse.location) {
                    const lat = selectedCourse.location.lat;
                    const lng = selectedCourse.location.lng;
                    initMap(lat, lng);
                }
            }, 100);
        },

        onremove: () => {
            if (map) {
                map.remove();
                map = null;
            }
        },

        view: (vnode) => {
            return [
                m("style",
                    `
                    .leaflet-bottom.leaflet-right {
                        display: none;
                    }
                `),


                m(App,
                    m(AppBar, {
                        leading: {
                            style: { color: 'white'},
                            icon: 'arrow-left',
                            onclick: () => m.route.set(`/course/${selectedCourse.displayName}`)
                        },
                    }),

                    m(AppContent,
                        m(FlexCol, {height:'100%'},
                            // Contenedor del mapa
                            m('div#map-container', {
                                style: {
                                    display:'flex',
                                    flexDirection:'column',
                                    flex: 1,
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '90vh',
                                    flex: 1
                                }
                            }),
                        )
                    )

                )
            ]
        }
    }
}*/