//ajoute un descripteur au triplestore ! facebook YEP
function addDescriptor(labelConcept, labelTag, uriTag, others) {
    $.ajax({
	url: '/jeu/add_tag',
	type: 'POST',
	data: {
	    label_concept: labelConcept,
	    label_tag: labelTag,
	    uri_tag: uriTag,
	    others: others
	},
	cache: false,
	dataType: 'json',
	success: function(result){
	},
	error: function(error){
	}
    });
}

//récupère tout les descripteurs d'un concept, par count décroissant ! stats YEP
function getDescriptors(json) {

}

//récupère les 20 concepts du triplestore ! facebook YEP
function getConcepts(json) {
    var tab = [];
    for(var i=0; i < json.length; ++i) {
	tab[i] = json[i]['label'];
    }
    return tab;
}

