require File.dirname(__FILE__) + '/../test_helper'
require 'non_model_data_controller'

# Re-raise errors caught by the controller.
class NonModelDataController; def rescue_action(e) raise e end; end

class NonModelDataControllerTest < Test::Unit::TestCase
  def setup
    @controller = NonModelDataController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
  end

  # Replace this with your real tests.
  def test_truth
    assert true
  end
end
