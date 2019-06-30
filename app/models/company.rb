class Company < ActiveRecord::Base
  has_many :jobs
  has_many :user_reviews
  has_many :company_to_company_categories, dependent: :destroy
  has_many :company_categories, through: :company_to_company_categories, source: :company_category

  before_validation :set_slug, on: :create

  validates :name, presence: true, length: { maximum: 100 }
  validates :slug, presence: true, uniqueness: true

  scope :not_approved, -> { where(approved: false) }
  scope :approved, -> { where(approved: true) }

  after_save :reindex

  # TODO: user_reviews_count is a counter_cache and auto increments BUT it contains spam user reviews

  searchable auto_index: false do
    text :name, default_boost: 2, stored: true
    text :description, stored: true
    integer :user_reviews_count
    float :avg_rating
    string :job_locations, multiple: true do
      jobs.map(&:location)
    end
  end

  USER_REVIEWS_COUNT_CALCULATION_THRESHOLD = 100

  def reindex
    Company.reindex
  end

  def self.company_widget_attributes
    [
      :name,
      :slug,
      :logo_url,
      :avg_rating,
      :user_reviews_count,
    ]
  end

  def self.most_reviewed(attributes, limit)
    self.select(attributes).order(:user_reviews_count).reverse_order.limit(limit)
  end

  def self.most_reviewed_by_category(category_id, attributes, limit)
    company_ids = CompanyToCompanyCategory.where(company_category_id: category_id).map(&:company_id)
    self.most_reviewed(attributes, limit).find(company_ids)
  end

  def self.recommended_companies(company, attributes, limit)
    # Get most reviewed companies that belong to one of `company`'s categories
    category_ids = company.company_categories.collect(&:id)
    company_ids = CompanyToCompanyCategory.where(company_category_id: category_ids)
                                          .where.not(company_id: company.id)
                                          .pluck(:company_id)
    companies_in_categories = self.most_reviewed(attributes, limit).find(company_ids)

    # To fill the remaining spots, get random highest rated companies from the top 25
    num_remaining = limit - companies_in_categories.count
    highest_rated_companies = self.where.not(avg_rating: nil)
                                  .where.not(id: [company.id] + company_ids) # Exclude already chosen companies
                                  .order(:avg_rating)
                                  .reverse_order
                                  .limit(25)
    recommended_companies = companies_in_categories + highest_rated_companies.sample(num_remaining)
  end

  def self.highest_rated(limit)
    self.where.not(avg_rating: nil).order(:avg_rating).reverse_order.limit(limit)
  end

  def set_slug
    # TODO: how to deal with companies with the same name or name that slugifies down to the same slug?
    self.slug = Utils.slugify(self.name)
  end

  def add_category(category_name)
    category = CompanyCategory.find_by_name(category_name)
    if category.nil?
      return false
    end
    company_to_company_category = CompanyToCompanyCategory.new(
      company_id: self.id,
      company_category_id: category.id)
    return company_to_company_category.save
  end

  def new_review_update(user_review)
    non_spam_reviews_count = self.user_reviews.non_spam.count
    if non_spam_reviews_count < USER_REVIEWS_COUNT_CALCULATION_THRESHOLD
      self.recalculate_summary_data
    else
      self.total_rating += user_review.overall_rating
      self.avg_rating = self.total_rating / (non_spam_reviews_count + 1)
    end
  end

  def recalculate_summary_data
    non_spam_reviews_count = self.user_reviews.non_spam.count
    if non_spam_reviews_count > 0
      total_rating = 0
      self.user_reviews.non_spam.each do |user_review|
        total_rating += user_review.overall_rating
      end
      self.total_rating = total_rating
      self.avg_rating = self.total_rating / non_spam_reviews_count
    else
      self.total_rating = nil
      self.avg_rating = nil
    end
  end

  # uses Cloudinary image transforms
  def resize_logo(width=150, height=150)
    url = self.logo_url.split('/')
    url[6] = "c_pad,w_%d,h_%d" % [width, height]
    self.logo_url = url.join('/')
  end
end
