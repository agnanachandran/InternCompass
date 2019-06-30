class CompaniesController < ApplicationController
  before_action :authenticate_user!, only: [:follow, :unfollow]
  PER_PAGE = 15
  SUGGEST_PER_PAGE = 5
  LIST_LIMIT = 12
  MIN_COMPANIES = 7
  NUM_RECOMMENDED_COMPANIES = 6

  def companies_by_category
    company_attributes = Company.company_widget_attributes

    companies_data = CompanyCategory.order(:name).all.map do |category|
      companies = Company.most_reviewed_by_category(category.id, company_attributes, LIST_LIMIT)
      if companies.blank? || companies.count < MIN_COMPANIES
        nil
      else
        {
          title: category.name,
          companies: companies.map do |c|
            c.slice(*company_attributes)
          end
        }
      end
    end

    companies_data.compact!

    companies_data.unshift(
      {
        title: 'Most Reviewed',
        companies: Company.most_reviewed(company_attributes, LIST_LIMIT).map do |c|
          c.slice(*company_attributes)
        end
      }
    )

    render json: companies_data
  end

  def search
    page = params[:page]
    if page.blank? or page.to_i < 1
      page = 1
    end

    query = params[:query]
    order = params[:order]
    location_filter = params[:location_filter] || []
    location_filter.reject! { |f| f.empty? }

    search = Company.search(include: [:jobs]) do
      keywords query do
        highlight :description, fragment_size: 0
      end
      with(:job_locations, location_filter) unless location_filter.empty?
      paginate page: page, per_page: PER_PAGE
      if order == 'most_reviews'
        order_by(:user_reviews_count, :desc)
      elsif order == 'highest_rating'
        order_by(:avg_rating, :desc)
      end
    end

    id_to_company = Hash.new
    search.results.each do |result|
      id = result.id
      num_jobs = result.jobs.count
      num_reviews = result.user_reviews_count
      result = result.slice('slug', 'name', 'description', 'logo_url')
      result['num_jobs'] = num_jobs
      result['num_reviews'] = num_reviews
      id_to_company[id] = result
    end

    company_results = []
    search.hits.each do |hit|
      company = id_to_company[hit.primary_key.to_i]
      if !company.blank?
        if !hit.highlights.blank?
          desc_hl = hit.highlights[0].format { |query| "*#{query}*" }
          company['description'] = desc_hl
        end
        company_results.push(company)
      end
    end

    results = {
      results: company_results,
      query: query,
      order: order,
      location_filter: location_filter,
      page: page,
      total_pages: search.results.total_pages,
    }

    respond_to do |format|
      format.html do
        @props = { search: results }
      end
      format.json do
        render json: results.to_json
      end
    end
  end

  def suggest
    respond_to do |format|
      format.json do
        search = Company.search do
          keywords params[:query] do
            fields(:name)
          end
          paginate page: 1, per_page: SUGGEST_PER_PAGE
        end

        id_to_company = Hash.new
        search.results.each do |result|
          id_to_company[result.id] = result.slice('name', 'slug')
        end

        company_names = []
        names_to_slugs = {}
        search.hits.each do |hit|
          company = id_to_company[hit.primary_key.to_i]
          if !company.blank?
            company_names.push(company[:name])
            names_to_slugs[company[:name]] = company[:slug]
          end
        end
        render json: { names: company_names, slugs: names_to_slugs }
       end
     end
  end

  def most_reviews
    respond_to do |format|
      format.json { render json: Company.most_reviews(5) }
    end
  end

  def show
    company = Company
                .select([:id,
                    :name,
                    :description,
                    :logo_url,
                    :hq_city,
                    :hq_region,
                    :website_url,
                    :careers_url,
                    :user_reviews_count,
                    :avg_rating,
                  ])
                .includes(:company_categories, user_reviews: [:user, :job])
                .find_by_slug(params[:id])
    company_json = company.as_json
    company_json[:is_following] =
      if user_signed_in?
        FollowingCompany.exists?(company_id: company.id, user_id: current_user.id)
      else
        false
      end

    job_to_perks = {} # TODO, this should be on the job model, similar to job.avg_salary
    company.user_reviews.map do |r|
      unless job_to_perks.key?(r.job.id) then
        job_to_perks[r.job.id] = Set.new
      end
      job_to_perks[r.job.id].merge(r.perk_tags)
    end

    # TODO we shouldn't be duplicating job title, salary, etc by putting it in every review
    # we should instead send out both job and review data, and each review
    # can have a job_id on it to know which job it's for
    reviews_json = company.user_reviews.map do |r|
      review = r.slice('id', 'token', 'description', 'anonymous', 'created_at', 'overall_rating',
                       'mentorship_rating', 'work_life_balance_rating', 'meaningful_work_rating')
      review[:name] = r.anonymous ? nil : "#{r.user.first_name} #{r.user.last_name[0]}."
      review[:is_for_current_user] = current_user.present? && current_user.id == r.user.id
      review[:user_token] = r.anonymous ? nil : r.user.token
      review[:user_profile_photo] = r.anonymous ? nil : r.user.image_url
      review[:job_title] = r.job.title
      review[:job_location] = r.job.location
      review[:job_perks] = job_to_perks[r.job.id]
      salary_in_subunits = (r.job.avg_salary_in_cents/100.0).round * Money::Currency.new(r.currency).subunit_to_unit
      formatted_salary = Money.new(salary_in_subunits, r.currency).format(no_cents: true)
      review[:job_average_salary] = formatted_salary
      review[:job_currency] = r.currency
      review[:job_average_rating] = r.job.avg_rating
      review[:helpfulness] = r.get_helpfulness
      review[:upvote] = r.get_upvotes
      review[:downvote] = r.get_num_votes - review[:upvote]
      review[:user_vote] = r.get_user_vote(current_user)

      review
    end

    recommended_companies_json = Company.recommended_companies(company,
                                                               Company.company_widget_attributes,
                                                               NUM_RECOMMENDED_COMPANIES)

    respond_to do |format|
      format.html do
        @props = {
          company: {
            company: company_json,
            recommended_companies: recommended_companies_json
          },
          review: {
            reviews: reviews_json
          }
        }
        @props[:company][:company][:fully_loaded] = true
      end
      format.json {
        render json: {
          company: company_json,
          recommended_companies: recommended_companies_json,
          reviews: reviews_json
        }
      }
    end
  end

  def follow
    company = Company.find_by_slug(params[:slug])
    if company
      following = FollowingCompany.new(company_id: company.id, user_id: current_user.id)
      following.save
    end
    head :ok, content_type: 'text/html'
  end

  def unfollow
    company = Company.find_by_slug(params[:slug])
    following = FollowingCompany.find_by_company_id_and_user_id(company.id, current_user.id)
    if following
      following.destroy
    end
    head :ok, content_type: 'text/html'
  end

end
