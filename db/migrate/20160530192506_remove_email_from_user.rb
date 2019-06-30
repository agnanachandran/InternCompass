class RemoveEmailFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :email
  end
end
