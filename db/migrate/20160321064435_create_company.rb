class CreateCompany < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :name, null: false
      t.integer :size
      t.text :description

      t.datetime :deleted_at, default: nil
      t.timestamps
    end
    add_index :companies, :name, unique: true
  end
end
