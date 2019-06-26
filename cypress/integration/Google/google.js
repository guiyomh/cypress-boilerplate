/**
 * @module stepdef/google
 */
import { Given } from 'cypress-cucumber-preprocessor/steps';

const url = 'https://google.com';

/**
 * @method I open Google page
 * @example
 * I open Google page
 */
Given('I open Google page', () => {
  cy.visit(url).then(() => {
    cy.screenshot('google homepage');
  });
});

/**
 * Enter the term  in the search bar and take a screenshot of the result page
 * @method I search "term"
 * @param {string} term the search term
 * @example
 * I search "cypress.io"
 */
Given('I search {string}', (term) => {
  cy.get('input[name=q]').type(term);
  cy.contains('chance').click();
});
