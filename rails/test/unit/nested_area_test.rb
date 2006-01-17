require File.dirname(__FILE__) + '/../test_helper'

class NestedAreaTest < Test::Unit::TestCase
  fixtures :nested_areas

  # Replace this with your real tests.
  def test_truth
    assert_kind_of NestedArea, nested_areas(:first)
  end
end
