// Código por Lucio Persano :D

const key = '0ba8533cea705c5c9b088985fc09b6b0';

let prueba = '';
let textElement = document.getElementById('container');

var librosES = ['Génesis', 'Éxodo', 'Levíticos', 'Números', 'Deutronomio', 'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías', 'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis']
var librosEN = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy','Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']

let app = document.getElementById('app');
let body = document.getElementById('body');
let newBtn = document.getElementById('newBtn');
let okBtn = document.getElementById('okBtn');

let bookInput = document.getElementsByClassName('bookInput');
let chapterInput = document.getElementsByClassName('chapterInput');
let verseInput = document.getElementsByClassName('verseInput');
let versionInput = document.getElementsByClassName('versionInput');
let variosInput = document.getElementsByClassName('variosInput');
let inputsGroups = document.getElementsByClassName('inputs');

let okPopUp = `
    <div class="okPopUp" id="okPopUp">
        <div class="pContainer" id="pContainer">
            <div class="closePopupBtn" onclick="del('okPopUp')">
                <i class="fas fa-times"></i>
            </div>
            <div class="popupIcon" id="popupIcon">
                <i class="far fa-check-circle"></i>
            </div>
            <div class="popupTextContainer" id="popupTextContainer">
                <p class="popupText" id="popupText">Copiado</p>
            </div>
        </div>
    </div>
`;
let loadingPopUp = `
    <div class="loadingPopUp" id="loadingPopUp">
        <div class="loadingPopupContainer" id="pContainer">
            <div class="popupIcon" id="popupIcon">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            <div class="popupTextContainer" id="popupTextContainer">
                <p class="popupText" id="popupText">Cargando...</p>
            </div>
        </div>
    </div>
`;

function newIn(){
    console.log('Agregando nuevo grupo de inputs...')
    let existing = inputsGroups.length;
    let lastOne = inputsGroups[existing-1];
    console.log('La cantidad de grupos existentes es ' + existing + ' y el último es este:');
    console.log(lastOne);
    console.log('con valor actual de ' + bookInput[existing-1].value + ' ' + chapterInput[existing-1].value + ':' + verseInput[existing-1].value + ' ' + versionInput[existing-1].value);
    let html = `
    <div class="inputs ${existing}" id="inputs${existing}">
        <select name="book" id="bookInput${existing}" class="bookInput ${existing}">
            <option value="" disabled>|Antiguo Testamento|</option>
            <option value="Genesis">Génesis</option>
            <option value="Exodus">Éxodo</option>
            <option value="Leviticus">Levíticos</option>
            <option value="Numbers">Números</option>
            <option value="Deutronomy">Deutronomio</option>
            <option value="Joshua">Josué</option>
            <option value="Judges">Jueces</option>
            <option value="Ruth">Rut</option>
            <option value="1Samuel">1 Samuel</option>
            <option value="2Samuel">2 Samuel</option>
            <option value="1Kings">1 Reyes</option>
            <option value="2Kings">2 Reyes</option>
            <option value="1Chronicles">1 Crónicas</option>
            <option value="2Chronicles">2 Crónicas</option>
            <option value="Ezra">Esdras</option>
            <option value="Nehemiah">Nehemías</option>
            <option value="Esther">Ester</option>
            <option value="Job">Job</option>
            <option value="Psalms">Salmos</option>
            <option value="Proverbs">Proverbios</option>
            <option value="Ecclesiastes">Eclesiastés</option>
            <option value="Song">Cantares</option>
            <option value="Isaiah">Isaías</option>
            <option value="Jeremiah">Jeremías</option>
            <option value="Lamentations">Lamentaciones</option>
            <option value="Ezekiel">Ezequiel</option>
            <option value="Daniel">Daniel</option>
            <option value="Hosea">Oseas</option>
            <option value="Joel">Joel</option>
            <option value="Amos">Amós</option>
            <option value="Obadiah">Abdías</option>
            <option value="Jonah">Jonás</option>
            <option value="Micah">Miqueas</option>
            <option value="Nahum">Nahum</option>
            <option value="Habakkuk">Habacuc</option>
            <option value="Zephaniah">Sofonías</option>
            <option value="Hagai">Hageo</option>
            <option value="Zechariah">Zacarías</option>
            <option value="Malachi">Malaquías</option>
            <option value="" disabled></option>
            <option value="" disabled>|Nuevo Testamento|</option>
            <option value="Matthew">Mateo</option>
            <option value="Mark">Marcos</option>
            <option value="Luke">Lucas</option>
            <option value="John">Juan</option>
            <option value="Acts">Hechos</option>
            <option value="Romans">Romanos</option>
            <option value="1Corinthians">1 Corintios</option>
            <option value="2Corinthians">2 Corintios</option>
            <option value="Galatians">Gálatas</option>
            <option value="Ephesians">Efesios</option>
            <option value="Philippians">Filipenses</option>
            <option value="Colossians">Colosenses</option>
            <option value="1Thessalonians">1 Tesalonicenses</option>
            <option value="2Thessalonians">2 Tesalonicenses</option>
            <option value="1Timothy">1 Timoteo</option>
            <option value="2Timothy">2 Timoteo</option>
            <option value="Titus">Tito</option>
            <option value="Philemon">Filemón</option>
            <option value="Hebrews">Hebreos</option>
            <option value="James">Santiago</option>
            <option value="1Peter">1 Pedro</option>
            <option value="2Peter">2 Pedro</option>
            <option value="1John">1 Juan</option>
            <option value="2John">2 Juan</option>
            <option value="3John">3 Juan</option>
            <option value="Jude">Judas</option>
            <option value="Revelation">Apocalipsis</option>
        </select>
        <input name="Chapter" type="text" value="1" placeholder="Cap" id="chapterInput${existing}" class="chapterInput ${existing}">
        <input name="Verse" type="text" value="1" placeholder="Vers" class="verseInput ${existing}" id="verseInput${existing}">
        <select name="version" class="versionInput 0" id="versionInput${existing}">
            <option value="RVR60">Reina Valera 1960</option>
            <option value="TLA" disabled>TLA</option>
        </select>
        <!--<input name="varios" type="checkbox" class="variosInput ${existing}" id="variosInput${existing}">-->
    </div>
    `;
    lastOne.insertAdjacentHTML('afterend', html);
    console.log('Se agregó un nuevo grupo de inputs:');
    console.log(inputsGroups[existing]);
    console.log('');
}

function okIn(){
    var solicitudes = 0;
    var solicitudesExitosas = 0;
    let amount = inputsGroups.length;
    let copy = '';
    console.log('Se ha hecho click en OK');

    app.insertAdjacentHTML('afterbegin', loadingPopUp);
    var icon = document.getElementById('popupIcon');
    icon.style.opacity = '0';
    var loadingIconAnimation = setInterval(() => {
        if(icon.style.opacity == '1'){
            icon.style.opacity = '0';
        } else{
            icon.style.opacity = '1';
        }
    }, 1000);

    for(i = 0; i < amount; i++){
        let bookv = bookInput[i].value;
        let chapterv = chapterInput[i].value;
        let versev = verseInput[i].value;
        let versionv = versionInput[i].value;
        let url = `https://api.biblia.com/v1/bible/content/${versionv}.txt.json?passage=${bookv}${chapterv}.${versev}&eachVerse=[VerseNum]+[VerseText]{{{tab}}}[FullVerseRef]{{{{salto}}}&paragraphs=false&key=${key}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data.text);
                
                var tocopy = '';

                var salto = 0;
                var saltos = []
                
                while(salto >= 0){
                    if(salto != 0){
                        saltos.push(salto);
                    }
                    salto = data.text.indexOf('{{{salto}}}', salto + 1);
                    console.log(salto);
                }
                console.log(saltos);

                var tab = '	';
                var saltodelinea = `
`;
                var textConSaltos = data.text;

                for(i = 0; i < saltos.length; i++){
                    textConSaltos = textConSaltos.replace('{{{{salto}}}', saltodelinea);
                    textConSaltos = textConSaltos.replace('{{{tab}}}', tab);
                }

                console.log(textConSaltos);
                copy += textConSaltos;
                copy += `
`;
                console.log('Loq que se va a copiar:')
                console.log(copy);

                solicitudes++;
                solicitudesExitosas++;
                console.log('solicitudes exitosas: ' + solicitudesExitosas);
            })
            .catch(err => {
                solicitudes++;
                console.log('Error:')
                console.log(err);
            });
    }

    var intervalID = setInterval(() => {
        if(solicitudes == amount){
            setTimeout(() => {
                for(i = 0; i < 66; i++){
                    copy = copy.replaceAll(librosEN[i], librosES[i]); //Cambia la cita de inglés a Español
                }

                navigator.clipboard.writeText(copy)
                .then(() => {
                    console.log('copiado');
                    app.removeChild(document.getElementById('loadingPopUp'));
                    clearInterval(loadingIconAnimation);
                    app.insertAdjacentHTML('afterbegin', okPopUp);
                })
                .catch(err => {
                    console.log(err);
                })
            }, 1000);
            clearInterval(intervalID);
        }
    }, 500);

    // let copy = `hola	hola
    // que tal	todo bien?`;
    // navigator.clipboard.writeText(copy)
    //     .then(() => {
    //         console.log('copiado');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
}

function onload(elementId) {
    document.getElementById(elementId).style.opacity = '1';
}

function del(id){
    var element = document.getElementById(id);
    var padre = element.parentNode;
    padre.removeChild(element);

    if(id == 'okPopUp'){
        let amount = inputsGroups.length;
        for(i = amount; i > 1; i--){
            app.removeChild(inputsGroups[i-1]) 
        } //Elimina los inputs groups hasta que queda uno solo
    }
}