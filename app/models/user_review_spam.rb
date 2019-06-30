class UserReviewSpam < ActiveRecord::Base
  has_one :user_review
  belongs_to :admin, class_name: 'User', foreign_key: 'admin_id'

  before_save lambda { self.admin.admin? }
end