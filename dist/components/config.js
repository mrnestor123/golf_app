// fichero de configuración ??
// idea para configurar diferentes estilos? de momento no se añade !!
export { config, setConfig };
let config = {
    primaryColor: '', // to do !!
    secondaryColor: '',
    accentColor: '',
    background: '#f5f5f5',
    fontFamily: 'Poppins, Karla, Raleway, Lato, sans-serif',
    h1: {},
    h2: {},
    h3: {},
    p: {},
    button: {
    // primary : {
    //     background: '#e8def8'
    // }
    },
    app: {
        appBar: {
        //background:'#ffffff'
        },
        //background: ''
    }
};
function setConfig(newConfig) {
    Object.assign(config, newConfig);
}
