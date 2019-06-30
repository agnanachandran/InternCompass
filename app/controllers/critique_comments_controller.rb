class CritiqueCommentsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :edit]

  def create
    critique_token = params.require(:critique_token)
    text = params[:text].strip
    critique = Critique.find_by_token(critique_token)
    if critique
      critique_comment = CritiqueComment.new(text: text)
      critique_comment.user = current_user
      critique_comment.critique = critique
      if critique_comment.save
        # Create a notification if the commenter is not the critique creator
        if current_user.id != critique.user.id
          notification = Notification.new(
            content: {critique_token: critique_token},
            user_id: critique.user.id,
            notifier_id: current_user.id,
            category: Notification.categories['critique_comment'],
          )
          notification.save
        end
        render json: {
          comments: critique.get_comments_for_critique
        }
        return
      end
    end

    render json: {
      error: 'Something went wrong when posting your comment!'
    },
    status: 500
  end

  def update
    comment_id = params.require(:comment_id)
    text = params[:text].strip
    critique_comment = CritiqueComment.find_by_id(comment_id)
    if critique_comment
      critique_comment.text = text
      if critique_comment.save
        critique = critique_comment.critique
        render json: {
          comments: critique.get_comments_for_critique
        }
        return
      end
    end

    render json: {
      error: 'Something went wrong when editing your comment!'
    },
    status: 500
  end

  def destroy
    comment_id = params.require(:comment_id)
    critique_comment = CritiqueComment.find_by_id(comment_id)
    if critique_comment.user_id != current_user.id and not current_user.admin
      render json: {
        error: 'Invalid user ID.'
      },
      status: 401
      return
    end

    critique = critique_comment.critique
    if critique_comment.destroy!
      render json: {
        comments: critique.get_comments_for_critique
      }
      return
    end

    render json: {
      error: 'Something went wrong when deleting your comment!'
    },
    status: 500
  end

end

