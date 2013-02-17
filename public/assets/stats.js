var dataNormal = [ { x: 0, y: 30 }, { x: 1, y: 25 }, { x: 2, y: 0 }, { x: 3, y: 12 }, { x: 4, y: 6 } ];
var dataCandidat = [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 30 }, { x: 3, y: 0 }, { x: 4, y: 0 } ];
var seriesData = [ dataNormal, dataCandidat ];

document.addEventListener('DOMContentLoaded', function () {
    var listConcepts = [];
    $.get("/jeu/get_concepts.json",function(json){
	listConcepts = getConcepts(json);
	render(listConcepts);
    });
});

function render(listConcepts) {
    document.querySelector('#concept').textContent = listConcepts[0];
    document.querySelector('#uri').textContent = listConcepts[0];

    var strConceptsList = "";
    for (var i=0;i<listConcepts.length;i++) {
        strConceptsList += '<option>'+listConcepts[i]+'</option>';
    }
    document.querySelector('#listConcepts').innerHTML = strConceptsList;

    /*
     * GRAPH
     */
    var graph = new Rickshaw.Graph( {
        element: document.getElementById("chart"),
        width: 800,
        height: 400,
        renderer: 'bar',
        series: [ {
            name: "Classique",
            color: '#6060c0',
            data: seriesData[0]
        }, {
            name: "Candidat",
            color: "#30c020",
            data: seriesData[1]
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
	    renderGraph(listDescripteurs, graph);
	},
	error: function(error){
	}
    });

    var selectConcept = document.getElementById("listConcepts");
    selectConcept.onchange = function() {
        var conceptChoisi = this.options[this.selectedIndex];
        document.querySelector('#concept').textContent = listConcepts[this.selectedIndex];
        document.querySelector('#uri').textContent = listConcepts[this.selectedIndex];

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
		renderGraph(listDescripteurs, graph);
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
    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph,
        formatter: function(series, x, y) {
            if (parseInt(y))  {
                var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                var content = swatch + listDescripteurs[parseInt(x)] + ": " + parseInt(y) + " (" + series.name + ")" + '<br>';
                return content;
            }
        }
    } );

    graph.render();
}
