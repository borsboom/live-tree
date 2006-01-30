class AreasController < ApplicationController
    live_tree :area_tree, :model => :area

    def index
        @root_area = Area.find(:first, :conditions => ["parent_id IS NULL"])
    end

    def map
        render :partial => 'map', :locals => { :area => Area.find(params[:id]) }
    end
end


