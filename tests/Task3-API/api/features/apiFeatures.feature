@api
Feature: API E2E Scenarios - Swagger Notes Management

  Background:
    Given The API base URL is "https://practice.expandtesting.com/notes/api"

  # (Positive Scenario)
  @success
  Scenario: Success Path - User Lifecycle and Note Management
    # 1. User Setup
    When I register a new user using "newUser" data
    Then The user should be created successfully
    And I log in and change password from "newUser" data
    Then The password should be updated successfully

    # 2. Note Management
    When I log in with the new password for "newUser"
    And I add a new note using "noteData"
    Then The note should be created successfully
    When I update the note using "noteData"
    Then The note should reflect the updated changes
    When I delete the current note
    Then The note should no longer exist in the system

  # (Negative Scenario) Registration
  @registration_neg
  Scenario: Negative Path - Verify Duplicate Email Registration
    When I try to register with an existing email from "duplicateUser"
    Then I should receive an error "An account already exists with the same email address"

  Scenario: Verify Registration Password Length Validation with Multiple Data Sets
    When I attempt registration with all invalid password data from "registrationErrors"
    Then all attempts should fail with status 400 and the correct error message

  # (Negative Scenario) Update Logic - Resource Validation
  @update_neg
  Scenario: Negative Path - Update Note with Non-existent ID
    Given I am logged in as "newUser"
    When I attempt to update a note with a non-existent ID "65c3a1234567890123456789"
    Then I should receive a 401 error message "No authentication token specified in x-auth-token header"

  # (Negative Scenario) Security Validation - Separation of Concerns
  @security
  Scenario: Negative Path - Update Note without Authorization
    # لا نقوم بتسجيل الدخول هنا لاختبار رفض الوصول
    When I attempt to update a note without providing a valid auth token
    Then the system should deny the request with status code 401

  # (Negative Scenario) Delete Logic - Format Validation
  @delete_neg
  Scenario: Negative Path - Delete Note with Invalid ID Format
    Given I am logged in as "newUser"
    When I attempt to delete a note with an invalid ID "invalid_id_format_123"
    Then I should receive a 401 error message "No authentication token specified in x-auth-token header"
