class CreateCompanyCategory < ActiveRecord::Migration
  def change
    create_table :company_categories do |t|
      t.string :name, null: false
    end
    add_index :company_categories, :name, unique: true
  end
end
