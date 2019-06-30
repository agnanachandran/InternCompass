class SalaryToSalaryInCents < ActiveRecord::Migration
  def change
    rename_column :user_reviews, :salary, :salary_in_cents
    rename_column :jobs, :avg_salary, :avg_salary_in_cents
    rename_column :jobs, :min_salary, :min_salary_in_cents
    rename_column :jobs, :max_salary, :max_salary_in_cents
    add_column :jobs, :total_salary_in_cents, :decimal, precision: 15, scale: 0
  end
end
