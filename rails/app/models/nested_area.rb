class NestedArea < ActiveRecord::Base
  acts_as_nested_set
  belongs_to :map
  belongs_to :parent, :class_name => 'NestedArea', :foreign_key => 'parent_id'
  
  def children
    direct_children
  end  
end
