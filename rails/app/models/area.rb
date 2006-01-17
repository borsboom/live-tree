class Area < ActiveRecord::Base
  VANCOUVER_ISLAND_ID = 1

  acts_as_tree :order => "name", :counter_cache => true
  belongs_to :map
end
