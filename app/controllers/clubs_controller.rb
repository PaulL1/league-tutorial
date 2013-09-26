class ClubsController < ApplicationController
  before_filter :intercept_html_requests
  layout false
  respond_to :json

  # GET /clubs
  # GET /clubs.json
  def index
    @clubs = Club.all
    render json: @clubs
  end

  # GET /clubs/1
  # GET /clubs/1.json
  def show
    @club = Club.find(params[:id])

    render json: @club
  end

  # POST /clubs
  # POST /clubs.json
  def create
    @club = Club.new(params[:club])

    if @club.save
      render json: @club, status: :created, location: @club
    else
      render json: @club.errors, status: :unprocessable_entity
    end
  end

  # PUT /clubs/1
  # PUT /clubs/1.json
  def update
    @club = Club.find(params[:id])

    if @club.update_attributes(params[:club])
      head :no_content
    else
      render json: @club.errors, status: :unprocessable_entity
    end
  end

  # DELETE /clubs/1
  # DELETE /clubs/1.json
  def destroy
    @club = Club.find(params[:id])
    @club.destroy

    head :no_content
  end

  private
  def intercept_html_requests
    redirect_to('/') if request.format == Mime::HTML
  end
end