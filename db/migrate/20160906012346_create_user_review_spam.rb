class CreateUserReviewSpam < ActiveRecord::Migration
  def change
    create_table :user_review_spams do |t|
      t.integer :admin_id
      t.string :reason
    end
    add_index :user_review_spams, :admin_id
    add_reference :user_reviews, :user_review_spam, index: true
    add_foreign_key :user_reviews, :user_review_spams
  end
end
