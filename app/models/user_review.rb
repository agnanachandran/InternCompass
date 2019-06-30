class UserReview < ActiveRecord::Base
  USER_REVIEW_LIMIT = 10
  VALID_STAR_RATINGS = (1..5).step(1)
  VALID_CURRENCY_ISO_CODES = Money::Currency.all.map { |c| c.iso_code }
  enum pay_period: [ :hourly, :weekly, :monthly ]

  scope :non_spam, -> { where(user_review_spam: nil) }
  scope :spam, -> { where.not(user_review_spam: nil) }

  belongs_to :user
  belongs_to :job
  belongs_to :company, counter_cache: true
  belongs_to :user_review_spam

  has_many :user_to_review_votes
  has_many :review_comment
  has_many :user_review_to_perk_tags, dependent: :destroy
  has_many :perk_tags, through: :user_review_to_perk_tags, source: :perk_tag

  has_one :curated_recent_review, dependent: :destroy

  validates :overall_rating, inclusion: { in: VALID_STAR_RATINGS }
  validates :mentorship_rating, inclusion: { in: VALID_STAR_RATINGS }
  validates :work_life_balance_rating, inclusion: { in: VALID_STAR_RATINGS }
  validates :meaningful_work_rating, inclusion: { in: VALID_STAR_RATINGS }
  validates :currency, inclusion: { in: VALID_CURRENCY_ISO_CODES }
  validates :pay_period, inclusion: { in: pay_periods.keys }
  validates :salary_in_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :user_review_limit_reached, on: :create
  validates_with JobCompanyValidator

  has_secure_token

  def self.get_recent_user_reviews
    curated_review_ids = CuratedRecentReview.all.pluck(:user_review_id)
    reviews = UserReview
      .select([
        :id,
        :description,
        :anonymous,
        :overall_rating,
        :user_id,
        :job_id,
      ])
      .includes(:user, job: [:company])
      .order(:created_at)
      .find(curated_review_ids)
      .reverse
      .map do |r|
        review = r.slice('id', 'description', 'overall_rating')
        review[:user_first_name] = r.anonymous ? nil : r.user.first_name
        review[:company_slug] = r.job.company.slug
        review[:company_name] = r.job.company.name
        review[:company_logo_url] = r.job.company.logo_url
        review[:job_title] = r.job.title
        review
      end
    reviews
  end

  def self.currency_from_country(country_code)
    country = Country[country_code]
    if country.blank? or country.currency.blank?
      return nil
    end
    return country.currency.code
  end

  def self.is_valid_currency(code)
    currency_codes = Money::Currency.all.map do |currency|
      currency.iso_code
    end
    return currency_codes.include? code
  end

  def self.get_user_review(token, current_user)
    review = UserReview.select([
      :id,
      :description,
      :anonymous,
      :overall_rating,
      :mentorship_rating,
      :work_life_balance_rating,
      :meaningful_work_rating,
      :user_id,
      :job_id,
      :token,
      :created_at,
    ])
    .includes(:user, job: [:company])
    .find_by_token!(token)
    job = review.job
    company = review.job.company
    votes = UserToReviewVote.where(user_review_id: review.id).to_a { |v| v }
    upvotes = votes.count { |vote| vote.vote }
    downvotes = votes.count - upvotes

    helpfulness = get_helpfulness_rank(upvotes, votes.count)

    user_vote = if !current_user.blank?
      vote = votes.find { |v| v.user_id == current_user.id}
      if !vote.blank?
        vote.vote
      end
    end

    review_json = review.as_json
    review_json[:is_for_current_user] = !current_user.blank? && current_user.id == review.user_id
    review_json[:company_name] = company.name
    review_json[:company_logo_url] = company.logo_url
    review_json[:company_slug] = company.slug
    review_json[:job_title] = job.title
    review_json[:location] = job.location
    review_json[:upvote] = upvotes
    review_json[:downvote] = downvotes
    review_json[:user_vote] = user_vote
    review_json[:helpfulness] = helpfulness

    return review_json
  end

  def get_user_vote(user)
    votes = UserToReviewVote.where(user_review_id: id).to_a { |v| v }
    user_vote = if !user.blank?
      vote = votes.find { |v| v.user_id == user.id}
      if !vote.blank?
        vote.vote
      end
    end
    return user_vote
  end

  def get_num_votes
    return UserToReviewVote.where(user_review_id: id).to_a { |v| v }.count
  end

  def get_upvotes
    votes = UserToReviewVote.where(user_review_id: id).to_a { |v| v }
    return votes.count { |vote| vote.vote }
  end

  def get_helpfulness
    votes = UserToReviewVote.where(user_review_id: id).to_a { |v| v }
    n = votes.count
    pos = votes.count { |vote| vote.vote }
    return UserReview.get_helpfulness_rank(pos, n)
  end

  # stolen from http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
  def self.get_helpfulness_rank(pos, n)
    if n == 0
      return 0
    end
    z = 1.96  # corresponds to a confidence of 95%
    p_hat = 1.0 * pos / n
    return (p_hat + z*z/(2*n) - z * Math.sqrt((p_hat*(1-p_hat)+z*z/(4*n))/n))/(1+z*z/n)
  end

  def user_review_limit_reached
    errors.add(:user, 'User review limit reached.') if
      UserReview.where(user_id: user_id).count >= USER_REVIEW_LIMIT
  end

  def mark_as_spam(admin, reason)
    if not self.user_review_spam.nil?
      return true
    end
    ActiveRecord::Base.transaction do
      user_review_spam = UserReviewSpam.create!(admin: admin, reason: reason)
      self.update_attributes!(user_review_spam: user_review_spam)
    end
    true
  end

  def unmark_as_spam(admin)
    if self.user_review_spam.nil?
      return true
    end
    if not admin.admin?
      return false
    end
    ActiveRecord::Base.transaction do
      user_review_spam = self.user_review_spam
      self.update_attributes!(user_review_spam: nil)
      user_review_spam.destroy
    end
    return true
  end

  def add_perk(perk_name)
    perk = PerkTag.find_by_name(perk_name)
    if perk.nil?
      return false
    end
    user_review_to_perk_tag = UserReviewToPerkTag.new(
      user_review: self,
      perk_tag: perk)
    return user_review_to_perk_tag.save
  end

  def remove_perk(perk_name)
    perk = PerkTag.find_by_name(perk_name)
    if perk.nil?
      return false
    end
    UserReviewToPerkTag.where(user_review: self, perk_tag: perk).destroy_all
    return true
  end

  WEEKLY_TO_MONTHLY_RATE = 4
  HOURLY_TO_MONTHLY_RATE = 160

  def get_salary_in_dollars
    return self.salary_in_cents / 100.0
  end

  def get_monthly_salary_in_cents
    case self.pay_period
    when 'monthly'
      return self.salary_in_cents
    when 'weekly'
      return (self.salary_in_cents * WEEKLY_TO_MONTHLY_RATE).round
    when 'hourly'
      return (self.salary_in_cents * HOURLY_TO_MONTHLY_RATE).round
    end
  end

  def delete
    job = self.job
    company = self.company
    self.destroy
    job.recalculate_summary_data
    company.recalculate_summary_data
    return job.save && company.save
  end
end
