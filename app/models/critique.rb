class Critique < ActiveRecord::Base
  belongs_to :user
  has_one :resume, dependent: :destroy
  has_many :critique_comments, dependent: :destroy

  has_secure_token

  def get_comments_for_critique
    self.critique_comments.map do |comment|
      comment_object = {}
      comment_object['user'] = User.find_by_id(comment.user_id).get_public_user_info()
      comment_object['text'] = comment.text
      comment_object['id'] = comment.id
      comment_object['created_at'] = comment.created_at
      comment_object['updated_at'] = comment.updated_at
      comment_object
    end
  end
end
