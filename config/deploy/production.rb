role :app, %w{ubuntu@ec2-52-14-10-176.us-east-2.compute.amazonaws.com}
role :web, %w{ubuntu@ec2-52-14-10-176.us-east-2.compute.amazonaws.com}
role :db, %w{ubuntu@ec2-52-14-10-176.us-east-2.compute.amazonaws.com}

server 'ec2-52-14-10-176.us-east-2.compute.amazonaws.com', user: 'ubuntu', roles: %w{web app}

set :ssh_options, {
  keys: %w(~/FYDP_US_EAST_OHIO.pem),
  forward_agent: false
}