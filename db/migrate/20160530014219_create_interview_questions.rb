class CreateInterviewQuestions < ActiveRecord::Migration
  def change
    create_table :interview_questions do |t|
      t.string :title, null: false
      t.text :description_markdown, null: false

      t.references :job

      t.datetime :deleted_at, default: nil
      t.timestamps
    end
    add_foreign_key :interview_questions, :jobs
  end
end
