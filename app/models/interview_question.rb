class InterviewQuestion < ActiveRecord::Base
  DIFFICULTIES = [
    'easy',
    'moderate',
    'hard'
  ]

  belongs_to :job
  has_many :question_to_tags, dependent: :destroy
  has_many :tags, through: :question_to_tags, source: :interview_question_tag

  validates :difficulty, inclusion: { in: DIFFICULTIES }

  def add_tag(tag_name)
    tag_name.downcase!
    tag = InterviewQuestionTag.find_by_name(tag_name)

    if tag.nil?
      return false
    end

    question_to_tag = QuestionToTag.new(
      interview_question_tag: tag, 
      interview_question: self)
    return question_to_tag.save
  end

  def remove_tag(tag_name)
    tag_name.downcase!
    tag = InterviewQuestionTag.find_by_name(tag_name)

    if tag.nil?
      return false
    end

    QuestionToTag.where(interview_question: self, interview_question_tag: tag).destroy_all
    return true
  end
end
