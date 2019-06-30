class InterviewQuestionTag < ActiveRecord::Base
  has_many :question_to_tags, dependent: :destroy
  has_many :questions, through: :question_to_tags, source: :interview_question

  validates :name, presence: true

  before_save :preprocess

  private  
  def preprocess 
    self.name.downcase!
    self.name.strip!

    if self.url_slug.blank?
      self.url_slug = self.name.gsub(' ', '-').gsub(/[^\w-]/, '')
    end
  end
end
