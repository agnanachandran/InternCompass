#!/bin/bash


bundle exec rake sunspot:solr:stop
bundle exec rake sunspot:solr:start
bundle exec rake sunspot:solr:reindex

# run rake sunspot:reindex if you make changes to searchable in models
