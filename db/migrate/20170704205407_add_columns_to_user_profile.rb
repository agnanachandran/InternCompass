class AddColumnsToUserProfile < ActiveRecord::Migration
  def change
    add_column :user_profiles, :school, :string
    add_column :user_profiles, :program, :string
    add_column :user_profiles, :personal_website, :string
    add_column :user_profiles, :github, :string
    add_column :user_profiles, :linkedin, :string
    add_column :user_profiles, :twitter, :string
    add_column :user_profiles, :blog, :string
    add_column :user_profiles, :dribbble, :string
    add_column :user_profiles, :bio, :string
  end
end
