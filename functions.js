function newIn(){
    console.log('Agregando nuevo grupo de inputs...')
    let existing = inputsGroups.length;
    let lastOne = inputsGroups[existing-1];
    console.log('La cantidad de grupos existentes es ' + existing + ' y el último es este:');
    console.log(lastOne);
    console.log('con valor actual de ' + bookInput[existing-1].value + ' ' + chapterInput[existing-1].value + ':' + verseInput[existing-1].value + ' ' + versionInput[existing-1].value);
    let html = `
    <div class="inputs ${existing}" id="inputs${existing}">
    <datalist id="chaptersDatalist${existing}"></datalist>
    <datalist id="versesDatalist${existing}"></datalist>

    <!-- BOTÓN PARA ELIMINAR GRUPO DE INPUTS -->
    <div class="delInputs ${existing}" id="delInputs${existing}" onclick="del('inputs${existing}')">
        <span class="material-icons">close</span>
    </div>

    <!-- INPUTS -->
    <input name="book" type="text" placeholder="Libro" id="bookInput${existing}" class="bookInput ${existing}" list="booksDataList" onchange="getAvailableChapters('inputs${existing}')">
    <input name="Chapter" type="text" placeholder="Capítulo" id="chapterInput${existing}" class="chapterInput ${existing}" list="chaptersDatalist${existing}">
    <input name="Verse" type="text" placeholder="Versículo/s" id="verseInput${existing}" class="verseInput ${existing}" list="versesDatalist${existing}">
    <select name="version" class="versionInput ${existing}" id="versionInput${existing}">
        <option value="RVR60">Reina Valera 1960</option>
    </select>
    </div>
    `;
    lastOne.insertAdjacentHTML('afterend', html);
    console.log('Se agregó un nuevo grupo de inputs:');
    console.log(inputsGroups[existing]);
    console.log('');
}

function okIn(){
    amount = inputsGroups.length;
    insertPopup(popups.popupsArray.find(popup => popup.name == 'cargando').html);
    doNextReq();
    var intervalID = setInterval(() => {
        if(solicitudesExitosas === amount){
            setTimeout(() => {
                for(i = 0; i < 66; i++){
                    copy = copy.replaceAll(librosEN[i], librosES[i]); //Cambia la cita de inglés a Español
                }
                copiar();
            }, 1000);
            clearInterval(intervalID);
        } else if(solicitudes === amount){
            removeExistingPopups()
            insertPopup(popups.popupsArray.find(popup => popup.name == 'error').html)
            clearInterval(intervalID);
            // Reinicia las variables para la próxima petición
            solicitudes = 0;
            solicitudesExitosas = 0;
            copy = '';
        }
    }, 500);
}

function copiar(){
    navigator.clipboard.writeText(copy)
    .then(() => {
        console.log('copiado');
        removeExistingPopups()
        insertPopup(popups.popupsArray.find(e => e.name == 'copiado').html)

        // Reinicia las variables para la próxima petición
        solicitudes = 0;
        solicitudesExitosas = 0;
        copy = '';
    })
    .catch(err => {
        console.log(err);

        // Abrir popup de error
        removeExistingPopups()
        insertPopup(popups.popupsArray.find(e => e.name == 'copying error').html)

        solicitudes = 0;
        solicitudesExitosas = 0;
    })
}

function changeBookToEnglish(ESBookString){
    let ENBookString = ESBookString
    // librosES.forEach(element => {
    //     ENBookString
    // });
    for(let i = 0; i < librosES.length; i++){
        ENBookString = ENBookString.replaceAll(librosES[i], librosEN[i]);
    }
    return ENBookString
}

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

function onload(elementId) {
    document.getElementById(elementId).style.opacity = '1';
}

function del(id){
    if(id.indexOf('inputs') > -1 && inputsGroups.length <= 1) return

    var element = document.getElementById(id);
    var padre = element.parentNode;
    padre.removeChild(element);

    // Corrige la enumeración de los grupos de inputs despues de la eliminación de uno de ellos
    if(id.indexOf('inputs') > -1){
        var amount = inputsGroups.length;
        for(var i = 0; i < amount; i++){
            inputsGroups[i].className = 'inputs ' + i;
            inputsGroups[i].id = 'inputs' + i;
            bookInput[i].className = 'bookInput ' + i;
            bookInput[i].id = 'bookInput' + i;
            bookInput[i].setAttribute('onchange', 'getAvailableChapters(\'inputs' + i + '\')');
            chapterInput[i].className = 'chapterInput ' + i;
            chapterInput[i].id = 'chapterInput' + i;
            chapterInput[i].setAttribute('list', 'chaptersDatalist' + i)
            verseInput[i].className = 'verseInput ' + i;
            verseInput[i].id = 'verseInput' + i;
            versionInput[i].className = 'versionInput ' + i;
            versionInput[i].id = 'versionInput' + i;
            document.querySelector('#' + inputsGroups[i].id + ' > datalist').id = 'chaptersDatalist' + i;
            document.querySelector('#' + inputsGroups[i].id + ' > div.delInputs').id = 'delInputs' + i;
            document.querySelector('#' + inputsGroups[i].id + ' > div.delInputs').className = 'delInputs ' + i;
            document.querySelector('#' + inputsGroups[i].id + ' > div.delInputs').setAttribute('onclick', 'del(\'inputs' + i + '\')');
        }
    }
}

function isItABook(lan, book){
    console.log(book)
    if(lan === 'es'){
        for(let i = 0; i < librosES.length; i++){
            if (librosES[i] === book) {
                return true
            }
        }
        return false
    } else if(lan === 'en'){
        for(let i = 0; i < librosEN.length; i++){
            if (librosEN[i] === book) {
                return true
            }
        }
        return false
    }
}

function getAvailableChapters(actualInputsGroup){
    if(bibleInfo === undefined){
        setTimeout(() => {
            getAvailableChapters(actualInputsGroup);
        }, 500)
        return
    } else {
        let actualInputsGroupNumber = parseInt(actualInputsGroup.substring(6))
        let actualBook = bookInput[actualInputsGroupNumber].value
        let isABook = isItABook('es', actualBook)
        console.log(isABook);
        if(isABook === false) {
            updateChaptersDatalist(actualInputsGroupNumber, 0)
            return
        }

        let englishActualBook = changeBookToEnglish(actualBook)
        let actualBookNumber = getBookNumber(englishActualBook);
        let availableChapters = bibleInfo.books[actualBookNumber].chapters;
        updateChaptersDatalist(actualInputsGroupNumber, availableChapters.length)
    }
}

function getAvailableVerses(actualInputsGroup){
    let actualInputsGroupNumber = actualInputsGroup.classList[1]
    let actualBook = bookInput[actualInputsGroupNumber].value
    let actualChapter = Number(chapterInput[actualInputsGroupNumber].value)
    let actualVersion = versionInput[actualInputsGroupNumber].value
    let isABook = isItABook('es', actualBook)
    if(isABook === false) return

    toCheckVerse = 1;
    checkNextVerse(actualVersion, actualBook, actualChapter, toCheckVerse, actualInputsGroupNumber);
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

function updateVersesDatalist(inputsGroupNumber, verses){
    let datalist = document.querySelector('#versesDatalist' + inputsGroupNumber)
    datalist.innerHTML = '';
    for(let i = 1; i <= verses; i++){
        datalist.insertAdjacentHTML('beforeend', `<option>${i}</option>`)
    }
}

function updateChaptersDatalist(inputGroupsNumber, chapters){
    let datalist = document.querySelector('#chaptersDatalist' + inputGroupsNumber)
    datalist.innerHTML = '';
    for(let i = 0; i < chapters; i++){
        datalist.insertAdjacentHTML('beforeend', `<option>${ i + 1 }</option>`)
    }
}

function getBookNumber(bookString){
    for(let i = 0; i < 66; i++){
        if(bookString === librosEN[i]) {
            return i
        }
    }
}

function openTutorial() {
    // agregar spinner de carga
    container.insertAdjacentHTML('beforeend', loadingSpinnerHTMLCode)
    let loadingSpinner = document.querySelector('.container#container > .loading-spinner');

    // Desabilitar el boton de tutorial
    tutorialBtn.toggleAttribute('disabled');
    
    // realizar petición al servidor del tutorial
    fetch('tutorial.html')
        .then(response => {
            return response.text()
        })
        .then(data => {
            loadingSpinner.remove(); // eliminar spinner de carga
            container.insertAdjacentHTML('beforeend', data); // agregar tutorial al documento
            setTimeout(() => {
                document.querySelector('.tutorial').style.opacity = '1';
                tutorialBtn.removeEventListener('click', openTutorial);
                tutorialBtn.addEventListener('click', closeTutorial);
                tutorialBtn.toggleAttribute('disabled');
                tutorialBtn.querySelector('p > i.fas').classList.remove('fa-question')
                tutorialBtn.querySelector('p > i.fas').classList.add('fa-times')
                tutorialBtn.classList.add('big');
                setTimeout(() => {
                    tutorialBtn.classList.add('finish');
                }, 500)
            }, 10);
        })
}

function closeTutorial(){
    setTimeout(() => {
        document.querySelector('.tutorial').style.opacity = '0';
        tutorialBtn.querySelector('p > i.fas').classList.remove('fa-times')
        tutorialBtn.querySelector('p > i.fas').classList.add('fa-question')
        tutorialBtn.classList.remove('big');
        tutorialBtn.classList.remove('finish');
        setTimeout(() => {
            tutorialBtn.removeEventListener('click', closeTutorial);
            tutorialBtn.addEventListener('click', openTutorial);
            document.querySelector('.tutorial').remove();
        }, 1000)
    }, 10)
}

function getPopups(){
    console.log('Cargando popups...')
    fetch('popups/popups.json')
        .then(response => response.json())
        .then(data => {
            console.log('>>>Popups obtenidos correctamente')
            popups = data;
        })
        .catch(err => {
            console.error('>>>Error cargando popups. Reintentando...')
            retry(getPopups, 5000)
        })
}

function retry(func, time){
    return setTimeout(() => func(), time)
}

function bootActions(){
    getBibleInfo('RVR60');
    getPopups();
    tutorialBtn.addEventListener('click', openTutorial)
    document.querySelectorAll('.inputs > input').forEach(input => {
        input.addEventListener('keydown', handleKeyDown)
    })
}

function toHTML(stringElement){
    let temp = document.createElement('div');
    temp.innerHTML = stringElement;
    return temp.firstChild
}

function removeExistingPopups(){
    var existingPopups = document.querySelectorAll('.popup');
    if(existingPopups){
        existingPopups.forEach(popup => {
        popup.remove()
    });
    }
}

function insertPopup(popup){
    app.insertAdjacentHTML('afterbegin', popup)
}

function handleKeyDown(){
    console.log(event);
    if(event.key != 'Enter') return
    if(event.ctrlKey){
        newBtn.click()
        inputsGroups[inputsGroups.length - 1].querySelector('.bookInput').focus()
        inputsGroups[inputsGroups.length - 1].querySelectorAll('input').forEach(input => { input.addEventListener('keydown', handleKeyDown) })
    } else if(!event.altKey && !event.shiftKey){
        okBtn.click()
    }
}