import { Then } from 'cypress-cucumber-preprocessor/steps';
/**
 * @module stepdef/common
 */

/**
 * @method Then I see "google" in the title
 * @param {string} term the term to search in the title
 * @example
 * Then I see "google" in the title
 */
Then('I see {string} in the title', (term) => {
  cy.title().should('include', term);
});
