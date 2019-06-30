class UserReviewToPerkTag < ActiveRecord::Base
  belongs_to :perk_tag
  belongs_to :user_review

  validates_presence_of :user_review, :perk_tag
  validates_uniqueness_of :user_review_id, scope: :perk_tag_id
end
