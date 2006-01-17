class Map < ActiveRecord::Base
  has_many :areas
  has_many :map_areas
end
