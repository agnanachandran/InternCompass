class RemoveCritiqueIndices < ActiveRecord::Migration
  def change
    remove_index "critique_comments", name: "index_critique_comments_on_user_id"
    remove_index "critique_comments", name: "index_critique_comments_on_critique_id"
  end
end
