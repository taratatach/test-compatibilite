class GameController < ApplicationController
  respond_to :html, :json

  def index
  end

  def jeu
    @classes = get_classes
  end

  def fin
  end

  def get_concepts
    result = @store.select("
        SELECT ?label ?uri
        WHERE {
            GRAPH <http://www.testcompatibilite.fr/Graph> {
                ?mot skos:prefLabel ?label.
                ?mot tc:subjectURI ?uri
            }
        }")
    
    @concepts = []
    result.each do |concept|
      @concepts.push({:label => concept['label'], :uri => concept['uri']})
    end
    
    respond_with(@concepts) do |format|
      format.json { render :json => @concepts}
    end
  end

  def get_classes
    sparql = SPARQL::Client.new("http://fr.dbpedia.org/sparql")
    result = sparql.query("
        SELECT DISTINCT ?label ?s
        WHERE {
            ?s rdfs:label ?label.
            ?s rdf:type owl:Class.
            FILTER(lang(?label)=\"fr\")
        } LIMIT 1000")

    classes = []

    result.each do |c|
      classes.push({:label => c[:label].value, :uri => c[:s].to_s})
    end
    
    return classes
  end

  def add_tag
    @label_concept = params[:label_concept]
    @label_tag = params[:label_tag]
    @uri_tag = params[:uri_tag]
    @others = params[:others]
    @date = DateTime.now

    result = @store.select("
       SELECT ?mot
       WHERE { 
           GRAPH <http://www.testcompatibilite.fr/Graph> {
               ?mot skos:prefLabel ?label.
	       FILTER(xsd:string(?label) = \""+@label_concept+"\" && lang(?label) = \"FR\")
           }
       }")
    
    @response = @store.add(@graph, "
          <"+result[0]['mot']+"> tc:tag _:tag.
          _:tag tags:name \""+@label_tag+"\"@fr.
          "+((@uri_tag != '') ? "_:tag moat:tagMeaning <"+@uri_tag+">." : "")+"
          _:tag tags:taggedOn \""+@date.to_s+"\"^^xsd:dateTime.
          _:tag tc:others \""+@others.to_s+"\"^^xsd:boolean	     
      ")

    respond_with(@response) do |format|
      format.json { render :json => @response}
    end
  end
end
