class Users::PasswordsController < Devise::PasswordsController
  clear_respond_to
  respond_to :json

  # GET /forgot_password
  def new
    respond_to :html
  end

  # POST /forgot_password
  # def create
  #   super
  # end

  # GET /change_password
  # def edit
  #   super
  # end

  # PUT /change_password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      sign_in(resource_name, resource)
      render json: resource
    else
      set_minimum_password_length
      respond_with resource
    end
  end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
