class AddLocationToJobs < ActiveRecord::Migration
  def change
    add_column :jobs, :location, :string
    remove_index(:jobs, name: 'index_jobs_on_company_id_and_title')
    add_index :jobs, ['company_id', 'title', 'location'], unique: true
  end
end
