class AddNonNullConstraintToReferences < ActiveRecord::Migration
  def change
    change_column_null :jobs, :company_id, false
    change_column_null :question_to_tags, :interview_question_id, false
    change_column_null :question_to_tags, :interview_question_tag_id, false
    change_column_null :review_comments, :user_review_id, false
    change_column_null :review_comments, :user_id, false
    change_column_null :user_to_review_votes, :user_review_id, false
    change_column_null :user_to_review_votes, :user_id, false
    change_column_null :user_review_to_perk_tags, :user_review_id, false
    change_column_null :user_review_to_perk_tags, :perk_tag_id, false
  end
end
