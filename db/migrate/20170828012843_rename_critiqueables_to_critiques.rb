class RenameCritiqueablesToCritiques < ActiveRecord::Migration
  def change
   rename_table :critiqueables, :critiques
  end
end
