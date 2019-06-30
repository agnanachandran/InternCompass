class AddUserReviewCounterCacheToCompany < ActiveRecord::Migration
  def change
    add_column :companies, :user_reviews_count, :integer, null: false, default: 0
    Company.all.each do |company|
        Company.reset_counters(company.id, :user_reviews)
    end
    add_index :companies, :user_reviews_count
  end
end
