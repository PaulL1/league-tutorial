LeagueTutorial::Application.routes.draw do

  devise_for :users

  root to: 'home#index'
  resources :clubs, :except => [:new, :edit]
  resources :teams, :except => [:new, :edit]
end
