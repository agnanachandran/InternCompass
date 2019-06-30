require 'will_paginate/array'

class UserReviewsController < ApplicationController
  before_action :authenticate_user!, except: [:show, :recent_user_reviews]

  def new
    perks = PerkTag.all
    @props = { review: { createReview: { suggestedPerks: perks } } }
    respond_to do |format|
      format.html
      format.json { render json: @props }
    end
  end

  def destroy
    user_review = UserReview.find_by_token(params[:id])
    if current_user.id == user_review.user_id
      user_review.delete
      respond_to do |format|
        format.json { head :ok, content_type: 'text/html' }
      end
    else
      render status: 401 # forbidden
    end
  end

  def show
    review = UserReview.get_user_review(params[:id], current_user)
    comments, total_pages = ReviewComment.page_comments_by_user_review(params[:id], 1)
    @props = {
      review: {
        review: review,
        comments: {
          comments: comments,
          total_pages: total_pages
        }
      }
    }
    respond_to do |format|
      format.html
      format.json { render json: @props }
    end
  end

  def currency_from_country
    respond_to do |format|
      format.json do
        render json: { currency: UserReview.currency_from_country(params[:country_code]) }
      end
    end
  end

  def create
    # TODO: add transaction here so if one step fails, rollback
    review = UserReview.new(user_review_params)
    review.salary_in_cents = (params[:user_review][:salary].to_f * 100).round
    # fetch company or create company if not exists
    company_name = params[:company_name]
    company = Company.find_by_slug(Utils.slugify(company_name))
    company = Company.new(name: company_name) if company.nil?
    if company.save
      # fetch job or create job if not exists
      job_title = params[:job_title]
      job_location = params[:location]
      job = Job.find_by(company_id: company.id, slug: Utils.slugify(job_title), location: job_location)
      if job.nil?
        job = Job.new
        job.title = job_title
        job.company = company
        job.location = job_location
      end
      if job.save
        review.job = job
        review.user = current_user
        review.company = company
        if review.save
          # update company and job average ratings
          job.new_review_update(review)
          job.save
          company.new_review_update(review)
          company.save
          unless params[:perks].nil?
            perk_names = params[:perks].values.map{|perk| perk[:name]}
            PerkTag.where(name: perk_names).each do |perk|
              UserReviewToPerkTag.create(user_review: review, perk_tag: perk)
            end
          end
          render json: {
            token: review.token,
            description: review.description,
            currency: review.currency,
            overall_rating: review.overall_rating,
            mentorship_rating: review.mentorship_rating,
            work_life_balance_rating: review.work_life_balance_rating,
            meaningful_work_rating: review.meaningful_work_rating,
            company_name: company_name,
            company_slug: company.slug,
            job_title: job_title,
            upvote: 0,
            downvote: 0,
            user_id: review.anonymous ? nil : review.user_id,
          }
          return
        end
      end
    end
    render json: {
      errors: {
        user_review: review.errors.messages,
        job: job.errors.messages,
      },
    },
    status:500
  end

  def recent_user_reviews
    respond_to do |format|
      format.json { render json: { review: { recent_reviews: UserReview.get_recent_user_reviews } } }
    end
  end

  private

  def user_review_params
    params.require(:user_review).permit(:overall_rating,
                  :mentorship_rating,
                  :work_life_balance_rating,
                  :meaningful_work_rating,
                  :currency,
                  :description,
                  :anonymous,
                  :pay_period)
  end
end
