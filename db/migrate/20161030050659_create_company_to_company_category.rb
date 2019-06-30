class CreateCompanyToCompanyCategory < ActiveRecord::Migration
  def change
    create_table :company_to_company_categories do |t|
      t.references :company, index: true
      t.references :company_category, index: true
    end
    add_foreign_key :company_to_company_categories, :companies
    add_foreign_key :company_to_company_categories, :company_categories
    add_index :company_to_company_categories, ['company_id', 'company_category_id'], unique: true, name: 'company_to_company_categories_index'
  end
end