class OtherColumnNamesController < ApplicationController
    live_tree :tree, :model => :other_column_names_item, :item_name_attribute => :widget_description

    def index
        @root = OtherColumnNamesItem.find(:first, :conditions => ["parent_widget IS NULL"])
    end
end
