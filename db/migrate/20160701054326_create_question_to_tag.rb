class CreateQuestionToTag < ActiveRecord::Migration
  def change
    create_table :question_to_tags do |t|
      t.references :interview_question, index: true
      t.references :interview_question_tag, index: true
    end
    add_foreign_key :question_to_tags, :interview_questions
    add_foreign_key :question_to_tags, :interview_question_tags
    add_index :question_to_tags, ['interview_question_id', 'interview_question_tag_id'], unique: true, name: 'question_to_tags_index'
  end
end
