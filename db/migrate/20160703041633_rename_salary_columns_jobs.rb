class RenameSalaryColumnsJobs < ActiveRecord::Migration
  def change
    rename_column :jobs, :min_salary_in_cents, :min_salary
    rename_column :jobs, :max_salary_in_cents, :max_salary
    rename_column :jobs, :average_salary, :avg_salary
  end
end
