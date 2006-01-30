require File.dirname(__FILE__) + '/../test_helper'
require 'nested_set_controller'

# Re-raise errors caught by the controller.
class NestedSetController; def rescue_action(e) raise e end; end

class NestedSetControllerTest < Test::Unit::TestCase
  def setup
    @controller = NestedSetController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
  end

  # Replace this with your real tests.
  def test_truth
    assert true
  end
end
