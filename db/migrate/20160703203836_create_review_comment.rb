class CreateReviewComment < ActiveRecord::Migration
  def change
    create_table :review_comments do |t|
      t.string :text, null: false

      t.references :user_review, index: true
      t.references :user, index: true

      t.datetime :deleted_at, default: nil
      t.timestamps
    end
  end
end
