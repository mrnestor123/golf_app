// MODEL

let Model = {
    messages: [],
    user: {},
    conversations: [], 
}

let Theme = {
    colorPalette: {
        primary: "#3498db",
        secondary: "#2ecc71",
        background: "#ecf0f1",
        text: "#2c3e50"
    }
}

let Controller = {

    sendMessage:(message) => {
        Model.messages.push(message)
    }
}




// Router
m.route(document.body, "/", {
    "/": {
        render: function(vnode) {
            return m(Layout, vnode.attrs, m(MainPage))
        }
    },
    "/profile": {
        render: function(vnode) {
            return m(Layout, vnode.attrs, m(Profile))
        }
    },
    "/conversations": {
        render: function(vnode) {
            return m(Layout, vnode.attrs, m(Conversations))
        }
    }
})


function Layout(){

    return {
        view: function(vnode) {
            
        }
    }
}


function MainPage(){
    return {
        view: (vnode)=> {
            return [

            ]
        }
    }
}


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