require File.dirname(__FILE__) + '/../test_helper'
require 'custom_data_controller'

# Re-raise errors caught by the controller.
class CustomDataController; def rescue_action(e) raise e end; end

class CustomDataControllerTest < Test::Unit::TestCase
  def setup
    @controller = CustomDataController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
  end

  # Replace this with your real tests.
  def test_truth
    assert true
  end
end
