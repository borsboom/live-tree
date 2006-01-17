require File.dirname(__FILE__) + '/../test_helper'

class MapTest < Test::Unit::TestCase
  fixtures :maps

  # Replace this with your real tests.
  def test_truth
    assert_kind_of Map, maps(:first)
  end
end
