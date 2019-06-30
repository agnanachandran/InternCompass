class AddFeedback < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.string :name
      t.string :email
      t.text :comment
    end
  end
end
