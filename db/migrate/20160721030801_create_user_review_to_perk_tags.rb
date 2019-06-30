class CreateUserReviewToPerkTags < ActiveRecord::Migration
  def change
    create_table :user_review_to_perk_tags do |t|
      t.references :user_review, index: true
      t.references :perk_tag, index: true
    end
    add_foreign_key :user_review_to_perk_tags, :user_reviews
    add_foreign_key :user_review_to_perk_tags, :perk_tags
    add_index :user_review_to_perk_tags, ['user_review_id', 'perk_tag_id'], unique: true, name: 'user_review_to_perk_tags_index'
  end
end
