class OtherColumnNamesController < ApplicationController
    live_tree :tree, :model => :other_column_names_item, :get_item_name_proc => Proc.new { |item| item.widget_description }

    def index
        @root = OtherColumnNamesItem.find(:first, :conditions => ["parent_widget IS NULL"])
    end
end
