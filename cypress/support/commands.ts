// ***********************************************************
// Command custom Cypress
// ***********************************************************

/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Login via UI (akun uji apa pun) — TIDAK menunggu redirect; asersi URL di spec. */
      loginViaUi(email: string, password: string): Chainable<void>;
      /** Login via UI sebagai Admin Masjid (akun uji) dan tunggu sampai di /dashboard. */
      loginAdminMasjid(): Chainable<void>;
    }
  }
}

/**
 * Login via UI (bukan inject token) supaya tetap menguji alur login asli.
 * Akun uji: lihat CYPRESS.md / Fix History #45 & #47.
 */
Cypress.Commands.add('loginViaUi', (email: string, password: string) => {
  cy.visit('/login');
  cy.clearLocalStorage();
  cy.reload();
  cy.get('input[type="email"]').should('exist');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('loginAdminMasjid', () => {
  cy.loginViaUi('pangestuakbar939@gmail.com', 'menara23');
  cy.url({ timeout: 15000 }).should('include', '/dashboard');
});

export {};
