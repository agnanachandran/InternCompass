class FeedbackController < ApplicationController
  def create
    feedback = Feedback.new
    feedback.name = params[:name]
    feedback.email = params[:email]
    feedback.comment = params[:comment]

    if feedback.save
      respond_to do |format|
        format.json do
          head :ok, content_type: "text/html"
        end
      end
    else
      render json: {
        errors: feedback.errors.messages,
      },
      status: 500
    end
  end
end