class CreateUser < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false

      t.datetime :deleted_at, default: nil
      t.timestamps
    end
  end
end
