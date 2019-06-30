class AddOverallRatingToJob < ActiveRecord::Migration
  def change
    add_column :jobs, :avg_rating, :float
  end
end
