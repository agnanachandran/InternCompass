class AddHqInfoToCompanies < ActiveRecord::Migration
  def change
    add_column :companies, :hq_city, :string
    add_column :companies, :hq_region, :string
    add_column :companies, :hq_country, :string
  end
end
