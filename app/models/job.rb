class Job < ActiveRecord::Base
  belongs_to :company
  has_many :interview_questions
  has_many :user_reviews

  before_validation :set_slug, on: :create
  before_save :clean_format_title

  validates :title, presence: true, length: { maximum: 100 }
  validate :slug_must_be_unique_for_given_company_and_location, on: :create

  after_save :reindex

  def set_slug
    self.slug = Utils.slugify(self.title)
  end

  def clean_format_title
    self.title = Utils.clean_format(self.title)
    self.title = Job.fix_acronym_casing(self.title)
  end

  def slug_must_be_unique_for_given_company_and_location
    errors.add(:job, 'already exists for given company and location.') if not
      Job.find_by(company_id: company.id, title: slug, location: location).nil?
  end

  searchable auto_index: false do
    text :title, stored: true
    integer :company_id
  end

  USER_REVIEWS_COUNT_CALCULATION_THRESHOLD = 25

  def reindex
    Job.reindex
  end

  def new_review_update(user_review)
    non_spam_reviews_count = self.user_reviews.non_spam.count
    if non_spam_reviews_count < USER_REVIEWS_COUNT_CALCULATION_THRESHOLD
      self.recalculate_summary_data
    else
      monthly_salary_in_cents = user_review.get_monthly_salary_in_cents
      self.total_rating += user_review.overall_rating
      self.total_salary_in_cents += monthly_salary_in_cents
      self.avg_rating = self.total_rating / (non_spam_reviews_count + 1)
      self.avg_salary_in_cents = self.total_salary_in_cents / (non_spam_reviews_count + 1)
      if non_spam_reviews_count == 0
        self.min_salary_in_cents = monthly_salary_in_cents
        self.max_salary_in_cents = monthly_salary_in_cents
        self.avg_salary_in_cents = monthly_salary_in_cents
      else
        self.min_salary_in_cents = [self.min_salary_in_cents, monthly_salary_in_cents].min
        self.max_salary_in_cents = [self.max_salary_in_cents, monthly_salary_in_cents].max
      end
    end
  end

  def recalculate_summary_data
    non_spam_reviews_count = self.user_reviews.non_spam.count
    if non_spam_reviews_count > 0
      min_salary_in_cents = nil
      max_salary_in_cents = nil
      total_salary_in_cents = 0
      total_rating = 0
      self.user_reviews.non_spam.each do |user_review|
        monthly_salary_in_cents = user_review.get_monthly_salary_in_cents
        if min_salary_in_cents.nil?
          min_salary_in_cents = monthly_salary_in_cents
          max_salary_in_cents = monthly_salary_in_cents
        else
          min_salary_in_cents = [min_salary_in_cents, monthly_salary_in_cents].min
          max_salary_in_cents = [max_salary_in_cents, monthly_salary_in_cents].max
        end
        total_salary_in_cents += monthly_salary_in_cents
        total_rating += user_review.overall_rating
      end
      self.min_salary_in_cents = min_salary_in_cents
      self.max_salary_in_cents = max_salary_in_cents
      self.total_salary_in_cents = total_salary_in_cents
      self.avg_salary_in_cents = total_salary_in_cents / non_spam_reviews_count
      self.total_rating = total_rating
      self.avg_rating = total_rating / non_spam_reviews_count
    else
      self.min_salary_in_cents = nil
      self.max_salary_in_cents = nil
      self.avg_salary_in_cents = nil
      self.avg_rating = nil
    end
  end

  ACRONYMS = {
    '3d': '3D',
    'Ai': 'AI',
    'Api': 'API',
    'Bbm': 'BBM',
    'Devops': 'DevOps',
    'Ios': 'iOS',
    'It': 'IT',
    'Qa': 'QA',
    'Sde': 'SDE',
    'Ui': 'UI',
    'Ux': 'UX',
    'Voip': 'VoIP',
    'Vr': 'VR',
  }

  def self.fix_acronym_casing(string)
    ACRONYMS.each do |before, actual|
      # \G so that we allow match and replace with overlapping matches
      # e.g. 'Ios Ios' becomes 'iOS iOS' instead of 'iOS Ios'
      string.gsub!(/(^|\W|\G)#{before}($|\W)/, '\1' + actual + '\2')
    end
    string
  end
end
