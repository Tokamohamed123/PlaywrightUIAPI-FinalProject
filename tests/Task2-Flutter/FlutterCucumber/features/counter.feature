@flutter
Feature: Flutter Counter Functionality

Background: open the website
    Given navigate to the Flutter Angular app
    And enable Flutter accessibility semantics

  Scenario: Increase counter when clicking the plus button
    When I click the "+" increment button
    Then The counter should display "Index: 1"

Scenario: Verify counter stays at zero without interaction
  Then The counter should display "Index: 0"

 