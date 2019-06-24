import { Given } from 'cypress-cucumber-preprocessor/steps';

const url = 'https://google.com';
Given('I open Google page', () => {
  cy.visit(url).then(() => {
    cy.screenshot();
  });
});

Given('I search {string}', (term) => {
  cy.get('input[name=q]').type(term);
  cy.contains('chance').click().then(() => {
    cy.screenshot();
  });
});
