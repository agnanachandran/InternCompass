class Resume < ActiveRecord::Base
  belongs_to :critique

  before_destroy :delete_from_s3

  private
  def delete_from_s3
    S3Client.delete_from_resume_bucket(self.s3_key)
  end
end

