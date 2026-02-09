@Flutter
Feature: Flutter Counter Functionality

  Scenario: Increase counter when clicking the plus button
    Given navigate to the Flutter Angular app
    And enable Flutter accessibility semantics
    When I click the "+" increment button
    Then The counter should display "Index: 1"

Scenario: Verify counter stays at zero without interaction
  Given navigate to the Flutter Angular app
  And enable Flutter accessibility semantics
  Then The counter should display "Index: 0"

  # Scenario: Verify counter resets to zero after page refresh
  # Given navigate to the Flutter Angular app
  # And enable Flutter accessibility semantics
  # When I click the "+" button
  # And I refresh the page
  # Then The counter should display "Index: 0"
