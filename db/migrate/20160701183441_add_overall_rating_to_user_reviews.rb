class AddOverallRatingToUserReviews < ActiveRecord::Migration
  def change
    add_column :user_reviews, :overall_rating, :float, null: false
  end
end
