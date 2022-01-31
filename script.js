const key = '0ba8533cea705c5c9b088985fc09b6b0';
const url = 'https://api.biblia.com/v1/bible/content/RVR60.txt.json?passage=John3.16&key=' + key;
let prueba = '';
let textElement = document.getElementById('texto');

const resp = fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log(data.text)
        textElement.innerHTML = data.text
    })
    .catch(err => console.log('Error: ' + err))