# set :output, "/path/to/my/cron_log.log"

# Learn more: http://github.com/javan/whenever

# whenever --set environment=<environment> --update-crontab

case @environment
when 'production'
  every 10.minutes do
    runner "Company.index"
    runner "Job.index"
  end
when 'development'
  every 10.minutes do
    runner "Company.index", :environment => "development"
    runner "Job.index", :environment => "development"
  end
end
