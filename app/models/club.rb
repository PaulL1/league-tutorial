class Club < ActiveRecord::Base
  attr_accessible :contact_officer, :date_created, :name
  validates :name, presence: true
end