class AdminController < ApplicationController
  def init
    @result = init_words
  end

  def stats

  end

  def init_words
    sparql = SPARQL::Client.new("http://fr.dbpedia.org/sparql")
    result = sparql.query("
        SELECT DISTINCT ?label ?s
            WHERE {
                ?s rdfs:label ?label.

            MINUS {
      	        ?s rdf:type _:other.
            }
        } LIMIT 20")

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
end
