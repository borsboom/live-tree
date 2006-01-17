require File.dirname(__FILE__) + '/../test_helper'

class MapAreaTest < Test::Unit::TestCase
  fixtures :map_areas

  # Replace this with your real tests.
  def test_truth
    assert_kind_of MapArea, map_areas(:first)
  end
end
