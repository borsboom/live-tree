require File.dirname(__FILE__) + '/../test_helper'
require 'areas_controller'

# Re-raise errors caught by the controller.
class AreasController; def rescue_action(e) raise e end; end

class AreasControllerTest < Test::Unit::TestCase
  def setup
    @controller = AreasController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
  end

  # Replace this with your real tests.
  def test_truth
    assert true
  end
end
