Feature: The search engine

    I want to open a search engine page

    @focus
    Scenario: Opening a search engine page
        Given I open Google page
        Then I see "Google" in the title

    @focus
    Scenario: I search the term cypress in google
        Given I open Google page
        And I search "cypress.io"
        Then I see "End to End" in the title
