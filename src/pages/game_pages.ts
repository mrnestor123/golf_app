
import { deleteSavedGame, getGame, getSavedGame, saveGameToLocal, uploadGame } from '../backend/game.js'
import { getClub } from '../backend/golf.js'
import { searchUsers } from '../backend/user.js'
import { App, AppBar, AppContent, LucideIcon, mobileNavigator } from '../components/app_elements.js'
import { config } from '../components/config.js'
import { openDialog } from '../components/dialogs.js'
import { Button, Img, Label } from '../components/elements.js'
import { Input } from '../components/forms.js'
import { Animate, Box, Div, FlexCol, FlexRow, Tappable } from '../components/layout.js'
import { H2, H3, SmallText, Text } from '../components/texts.js'
import { Game } from '../model/game.js'
import { GolfClub } from '../model/golf_club.js'
import { Hole } from '../model/hole.js'
import { Round } from '../model/round.js'
import { Score } from '../model/score.js'
import { Tee } from '../model/tee.js'
import { User } from '../model/user.js'
import { AppData } from './controller.js'


const m = (window as any).m; 



export function GameConfig() {

  let club : GolfClub | null = AppData.selectedClub || null;
  let loading = false;
  let activeModal: string | null = null;

  let game : Game | null ;

  return {
    oninit:(vnode:any)=> {
      if(!club || !club.rounds?.length){
        getClub(vnode.attrs.id)
        .then((r)=>{
          club = AppData.selectedClub =  r;

          game = new Game({
            user_id: AppData.user.id,
            club: { id: club.id, name: club.name, description: club.description}
          });

          loading = false;
          console.log(club)
          m.redraw()
        })
      }

      // siempre lo creo para simplificar el código y no hacer mucho if
      game = new Game({
        club: club,
        user_id: AppData.user.id   
      });

    },
    view: (vnode:any)=> {
      return [
        m(App,
          m(AppBar, {
            leading: {
              route: '/'
            }
          }),
          /*
          m("img", {
            style: {
              width:'100%',
              height: '200px',
              objectFit:'cover',
            },
            src: club.photo
          }),
          */

          m(AppContent,{ gap:'1rem', borderTop:'1px solid lightgrey'},

            m(FlexCol,{gap:'0.5rem'},
              
              club?.name 
              ? m(H2, club.name)
              : m(H2, {opacity:0}, "TEXT"),

              m(Text, "Select the different options to start a new game"),
              
            ),
            
            m(ButtonModal, {
              id: 'round',
              left: 'Round',
              icon: 'route',
              right: game?.round ? game.round?.name : 'Select',
              emptyText: "There is no saved rounds for this golf club",
              selected: game?.round,
              modal: club?.rounds?.map((round:Round)=>{
                return {
                  title: round.name,
                  //description: round.holes.length + ' holes',
                  onclick: (e: Event) => {
                    game.round = round;
                    console.log(round.tees, 'round', round)
                  }
                }
              }) 
            }),

            m(ButtonModal, {
              id: 'tee',
              left: 'Tee',
              icon:'land-plot',
              selected: game?.tee,
              right: game?.tee ? game.tee.name : 'Select',
              modal: game?.round?.tees?.map((tee:Tee)=>{
                
                let course_ratings = game.round.course_ratings 
                let slopes = game.round.slopes
                let descriptionText= ''
                
                if(course_ratings){
                  descriptionText += 'CR '
                  
                  let menCR = course_ratings['men']?.[tee.id]

                  if(menCR){
                    descriptionText+= 'M ' + menCR.split('/')[0]
                  }

                  let womenCR = course_ratings['women']?.[tee.id]

                  if(womenCR){
                    descriptionText+= ' W ' + womenCR.split('/')[0]
                  }
                }
                
                if(slopes){
                  descriptionText += '// SL'

                  if(slopes['men'] && slopes['men'][tee.id]){
                    descriptionText+= ' M ' + slopes['men'][tee.id].split('/')[0]
                  }

                  if(slopes['women'] && slopes['women'][tee.id]){
                    descriptionText+= ' W ' + slopes['women'][tee.id].split('/')[0]
                  }
                }

                return {
                  title: tee.name,
                  description: descriptionText,
                  onclick: (e: Event) => {
                    game.tee = tee;
                  }
                }
              }),
              emptyText: "Please select a round first"
            }),

            /*
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
            }),*/

            /*
            m(ButtonModal, {
              id: 'players',
              left: 'Players',
              right: game.players.length || '1',
              icon:'users-round'
            },  
              m(SearchPlayers)
            ),*/

            m("div", {style: { flex:1 }}),

            m(Button, {
              type:'primary',
              disabled: game?.round == null || game?.tee == null,
              onclick:(e: Event) => {    
                game.start = new Date();       
                console.log('GAME', game)

                saveGameToLocal(game);

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
    return {
      view:(vnode)=> {
        let { id, left, right, modal, emptyText } = vnode.attrs;
        const isOpen = activeModal === id;

        return [
          isOpen && [
            // dimmer overlay
            m(Tappable, {
              style: {
                position: 'fixed',
                inset: 0,
                background: '#00000088',
                zIndex: 1000
              },
              onclick: (e: Event) => {
                activeModal = null;
                e.stopPropagation();
              }
            },
              m("div", { onclick: (e: Event) => e.stopPropagation() },
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
                    overflowY: 'auto'
                  },
                }, 
                  m(FlexCol, {gap:'1rem'},
                    m(Div, {width:'40px', height:'4px', background:'#ccc', borderRadius:'2px', margin:'0 auto', marginBottom:'1rem'}),

                    modal && modal.length ?
                    modal.map((item:any) => 
                      m(TapButton,{
                        item: item,
                        onclick:(e)=>{
                          activeModal = null;
                          item.onclick()
                        }
                      })
                    ) 
                    : emptyText ? 
                    m(Text,{padding:'1em', color: 'grey'}, emptyText)
                    : vnode.children 
                  )
                )
              )
            )
          ],

          m(Tappable,{
            onclick:(e: Event) => {
              activeModal = id;
            },
            rippleEffect: true,
            style: {
              background: config.colors.lightgrey,
              padding: '0.75rem',
              border: '1px solid '+ config.colors.grey,
              borderRadius: '0.5rem',
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
    
    function TapButton(){
      return {
        view: (vnode) =>{
          let {onclick, item} = vnode.attrs

          return [
            m(Tappable,{
              onclick:(e: Event) => {
                onclick(e);
                
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
                m(Text, item.title),
                item.description && m(SmallText, item.description)
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
          ]
        }
      }
    }
  }

  function SearchPlayers(){
    let query = '';
    let results: User[] = [];
    let searching = false;
    let debounceTimer: any = null;

    function onInput(value: string) {
      query = value;
      clearTimeout(debounceTimer);
      if (query.length < 2) { results = []; return; }
      searching = true;
      debounceTimer = setTimeout(() => {
        searchUsers(query).then((users) => {
          results = users.filter(u => !game.players.find(p => p.id === u.id));
          searching = false;
          m.redraw();
        });
      }, 300);
    }

    return {
      view: ()=> [
        // added players
        game.players.length > 0 && m(FlexCol, { gap: '0.5rem' },
          game.players.map((player: User, index: number) =>
            m(FlexRow, { alignItems:'center', justifyContent:'space-between',
              style: { background:'#f0f0f0', borderRadius:'0.5rem', padding:'0.75rem 1rem' }
            },
              m(FlexCol, { gap: '0.15rem' },
                m(Text, { fontWeight:'bold' }, player.user_name || `Player ${index + 1}`),
                player.handicap != null && m(SmallText, `HCP: ${player.handicap}`)
              ),
              m(Tappable, {
                onclick: () => { game.players.splice(index, 1); }
              },
                m(LucideIcon, { icon:'x', width:'18', height:'18', style:{ color:'#999' } })
              )
            )
          )
        ),

        // search input
        m(Input, {
          type: 'text',
          icon:'search',
          placeholder: 'Search by username...',
          value: query,
          oninput: (e: any) => onInput(e.target.value),
        }),

        // results
        searching && m(SmallText, { style:{ padding:'0.5rem 0', color:'#999' }}, 'Searching...'),

        results.length > 0 && m(FlexCol, { gap:'0.5rem' },
          results.map((user: User) =>
            m(Tappable, {
              rippleEffect: true,
              onclick: () => {
                console.log('ONCLICK ONCLICK')
                game.players.push(user);
                results = results.filter(r => r.id !== user.id);
                query = '';
                results = [];
              },
              style: { background:'#f0f0f0', borderRadius:'0.5rem', padding:'0.75rem 1rem',
                display:'flex', alignItems:'center', justifyContent:'space-between' }
            },
              m(FlexCol, { gap:'0.15rem' },
                m(Text, { fontWeight:'bold' }, user.user_name),
                user.handicap != null && m(SmallText, `HCP: ${user.handicap}`)
              ),
              m(LucideIcon, { icon:'plus', width:'18', height:'18', style:{ color:'#555' } })
            )
          )
        ),

        query.length >= 2 && !searching && results.length === 0 &&
          m(SmallText, { style:{ padding:'0.5rem 0', color:'#999' }}, 'No players found'),

        // done button
        m(Button, {
          type:'primary',
          onclick: () => { activeModal = null; }
        }, 'Done')
      ]
    }
  }
}


export function GameStart(){   
  let game: Game  = AppData.currentGame;
  let holes: Hole[] = game?.round?.holes.map((hole:any) => new Hole(hole));
  let hole_index = 0;
  
  let loading = false;

  async function getData({id}){
    try {
      if(!game){
        loading = true;
        game = await getSavedGame(id);

        console.log('GAME', game)

        holes = game.round.holes.map((hole:any) => new Hole(hole));

        let i = 0;

        for(var score of game.scores){
          console.log('scoreconfirmed', score.confirmed, score)
          if(score.confirmed == false){
            hole_index = i
            break;
          } else i++
        }
        
        AppData.currentGame = game;
        loading = false;
        m.redraw()
      }
    } catch(e){
      loading = false
      m.redraw()
    }
  }
  
  return {
    oninit:(vnode:any)=> {
      getData(vnode.attrs);
    },
    view : (vnode:any) => {
      if(loading) return;


      return m(App,
        m(AppBar, {
          leading: {
            icon: 'x',
            onclick:(e)=>{
              openDialog(ExitDialog)
            },
            style: { color: 'black'}
          },
          title: game && game.round.name,
          subtitle: game && game.club.name,
        }),

        !game ?
        null :

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
                  uploadGame(game)
                  AppData.currentGame = game;
                  m.route.set(`/game/end/${game.id}`)
                } else {
                  game.scores[hole_index].confirmed = true;
                  game.scores[hole_index].end = new Date()
                  hole_index++;
                  saveGameToLocal(game)
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

            m(FlexCol,{gap:'0.5rem', width:'80%'},
              m(Button, {
                type:'primary',
                onclick: (e: Event) => {
                  //mobileNavigator.pop()
                  //mobileNavigator.pagestack = []
                  m.route.set(`/`)
                  deleteSavedGame(game.id)
                  vnode.attrs.close()
                }
              }, "Discard session"),


              game.scores.some((score: Score) => score.confirmed) &&
              m(Button, {
                type:'primary',
                onclick: (e: Event) => {
                  uploadGame(game)
                  AppData.currentGame = game;
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

        console.log('handicapssss', game.round.handicaps[hole_index])

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

              m(SmallText, 
                (typeof hole.tees[game.tee.id] == 'string' ? hole.tees[game.tee.id] : hole.tees[game.tee.id].distance)  + ' m'
              )
            )
            /*
            m(Label, {
              type: 'secondary',
              style: { border:`1px solid ${tee.color}`, color: tee.color, background:'white'}
            }, m(SmallText, tee.name )*/
          ),

          m(FlexRow, {justifyContent:'space-between', alignItems:'center', flex: 1},
            [
            'Par ' + (hole.tees[game.tee.id]?.par ||  hole.par),
            'Hcp ' + (hole.tees[game.tee.id]?.handicap || game.round.handicaps[hole_index]),
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


export function GameEnded(){
  let game = AppData.currentGame;
  let club: GolfClub = game?.club;
  let loading = false;
  let total_score = 0;
  // AGRUPAR ESTO EN UN WRAPPER EN CONTROLLER !!
  async function getData({id}){
    try {
      if(game){
        getScore()
        return;
      }

      loading = true;
      game = await getGame(id);
      AppData.currentGame = game;
      getScore()
      club = game.club;
      loading = false;
      m.redraw()
    } catch(e){
      loading = false
      m.redraw()
    }
  }

  function getScore(){
    game.scores.map((score: Score, i)=>{
    if(!score.confirmed) return;

    let hole:Hole = game.round.holes[score.hole_index != undefined ? score.hole_index : i]
    total_score+= score.strokes - hole.par
  })
  }

  
  return {
    oninit:(vnode:any)=> {
      getData(vnode.attrs);
    },
    view: (vnode:any)=> {

      return m(App,
        m(AppBar, {
          leading: {
            icon: 'x',
            style: { color: 'black'},

            onclick:(e)=>{
              AppData.currentGame = null;
              mobileNavigator.pop();
              if(vnode.attrs.past){
                m.route.set('/profile')
              } else {
                m.route.set('/')
              }
            }
            
          },
        }), 

        loading ? m(Skeleton) :
        game && [
          
          m(AppContent, {style: {borderTop: '1px solid #ccc', padding:'1rem'}},
            m(H2, club.name),

            m(SmallText, 
              game.start ? `Played on ${new Date(game.start).toLocaleDateString()}` : ''
            ),

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

              m(FlexCol, {alignItems:'center'},
                m(H2,
                  game.scores.reduce((total, score) => total + (score.fairway_hit ? 1: 0), 0)
                ),

                m(Text, 'Fairways')
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
                let handicap = hole.tees[game.tee.id]?.handicap || game.round.handicaps[i]
                let par = hole.tees[game.tee.id]?.par || hole.par
              

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
                    m(SmallText, `Par ${par}`),
                    m(SmallText, '/'),
                    m(SmallText, `${score.strokes || 0} strokes`),


                    score.putts 
                    ? m(SmallText, `putts ${score.putts} `) 
                    : null

                  )

                )
              })
              
            )
          )
        ]
        
      )
    }
  }


  function Skeleton(){
    const shimmer = {
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      borderRadius: '0.25rem',
    };

    const block = (w: string, h: string, extra: any = {}) =>
      m(Div, { style: { ...shimmer, width: w, height: h, ...extra } });

    return {
      view: () => [
        m('style', `
          @keyframes shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `),
        m(AppContent, { style: { borderTop: '1px solid #ccc', padding: '1rem' } },

          // Title + date
          block('55%', '22px'),
          block('35%', '14px', { marginTop: '0.5rem' }),

          // Stats row
          m(FlexRow, {
            style: { justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }
          },
            [1,2,3,4].map(() =>
              m(FlexCol, { style: { alignItems: 'center', gap: '0.4rem' } },
                block('40px', '28px'),
                block('50px', '12px')
              )
            )
          ),

          // Hole by hole title
          block('100px', '14px', { marginTop: '1.5rem' }),

          // Hole rows
          m(FlexCol, { style: { gap: '0.5rem', marginTop: '0.5rem' } },
            [1,2,3,4,5,6].map(() =>
              m(FlexRow, {
                style: {
                  background: config.app.card.background,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  borderRadius: '0.2rem'
                }
              },
                block('30px', '30px', { borderRadius: '0.1rem', flexShrink: 0 }),
                block('40%', '14px')
              )
            )
          )
        )
      ]
    }
  }
}