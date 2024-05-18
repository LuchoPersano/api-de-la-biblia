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
        <div class="inputs-container">
            <input name="book" type="text" placeholder="Libro" id="bookInput${existing}" class="bookInput ${existing}" list="booksDataList" autocomplete="off" onchange="getAvailableChapters('inputs${existing}')">
            <div class="renglon2">
                <input name="Chapter" type="text" placeholder="Capítulo" id="chapterInput${existing}" class="chapterInput ${existing}" list="chaptersDatalist${existing}" autocomplete="off" onchange="getAvailableVerses(this)">
                <input name="Verse" type="text" placeholder="Versículo/s" id="verseInput${existing}" class="verseInput ${existing}" list="versesDatalist${existing}" autocomplete="off">
                <select name="version" class="versionInput ${existing}" id="versionInput${existing}">
                    <option value="RVR60">Reina Valera 1960</option>
                </select>
            </div>
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