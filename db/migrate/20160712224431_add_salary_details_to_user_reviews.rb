class AddSalaryDetailsToUserReviews < ActiveRecord::Migration
  def change
    rename_column :user_reviews, :salary_per_week, :salary
    add_column :user_reviews, :pay_period, :integer
    add_column :user_reviews, :currency, :string
  end
end
