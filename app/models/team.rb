class Team < ActiveRecord::Base
  belongs_to :club
  attr_accessible :captain, :date_created, :name
end
