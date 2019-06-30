class PerkTag < ActiveRecord::Base
  has_many :user_review_to_perk_tags, dependent: :destroy
  has_many :user_reviews, through: :question_to_tags

  validates :name, presence: true
end
