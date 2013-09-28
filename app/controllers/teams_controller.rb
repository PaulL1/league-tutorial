class TeamsController < ApplicationController
  before_filter :intercept_html_requests
  layout false
  respond_to :json

  # GET /teams.json
  def index
    @teams = Team.all

    render_with_protection @teams.to_json
  end

  # GET /teams/1.json
  def show
    @team = Team.find(params[:id])

    render_with_protection @team.to_json
  end

  # POST /teams.json
  def create
    @team = Team.new(params[:team])

    if @team.save
      render_with_protection @team.to_json, {status: :created, location: @team}
    else
      render_with_protection @team.errors.to_json, {status: :unprocessable_entity}
    end
  end

  # PUT /teams/1.json
  def update
    @team = Team.find(params[:id])

    if @team.update_attributes(params[:team])
      head :no_content
    else
      render_with_protection @team.errors.to_json, {status: :unprocessable_entity}
    end
  end

  # DELETE /teams/1.json
  def destroy
    @team = Team.find(params[:id])
    @team.destroy

    head :no_content
  end

  private
  def intercept_html_requests
    redirect_to('/') if request.format == Mime::HTML
  end
end