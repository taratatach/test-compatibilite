//Variables
var listConcepts = [];
var cpt = 0;
var uriConcept = "uri";

//fin chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    Init();

    //click ok
    document.querySelector('#form-suivant').onsubmit = function (e) {
        e.preventDefault();
        if (cpt >= listConcepts.length) {
            finJeu();
            document.location.href='fin.html';
        }
        else {
            changerConcept();
        }
    };
});

function finJeu() {

}
//A chaque nouveau concept
function changerConcept() {
    var label = document.querySelector('#myTextfield').value != "" ? document.querySelector('#myTextfield').value : "Chose";
    var uri = getUriFromName(label);
    var others = document.getElementById('myCheck').checked;
    addDescriptor(listConcepts[cpt], label, uri, others);
    document.querySelector('#theword').textContent = listConcepts[cpt];
    cpt++;
    document.getElementById('myCheck').checked = false;
    document.getElementById('myTextfield').value = "";
    ResetCompteur();
}

function getUriFromName(name) {
    var options = document.getElementsByTagName('option');
    for(var i=0; i<options.length; ++i)
	if (options[i].value == name)
	    return options[i].dataset.uri;
    return '';	    
}

//initialisation
function Init()	{
    $.get("/jeu/get_concepts.json",function(json){
	listConcepts = getConcepts(json);
	document.querySelector('#theword').textContent = listConcepts[cpt];
	InitCompteRebours();
    });
}

//Compte à rebours
var tempsMax = 30;
var tempsRestant = tempsMax;
var x;

function InitCompteRebours()	{
    window.document.getElementById('compteur').innerHTML=tempsRestant;
    x = window.setInterval('Decompte()', 1000);
}

function Decompte()	{
    if (tempsRestant > 0) {
        window.document.getElementById('compteur').innerHTML = --tempsRestant;
    }
    else {
        if (cpt >= listConcepts.length) {
            document.location.href='/jeu/fin';
        }
        else {
            changerConcept();
        }
    }
}

function ResetCompteur()	{
    tempsRestant = tempsMax;
    window.clearInterval(x);
    InitCompteRebours();
}
