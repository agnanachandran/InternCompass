class AddApprovedFlagToCompany < ActiveRecord::Migration
  def change
    add_column :companies, :approved, :boolean, null: false, default: false
    add_index :companies, :approved
  end
end
