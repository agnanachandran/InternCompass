class AddTotalRatingToJob < ActiveRecord::Migration
  def change
    add_column :jobs, :total_rating, :float, default: 0
    change_column_default :companies, :total_rating, 0
  end
end
