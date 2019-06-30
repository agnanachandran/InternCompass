set :application, 'compass'
set :repo_url, 'git@bitbucket.org:ChronosKey/interncompass.git'
set :deploy_to, '/home/ubuntu/sails'
set :branch, ENV['CAP_BRANCH'] if ENV['CAP_BRANCH']

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system', 'client/node_modules')

set :slackistrano, {
  channel: '#deploys',
  webhook: 'https://hooks.slack.com/services/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'
}

namespace :deploy do
  task :compile_client do
    on roles(:web) do
      # stop gap solution, npm install's post install has some permission issues, so we directly run npm install within client/ first
      execute "cd #{release_path}/client && npm install"
      execute "cd #{release_path} && npm install"
      execute "sh -c 'cd #{release_path} && npm run build:production:server && npm run build:production:client'"
    end
  end

  before :compile_assets, :compile_client

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
    end
  end
end
