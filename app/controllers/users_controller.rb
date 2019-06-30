require 'uri'

class UsersController < ApplicationController
  before_action :authenticate_user!, except: :show

  def show
    user = User.find_by_token!(params[:id])
    user_profile = UserProfile.find_by_user_id(user.id)
    user_profile_json = user_profile.as_json(only: user_profile_fields)

    @props = {
      user: {
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          img_url: user.image_url,
          reviews: get_visible_reviews(user),
          following: get_following(user),
          token: user.token,
          profile_data: user_profile_json,
        }
      }
    }
    respond_to do |format|
      format.html
      format.json { render json: @props }
    end
  end

  def edit
    user = User.find(current_user.id)
    user_profile = UserProfile.find_by_user_id(user.id)
    user_profile_json = user_profile.as_json(only: user_profile_fields)

    @props = {
      user: {
        user: {
          token: user.token,
          profile_data: user_profile_json,
        }
      }
    }
    respond_to do |format|
      format.html
      format.json { render json: @props }
    end
  end

  def update
    profile = UserProfile.find_by_user_id(current_user.id)
    profile = UserProfile.new if profile.nil?

    profile.bio = params[:bio] if params[:bio]

    profile.school = params[:school] if params[:school]
    profile.program = params[:program] if params[:program]

    validate_personal_site_url(profile, params[:personal_website])
    profile.personal_website = params[:personal_website]

    validate_blog_url(profile, params[:blog])
    profile.blog = params[:blog]

    validate_linkedin(profile, params[:linkedin])
    profile.linkedin = params[:linkedin]

    validate_twitter(profile, params[:twitter])
    profile.twitter = params[:twitter]

    validate_github(profile, params[:github])
    profile.github = params[:github]

    validate_dribbble(profile, params[:dribbble])
    profile.dribbble = params[:dribbble]

    if profile.errors.count == 0
      profile.user_id = current_user.id
      profile.save
      respond_to do |format|
        format.json { head :ok, content_type: 'text/html' }
      end
    else
      render json: { :errors => profile.errors }, status: 400
    end
  end

  private

  def validate_personal_site_url(profile, url)
    profile.errors.add(:validation, 'Invalid personal website URL.') unless validate_url(url)
  end

  def validate_blog_url(profile, url)
    profile.errors.add(:validation, 'Invalid blog URL.') unless validate_url(url)
  end

  def validate_url(url)
    uri = URI.parse(url)
    url.length == 0 || uri.kind_of?(URI::HTTP) || uri.kind_of?(URI::HTTPS)
  end

  # Twitter usernames must be 15 characters or less and can contain only
  # alphanumeric characters and underscores according to
  # https://support.twitter.com/articles/101299
  def validate_twitter(profile, username)
    profile.errors.add(:validation, 'Invalid Twitter handle.') unless username.length <= 15 && username.match(/^[a-zA-Z0-9_]*$/)
  end

  # LinkedIn generated profile urls contain alphanumeric characters and dashes.
  # Users are able to update their url, but it is a subset of these characters so checking
  # for just the generated case should be okay
  def validate_linkedin(profile, username)
    profile.errors.add(:validation, 'Invalid LinkedIn profile URL.') unless username.length <= 50 && username.match(/^[a-zA-Z0-9-]*$/)
  end

  # Github usernames can only contain alphanumeric characters and single hyphens, but
  # not at the beginning or end, allowing hyphens anywhere for now
  def validate_github(profile, username)
    profile.errors.add(:validation, 'Invalid Github username.') unless username.length <= 39 && username.match(/^[a-zA-Z0-9-]*$/)
  end

  # Dribbble usernames must be 20 characters or less and can contain only
  # alphanumeric characters, underscores and dashes
  def validate_dribbble(profile, username)
    profile.errors.add(:validation, 'Invalid Dribbble username.') unless username.length <= 20 && username.match(/^[a-zA-Z0-9_-]*$/)
  end

  def get_following(user)
    if (current_user.present? && current_user.id == user.id)
      company_ids = FollowingCompany.where(user_id: user.id).pluck(:company_id)
      following_companies = Company.find(company_ids)
      following_companies.map { |company| company.slice(*Company.company_widget_attributes) }
    else
      []
    end
  end

  def get_visible_reviews(user)
    if (current_user.present? && current_user.id == user.id)
      reviews = UserReview.includes(job: [:company])
        .where(id: user.user_review_ids)
        .order(created_at: :desc)
    else
      reviews = UserReview.includes(job: [:company])
        .where(id: user.user_review_ids, anonymous: false)
        .order(created_at: :desc)
    end
    reviews.map do |review|
      {
        company_name: review.job.company.name,
        created_at: review.created_at,
        id: review.id,
        job_id: review.job.id,
        job_name: review.job.title,
        description: review.description,
        token: review.token,
        company_logo_url: review.job.company.logo_url,
        company_slug: review.job.company.slug
      }
    end
  end

  private

  def user_profile_fields
    [
      :school,
      :program,
      :personal_website,
      :github,
      :linkedin,
      :twitter,
      :blog,
      :dribbble,
      :bio
    ]
  end

end
