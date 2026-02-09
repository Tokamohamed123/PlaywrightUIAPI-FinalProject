@KIB
Feature: KIB Store Purchase Flow

# Background it will be run before each scenario 
Background: open the website
    Given I navigate to the KIB demo store
    And I login with valid credentials
    When I select the test product and proceed to buy



  Scenario: Complete a product purchase with mandatory details
    And I fill the mandatory details using test data
    Then I should complete the order successfully


  Scenario: Fail to complete product purchase due to missing mandatory details
    And I leave the mandatory details fields empty and click the "Complete Order" button
    Then I should see an error message indicating that mandatory fields are required