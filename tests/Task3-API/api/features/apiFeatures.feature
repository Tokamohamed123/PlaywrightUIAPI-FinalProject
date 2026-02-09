@API
Feature: API E2E Scenarios - Swagger Notes Management

  Background:
    Given The API base URL is "https://practice.expandtesting.com/notes/api"

  # (Positive Scenario)
  Scenario: Success Path - User Lifecycle and Note Management
    # 1. login
    When I register a new user using "newUser" data
    Then The user should be created successfully
    And I log in and change password from "newUser" data
    Then The password should be updated successfully
    
    # 2. note
    When I log in with the new password for "newUser"
    And I add a new note using "noteData"
    Then The note should be created successfully
    
    When I update the note using "noteData"
    Then The note should reflect the updated changes

    When I delete the current note
    Then The note should no longer exist in the system


  # (Negative Scenario)
  Scenario: Negative Path - Verify Duplicate Email Registration
    When I try to register with an existing email from "duplicateUser"
    Then I should receive an error "An account already exists with the same email address"