class AddUrlSlugToInterviewQuestionTags < ActiveRecord::Migration
  def change
    add_column :interview_question_tags, :url_slug, :string
    add_index :interview_question_tags, :url_slug, unique: true
  end
end
