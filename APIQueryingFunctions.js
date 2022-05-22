function getBibleInfo(version){
    let url = 'bibles-info/' + version + '.json';
    console.log('Cargando información de la biblia...')
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Información de la biblia obtenida con éxito :D')
            bibleInfo = data;
        })
        .catch(err => console.error(err))
}

function doNextReq(){
    let bookv = changeBookToEnglish(bookInput[solicitudes].value);
    let chapterv = chapterInput[solicitudes].value;
    let versev = verseInput[solicitudes].value;
    let versionv = versionInput[solicitudes].value;
    let url = `https://api.biblia.com/v1/bible/content/${versionv}.txt.json?passage=${bookv}${chapterv}.${versev}&eachVerse=[VerseNum]+[VerseText]{{{tab}}}[FullVerseRef]{{{{salto}}}&paragraphs=false&key=${key}`;

    if(versev === 'todos'){
        getTheWholeChapter(bookv, chapterv, versionv)
        return
    } 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var salto = 0;
            var saltos = []
            while(salto >= 0){
                if(salto != 0){
                    saltos.push(salto);
                }
                salto = data.text.indexOf('{{{salto}}}', salto + 1);
            }
            var textConSaltos = data.text.replaceAll('{{{{salto}}}', saltodelinea).replaceAll('{{{tab}}}', tab);
            copy += textConSaltos + saltodelinea;
            solicitudes++;
            solicitudesExitosas++;
            if(solicitudes < amount){
                doNextReq();
            }
        })
        .catch(err => {
            console.error(err);
            solicitudes++;
            if(solicitudes < amount){
                doNextReq();
            }
        })
}

let hasFinished = false;
let actualVerse = 1;

function getTheWholeChapter(book, chapter, version){
    getNextVerse()
    function getNextVerse(){
        let actualUrl = `https://api.biblia.com/v1/bible/content/${version}.txt.json?passage=${book}${chapter}.${actualVerse}&eachVerse=[VerseNum]+[VerseText]{{{tab}}}[FullVerseRef]{{{{salto}}}&paragraphs=false&key=${key}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var salto = 0;
                var saltos = []
                while(salto >= 0){
                    if(salto != 0){
                        saltos.push(salto);
                    }
                    salto = data.text.indexOf('{{{salto}}}', salto + 1);
                }
                var textConSaltos = data.text.replaceAll('{{{{salto}}}', saltodelinea).replaceAll('{{{tab}}}', tab);
                copy += textConSaltos;
                
            })
    }
    if(hasFinished){

    }
}

function checkNextVerse(version, book, chapter, verse, inputsGroupNumber){
    console.log(toCheckVerse)
    let url = `https://api.biblia.com/v1/bible/content/${version}.txt.json?passage=${book}${chapter}.${verse}&key=${key}`
    fetch(url)
        .then(res => {
            if(res.status === 200){
                toCheckVerse++;
                checkNextVerse(version, book, chapter, toCheckVerse, inputsGroupNumber)
            } else if(res.status === 404){
                toCheckVerse--;
                updateVersesDatalist(inputsGroupNumber, toCheckVerse)
            }
        })
}