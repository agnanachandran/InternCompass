require 'aws-sdk'

RESUMES_BUCKET_NAME = Rails.env.production? ? 'resumes.interncompass.io' : 'resumes.development.interncompass.io'
S3_REGION = 'us-east-1'

class S3Client
  def self.get_resume_object(s3_key)
    s3 = Aws::S3::Resource.new(region: S3_REGION)
    return s3.bucket(RESUMES_BUCKET_NAME).object(s3_key)
  end

  def self.delete_from_resume_bucket(s3_key)
    s3 = Aws::S3::Resource.new(region: S3_REGION)
    s3.bucket(RESUMES_BUCKET_NAME).object(s3_key).delete
  end
end

