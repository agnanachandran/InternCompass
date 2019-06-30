class CritiqueComment < ActiveRecord::Base
  belongs_to :critique
  belongs_to :user

  validates :text, presence: true

end

