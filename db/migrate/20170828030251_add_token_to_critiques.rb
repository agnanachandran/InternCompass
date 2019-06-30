class AddTokenToCritiques < ActiveRecord::Migration
  def change
    add_column :critiques, :token, :string
    add_index :critiques, :token
  end
end
