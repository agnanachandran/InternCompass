class UserToReviewVotesController < ApplicationController
  before_action :authenticate_user!

  def create
    respond_to do |format|
      format.json do
        utrv = UserToReviewVote.find_or_initialize_by(
          user_id: current_user.id,
          user_review_id: params[:user_review_id]
        )
        utrv.vote = params[:vote]
        utrv.save
        render json: utrv
      end
    end
  end

  def delete
    respond_to do |format|
      format.json do
        utrv = UserToReviewVote.find_by(
          user_id: current_user.id,
          user_review_id: params[:user_review_id]
        )
        if !utrv.blank?
          utrv.delete
        end
        render json: utrv
      end
    end
  end
end