class CreateClubs < ActiveRecord::Migration
  def change
    create_table :clubs do |t|
      t.string :name
      t.string :contact_officer
      t.datetime :date_created

      t.timestamps
    end
  end
end
