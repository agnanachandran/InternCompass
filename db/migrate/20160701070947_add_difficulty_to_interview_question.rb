class AddDifficultyToInterviewQuestion < ActiveRecord::Migration
  def change
    add_column :interview_questions, :difficulty, :string, null: false, default: "easy"
  end
end
