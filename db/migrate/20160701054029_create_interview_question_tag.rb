class CreateInterviewQuestionTag < ActiveRecord::Migration
  def change
    create_table :interview_question_tags do |t|
      t.string :name, null: false
    end
    add_index :interview_question_tags, :name, unique: true
  end
end
