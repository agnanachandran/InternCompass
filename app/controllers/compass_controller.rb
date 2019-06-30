class CompassController < ApplicationController
  def index
    reviews = UserReview.get_recent_user_reviews
    @props = { review: { recent_reviews: reviews } }
  end
end

