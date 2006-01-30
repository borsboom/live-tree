require File.dirname(__FILE__) + '/../test_helper'

class OtherColumnNamesItemTest < Test::Unit::TestCase
  fixtures :other_column_names_items

  # Replace this with your real tests.
  def test_truth
    assert_kind_of OtherColumnNamesItem, other_column_names_items(:first)
  end
end
