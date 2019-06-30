class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_many :critiques
  has_many :critique_comments
  has_many :user_reviews
  has_many :user_to_review_votes
  has_many :user_review_spams, foreign_key: 'admin_id'

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :omniauthable, omniauth_providers: [:facebook]

  has_secure_token

  def get_public_user_info()
    user_profile = UserProfile.select([:school, :program]).find_by_user_id(self.id)
    return {
      name: "#{self.first_name} #{self.last_name}",
      school: user_profile ? user_profile.school : nil,
      program: user_profile ? user_profile.program : nil,
      img_url: self.image_url,
      token: self.token,
    }
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
      user.image_url = auth.info.image
      user.skip_confirmation!
    end
  end
end
