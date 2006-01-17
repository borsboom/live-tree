class MapArea < ActiveRecord::Base
  belongs_to :map
  belongs_to :area
end
