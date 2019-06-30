MAX_FILE_SIZE = 5 * 1024 * 1024
CRITIQUE_ATTRIBUTES = [:id, :token, :description, :updated_at]
PER_PAGE = 10

class CritiquesController < ApplicationController
  before_action :authenticate_user!, only: [:create]

  def index
    user_critiques = []
    if current_user.present?
      user_critiques = Critique.where(user_id: current_user.id).order(created_at: :desc)
    end

    page = params[:page] or 1

    critiques = Critique.select([:id, :token, :user_id, :description, :updated_at])
                        .order(created_at: :desc)
                        .includes(:critique_comments)
                        .paginate(page: page, per_page: PER_PAGE)

    critique_creators = {}
    critiques.each do |c|
      critique_creators[c.id] = User.find_by_id(c.user_id).get_public_user_info()
    end

    @props = {
      critique: {
        user_critiques: user_critiques.map do |c|
          c.slice(*CRITIQUE_ATTRIBUTES)
        end,
        critiques: critiques.map do |c|
          critique_object = c.slice(*CRITIQUE_ATTRIBUTES)
          critique_object = critique_object.as_json()
          critique_object['comment_count'] = c.critique_comments.count
          critique_object
        end,
        total_pages: (Critique.count/PER_PAGE.to_f).ceil
      },
      user: {
        critique_creators: critique_creators
      }
    }

    respond_to do |format|
      format.html
      format.json { render json: @props }
    end
  end

  def show
    critique = Critique.select([:id, :user_id, :description, :updated_at])
                        .includes(:critique_comments)
                        .find_by_token(params.require(:critique_token))
    if critique.nil?
      not_found()
      return
    end

    critique_creator_id = critique.user_id
    critique_creator = User.find_by_id(critique_creator_id).get_public_user_info()
    resume = Resume.select([:s3_key]).find_by_critique_id(critique.id)
    @props = {
      critique: {
        critique: {
          token: params[:critique_token],
          description: critique.description,
          updated_at: critique.updated_at,
          resume_key: resume.s3_key,
          comments: critique.get_comments_for_critique
        }
      },
      user: {
        critique_creator: critique_creator
      }
    }
    respond_to do |format|
      format.html
      format.json { render json: @props }
    end
  end

  def create
    file = params.require(:file)
    description = params[:description].strip

    if file.content_type != 'application/pdf'
      render json: {
        error: 'Invalid file type; ensure you are uploading a PDF.'
      },
      status: 400
      return
    end

    if file.size() > MAX_FILE_SIZE
      render json: {
        error: 'Invalid file size; ensure the file size is < 5 MB.'
      },
      status: 400
      return
    end

    if Critique.exists?(user_id: current_user.id)
      render json: {
        error: 'Only one resume may be uploaded at a time.'
      },
      status: 400
      return
    end

    uuid_key = SecureRandom.uuid
    s3_obj = S3Client.get_resume_object(uuid_key)
    s3_obj.put(body: file.tempfile)

    ActiveRecord::Base.transaction do
      resume = Resume.new(s3_key: uuid_key, file_name: file.original_filename, size_in_bytes: file.size())
      critique = Critique.new(description: description)
      critique.user = current_user
      if critique.save
        resume.critique = critique
        resume.save
      end

      render json: {
        critiqueToken: critique.token
      }
    end
  end

  def destroy
    critique_token = params.require(:critique_token)
    critique = Critique.find_by_token(critique_token)
    if critique.user_id != current_user.id and not current_user.admin
      render json: {
        error: 'Invalid user ID.'
      },
      status: 401
      return
    end

    if critique.destroy!
      render json: {}
      return
    end

    render json: {
      error: 'Something went wrong when deleting your critique!'
    },
    status: 500
  end

end
