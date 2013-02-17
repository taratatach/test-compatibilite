class AdminController < ApplicationController
  respond_to :html, :json

  def init
    @result = init_concepts
  end

  def stats
  end

  def init_concepts
    sparql = SPARQL::Client.new("http://fr.dbpedia.org/sparql")
    result = sparql.query("
        SELECT DISTINCT ?label ?s
            WHERE {
                ?s rdfs:label ?label.

            MINUS {
      	        ?s rdf:type _:other.
            }
        } 
        OFFSET 20
        LIMIT 20")

    result.each do |term|
      add_concept term.label.value, term.s.to_s
    end
    return result
  end

  def add_concept(label, uri)
    label = label
    uri = uri
    s = uri.match(/.+\/(.+)$/)[1]

    result = @store.add(@graph, "
        data:"+s+" rdf:type skos:Concept.
	data:"+s+" skos:prefLabel \""+label+"\"@fr.
        data:"+s+" tc:subjectURI <"+uri+">    
    ")
    return result
  end

  def get_tags_infos
    concept = params[:concept]

    result = @store.add(@graph, "
        SELECT DISTINCT ?tag ?count ?nb_others
        WHERE {
            GRAPH <http://www.testcompatibilite.fr/Graph> {
	        ?mot tc:tag ?t.
	        ?mot skos:prefLabel \""+concept+"\"@fr.
	        ?mot tc:subjectURI ?word_uri.
	        ?t tags:name ?tag.
	        {
		    SELECT (COUNT(?e) as ?count)
		    WHERE {
                        ?mot tc:tag ?e.
		        ?e tags:name ?tag
		    }
       	        }
       	        {
       		    SELECT (COUNT(?f) as ?nb_others)
       		    WHERE {
                        ?mot tc:tag ?f.
       		        ?f tags:name ?tag.
       		        ?f tc:others ?o
       		        FILTER(xsd:boolean(?o) = \"true\"^^xsd:boolean)
       		    }
       	        }
            }    
        } ORDER BY DESC(?count)")

    @tags = []
    result.each do |tag|
      @tags.push({:tag_label => tag['tag'], :count => tag['count'].to_i, :others => tag['others'].to_i})
    end

    respond_with(@tags) do |format|
      format.json { render :json => @tags}
    end
  end
end
