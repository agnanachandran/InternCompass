class CreateUserReview < ActiveRecord::Migration
  def change
    create_table :user_reviews do |t|
      t.text :description
      t.integer :salary_in_cents, default: nil
      t.boolean :anonymous, default: true, null: false
      t.references :job, index: true, null: false
      t.references :user, index: true, null: false
      t.datetime :deleted_at, default: nil
      t.timestamps
    end
    add_foreign_key :user_reviews, :jobs
    add_foreign_key :user_reviews, :users
  end
end
