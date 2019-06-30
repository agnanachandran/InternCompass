class ChangeDefaultValueForJobTotalSalaryToZero < ActiveRecord::Migration
  def change
    change_column_default :jobs, :total_salary_in_cents, 0
  end
end
