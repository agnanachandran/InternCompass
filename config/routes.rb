Rails.application.routes.draw do
  devise_for :users, skip: [:registrations, :sessions, :passwords, :confirmations], controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  devise_scope :user do
    get '/login' => 'users/sessions#new', :as => :new_user_session
    get '/signup' => 'users/registrations#new', :as => :new_user_registration
    post '/login' => 'users/sessions#create', :as => :user_session
    delete '/logout' => 'users/sessions#destroy', :as => :destroy_user_session
    get '/forgot_password' => 'users/passwords#new', :as => :new_user_password
    post '/forgot_password' => 'users/passwords#create', :as => :user_password
    get '/change_password' => 'users/passwords#edit', :as => :edit_user_password
    put '/change_password' => 'users/passwords#update'
    post '/users' => 'users/registrations#create', :as => :user_registration
    get '/token' => 'users/sessions#token'
    get '/users/confirmation' => 'users/confirmations#show', :as => :user_confirmation
  end

  root 'compass#index'
  get '/suggest', to: 'companies#suggest'

  # user routes
  scope '/users' do
    get 'update-profile', to: 'users#edit'
    put 'update-profile', to: 'users#update'
  end
  # Do not remove this line; it is necessary for Devise to work properly.
  # It must also be the last /users/* route to prevent it from trying to match the ending to a user's token
  resources :users, only: [:show]

  scope '/user_reviews' do
    get 'comments', to: 'review_comments#page'
    post 'comments', to: 'review_comments#create'
    get 'currency_from_country', to: 'user_reviews#currency_from_country'
    get 'recent', to: 'user_reviews#recent_user_reviews'
  end

  resources :user_reviews, only: [:create, :show, :destroy]

  get '/write-review', to: 'user_reviews#new'

  resources :user_to_review_votes, only: [:create]

  scope '/user_to_review_votes' do
    post 'delete', to: 'user_to_review_votes#delete'
  end

  scope '/jobs' do
    get 'search', to: 'jobs#search'
  end

  resources :jobs, only: [:show]

  get '/search', to: 'companies#search'
  get '/companies.json', to: 'companies#companies_by_category'

  # company routes
  scope '/companies' do
    post 'follow', to: 'companies#follow'
    post 'unfollow', to: 'companies#unfollow'
  end
  resources :companies, except: [:new]

  # critiques routes
  scope '/critiques' do
    get '/', to: 'critiques#index'
    get 'page/:page', to: 'critiques#index'
    get 'upload', to: 'compass#index'
    post 'upload', to: 'critiques#create'
    get ':critique_token', to: 'critiques#show'
    delete ':critique_token', to: 'critiques#destroy'
  end

  resources :critique_comments, only: [:create, :update, :destroy]

  resources :interview_questions, only: [:index, :show] do
    get 'get_filters', on: :collection
  end

  resources :feedback, only: :create

  get '/notifications.json', to: 'notifications#index'
  put '/notifications/mark-seen', to: 'notifications#mark_as_seen'

  scope '/reports' do
    post 'critique', to: 'reports#critique'
    post 'critique_comment', to: 'reports#critique_comment'
  end

  namespace :admin, module: false do
    get '/', to: 'admin#index'
    get '/users', to: 'admin#users'
    get '/companies', to: 'admin#companies'
    get '/companies/edit/:slug', to: 'admin#edit_company'
    post '/approve_company', to: 'admin#approve_company'
    post '/companies/update/:id', to: 'admin#update_company'
    get '/feedback', to: 'admin#feedback'
    get '/user_reviews', to: 'admin#user_reviews'
    post '/companies/create_company_category', to: 'admin#create_company_category'
    post '/toggle_spam', to: 'admin#toggle_spam'
    post '/toggle_curated', to: 'admin#toggle_curated'
    post '/delete_review', to: 'admin#delete_review'
  end

  get '/*path' => 'compass#index'
end
