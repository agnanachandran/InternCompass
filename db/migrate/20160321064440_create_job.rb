class CreateJob < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.string :title, null: false
      t.integer :min_salary_in_cents
      t.integer :max_salary_in_cents
      t.integer :average_salary

      t.references :company, index: true

      t.datetime :deleted_at, default: nil
      t.timestamps
    end
    add_foreign_key :jobs, :companies
  end
end
