require File.dirname(__FILE__) + '/../test_helper'
require 'other_column_names_controller'

# Re-raise errors caught by the controller.
class OtherColumnNamesController; def rescue_action(e) raise e end; end

class OtherColumnNamesControllerTest < Test::Unit::TestCase
  def setup
    @controller = OtherColumnNamesController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
  end

  # Replace this with your real tests.
  def test_truth
    assert true
  end
end
