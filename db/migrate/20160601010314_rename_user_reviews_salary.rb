class RenameUserReviewsSalary < ActiveRecord::Migration
  def change
    rename_column :user_reviews, :salary_in_cents, :salary_per_week
  end
end
