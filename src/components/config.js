
// fichero de configuración ??
// idea para configurar diferentes estilos? de momento no se añade !!

export { config, setConfig }

let config = {

    primaryColor: '', // to do !!
    secondaryColor: '',
    accentColor: '',
    background: '#f5f5f5',

    fontFamily: 'Poppins, Karla, Raleway, Lato, sans-serif',

    fonts: {
        h1: {
            fontSize:'2.5rem',
            lineHeight:'2.25',
            marginTop: 0,
            marginBottom:0,
        },
        h2: {
            fontSize: '1.5rem',
            lineHeight:'1.5',
            marginBottom:0,
        },
        h3: {
            marginTop: 0,
            marginBottom: 0,
            
        },
        h4: {
            marginTop: 0,
            marginBottom: 0,
        },
        default: {
            fontSize: '1rem',
            lineHeight: '1.21428571em',
            margin: 0
        },
        small: {
            fontSize: "0.875rem",
            lineHeight: "1rem",
            margin: 0
        },
    },
    
    form: {
        baseStyle: {
            fontSize: '1rem', // es la misma fontSize que default !! mantener ratio!!
            lineHeight: '1.21428571em',
            background: '#fff',
            padding: '.67857143rem 1rem',
            borderRadius: '.28571429rem',
            border: '1px solid #ccc',
            borderColor:'#ccc',
            color: 'rgba(0, 0, 0, .87)',
            outline:'none',
            resize: "vertical"
        },
        focusStyle: {
            outline: '-webkit-focus-ring-color auto 1px',
            boxShadow: '0 0 0 0 transparent inset, 0 0 0 0 transparent',
        },
        formLabel: {
            fontSize: '1em', // misma fontSize que default !! Mantener ratio!!
            lineHeight: '1.21428571em',
            fontWeight:'normal',
            display: 'block',
            color: 'black',
            marginBottom: '0.2em',
            whiteSpace: 'normal',
        }
    },

    elements: {
        segment: {

        },
        button: {
            // primary : {
            //     background: '#e8def8'
            // }        
        }

    },

    
    
    app: {
        appBar: {
            //background:'#ffffff'
        },
        //background: ''
        
    }



}

function setConfig(newConfig) {

    console.log('newConfig', newConfig)

    mergeDeep(config, newConfig)

    console.log('config', config)


    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    function mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
            }
        }

        return mergeDeep(target, ...sources);
    }

    
}