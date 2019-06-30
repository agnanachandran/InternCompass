class AddCompanyAndTitleIndexToJobs < ActiveRecord::Migration
  def change
    add_index :jobs, ['company_id', 'title'], :unique => true
  end
end
