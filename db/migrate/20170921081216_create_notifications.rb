class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.json :content, null: false
      t.integer :category, null: false
      t.references :user, index: true, null: false
      t.references :notifier
      t.boolean :seen, default: false
      t.timestamps
    end
  end
end
