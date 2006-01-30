class NestedSetItem < ActiveRecord::Base
    acts_as_nested_set
    belongs_to :parent, :class_name => 'NestedSetItem', :foreign_key => 'parent_id'
    def children
        direct_children    end
end
