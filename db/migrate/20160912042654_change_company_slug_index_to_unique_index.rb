class ChangeCompanySlugIndexToUniqueIndex < ActiveRecord::Migration
  def change
    remove_index :companies, :slug
    add_index :companies, :slug, unique: true
  end
end
