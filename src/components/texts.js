

import { config } from "./config.js"

export { H1, H2, H3, H4, Text, SmallText, TinyText }





/*
*
* TEXTOS
*
*/
function H1(){
    return {
        view:(vnode)=>{
            return m("h1",{
                style: {
                    fontFamily: config.fontFamily,
                    margin: 0,
                    ...(config.fonts.h1 || {}),
                    ...(vnode.attrs?.style || vnode.attrs)
                },
                //class: vnode.attrs.class
            }, vnode.children)
        }
    }
}

function H2(){
    return {
        view:(vnode)=>{
            return m("h2",{
                style: {
                    fontFamily: config.fontFamily,
                    margin:0,
                    ...(config.fonts.h2 || {}),
                    ...(vnode.attrs?.style || vnode.attrs)
                }
            }, vnode.children)
        }
    }
}

function H3(){
    return {
        view:(vnode)=>{
            return m("h3",{
                style: {
                    fontFamily: config.fontFamily,
                    margin: 0,
                    ...(config.fonts.h3 || {}),
                    ...(vnode.attrs?.style || vnode.attrs)
                }
            }, vnode.children)
        }
    }
}

function H4(){
    return {
        view:(vnode)=>{
            return m("h4",{
                style: {
                    fontFamily: config.fontFamily,
                    margin: 0,
                    ...(config.fonts.h4 || {}),
                    ...(vnode.attrs?.style || vnode.attrs)
                }
            }, vnode.children)
        }
    }
}

function Text(){
    return { 
        view:(vnode)=>{
            return m("p",{
                style: {
                    fontFamily: config.fontFamily,
                    margin: 0,
                    color:'black',
                    ...(config.fonts?.text ||  config.defaultFont  || {}),
                    ...(vnode.attrs.style || vnode.attrs)
                }
            }, vnode.children)
        }
    }
}

function SmallText(){
    return{ 
        view:(vnode)=>{
            return m("p",{
                style: {
                    fontFamily: config.fontFamily,
                    margin: 0,
                    ...(config.fonts.small || config.smallFont || {}),
                    ...(vnode.attrs.style || vnode.attrs)
                }
            }, vnode.children)
        }
    }
}


function TinyText(){
    return { 
        view:(vnode)=>{
            return m("p",{
                style:{
                    fontSize: '0.75rem',
                    //fontSize: '0.8em', utilizar em o px ??
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}
