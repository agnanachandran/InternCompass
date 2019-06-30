# Load DSL and set up stages
require 'capistrano/setup'
# Include default deployment tasks
require 'capistrano/deploy'
require 'capistrano/bundler'
require 'capistrano/rails'
require 'capistrano/rvm'
require 'capistrano/passenger'
require 'slackistrano/capistrano'
set :rvm_type, :user
set :rvm_ruby_version, '2.3.0p0'
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }
