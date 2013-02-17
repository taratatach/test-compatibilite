(function () {
    var dataDescripteurs = null;
    var dataPotentiels = null;

    document.addEventListener('DOMContentLoaded', function () {
	var listConcepts = [];
	$.get("/jeu/get_concepts.json",function(json){
	    listConcepts = getConcepts(json);
	    render(listConcepts);
	});
    });

    function render(listConcepts) {
	var strConceptsList = "";
	for (var i=0;i<listConcepts.length;i++) {
            strConceptsList += '<option>'+listConcepts[i]+'</option>';
	}
	document.querySelector('#listConcepts').innerHTML = strConceptsList;

	var listDescripteurs = [];
	$.ajax({
	    url: "/admin/get_tags_infos.json",
	    type: 'GET',
	    data: {
		concept: listConcepts[0]
	    },
	    cache: false,
	    dataType: 'json',
	    success: function(json){
		listDescripteurs = json;
		createTable(listDescripteurs);
		renderGraph(listDescripteurs);
	    },
	    error: function(error){
	    }
	});

	var selectConcept = document.getElementById("listConcepts");
	selectConcept.onchange = function() {
            var conceptChoisi = this.options[this.selectedIndex];
	    $.ajax({
		url: "/admin/get_tags_infos.json",
		type: 'GET',
		data: {
		    concept: conceptChoisi.value
		},
		cache: false,
		dataType: 'json',
		success: function(json){
		    listDescripteurs = json;
	            var selectBlocHtml = document.getElementById("blocStats");
        	    selectBlocHtml.innerHTML = '<div id="chart_container"><div id="y_axis"></div><div id="chart"></div></div><div id="legend"></div><div id="timeline"></div>';
        	    createTable(listDescripteurs);
		    renderGraph(listDescripteurs);
		},
		error: function(error){
		}
	    });
	}
    }

    // Infos d'un descripteur :
    // listDescripteur[i]['tag_label']
    // listDescripteur[i]['count']
    // listDescripteur[i]['others'] <-- nombre ici
    function renderGraph(listDescripteurs, graph) {
	if (graph)
	    graph.remove();

	/*
	 * GRAPH
	 */
	var graph = new Rickshaw.Graph( {
            element: document.getElementById("chart"),
            width: 800,
            height: 400,
            renderer: 'bar',
            series: [ {
		name: "Descripteurs",
		color: '#6060c0',
		data: dataDescripteurs
            }, {
		name: "Non Uniques",
		color: "#30c020",
		data: dataPotentiels
            } ]
	} );

	var x_axis = new Rickshaw.Graph.Axis.X( { graph: graph } );

	var y_axis = new Rickshaw.Graph.Axis.Y( {
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis')
	} );

	var legend = new Rickshaw.Graph.Legend( {
            element: document.querySelector('#legend'),
            graph: graph
	} );
	// ----------------------------------------------------------

	var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: graph,
            formatter: function(series, x, y) {
		var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
		var content = swatch + listDescripteurs[x]['tag_label'] + ": " + parseInt(y) + " (" + series.name + ")" + '<br>';
		return content;
            }
	} );

	graph.unstack = true;
	graph.render();
    }

    function createTable(listDescripteurs) {
	dataDescripteurs = [];
	dataPotentiels = [];
	for(var i=0; i < listDescripteurs.length; ++i) {
	    dataDescripteurs.push({ 'x': i, 'y': listDescripteurs[i]['count'] });
	    dataPotentiels.push({ 'x': i, 'y': listDescripteurs[i]['others'] });
	}
    }
})();
