class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def not_found
    # TODO we should actually handle this error and somehow show our nice looking 404 page
    # raise ActionController::RoutingError.new('Not Found')
    redirect_to '/'
  end

  def authenticate_admin!
    redirect_to '/login' unless (user_signed_in? and current_user.admin?)
  end
end
