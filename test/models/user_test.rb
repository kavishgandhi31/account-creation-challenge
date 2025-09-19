require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "should not save user without username" do
    user = User.new(password: 'passwordissolong123456789')
    assert_not user.save, "Saved the user without a username"
    assert_includes user.errors[:username], "can't be blank"
  end

  test "should not save user without password" do
    user = User.new(username: 'validusername')
    assert_not user.save, "Saved the user without a password"
    assert_includes user.errors[:password], "can't be blank"
  end

  test "should not save user with short username" do
    user = User.new(username: 'short', password: 'passwordissolong123456789')
    assert_not user.save
    assert_includes user.errors[:username], "is too short (minimum is 10 characters)"
  end

  test "should not save user with long username" do
    user = User.new(username: 'a' * 51, password: 'passwordissolong123456789')
    assert_not user.save
    assert_includes user.errors[:username], "is too long (maximum is 50 characters)"
  end

  test "should not save user with invalid username format" do
    user = User.new(username: 'invalid username!', password: 'passwordissolong123456789')
    assert_not user.save
    assert_includes user.errors[:username], "can only contain letters, numbers, underscores, and hyphens"
  end

  test "should not save user with leading/trailing spaces in username" do
    user = User.new(username: ' username ', password: 'passwordissolong123456789')
    assert_not user.save
    assert_includes user.errors[:username], "cannot have leading or trailing spaces"
  end

  test "should not save user with short password" do
    user = User.new(username: 'validusername', password: 'short12345')
    assert_not user.save
    assert_includes user.errors[:password], "is too short (minimum is 20 characters)"
  end

  test "should not save user with long password" do
    user = User.new(username: 'validusername', password: 'A' * 51)
    assert_not user.save
    assert_includes user.errors[:password], "is too long (maximum is 50 characters)"
  end

  test "should not save user with password lacking a letter" do
    user = User.new(username: 'validusername', password: '12345678901234567890')
    assert_not user.save
    assert_includes user.errors[:password], "must contain at least 1 letter and 1 number."
  end

  test "should not save user with password lacking a number" do
    user = User.new(username: 'validusername', password: 'A' * 20)
    assert_not user.save
    assert_includes user.errors[:password], "must contain at least 1 letter and 1 number."
  end

  test "should not save user with weak password (zxcvbn score < 2)" do
    user = User.new(username: 'validusername', password: 'passwordpasswordpassword')
    user.save
    assert_includes user.errors[:password], "is too weak (zxcvbn score < 2)."
  end

  test "should save user with valid attributes" do
    user = User.new(username: 'validusername', password: 'passwordissolong123456789')
    assert user.save, "Did not save user with valid attributes"
  end
end
