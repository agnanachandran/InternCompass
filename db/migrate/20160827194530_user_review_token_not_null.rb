class UserReviewTokenNotNull < ActiveRecord::Migration
  def change
    change_column_null :user_reviews, :token, false
    UserReview.all.each do |r|
      r.regenerate_token
    end
  end
end
