class QuestionToTag < ActiveRecord::Base
  belongs_to :interview_question_tag
  belongs_to :interview_question

  validates_presence_of :interview_question, :interview_question_tag
  validates_uniqueness_of :interview_question_id, scope: :interview_question_tag_id
end
