class CreateUserProfile < ActiveRecord::Migration
  def change
    create_table :user_profiles do |t|
      t.string :summary
      t.column :user_id, :integer
      t.datetime :deleted_at, default: nil
      t.timestamps
    end
    add_foreign_key :user_profiles, :users
  end
end
