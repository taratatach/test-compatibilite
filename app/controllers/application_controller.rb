require 'rubygems'
require 'rest_client'
require 'nokogiri'
require '4store-ruby'

class ApplicationController < ActionController::Base
  protect_from_forgery

  def initialize
    @endpoint = 'http://localhost:8000/sparql/'

    # production options
    # @endpoint = 'http://zouig.org:8000/sparql/'
    
    @graph = 'http://www.testcompatibilite.fr/Graph'
    
    FourStore::Namespace::add('data', 'http://www.testcompatibilite.fr/data#')
    FourStore::Namespace::add('tc', 'http://www.testcompatibilite.fr/2013/schema#')
    FourStore::Namespace::add('tags', 'http://www.holygoat.co.uk/owl/redwood/0.1/tags/')
    FourStore::Namespace::add('moat', 'http://moat-project.org/ns#')

    @store = FourStore::Store.new @endpoint
    
    super()
  end
end
