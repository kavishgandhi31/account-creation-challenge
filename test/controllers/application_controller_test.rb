require "test_helper"

class ApplicationControllerTest < ActionDispatch::IntegrationTest
  test "root renders successfully" do
    get root_path
    assert_response :success
  end

  test "signup renders successfully" do
    get signup_path('account-selection')
    assert_response :success
  end

  test "create_account renders successfully" do
    get create_account_path
    assert_response :success
  end
end