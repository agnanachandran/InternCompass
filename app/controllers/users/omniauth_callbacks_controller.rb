class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    if request.env['omniauth.auth'].info.email.blank?
      redirect_to '/users/auth/facebook?auth_type=rerequest&scope=email'
      return
    end

    @user = User.from_omniauth(request.env['omniauth.auth'])

    if @user.persisted?
      sign_in @user, event: :authentication #this will throw if @user is not activated
      params = request.env['omniauth.params']
      if params['from'] == 'write_review'
        url = '/write-review'
        if !(params['company'].blank?)
          url = "#{url}?company=#{params['company']}"
        end
        redirect_to url
      elsif params['from'] == 'companies'
        redirect_to "/companies/#{params['slug']}"
      elsif params['from'] == 'critiques_upload'
        redirect_to '/critiques/upload'
      else
        redirect_to '/'
      end
    else
      session['devise.facebook_data'] = request.env['omniauth.auth']
      redirect_to new_user_registration_url
    end
  end

  def failure
    redirect_to root_path
  end
end
