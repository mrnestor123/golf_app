import { App, LucideIcon, AppContent, NavBar } from '../components/app_elements.js';
import { Box, FlexCol, FlexRow, Tappable,Div, Animate } from '../components/layout.js';
import { H2, SmallText, Text } from '../components/texts.js';
import { GolfClub } from "../model/golf_club.js";
import { AppData, getData } from './controller.js';
import { config } from '../components/config.js';
import { Game } from '../model/game.js';
import { User } from '../model/user.js';
import { openDialog } from '../components/dialogs.js';
import { Dropdown, HtmlDropdown, Input } from '../components/forms.js';
import { Button, Spinner, SVGIcon } from '../components/elements.js';
import { getUser, updateUser } from '../backend/user.js';
import { normalizeStr } from '../components/util.js';

const m = (window as any).m; 

export function Courses(){
  let golfClubs: GolfClub[] = AppData.golfClubs;
  let loading = false;
  
  const pageSize = 20;

  let filteredClubs: GolfClub[] = AppData.golfClubs
  let filter={ 
    'name': ''
  } 

  function filterClubs(){
    if(!filter.name){
      filteredClubs = golfClubs;
    } else {
      filteredClubs = golfClubs.filter((club)=>
        normalizeStr(club.name).includes(normalizeStr(filter.name))
      )
    }

    
  }

  return {
    oninit:(vnode:any)=> {
      if(!AppData.golfClubs.length){
        loading = true;

        // QUITAR GETDATA!!
        getData()
        .then((res:any[])=>{
          golfClubs = res;
          filterClubs()
          loading = false;
          m.redraw();
        })
        .catch((error: Error) => {
          loading = false;
          console.error('Error loading golf clubs:', error);
          m.redraw();
        })
      }
    },
    view: (vnode:any)=> {
      return  m(Layout, {padding:'0em'},
        m(FlexCol, {gap:'1rem'},
          m(H2,{paddingTop:'1rem', paddingLeft:'1em', paddingRight:'1em'}, 'Golf Courses Near You'),

          m(Div, {
            style:{
              position:'sticky',
              top:0,
              left:0,
              right:0,
              zIndex:2,
              paddingLeft:'1em', 
              paddingRight:'1em',
              background:'white'
            }
          },
            m(Input,{
              data: filter,
              name: 'name',
              icon: 'search',
              placeholder: 'Club name',
              oninput:(e)=>{
                console.log('filtering')
                filterClubs()
                m.redraw();
              }
            })
          ),

          m(FlexCol, {gap:'1rem', paddingLeft:'1em', paddingRight:'1em'},
            loading ?
            Array(5).fill(1).map((_, i)=> GolfMockUp(i)):
            m(LazyList),
          ),
        )
      )
    }
  }


  function LazyList(){

    let options = {
      //root: document.getElementById("app-content"),
      rootMargin: "0px",
      scrollMargin: "0px",
      threshold: 1.0,
    }

    let visibleCount = 20;

    let observer = new IntersectionObserver(entries => {
      var entry = entries[0];
      console.log('entry', entry)

      if (entry.isIntersecting) {
        console.log('You reached the bottom of the list!');
        
        observer.unobserve(document.getElementById(String(visibleCount-5)))
        visibleCount+=15;
        m.redraw()
      }
    }, options);

    //visibleCount = Math.min(pageSize, filteredClubs.length);


    return {
      view:(vnode)=>{
        return [
          // cambiar esto por items !!
          filteredClubs.slice(0, visibleCount).map((club: GolfClub, index)=> {
              const photo = club.photo; 
              
              return m(Tappable,{
                rippleEffect:true,
                id: index,
                onclick:(e:Event)=> {
                  AppData.selectedClub = club;
                  m.route.set(`/club/${club.id}`) 
                },
                ...visibleCount-5 == index ?
                { oncreate:({dom})=> observer.observe(dom)}
                : {}
              },
                m(FlexRow, {
                  background: config.colors.lightgrey,
                  padding: '0.75rem',
                  border: '1px solid '+ config.colors.grey,
                  borderRadius:'0.5rem',
                  alignItems: 'center',
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
                      
                      /*
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
                      )*/
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
          }),

          visibleCount < filteredClubs.length
          ? m(Text, {color:'grey', textAlign:'center', padding:'0.25rem 0 0.5rem'}, 'Loading more courses...')
          : null
        ]
      }
    }
  }

  function GolfMockUp(i:number){
    return m(FlexRow, {
      key: i,
      background:'#F8F8F8',
      padding: '0.75rem',
      borderRadius:'0.5rem',
      alignItems: 'center',
      color:'black',
      gap:'0.5rem'
    },
      m(FlexCol, {justifyContent:'space-between', padding:'0.5rem', flex:1, gap:'0.6rem'},
        m(Div, {
          style: {
            width:'65%',
            height:'14px',
            borderRadius:'0.2rem',
            background: config.colors.grey,
          }
        }),

        m(FlexRow, {alignItems:'center', gap:'0.7rem'},
          m(Div, {
            style: {
              width:'45px',
              height:'12px',
              borderRadius:'0.2rem',
              background: config.colors.lightgrey,
            }
          })
        )
      )
    )
  }

}


export function ProfilePage(){
  let user: User = AppData.user;

  return {
    view: (vnode) =>{
      console.log('USER', user.games)

      return [
        m(Layout, [
          m(FlexCol, { alignItems:'center', gap:'1rem'},
            m(Div,{
              style: {
                width:'80px',
                height: '80px',
                borderRadius:'50%',
                background: config.app.card.background,
                alignItems:'center',
                display:'flex',
                justifyContent:'center'
              }
            },
              m(Div,{
                style: {
                  width:'60px',
                  height: '60px',
                  borderRadius:'50%',
                  display:'flex', alignItems:'center',  justifyContent:'center',
                  border: '2px solid grey'
                }
              },
                m(SVGIcon,{icon:'user', width:24, height:24})
              )
            ),

            m(H2, user?.user_name),
          ),

          m(Box, {height:'2rem'}),
            
          m(Text, "My games"),
          m(Box, {height:'1rem'}),

          !user?.games?.length ?
          m(Text, {color:'grey', marginTop:'1rem'}, "No games played yet") :
          m(FlexCol, { gap: '1rem' },
            user.games.map((game:Game) =>
              m(Tappable, {
                style: {
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'space-between',
                  background: config.app.card?.background,
                  padding:'1rem'
                },
                onclick:(e)=> {
                  console.log('GAME', game);
                  //AppData.currentGame = new Game();
                  // aquí podría expandir el game !!
                  console.log('game', game, AppData.currentGame)
                  m.route.set(`/game/end/${game.id}?past=true`)
                }
              },
                m(FlexCol, {gap:'0.5rem'},
                  m(Text, game.club.name),
                  m(FlexRow, {gap:'0.1rem'},
                    
                    m(LucideIcon,{
                      icon: 'calendar',
                      width: '16',
                      height: '16',
                    }),
                    m(SmallText, `${new Date(game.start).toLocaleDateString()}`
                  )
                  ),
                ),
                m(LucideIcon, {
                  icon: 'chevron-right',
                  width: '20',
                  height: '20',
                  style: { color:'black' }
                })
              )
            )
          )
        ])
      ]
    }
  }
}


function Layout() {
  let user = AppData.user

  return {
    oninit:(vnode)=>{
      if(!user.user_name){
        setTimeout(()=>{
          openDialog(BottomModal)
        }, 1400)
      }
    },
    view: (vnode:any) => {
      return [
        m(App,
          m(AppContent, {
            ...(vnode.attrs || {})
          },
            vnode.children,
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
      ]
    }
  }


  function BottomModal(){

    let data = {
      username: '',
      gender: undefined
    };

    let loading = false;

    function isValidUserName(txt){

      return txt.trim().length>6
    }

    return {
      view: (vnode) => {
        return [
          m(Div, {position:'fixed', inset:'0px', background: 'black', opacity:0.5 }),

          m(Animate, {
              duration: 500,
              from: { transform: 'translateY(20%)' },
              to: { transform: 'translateY(0%)' },
              exit: { transform: 'translateY(20%)' },
              style: {
                position:'fixed',
                bottom:0,
                left: 0,
                right:0,
                padding:'2em 1em',
                background:'white',
                borderTopLeftRadius:'1rem',
                borderTopRightRadius:'1rem',
                maxHeight: '50vh',
                display:'flex', flexDirection:'column', gap:'1em',
                overflowY: 'auto',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
              },
            },

              m(Text,{color:config.colors.secondaryText}, "We need additional data to complete your profile"),
              
              m(HtmlDropdown,{
                data:data,
                label: 'Gender',
                placeholder:'Select an option',
                name:'gender'
              }, [{label:"Male",value:1},{label:"Woman",value:2}]),

              m(Input,{
                label:'Username',
                data:data,
                name:'username'
              }),

              
              


              m(Button,{
                disabled: !isValidUserName(data.username),
                onclick:(e)=>{
                  if(data.gender == undefined) return
                  if(!data.username) return

                  loading = true;

                  updateUser(user.id, {
                    'user_name': data.username, 
                    'gender': data.gender
                  }).then((res)=>{
                    loading = false;
                    vnode.attrs.close()
                  })
                }
              }, loading ? m(Spinner) : 'OK')
            )
        ]
      }
    }
  }

}