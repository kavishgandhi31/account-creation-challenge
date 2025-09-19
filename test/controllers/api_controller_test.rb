require "test_helper"

class ApiControllerTest < ActionDispatch::IntegrationTest
  test "index returns all users as json data" do
    User.delete_all
    user1 = User.create!(username: "validusername1", password: "passwordissolong123456789")
    user2 = User.create!(username: "validusername2", password: "anotheroneissolong123456789")
    get "/users"
    assert_response :success
    data = JSON.parse(response.body)
    assert_equal 2, data.length
    assert_equal user1.username, data[0]["username"]
    assert_equal user2.username, data[1]["username"]
  end

  test "creates user with valid attributes" do
    post "/api/create-account", params: {
      username: "validusername3",
      password: "passwordissolong123456789"
    }
    assert_response :created
    data = JSON.parse(response.body)
    assert_equal "Account created successfully", data["message"]
    assert_equal "validusername3", data["user"]["username"]
  end

  test "fails to create user with invalid username" do
    post "/api/create-account", params: {
      username: "short",
      password: "passwordissolong123456789"
    }
    assert_response :unprocessable_entity
    data = JSON.parse(response.body)
    assert_includes data["errors"].join, "Username"
  end

  test "fails to create user with invalid password" do
    post "/api/create-account", params: {
      username: "validusername4",
      password: "bad"
    }
    assert_response :unprocessable_entity
    data = JSON.parse(response.body)
    assert_includes data["errors"].join, "Password"
  end

  test "fails to create user with weak password for zxcvbn" do
    post "/api/create-account", params: {
      username: "validusername5",
      password: "passwordpasswordpassword"
    }
    assert_response :unprocessable_entity
    data = JSON.parse(response.body)
    assert_includes data["errors"].join, "weak"
  end
end