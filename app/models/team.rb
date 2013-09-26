class Team < ActiveRecord::Base
  belongs_to :club
  attr_accessible :captain, :date_created, :name, :club_id
end
