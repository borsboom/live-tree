require File.dirname(__FILE__) + '/../test_helper'

class NestedSetItemTest < Test::Unit::TestCase
  fixtures :nested_set_items

  # Replace this with your real tests.
  def test_truth
    assert_kind_of NestedSetItem, nested_set_items(:first)
  end
end
