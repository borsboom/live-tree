class OtherColumnNamesItem < ActiveRecord::Base
    set_primary_key "widget_name"
    acts_as_tree :order => "widget_description", :foreign_key => "parent_widget", :counter_cache => true
end
