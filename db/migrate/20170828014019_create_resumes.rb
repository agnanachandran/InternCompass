class CreateResumes < ActiveRecord::Migration
  def change
    create_table :resumes do |t|
      t.belongs_to :critique, index: { unique: true }, foreign_key: true
      t.string :s3_key
      t.string :file_name
      t.integer :size_in_bytes
      t.timestamps
    end
  end
end
