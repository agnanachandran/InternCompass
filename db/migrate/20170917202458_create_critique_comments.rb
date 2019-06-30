class CreateCritiqueComments < ActiveRecord::Migration
  def change
    create_table :critique_comments do |t|
      t.belongs_to :critique, index: { unique: true }, foreign_key: true
      t.belongs_to :user, index: { unique: true }, foreign_key: true
      t.string :text
      t.timestamps
    end
  end
end
