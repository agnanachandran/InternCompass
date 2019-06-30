class CreateUserToReviewVotes < ActiveRecord::Migration
  def change
    create_table :user_to_review_votes do |t|
      t.references :user, index: true
      t.references :user_review, index: true
      t.boolean :vote, null: false
    end
    add_index :user_to_review_votes, [:user_id, :user_review_id], :unique => true
  end
end
