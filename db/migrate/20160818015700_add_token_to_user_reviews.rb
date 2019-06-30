class AddTokenToUserReviews < ActiveRecord::Migration
  def change
    add_column :user_reviews, :token, :string
    add_index :user_reviews, :token, unique: true
  end
end
