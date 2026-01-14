// MODEL
import { App, AppBar, AppContent, LucideIcon, mobileRouter, NavBar} from './components/app_elements.js'
import { setConfig, config } from './components/config.js'
import { confirmDialog, openDialog } from './components/dialogs.js'
import { Button, Img, Label } from './components/elements.js'
import { Input } from './components/forms.js'
import { Animate, Box,  Div,  FlexCol, FlexRow, Tappable } from './components/layout.js'
import { H2, H3, SmallText, Text } from './components/texts.js'
import { getClub, getGolfClubs, Data, AppData, endGame, getGame, saveGame, getUser, createUser } from './controller.js'
import { Game, GolfClub, Hole, Round, Score, Tee, User } from './model.js'

const m = (window as any).m;


setConfig({
  background: 'white',
  fontFamily: 'Manrope',
  primaryColor:'#013220',
  form: {
    formLabel: {
      color: 'black',
      fontFamily:'Manrope'
    },
    input: {
      lineHeight: 1.4,
    }
  },

  fonts: {
    h2: {
      fontWeight:'normal'
    }
  },

  app: {
    navBar: {
      background:'white'
    },
    content: {
      padding:'1rem'
    },
    appBar: {
      background: 'white',
      color:'black'
    },
    card: {
      background:'#F3F3F3'
    }
  },
  
  elements: {
    label: {
      secondary: {
        border: '1px solid #ccc',
        borderRadius:'0.1rem',
        padding:'1rem',
        margin:0,
        backgroundColor: "white",
        color:'black',
        textAlign:'center'
      },

      primary: {
        background: '#1a1a1a',
        color: 'white',
        padding: '1rem',
        lineHeight: 1.4,
        borderRadius: '0.2rem',
        textAlign:'center'
      },
    },

    button: {
      primary: {
        background: '#1a1a1a',
        color: 'white',
        padding: '0.75rem 1.5rem',
        lineHeight: 1.4,
        borderRadius: '0.2rem',
      },
      secondary : {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
      }
    },

    card: {
      background:'#00000033',
      border:' 1px solid #444444'
    },
  }
})



// Router
mobileRouter(document.body, "/splash", {

  "/splash": {
    view: function(vnode:any) {
      return m(SplashPage, vnode.attrs)
    },
    'transition':'no'
  },


  "/login": {
    view: function(vnode:any) {
      return m(LoginPage, vnode.attrs)
    },
    'transition':'no'
  },

  "/": {
    view: function(vnode:any) {
      return m(Layout, vnode.attrs, MainPage)
    },
    'transition':'no'
  },

  "/profile": {
    view: function(vnode:any) {
      return m(Layout, vnode.attrs, ProfilePage)
    },
    'transition':'no'
  },

  "/club/:id": {
    view: function(vnode) {
      return m(ClubSelected, vnode.attrs)
    }
  },

  "/game/:id": {
    view: function(vnode: any){
      console.log('game start' , vnode.attrs)
      return m(GameStart, vnode.attrs)
    }
  },

  "/game/end/:id": {
    view: function(vnode: any){
      return m(GameEnded, vnode.attrs)
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
  
  let animation;

  return {
    oninit: (vnode) => {
      if(localStorage.getItem('user_cod')){
        getUser(localStorage.getItem('user_cod') || '').then((user)=>{
         AppData.user = new User(user);
         console.log('loaded user', AppData.user)
        })
      } 

      setTimeout(() => { 
        if(localStorage.getItem('user_cod') && AppData.user.id){
          m.route.set('/');
        } else {
          m.route.set('/login');
        }
      }, 5000);
    },
    view: (vnode)=> {
      return [
        m(App,
          m(AppContent, {justifyContent:'center', alignItems:'center', padding:'1rem', textAlign:'center'},

            m(Animate,{
              duration: 2000,
              from: { opacity: 0, transform: 'scale(0.5)' },
              to: { opacity: 1, transform: 'scale(1)' }
            }, 
              m(H2, "Welcome"),
            )
          )
        )
      ]
    }
  }
}


function LoginPage() {
  let loading = false;

  let data = {}

  return {
    view: (vnode)=> {
      return [
        m(App,
          m(AppContent, {justifyContent:'center', alignItems:'center', padding:'1rem', textAlign:'center', gap:'0.5rem'},
            m(H2, "Login Page"),

            m(Input,{
              label:  "Email",
              type: 'email',
              data: data,
              name: 'email',
              placeholder: 'Email'
            }),

            m(Input,{
              label: "Password",
              type: 'password',
              data: data,
              name: 'password',
              placeholder: 'Password'
            }),

            m(FlexRow,{width:'100%'}, m(Button, {
              type:'primary',
              fluid:true,
              style:{flex:1},
              onclick:(e: Event) => {
                if(!data['email'] || !data['password']){
                  alert('Please enter email and password');
                  return;
                }

                createUser(data['email'], data['password']).then(user=>{
                  if(user){
                    localStorage.setItem('user_cod', user.id);
                    AppData.user = user;
                    m.route.set('/');
                  }
                })
                
              }
            }, "Login"))
          )
        )
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
        /*
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
        )*/

        m(AppContent, 
          vnode.children.map((child:any) => m(child)),
          m(Box,{height:'4rem'})
        ),

        m(NavBar, {
          icons: [
            { icon: "land-plot", link: "/", name: 'Play'},
            // { icon: "land-plot", link: "/", name: 'Play'},
            // { icon: "dumbbell", link: "/train", name: 'Train'},
            { icon: "user", link: "/profile", name:'Profile'}
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
          color: '#fff'
        } 
      }, [
        
        m(H2, 'Golf Courses Near You'),
        m(Box, {height:'1rem'}),
        
        m(FlexCol, { gap: '1rem' },
          AppData.golfClubs.map((club: GolfClub)=> {
            const photo = club.photo; 
            
            return m(Tappable,{
              rippleEffect:true,
              onclick:(e:Event)=> {
                AppData.selectedClub = club;
                m.route.set(`/club/${club.id}`) 
              }
            },
              m(FlexRow, {
                background:'#F8F8F8',
                padding: '0.75rem',
                borderRadius:'0.5rem',
                alignItems: 'center',
                boxShadow:' 0 2px 4px rgba(0,0,0,0.1)',
                color:'black',
                gap:'0.5rem'
              },

                m(FlexRow, { flex:1, gap:'0.5rem'},
              
                  photo && m("img",{
                      style: {
                        width:'70px',
                        height:'90px',
                        borderRadius:'0.5rem',
                        objectFit:'cover'
                      },
                      src: photo 
                  }),

                  m(FlexCol, {justifyContent:'space-between', padding:'0.5rem'},
                    m(Text, club.name),

                    m(FlexRow, {alignItems:'center', gap:'1rem'},
                      m(FlexRow, {alignItems:'center', gap:'0.5rem'},
                        m(LucideIcon,{  
                          icon: 'star',
                          width: '16',
                          height: '16',
                          style: { color:'black'}
                        }),
                        m(SmallText, club.rating || 'N/A'),
                      ),

                      m(FlexRow, {alignItems:'center', gap:'0.5rem'},
                        m(LucideIcon,{  
                          icon: 'map-pin',
                          width: '16',
                          height: '16',
                          style: { color:'black'}
                        }),
                        m(SmallText, '100 m')  
                      ),
                    ),

                    
                  )
                ),

                m(LucideIcon, {
                  icon: 'chevron-right',
                  width: '24',
                  height: '24',
                  style: { color:'black' }
                })
              )
            )
          })
        )
      ])
    }
  }
}


function ProfilePage(){
  let user: User = AppData.user;
  
  
  return {
    oninit:(vnode)=>{
      if(!user){
        getUser(localStorage.getItem('user_cod') || '').then((u)=>{
          AppData.user = new User(u);
          user = AppData.user;
          m.redraw()
        })
      }
    },
    view: (vnode) =>{
      console.log('user', user, AppData.user)

      if(!user) return

      return [
        
        m(FlexCol, { alignItems:'center', gap:'1rem'},
          m(Div,{
            style: {
              width:'80px',
              height: '80px',
              borderRadius:'50%',
              background: 'grey',
            }
          }),

          m(H2, user.user_name),
        ),

        m(Box, {height:'2rem'}),
          
        m(Text, "My games"),

        !user.games?.length ?
        m(Text, {color:'grey', marginTop:'1rem'}, "No games played yet") :

        m(FlexCol, { gap: '1rem' },
          user.games.map((game:Game) =>
            m(Tappable, {
              style: {
                display:'flex',
                alignItems:'center',
                justifyContent:'space-between',
              }
            },
            )
          )
        )
      ]
    }
  }
}

function ClubSelected() {

  let club = AppData.selectedClub;
  let loading = false;

  let game : Game | null = null;

  async function getData({id}){
    if(!club){
      loading = true;
      club = await getClub(id)
      AppData.selectedClub = club;
      loading = false;
      m.redraw()
    }

    game = new Game({
      club: club,
      date: new Date(),
    })

    game.scoring_method = 'Stroke play';
  }

  return {
    oninit:(vnode:any)=> {
      console.log(vnode.attrs)

      getData(vnode.attrs);
    },
    view: (vnode:any)=> {
      if(loading) return;

      return [
        m(App,
          m(AppBar, {
            leading: {
              route: '/'
            }
          }),

          m("img", {
            style: {
              width:'100%',
              height: '200px',
              objectFit:'cover',
            },
            src: club.photo
          }),

          m(AppContent,{ gap:'1rem'},

            m(FlexCol,{gap:'0.5rem'},
              m(H2, club.name),

              m(Text, "Select the different options to start a new game"),
              
            ),

            
            
            m(ButtonModal, {
              left: 'Round',
              icon: 'route',
              right: game.round ? game.round?.name : 'Select',
              selected: game.round,
              modal: club.rounds.map((round:Round)=>{
                return {
                  title: round.name,
                  description: round.number_of_holes + ' holes',
                  onclick: (e: Event) => {
                    game.round = round;
                  }
                }
              }) 
            }),

            m(ButtonModal, {
              left: 'Tee',
              icon:'land-plot',
              selected: game.tee,
              right: game.tee ? game.tee.name : 'Select',
              modal: club.tees.map((tee:Tee)=>{
                return {
                  title: tee.name,
                  description: game.round && game.round.course_ratings[tee.id]  
                    ? `CR: ${game.round.course_ratings[tee.id]}, Slope: ${game.round.slopes[tee.id]}`
                    : 'Select a round first',
                  onclick: (e: Event) => {
                    game.tee = tee;
                  }
                }
              }) 
            }),

            m(ButtonModal, {
              left: 'Scoring',
              icon:'arrow-down-1-0',
              selected: game.scoring_method,
              right: game.scoring_method ? game.scoring_method : 'Stroke Play',
              modal: [
                {
                  title: 'Stroke Play',
                  description: 'Standard scoring method. Lowest total strokes wins.',
                  onclick:(e)=>{
                    game.scoring_method = 'Stroke play';
                  }
                },
                {
                  title: "Stableford",
                  description: 'Points-based system rewarding scoring relative to par.',
                  onclick:(e)=>{
                    game.scoring_method = 'Stableford';
                  }
                }
              ]
            }),

          
            m(ButtonModal, {
              left: 'Players',
              right: game.players.length || '1',
              icon:'users-round'
            },  
              m(FlexCol, {gap:'1rem'},
                game.players.map((player, index) =>
                  m(FlexRow, { alignItems:'center', justifyContent:'space-between' },
                    m(Text, player.user_name || `Player ${index + 1}`),
                  )
                ),


                m(Button, {
                  type:'secondary',
                  onclick:(e: Event) => {
                    game.players.push({} as User);
                  }
                })
              )
            ),

            m("div", {style: { flex:1 }}),

            m(Button, {
              type:'primary',
              disabled: game.round == null || game.tee == null,
              onclick:(e: Event) => {    
                console.log('STARTING GAME', game)              
                saveGame(game);

                AppData.currentGame = game;

                m.route.set(`/game/${game.id}`);
              },
              style: {
                marginTop:'1rem',
                maxWidth:'400px'
              }
            }, 'Start')
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
                  from: { transform: 'translateY(20%)' },
                  to: { transform: 'translateY(0%)' },
                  exit: { transform: 'translateY(20%)' },
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
                background: config.app.card.background,
                borderRadius: '0.5rem',
                padding: '1rem',
                display:'flex',
                //flex:'1 1 100%',
                alignItems:'center'
              },
            },    
              m(FlexRow, {flex:1, alignItems:'center', justifyContent:'space-between'},

                m(FlexRow, {gap:'1rem', alignItems:'center'},
                  m(Div, { display:'flex', alignItems:'center', justifyContent:'center', background:'white', padding:'0.6rem', borderRadius:'0.5rem'},
                    m(LucideIcon, {
                      icon: vnode.attrs.icon,
                      width: '20',
                      height: '20',
                      style: { color:'black', margin:'0 auto' }
                    })
                  ),
                  
                  m(Text,  left),
                ),
                m(SmallText, right)
              )
            )
          ]
        }
      }
  }
}


function GameStart(){   
  let game: Game  = AppData.currentGame;
  let holes: Hole[] = game?.round?.holes.map((hole:any) => new Hole(hole));
  let hole_index = 0;
  
  let loading = false;

  async function getData({id}){
    if(!game){
      loading = true;
      game = await getGame(id);
      console.log('game', game)

      holes = game.round.holes.map((hole:any) => new Hole(hole));
      AppData.currentGame = game;
      loading = false;
      m.redraw()
    }
  }
  
  return {
    oninit:(vnode:any)=> {
      getData(vnode.attrs);
    },
    view : (vnode:any) => {
      if(loading) return;

      console.log('game', game)

      return m(App,
        m(AppBar, {
          leading: {
            icon: 'x',
            onclick:(e)=>{
              openDialog(ExitDialog)
            },
            style: { color: 'black'}
          },
          title: game.round.name,
          subtitle: game.club.name,
        }),

        m(AppContent, {borderTop: '1px solid #ccc'},
          
          [
            m(HoleInfo, {
              hole: holes[hole_index], 
              key: hole_index,
              score: game.scores[hole_index],
              teeId: vnode.attrs.teeId
            }),
          ],

          m(TotalScore),

          m(Div, { 
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
            m(Button,{
              disabled: hole_index == 0,
              type:'secondary',
              style: {
                minWidth:'fit-content'
              },
              onclick: () => {
                m.redraw();
                if(hole_index > 0){
                  hole_index--;
                }
              }
            },  
              m(LucideIcon,{
                icon:'arrow-left',
                style: {
                  color:'black'
                },
                width: '16',
                height: '16'
              })
            ),


            m(Button, {
              onclick: () => {
                if(hole_index >= holes.length -1) {
                  endGame(game)
                  m.route.set(`/game/end/${game.id}`)
                } else {
                  game.scores[hole_index].confirmed = true;
                  game.scores[hole_index].end = new Date()
                  hole_index++;
                }

                m.redraw();
              },
              style: {
                flex: 1
              }
            },  hole_index >= holes.length -1 ? "End Round" : "Add score"),

            m(Button,{
              type:'secondary',
              style: {
                minWidth:'fit-content'
              },
              onclick: () => {
                m.redraw();
                if(hole_index < holes.length -1){
                  
                  if(game.scores[hole_index].strokes && !game.scores[hole_index].end){
                    game.scores[hole_index].end = new Date();
                  }

                  hole_index++;
                  
                }
              }
            }, 
              m(LucideIcon,{
                icon:'arrow-right',
                style: {
                  color:'black'
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


  function ExitDialog(){
    return {
      view:(vnode)=>{
        return m(FlexCol,{inset:'0', position:'fixed', background:'#00000088', zIndex:1000},
          m(FlexCol, { 
            border:'1px solid #ccc', borderRadius:'0.1rem', flex:1,
            gap:'1rem', alignItems:'center', background:'white', padding:'0.5rem', width:'80%',
            position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)'
          },
            m(H3, "Are you sure?"),
            m(Text, "You are going to end the game"),

            m(FlexCol,{gap:'0.5rem'},
              m(Button, {
                type:'primary',
                onclick: (e: Event) => {
                  m.route.set(`/`)
                  console.log('closing')
                  vnode.attrs.close()
                }
              }, "Discard session"),


              game.scores.some((score: Score) => score.confirmed) &&
              m(Button, {
                type:'primary',
                onclick: (e: Event) => {
                  m.route.set(`/game/end/${game.id}`)
                  vnode.attrs.close()

                }
              }, "End and save session"),

              m(Button,{
                type:"secondary",
                onclick:(e: Event) => {
                  vnode.attrs.close()
                }
              }, "Cancel"
              )
            )

          )
        )
      }
    }
  }

  function HoleInfo(){

    let expandMore = false;
    let hole: Hole ;
    let score: Score ;

    return {
      oninit:(vnode)=>{
        hole = vnode.attrs.hole
        score = vnode.attrs.score

        if(!score.confirmed){
          score.strokes = hole.par;
          score.start = new Date();
        }
      },
      view: (vnode)=> {
        hole = vnode.attrs.hole
        score = vnode.attrs.score

        if(!hole) return;

        if(!score.start) score.start = new Date();

        let green_score = (hole.par - 2);
        score.green_in_regulation = score.confirmed && score.strokes && score.putts ? score.strokes - (score.putts || 0) <= green_score: false;
        score.up_and_down = score.confirmed && score.strokes && !score.green_in_regulation ? hole.par >= score.strokes : false;

        return m(FlexCol,{ 
          background:'white', 
          gap: '1rem', color:'black'
        },
            
          m(FlexRow, { alignItems:'center', justifyContent:'space-between', width:'100%'}, 
            m(H2, `Hole ${hole_index + 1}`),


            m(FlexRow, { gap:'0.5rem', alignItems:'center' },

              m(LucideIcon,{
                icon:'land-plot',
                width: '20',
                height: '20',
              }),

              m(SmallText, hole.tees[game.tee.id] + ' m')
            )
            /*
            m(Label, {
              type: 'secondary',
              style: { border:`1px solid ${tee.color}`, color: tee.color, background:'white'}
            }, m(SmallText, tee.name )*/
          ),

          m(FlexRow, {justifyContent:'space-between', alignItems:'center', flex: 1},
             [
              'Par ' + hole.par,
              'Hcp ' + game.round.handicaps[hole_index],
              ].map((text,i)=>{
                return [
                  m(Label,{
                  type:'secondary',
                  style: { flex:1}
                },
                  m(Text, text)
                ),

                i == 0 ? m(Box, {width:'1rem'}) : null
              ]
              }),
            
            m(FlexRow, { alignItems:'center', gap:'0.5rem'},
             
            ),
            /*
             m(FlexRow, {gap:'1rem', alignItems:'center'},
              m(Label, {
                type: score.green_in_regulation ?'primary' : 'secondary',
              }, "GIR"),

              m(Label, {
                type: score.up_and_down ?'primary' : 'secondary',
              }, "UP & DOWN")
            ),*/

            
          ),

          m(NumberPut,{
            data: score,
            name: 'strokes',
            text: 'Total Strokes',
          }),
          

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
          }),


          m(FlexRow, {alignItems:'center'},
            m(Label, {
              style: {flex:1},
              type: score.green_in_regulation ?'primary' : 'secondary',
            }, m(Text, {color:score.green_in_regulation ? 'white' : 'black'}, "GIR")),

            m(Box, {width:'1rem'}),

            m(Label, {
              style: {flex:1},
              type: score.up_and_down ?'primary' : 'secondary',
            }, m(Text, {color:score.up_and_down ? 'white' : 'black'},  "UP & DOWN"))
          )

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
                flex:1, alignItems: 'center',
                borderRadius: '0.5rem', justifyContent: 'space-between'
              }
            },
              
              m(Text, text),  


              m(FlexRow, { minWidth:'30%', alignItems:'center', justifyContent:'space-between', background:config.app.card.background, padding:'1rem', borderRadius:'0.5rem'},
                
                m(Tappable, {
                  style:{display:'flex', alignItems:'center', justifyContent:'center'},
                  onclick: (e: Event) => {
                    if(data[name] == 0) return;

                    score.confirmed = true;

                    data[name] = (data[name] || 0) - 1;
                    m.redraw();
                  },
                },

                  m(LucideIcon, {icon:'minus', width: '24', height: '24'})
                ),
                
                m(H2,{color: score.confirmed ? 'black' : 'grey' }, data[name] || 0),


                m(Tappable, {
                  style:{display:'flex', alignItems:'center', justifyContent:'center'},
                  onclick: (e: Event) => {
                    score.confirmed = true;
                    data[name] = (data[name] || 0) + 1;
                    m.redraw();
                  },
                }, 
                  m(LucideIcon, {
                    icon:'plus',
                    width: '24',
                    height: '24'
                  })
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

          let { text, data, name } = vnode.attrs;

          return [
            m(FlexRow, {
              style: {
                flex:1, alignItems: 'center',
                borderRadius: '0.5rem', justifyContent: 'space-between'
              }
            },
              
              m(Text, text),  

              m(FlexRow, {alignItems:'center', background:config.app.card.background, padding:'1rem', borderRadius:'0.5rem'},
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


function GameEnded(){
  let game = AppData.currentGame;
  let club: GolfClub = game?.club;
  let loading = false;
  
  async function getData({id}){

    if(!game){
      loading = true;
      game = await getGame(id);
      AppData.currentGame = game;
      club = game.club;
      loading = false;
      m.redraw()
    }

  }

  return {
    oninit:(vnode:any)=> {
      getData(vnode.attrs);
    },
    view: (vnode:any)=> {
      if(loading) return;

      console.log('game end', game)

      let total_score = game.scores.filter(score => score.confirmed).reduce((total, score) => total + (score.strokes || 0), 0) -
        game.round.holes.filter((hole,i )=> game.scores[i].confirmed).reduce((total, hole) => total + hole.par, 0) 


      return m(App,
        m(AppBar, {
          leading: {
            icon: 'x',
            style: { color: 'black'},
            route: '/'
          },
        }), 

        m(Img, {
          src: club.photo,
          style: {
            width:'100%',
            maxHeight:'200px',
            objectFit:'cover'
          }
        }),
        
        m(AppContent, {style: {borderTop: '1px solid #ccc', padding:'1rem'}},
          m(H2, club.name),

          m(FlexRow, {
            justifyContent:'space-between',
            alignItems:'center',
            marginTop:'1rem',
          },  
            m(FlexCol, {alignItems:'center'},
              m(H2,
                (total_score > 0 ? `+`:
                total_score < 0 ? `-` :
                '')
                + total_score
              ),

              m(Text, 'Total Score')
            ),
            
            m(FlexCol, {alignItems:'center'},
              m(H2,
                game.scores.reduce((total, score) => total + (score.green_in_regulation ? 1: 0), 0) 
                
              ),

              m(Text, 'GIR')
            ),

            m(FlexCol, {alignItems:'center'},
              m(H2,
                game.scores.reduce((total, score) => total + (score.up_and_down ? 1: 0), 0)
              ),

              m(Text, 'UP&DOWN')
            ),

            
            
          ),

          m(Div, {
            marginTop:'1.5em',
            background:'grey'
          }),

          

          m(FlexCol, {gap:'0.5rem'},
            m(Text, { marginTop:'1rem'}, 'Hole by Hole'),

            game.scores
            .filter(score => score.confirmed)
            .map((score:Score, i)=>{
              let hole = game.round.holes[score.hole_index];
            

              return m(FlexRow, {
                background: config.app.card.background,
                justifyContent:'space-between', alignItems:'center', padding:'0.5rem'
              },

                m(Div, { 
                  background:'white', display:'flex', borderRadius:'0.1em', width:'30px', height:'30px',
                  alignItems:'center', justifyContent:'center', padding:'0.2rem' 
                },
                  
                  m(Text,score.hole_index + 1)
                ),

                m(FlexRow,{gap:'0.5rem'},
                  m(SmallText, `Par ${hole.par}`),
                  m(SmallText, '/'),
                  m(SmallText, `${score.strokes || 0} strokes`)

                )

              )
            })
            
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