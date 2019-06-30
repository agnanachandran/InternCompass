class JobsController < ApplicationController
  SUGGEST_PER_PAGE = 5

  def show
    company_slug = params[:company_slug]
    job_slug = params[:job_slug]

    company = Company.find_by_slug(company_slug)
    job = Job.where(company_id: company.id).find_by_slug!(job_slug)
    review_ids =  job.user_review_ids
    reviews = UserReview.find(review_ids)

    reviews_json = reviews.map { |review|
      review.as_json(only: [:id, :description, :salary, :upvote, :downvote])
    }

    @props={
      job: {
        job: {
          id: job.id,
          title: job.title,
          company: company.name,
          reviews:  reviews_json,
          slug: job.slug,
        }
      }
    }
    
    respond_to do |format|
      format.html
      format.json { render json: @props }
    end
  end 

  def search
    respond_to do |format|
      format.json do
        company = Company.find_by_name(params[:company_name])

        if company.blank?
          return render json: []
        end

        search = Job.search do
          keywords params[:query] do
            fields(:title)
          end
          with :company_id, company.id
          paginate page: 1, per_page: SUGGEST_PER_PAGE
        end

        id_to_job = Hash.new
        search.results.each do |result|
          id_to_job[result.id] = result[:title]
        end

        result = []
        search.hits.each do |hit|
          job = id_to_job[hit.primary_key.to_i]
          if !job.blank?
            job_title = id_to_job[hit.primary_key.to_i]
            if !job_title.blank?
              result.push(job_title)
            end
          end
        end

        render json: result.uniq
      end
    end
  end
end
