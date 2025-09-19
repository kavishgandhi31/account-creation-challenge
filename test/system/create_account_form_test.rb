require "application_system_test_case"

class CreateAccountFormTest < ApplicationSystemTestCase
  test "user can create account successfully" do
    visit "/create-account"
    fill_in "Username", with: "validusername1"
    fill_in "Password", with: "passwordissolong123456789"
    click_on "Create Account"
    assert_current_path "/signup/account-selection"
    assert_text "What type of account would you like?"
  end

  test "shows error for short username" do
    visit "/create-account"
    fill_in "Username", with: "short"
    fill_in "Password", with: "passwordissolong123456789"
    find('body').click
    assert_text "Username must be between 10 and 50 characters"
  end

  test "shows error for short password" do
    visit "/create-account"
    fill_in "Username", with: "validusername2"
    fill_in "Password", with: "short"
    find('body').click
    assert_text "Password must be between 20 and 50 characters"
  end

  test "shows error for invalid username format" do
    visit "/create-account"
    fill_in "Username", with: "invalid user!"
    fill_in "Password", with: "passwordissolong123456789"
    find('body').click
    assert_text "Username can only contain letters, numbers, underscores, and hyphens"
  end

  test "shows error for weak password" do
    visit "/create-account"
    fill_in "Username", with: "validusername3"
    fill_in "Password", with: "passwordpasswordpassword"
    find('body').click
    assert_text "Password is too weak. Try adding more letters, numbers, and special characters."
  end

  test "shows error for missing fields" do
    visit "/create-account"
    fill_in "Username", with: ""
    fill_in "Password", with: ""
    find('body').click
    assert_text "Username must be between 10 and 50 characters."
    assert_text "Password must be between 20 and 50 characters."
  end

  test "shows error for duplicate username" do
    User.create!(username: "duplicateuser", password: "passwordissolong123456789")
    visit "/create-account"
    fill_in "Username", with: "duplicateuser"
    fill_in "Password", with: "anotheroneissolong123456789"
    find('body').click
    assert_text "Username already exists. Please choose a different one."
  end
end