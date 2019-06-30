class AddCuratedRecentReviews < ActiveRecord::Migration
  def change
    create_table :curated_recent_reviews do |t|
      t.integer :user_review_id
    end
  end
end
