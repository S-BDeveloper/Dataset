
///<reference types="cypress" /> 

describe('Homepage loads', () => {
    it('shows the app title', () => {
      cy.visit('http://localhost:5173'); // Change port if needed
      cy.contains('Islamic Facts Explorer').should('be.visible');
    });
  });