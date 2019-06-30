class CreateUserPreference < ActiveRecord::Migration
  def change
    create_table :user_preferences do |t|
      t.column :user_id, :integer

      t.datetime :deteled_at, default: nil
      t.timestamps
    end
    add_foreign_key :user_preferences, :users
  end
end
