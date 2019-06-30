class AddAnonymousDefaultValueToReview < ActiveRecord::Migration
  def change
    change_column_null :user_reviews, :anonymous, false
  end
end
