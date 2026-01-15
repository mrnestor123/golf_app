

function loadScript(src){
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

// Funcion que traduce al valenciano, utilizada en el TranslationInput
async function translateSALT(text, mode = "spa-cat_valencia") {
    //Traducimos la descripción de castellano a valenciano
    if (!text || !mode)
      return alert("No hay descripción que traducir!!")

    let data = {
      mode: mode,
      data: text
    }
    try {
      let query = await fetch('https://innovacion.gva.es/pai_bus_inno/SALT/SaltService_REST_v2_00/api/translate', {
        method: "POST",
        'headers': {
          'x-api-key': 'eddd4e6820ff6e4d3f033cc0bcd63f45',
          'Content-Type': 'application/json',
          'Authorization': 'Basic c2FsdHVzdTpwd2RwYWkx',
          'aplicacion': 'SALT'
        },
        body: JSON.stringify(data)
      })
      let json = await query.json()
      return json.data
    }
    catch (error) {
      console.error(error)
    }
    return "ERROR AL TRADUCIR"
}

function localize(localized, lang = null) {
    if (!localized) return '';
    if (typeof localized == 'string' || typeof localized == 'number') return localized
    if (typeof localized != 'object') return 'ERR translation:'+typeof localized; //???
    if (Object.entries(localized).length === 0) return  '';  //???

    if (lang===null && Page && Page.lang) lang=Page.lang

    if (lang === 'va' && !localized[lang]) lang = 'ca'; // va === ca
    else if (lang === 'ca' && !localized[lang]) lang = 'va'; // va === ca

    var resp = localized[lang] || localized['und'] || Object.values(localized)[0] || '';

    if (typeof resp === 'string') return resp;
    return 'ERR translation';
}

export { loadScript, translateSALT, localize }
