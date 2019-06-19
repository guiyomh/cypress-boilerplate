const url = 'https://google.com';

describe('Cypress', () => {
  it('is working', () => {
    const title = 'Google';
    cy.visit(url);
    cy.title().should('include', title);
  });
});
