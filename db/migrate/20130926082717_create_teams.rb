class CreateTeams < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.references :club
      t.string :name
      t.string :captain
      t.datetime :date_created

      t.timestamps
    end
    add_index :teams, :club_id
  end
end
