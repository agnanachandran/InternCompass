class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
  clear_respond_to
  respond_to :json

  # GET /login
  def new
    respond_to :html
  end

  # POST /resource/sign_in
  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  def token
    render json: {
      token: form_authenticity_token,
      param: request_forgery_protection_token
    }
  end
  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
