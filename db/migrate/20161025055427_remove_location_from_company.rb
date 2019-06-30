class RemoveLocationFromCompany < ActiveRecord::Migration
  def change
    remove_column :companies, :location
  end
end
