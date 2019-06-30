class RemoveNormalizedTitleFieldFromCompanies < ActiveRecord::Migration
  def change
    remove_column :companies, :normalized_name
  end
end
