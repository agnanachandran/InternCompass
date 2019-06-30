class CreateCritiqueables < ActiveRecord::Migration
  def change
    create_table :critiqueables do |t|
      t.text :description
      t.references :user, index: true, null: false
      t.timestamps null: false
    end
    add_foreign_key :critiqueables, :users
  end
end
