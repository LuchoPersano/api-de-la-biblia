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
    for(let i = 0; i < librosES.length; i++){
        ENBookString = ENBookString.replaceAll(librosES[i], librosEN[i]);
    }
    return ENBookString
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