class AddNormalizedTitleFieldToCompanies < ActiveRecord::Migration
  def change
    add_column :companies, :normalized_name, :string, null: false, default: ''
    add_index :companies, :normalized_name
  end
end
