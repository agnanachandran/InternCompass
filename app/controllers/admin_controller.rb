class AdminController < ApplicationController
  before_filter :authenticate_admin!
  PER_PAGE = 10

  def index
    admin_main_data = {
      new_users_count: created_today(User).count,
      new_reviews_count: created_today(UserReview).count,
      new_jobs_count: created_today(Job).count,
      new_companies_count: created_today(Company).count,
      all_users_count: User.count,
      all_reviews_count: UserReview.count,
      all_jobs_count: Job.count,
      all_companies_count: Company.count
    }
    respond_to do |format|
      format.html
      format.json do
        render json: admin_main_data
      end
    end
  end

  def users
    users_page = params[:page] || 1
    users_page = users_page.to_i
    all_users_only = params[:all_users_only] || false
    all_users = User.select(user_fields).order('email ASC').paginate(page: users_page, per_page: PER_PAGE)
    admin_users_data = {
      users: all_users,
      users_pagination: {
        total_pages: all_users.total_pages,
        current_page: users_page
      }
    }
    user_review_counts = {}
    admin_users_data[:users].each do |user|
      user_review_counts[user.id] = user.user_reviews.count
    end
    if all_users_only != 'true'
      admin_users_data[:admin_users] = User.select(user_fields).where(admin: true)
      admin_users_data[:new_users] = created_today(User).select(user_fields)
      admin_users_data[:admin_users].each do |user|
        user_review_counts[user.id] = user.user_reviews.count
      end
      admin_users_data[:new_users].each do |user|
        user_review_counts[user.id] = user.user_reviews.count
      end
    end
    admin_users_data[:user_review_counts] = user_review_counts
    respond_to do |format|
      format.html
      format.json do
        render json: admin_users_data
      end
    end
  end

  def user_reviews
    user_reviews_page = params[:page] || 1
    user_reviews_page = user_reviews_page.to_i
    user_reviews = UserReview
      .order('created_at DESC')
      .paginate(page: user_reviews_page, per_page: PER_PAGE)
    admin_user_reviews_data = {
      user_reviews: user_reviews
        .as_json(
          only: user_review_fields,
          include: {
            company: { only: [:name] },
            user: { only: [:first_name, :last_name, :email] },
            job: { only: [:title] },
            curated_recent_review: { only: [:id] },
          }),
      user_reviews_pagination: {
        total_pages: user_reviews.total_pages,
        current_page: user_reviews_page
      }
    }
    respond_to do |format|
      format.html
      format.json do
        render json: admin_user_reviews_data
      end
    end
  end

  def companies
    admin_companies_data = {}
    if not(params.has_key? :approved) || params[:approved] == 'true'
      approved_companies_page = params[:approved_page] || 1
      approved_companies_page = approved_companies_page.to_i
      approved_companies = Company
        .approved
        .order('name ASC')
        .paginate(page: approved_companies_page, per_page: PER_PAGE)
      admin_companies_data[:approved_companies] = approved_companies
      admin_companies_data[:approved_companies_pagination] = {
        total_pages: approved_companies.total_pages,
        current_page: approved_companies_page
      }
    end
    if not(params.has_key? :approved) || params[:approved] == 'false'
      not_approved_companies_page = params[:not_approved_page] || 1
      not_approved_companies_page = not_approved_companies_page.to_i
      not_approved_companies = Company
        .not_approved
        .order('created_at DESC')
        .paginate(page: not_approved_companies_page, per_page: PER_PAGE)
      admin_companies_data[:not_approved_companies] = not_approved_companies
      admin_companies_data[:not_approved_companies_pagination] = {
        total_pages: not_approved_companies.total_pages,
        current_page: not_approved_companies_page
      }
    end
    respond_to do |format|
      format.html
      format.json do
        render json: admin_companies_data
      end
    end
  end

  def jobs
  end

  def feedback
    # TODO: use pagination
    all_feedback = Feedback.all.order(created_at: :desc)
    respond_to do |format|
      format.html
      format.json do
        render json: all_feedback
      end
    end
  end

  def edit_company
    respond_to do |format|
      format.html
      format.json do
        render json: { company: build_company_json(Company.find_by_slug(params[:slug])) }
      end
    end
  end

  def update_company
    company = Company.find(params[:id])
    company.company_categories.destroy_all
    params[:company][:categories].split(",").map(&:strip).each do |category_name|
      company.add_category(category_name)
    end
    success = company.update_attributes(company_params)
    respond_to do |format|
      format.json do
        render json: {
          success: success,
          company: build_company_json(company.reload)
        }
      end
    end
  end

  def toggle_spam
    user_review = UserReview.find(params[:user_review_id])
    if user_review.user_review_spam.nil?
      user_review.mark_as_spam(current_user, '')
    else
      user_review.unmark_as_spam(current_user)
    end
    user_review.reload
    respond_to do |format|
      format.json do
        render json: user_review.as_json(only: user_review_fields, include: [:company, :user, :job])
      end
    end
  end

  def approve_company
    approved_companies_page = params[:approved_page] || 1
    not_approved_companies_page = params[:not_approved_page] || 1
    company = Company.find(params[:company_id])
    company.update(approved: true)
    approved_companies = Company
      .approved
      .order('created_at DESC')
      .paginate(page: approved_companies_page, per_page: PER_PAGE)
    not_approved_companies = Company
      .not_approved
      .order('created_at DESC')
      .paginate(page: not_approved_companies_page, per_page: PER_PAGE)
    admin_companies_data = {
      approved_companies: approved_companies,
      approved_companies_pagination: {
        total_pages: approved_companies.total_pages,
        current_page: approved_companies_page
      },
      not_approved_companies: not_approved_companies,
      not_approved_companies_pagination: {
        total_pages: not_approved_companies.total_pages,
        current_page: not_approved_companies_page
      }
    }
    respond_to do |format|
      format.json do
        render json: admin_companies_data
      end
    end
  end

  def delete_review
    user_review = UserReview.find(params[:user_review_id])
    user_review.delete
    respond_to do |format|
      format.json do
        head :ok, content_type: "text/html"
      end
    end
  end

  def toggle_curated
    user_review = UserReview.find(params[:user_review_id])
    if user_review.curated_recent_review.nil?
      curated_review = CuratedRecentReview.new(user_review: user_review)
      curated_review.save
    else
      user_review.curated_recent_review.destroy
      curated_review = nil
    end
    respond_to do |format|
      format.json do
        render json: curated_review
      end
    end
  end

  private

  def created_today(model_class)
    model_class.where('created_at >= ?', Time.zone.now.beginning_of_day)
  end

  def user_fields
    [
      :token,
      :id,
      :first_name,
      :last_name,
      :email,
      :created_at,
      :provider,
      :admin,
      :uid,
    ]
  end

  def user_review_fields
    [
      :token,
      :id,
      :overall_rating,
      :mentorship_rating,
      :work_life_balance_rating,
      :meaningful_work_rating,
      :salary_in_cents,
      :pay_period,
      :currency,
      :description,
      :company_id,
      :job_id,
      :user_id,
      :user_review_spam_id,
      :created_at,
    ]
  end

  def company_fields
    [
      :id,
      :name,
      :description,
      :slug,
      :website_url,
      :careers_url,
      :logo_url,
      :size
    ]
  end

  def company_params
    params.require(:company).permit(:name, :slug, :description, :website_url, :careers_url, :logo_url)
  end

  def build_company_json(company)
    company_json = company.as_json(only: company_fields)
    company_json['categories'] = company.company_categories.map { |category| category.name }.join(', ')
    company_json
  end
end
