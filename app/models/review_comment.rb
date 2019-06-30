require 'will_paginate/array'

class ReviewComment < ActiveRecord::Base
  COMMENT_LIMIT = 1000
  PER_PAGE = 10

  belongs_to :user_review
  belongs_to :user

  validates :text, presence: true, length: { maximum: 150 }

  validate :comment_limit_reached, on: :create

  def comment_limit_reached
    errors.add(:user_review, 'Review comment limit reached.') if
      ReviewComment.where(user_review_id: user_review_id).count >= COMMENT_LIMIT
  end

  def self.page_comments_by_user_review(user_review_token, page)
    review = UserReview.find_by_token(user_review_token)
    comments = ReviewComment.where(user_review_id: review.id).to_a { |c| c }
    comments = comments.sort_by {|comment| comment.updated_at}.reverse!
    comments = comments.paginate(page: page, per_page: PER_PAGE)
    total_pages = comments.total_pages
    uids = comments.map do |comment|
      comment.user_id
    end

    uid_to_name = Hash.new
    begin
      User.find(uids).each do |user|
        uid_to_name[user.id] = "#{user.first_name} #{user.last_name}"
      end
    rescue ActiveRecord::RecordNotFound
      raise ActiveRecord::RecordNotFound
    end
    comments = comments.map do |comment|
      comment_map = comment.slice('id', 'text', 'updated_at')
      comment_map[:commenter] = uid_to_name[comment.user_id]
      comment_map
    end
    return comments, total_pages
  end
end
