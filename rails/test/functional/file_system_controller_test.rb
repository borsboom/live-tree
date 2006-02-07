require File.dirname(__FILE__) + '/../test_helper'
require 'file_system_controller'

# Re-raise errors caught by the controller.
class FileSystemController; def rescue_action(e) raise e end; end

class FileSystemControllerTest < Test::Unit::TestCase
  def setup
    @controller = FileSystemController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
  end

  # Replace this with your real tests.
  def test_truth
    assert true
  end
end
