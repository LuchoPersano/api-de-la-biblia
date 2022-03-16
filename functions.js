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

    <!-- BOTÓN PARA ELIMINAR GRUPO DE INPUTS -->
    <div class="delInputs ${existing}" id="delInputs${existing}" onclick="del('inputs${existing}')">
        <span class="material-icons">close</span>
    </div>

    <!-- INPUTS -->
    <input name="book" type="text" placeholder="Libro" id="bookInput${existing}" class="bookInput ${existing}" list="booksDataList" onchange="getAvailableChapters('inputs${existing}')">
    <input name="Chapter" type="text" placeholder="Cap" id="chapterInput${existing}" class="chapterInput ${existing}" list="chaptersDatalist${existing}">
    <input name="Verse" type="text" placeholder="Vers" id="verseInput${existing}" class="verseInput ${existing}" list="versesDatalist${existing}">
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
    console.log('Se ha hecho click en OK');

    // Agrega el popup de que está cargando en la pantalla
    var loadingPopup = popUp('loadingPopUp', 'rgb(97, 97, 97)', 'fas fa-ellipsis-h', 'Cargando...', '17px', false)
    app.insertAdjacentHTML('afterbegin', loadingPopup);
    var icon = document.getElementById('popupIcon');
    setTimeout(() => {
        icon.style.opacity = '0';
    }, 100);
    loadingIconAnimation = setInterval(() => {
        if(icon.style.opacity == '1'){
            icon.style.opacity = '0';
        } else{
            icon.style.opacity = '1';
        }
    }, 1000);

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
            var existingPopups = document.getElementsByClassName('popup');
            var existingPopup = existingPopups[0];
            var existingPopupParent = existingPopup.parentNode;

            var errPopupCode = popUp('requestErrorPopUp', '#f44', 'fas fa-exclamation', 'Error', '18px', true);
            existingPopupParent.removeChild(existingPopup);
            app.insertAdjacentHTML('afterbegin', errPopupCode)
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
        app.removeChild(document.getElementsByClassName('popup')[0]);
        clearInterval(loadingIconAnimation);
        app.insertAdjacentHTML('afterbegin', okPopUp);

        // Reinicia las variables para la próxima petición
        solicitudes = 0;
        solicitudesExitosas = 0;
        copy = '';
    })
    .catch(err => {
        console.log(err);

        // Abrir popup de error
        var existingPopups = document.getElementsByClassName('popup');
        var existingPopup = existingPopups[0];
        var existingPopupParent = existingPopup.parentNode;
        var errPopupCode = popUp('requestErrorPopUp', '#f44', 'fas fa-exclamation', 'Error', '18px', true, 'Se ha hecho click fuera de la página durante el proceso', '12px', true);
        existingPopupParent.removeChild(existingPopup);
        app.insertAdjacentHTML('afterbegin', errPopupCode);

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
    let url = 'https://api.biblia.com/v1/bible/contents/' + version + '?key=' + key;
    console.log('Cargando información de la biblia...')
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Información de la biblia obtenida on éxito :D')
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

            var tab = '	';
            var saltodelinea = `
`;
            var textConSaltos = data.text;
            for(j = 0; j < saltos.length; j++){
                textConSaltos = textConSaltos.replace('{{{{salto}}}', saltodelinea);
                textConSaltos = textConSaltos.replace('{{{tab}}}', tab);
            }

            console.log(textConSaltos);
            copy += textConSaltos;
            copy += saltodelinea;
            console.log('Loq que se va a copiar:')
            console.log(copy);
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

function onload(elementId) {
    document.getElementById(elementId).style.opacity = '1';
}

function popUp(id, color, iconClass, text, fontSize, closeBtn, body, bodyFontSize, retryBtn){
    var toReturn = `
        <div class="${id} popup" id="${id}">
            <div class="pContainer" id="pContainer" style="background: ${color};">
                <div class="closePopupBtn" onclick="del('${id}')"><i class="fas fa-times"></i></div>
                <div class="popupIcon" id="popupIcon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="popupTextContainer" id="popupTextContainer">
                    <p class="popupText" id="popupText" style="font-size: ${fontSize};">${text}</p>
                    <p class="popupBody" id="popupBody" style="font-size: ${ bodyFontSize };">${ body }</p>
                </div>
            </div>
        </div>
    `
    closeBtnCode = `<div class="closePopupBtn" onclick="del('${id}')"><i class="fas fa-times"></i></div>`
    bodyCode = `<p class="popupBody" id="popupBody" style="font-size: ${ bodyFontSize };">${ body }</p>`
    if(closeBtn == false){
        toReturn = toReturn.replace(closeBtnCode, '');
    }
    if(retryBtn === true){
        toReturn = toReturn.replace(`<p class="popupBody" id="popupBody" style="font-size: ${ bodyFontSize };">${ body }</p>
                </div>`, `<p class="popupBody" id="popupBody" style="font-size: ${ bodyFontSize };">${ body }</p>
                </div>
        <div class="retryBtnContainer" id="retryBtnContainer">
            <div class="retryBtn" id="retryBtn" onclick="copiar()">
                <p class="retryBtnText" id="retryBtnText">Reintentar</p>
            </div>
        </div>
        `)
    }
    if(body == undefined){
        toReturn = toReturn.replace(bodyCode, '')
    }

    return toReturn
}

function del(id){
    if(id.indexOf('inputs') > -1 && inputsGroups.length <= 1){
        var htmlCode = popUp('errorPopUp', '#f44', 'fas fa-exclamation', 'No se pueden eliminar todos los elementos!', '12px', true);
        app.insertAdjacentHTML("afterbegin", htmlCode);
        return
    }

    var element = document.getElementById(id);
    var padre = element.parentNode;
    padre.removeChild(element);

    if(id.indexOf('inputs') > -1){
        var amount = inputsGroups.length;
        for(var i = 0; i < amount; i++){
            inputsGroups[i].className = 'inputs ' + i;
            inputsGroups[i].id = 'inputs' + i;
            bookInput[i].className = 'bookInput ' + i;
            bookInput[i].id = 'bookInput' + i;
            chapterInput[i].className = 'chapterInput ' + i;
            chapterInput[i].id = 'chapterInput' + i;
            verseInput[i].className = 'verseInput ' + i;
            verseInput[i].id = 'verseInput' + i;
            versionInput[i].className = 'versionInput ' + i;
            versionInput[i].id = 'versionInput' + i;
        }
    }

    if(id == 'okPopUp'){
        let amount = inputsGroups.length;
        for(i = amount; i > 1; i--){
            app.removeChild(inputsGroups[i-1]) 
        } //Elimina los inputs groups hasta que queda uno solo
        bookInput[0].value = '';
        chapterInput[0].value = '';
        verseInput[0].value = '';
        versionInput[0].value = 'RVR60';
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
        if(isABook === false) return

        let englishActualBook = changeBookToEnglish(actualBook)
        let actualBookNumber = getBookNumber(englishActualBook);
        let availableChapters = bibleInfo.books[actualBookNumber].chapters;
        updateChaptersDatalist(actualInputsGroupNumber, availableChapters.length)
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
    // iniciar animación de carga
    document.querySelector('.charging-animation').style.display = 'block'
    let deg = 0;
    setTimeout(() => {
        deg = deg + 360;
        document.querySelector('.charging-animation').style.transform = 'rotate(' + deg + 'deg)'
    }, 1);
    let chargingIconAnimation = setInterval(() => {
        deg = deg + 360;
        document.querySelector('.charging-animation').style.transform = 'rotate(' + deg + 'deg)'
    }, 1000);

    // realizar petición al servidor del tutorial
    fetch('tutorial.html')
        .then(response => {
            return response.text()
        })
        .then(data => {
            // finalizar animación de carga
            clearInterval(chargingIconAnimation)
            deg = 0;
            document.querySelector('.charging-animation').style.display = 'none';
            document.querySelector('.charging-animation').style.transform = 'rotate(' + deg + 'deg)'

            // agregar tutorial al documento
            container.insertAdjacentHTML('beforeend', data)
            setTimeout(() => {
                document.querySelector('.tutorial').style.opacity = '1';
            }, 10);

            // desabilitar el botón de tutorial
            tutorialBtn.removeAttribute('onclick')
            tutorialBtn.setAttribute('disabled', '')
        })
}