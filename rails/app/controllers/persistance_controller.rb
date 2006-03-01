class PersistanceController < ApplicationController
    live_tree :tree, :model => :area

    def index
        @root = Area.find(:first, :conditions => ["parent_id IS NULL"])
    end
end
