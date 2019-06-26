Feature: The search engine

        As a user
        I want to open a search engine page
        And search term

    Background:
        Given I open Google page

    Scenario: Opening a search engine page
        Given I see "Google" in the title
        And I compare snapshot "google"

    Scenario: I search the term cypress.io in google
        Given I search "cypress.io"
        Then I see "End to End" in the title

    Scenario Outline: I search a <term> in google
        Given I search "<term>"
        Then I see "<keyword>" in the title
        Examples:
            | term         | keyword    |
            | cypress.io   | End to End |
            | Nightwatchjs | End-to-End |
            | Jest         | Testing    |
