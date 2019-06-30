# Compass

## Setup

1. bundle install && npm install
2. ./setup.sh
3. rake db:create
4. rake db:migrate

Ensure Postgres is running. If you get an issue saying there's no 'postgres' role, try running `createuser -s -r postgres`
If you encounter a 'peer authentication error', you need to edit the file "/etc/postgresql/9.3/main/pg\_hba.conf" and make sure that for the `postgres` user 'peer' is changed to 'md5'.
Restart the server using `service postgresql restart`.

Running the server:
1) Run foreman start -f Procfile.hot for hot reloading or run foreman start -f Procfile.static to generate static assets

Make sure the user you run with has root permissions... I just added my user to the sudo group and everything worked. `sudo usermod -a -G sudo kjnk`

If you are still having issues run the following command in the postgres command line:
1. ALTER USER postgres PASSWORD 'password';

Rerun the rake commands:
1. rake db:create
2. rake db:migrate

# Signing in via email (when the server is running)
Run the following commands:
1. gem install mailcatcher
2. mailcatcher

Click the sign up button and fill out the sign up form. Go to http://127.0.0.1:1080, find the email and click the link provided to activate the account. Go to the page where the server is running and login with the email you just activated.

# Gaining admin access
Run the following commands:
(where email is the email that you signed up with and activated)

1. rails c
2. u = User.find_by_email('email');
3. u.admin = true;
4. u.save!

## Technologies

This is a good read: http://stackoverflow.com/a/4113570.

### Server

We use Nginx with a Phusion Passenger module as the HTTP server for our Ruby on Rails web app.

Ruby on Rails a web application framework. It supports the development of web applications so that a developer can easily manage application interfacing with a database (Rails Models and ActiveRecord), setup routing and connecting routes with application logic and views (config/routes.rb, Rails Controllers, and app/views), managing background tasks (rake and other plugins), etc. What it does not do is handle network requests and responses. RoR relies on an underlying web server for this. Typically, WEBrick is used as the HTTP server for development. This is only because it comes with Ruby by default and it is by no means a production-ready HTTP server.

The HTTP server we chose to go with in production is Nginx with a Phusion Passenger module.

Nginx is an HTTP server known for its speed, mostly due to its event-driven, asynchronous architecture. I believe Nginx is single-threaded. Apache is another popular HTTP server that we could also use. We chose Nginx over Apache because Apache is not as scalable as Nginx. Apache is not event-driven and it spawns a thread for every new connection. There are other things that make Apache worse than Nginx but I'm not aware of the details.

Nginx by itself does not work with Ruby on Rails. That's where Phusion Passenger comes in. It integrates with Nginx to serve Ruby on Rails apps and can even serve multiple Rails apps on top of one Nginx instance (although that's not useful to us). Phusion Passenger also has a standalone mode where it acts as the HTTP server.

#### Why Phusion Passenger and Nginx?

1. On the Phusion Passenger website, "The Nginx mode is what we recommend for most people in production environments. It's fast, easy to use, well-supported, has lots of features." (https://www.phusionpassenger.com/library/indepth/integration_modes.html)
2. This stackoverflow post highly recommends Phusion Passenger/Nginx over other HTTP servers for Ruby on Rails such as Unicorn and Puma (http://stackoverflow.com/questions/4113299/ruby-on-rails-server-options). Apparently Airbnb, New York Times, and Pixar use Phusion Passenger as well

### DB

PostgreSQL is our DB of choice.

### Client

We use React, Redux, React-Redux, and React-Router on the clientside.

React is a UI library. It allows us to build reusable, composable UI components. It is declarative and abstracts a lot of the
unnecessary development details away from the developer.

Redux is an implementation of the Facebook Flux architecture and is responsible for storing state in a web application. React components plug into Redux to get state information.

React and Redux are standalone projects and React-Redux is a project to makes it easy to bridge the gap between the two.

React-Router allows us to offload routing and rendering of pages to the browser.

#### Learning resources

1. React

    https://facebook.github.io/react/docs/tutorial.html

2. Redux

    https://egghead.io/series/getting-started-with-redux

3. React-Redux

    This link is important to read! React-Redux adds some more development design principles on top of React and Redux's principles.
    http://redux.js.org/docs/basics/UsageWithReact.html

4. React-Router

    https://github.com/reactjs/react-router

## Deploying

### Setup

1. Go to the AWS console here: `https://aws.amazon.com/console/` (email: fydp\_vector@gmail.com)
2. Make sure you are in the US East (N. Virginia) region
3. Go to EC2 services page
4. Go to **Security Groups** link on the left panel, click on the group named **launch-wizard-1**
5. Add an ssh **Inbound** rule using your IP address, you don't have to find it in `ipconfig` or anything, the website gets your ip address for you
6. You also need a key pair to be able to ssh to the AWS instance. Each AWS instance is bound to one key pair. You can see the key pair for our production AWS instance by going to the **Key Pairs** link on the left panel in the EC2 services page
7. You cannot download the key pair from the console, you need to get it from Kevin. Please message him for a download link!
8. Place the downloaded `.pem` key file under `~/`. You need call the .pem file `FYDP_US_EAST_OHIO.pem` or deployment with Capistrano will not work!
9. Run bundle install
10. Go to the app repo and deploy using the command `bundle exec cap production deploy`

### Capistrano

Capistrano is the deployment tool we're using.

It is based on Git and so everytime we have new changes we need to deploy, we must commit to whatever branch Capistrano is set to pull from. By default it should be the master branch. As such, if you have changes you want to deploy, make sure they are committed to the master branch and pushed to the remote server for it successfully deploy on AWS.

# Notes

## Material-UI Cards

Cards in Material-UI have styling that can result in undesirable behaviour.

For example, in the `/companies` page, the `CardHeader` from `CompanyListItemWidget` causes the page to have a horizontal scroll bar at smaller widths.

This DOM structure for `CardHeader` looks like this:

  <div class="parent">
    <img class="avatar"/>
    <div class="text">
    </div>
  </div>

To make `div.text` stay on the same line instead of wrapping, `.parent` has `whitespace: nowrap` and `.avatar` and `.text` is `display: inline-block`. `div.text` is still has width 100% so to keep text from overflowing to the right, `div.text` has a right padding of `90px`. At smaller page widths, this padding extends past the right side of the screen, creating a horizontal scrollbar.

# Backup production db/port production db to local for debugging

1. Create a db backup file on the production server
        PGPASSWORD=$PG_PASSWORD pg_dump -U $PG_USERNAME compass_production > ~/db_backups/compass_$(date +"%m-%d-%Y:%H-%M").dump
2. Download backup file from production server
        scp -i path/to/compass.pem ubuntu@ec2-52-9-79-29.us-west-1.compute.amazonaws.com:/home/ubuntu/db_backups/compass_09-12-2016:02-54.dump temp.dump
3. Set local db to prod db data
        rake db:drop
        rake db:create
        psql -d compass_development -f temp.dump

# Secrets/Environment Variables
Environment variables are accessible through the ENV hash in Rails.

For prod, environment variables need to be set in `/etc/environment`, and `~/.bash_profile`.
Note that for our AWS credentials, they're read from the ~/.aws folder (only on prod though).
For dev, in your `config/local_env.yml` (which is ignored by git because of our `.gitignore`), set your environment variables according to those in prod's `.bash_profile`.
e.g.
`ENV_VAR_BLAH: 'blah'`
