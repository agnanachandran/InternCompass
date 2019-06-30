class AddFeedbackTimestamps < ActiveRecord::Migration
  def change
    change_table(:feedbacks) { |t| t.timestamps }
  end
end
