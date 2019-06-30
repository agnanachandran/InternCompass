class CreatePerkTags < ActiveRecord::Migration
  def change
    create_table :perk_tags do |t|
      t.string :name, null: false
    end
    add_index :perk_tags, :name, unique: true
  end
end
