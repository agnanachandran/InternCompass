class AddFollowingTable < ActiveRecord::Migration
  def change
    create_table :following_companies do |t|
      t.belongs_to :company, null: false
      t.belongs_to :user, null: false
      t.timestamps
    end
    add_index :following_companies, [:company_id, :user_id], unique: true
 end
end
