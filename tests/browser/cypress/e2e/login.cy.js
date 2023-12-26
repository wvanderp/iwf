describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://localho.st:1234/login.html');

        // the following code is injected into the page
        // and executed in the browser
        // the username and passwords are replaced by the .parcel-plugin-replace.js
        // with the values from the .env file
        const functionCall = `login('${Cypress.env('WIKIDATA_USERNAME')}', '${Cypress.env('WIKIDATA_PASSWORD')}')`;

        cy.window().then((win) => {
            try {
                win.eval(functionCall);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        });
    });
});
