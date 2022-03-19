// Código por Lucio Persano :D

const key = '0ba8533cea705c5c9b088985fc09b6b0';

let prueba = '';
let textElement = document.getElementById('container');

var librosES = ['Génesis', 'Éxodo', 'Levíticos', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías', 'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis']
var librosEN = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy','Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']
var bibleInfo;
var popups;

let app = document.getElementById('app');
let container = document.getElementById('container')
let body = document.getElementById('body');
let newBtn = document.getElementById('newBtn');
let okBtn = document.getElementById('okBtn');
let tutorialBtn = document.querySelector('.btn#tutorialBtn');

let icons = document.getElementsByClassName('material-icons');

let bookInput = document.getElementsByClassName('bookInput');
let chapterInput = document.getElementsByClassName('chapterInput');
let verseInput = document.getElementsByClassName('verseInput');
let versionInput = document.getElementsByClassName('versionInput');
let variosInput = document.getElementsByClassName('variosInput');
let inputsGroups = document.getElementsByClassName('inputs');

var solicitudes = 0;
var solicitudesExitosas = 0;
let amount = inputsGroups.length;
let copy = '';
var loadingIconAnimation;
var loadingSpinnerHTMLCode = '<div class="loading-spinner"></div>'

let okPopup = `
    <div class="okPopup popup" id="okPopup">
        <div class="popupContainer" id="popupContainer">
            <div class="closePopupBtn" onclick="del('okPopup')">
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

bootActions();