class AddCareersUrlToCompanies < ActiveRecord::Migration
  def change
    add_column :companies, :careers_url, :string
  end
end
