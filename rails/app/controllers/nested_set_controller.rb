class NestedSetController < ApplicationController
    live_tree :tree, :model => :nested_set_item

    def index
        @root = NestedSetItem.find(:first, :conditions => ["parent_id IS NULL"])
    end
end
