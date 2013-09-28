class HomeController < ApplicationController
  def index
    redirect_to('/UI/index.html')
  end
end