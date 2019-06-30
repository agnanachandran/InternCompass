class CuratedRecentReview < ActiveRecord::Base
  belongs_to :user_review
  validates :user_review, presence: :true
end