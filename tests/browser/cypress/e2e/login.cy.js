describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://localho.st:1234/login.html');

        // The following code is injected into the page and executed in the browser
        // The username and passwords are replaced by the .parcel-plugin-replace.js with the values from the .env file
        const functionCall = `login('${Cypress.env('WIKIDATA_USERNAME')}', '${Cypress.env('WIKIDATA_PASSWORD')}')`;

        cy.window().then((win) => {
            try {
                win.eval(functionCall);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }

            cy.wait(5000);
            cy.get('body').should('contain', 'success:');
        });
    });
});
