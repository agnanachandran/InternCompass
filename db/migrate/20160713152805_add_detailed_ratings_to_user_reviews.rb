class AddDetailedRatingsToUserReviews < ActiveRecord::Migration
  def change
    add_column :user_reviews, :mentorship_rating, :float, null: false
    add_column :user_reviews, :work_life_balance_rating, :float, null: false
    add_column :user_reviews, :meaningful_work_rating, :float, null: false
  end
end
