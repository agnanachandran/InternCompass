class UserToReviewVote < ActiveRecord::Base
  belongs_to :user
  belongs_to :user_review
end