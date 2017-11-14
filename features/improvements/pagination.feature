Feature: Pagination

  AS A user
  I WANT to find recipes
  SO THAT I can get inspiration for cooking

  Scenario: Multiple pages of recipes

    When there are more than 10 recipes in the system
    Then only the first 10 recipes are shown

  Scenario: Navigating multiple pages of recipes

    When there are more than 10 recipes in the system
    Then page navigation elements are displayed

