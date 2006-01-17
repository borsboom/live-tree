require File.dirname(__FILE__) + '/../test_helper'

class AreaTest < Test::Unit::TestCase
  fixtures :areas

  # Replace this with your real tests.
  def test_truth
    assert_kind_of Area, areas(:first)
  end
end
