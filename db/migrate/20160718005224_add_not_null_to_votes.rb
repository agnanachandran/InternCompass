class AddNotNullToVotes < ActiveRecord::Migration
  def change
    change_column_null :user_to_review_votes, :user_id, false
    change_column_null :user_to_review_votes, :user_review_id, false
  end
end
