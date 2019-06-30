class AddTotalRatingToCompany < ActiveRecord::Migration
  def change
    add_column :companies, :total_rating, :float
    add_column :companies, :avg_rating, :float
    add_index :companies, :avg_rating
  end
end
