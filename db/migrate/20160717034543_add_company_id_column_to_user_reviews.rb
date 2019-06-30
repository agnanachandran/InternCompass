class AddCompanyIdColumnToUserReviews < ActiveRecord::Migration
  def change
    add_reference :user_reviews, :company, index: true, null: false
    add_foreign_key :user_reviews, :companies
  end
end
