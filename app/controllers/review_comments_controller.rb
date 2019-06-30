class ReviewCommentsController < ApplicationController
  before_action :authenticate_user!, except: [:page]

  def page
    respond_to do |format|
      format.json do
        comments, total_pages = ReviewComment.page_comments_by_user_review(params[:user_review_token], params[:page])
        render json: {comments: comments, total_pages: total_pages}
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        comment = ReviewComment.new(review_comments_params)
        comment.user = current_user
        if comment.save
          comment = comment.slice('id', 'text', 'user_review_id', 'user_id', 'updated_at')
          comment[:commenter] = "#{current_user.first_name} #{current_user.last_name}"
          render json: comment
        else
          # we need a more cohesive way of handling not found JSON return values
          render json: {error: 'Comment failed to save.'}
        end
      end
    end
  end

  private

  def review_comments_params
    params.permit(:text, :user_review_id)
  end
end
