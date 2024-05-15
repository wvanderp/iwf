describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://localho.st:1234/login.html');

        // The following code is injected into the page and executed in the browser
        // The username and passwords are replaced by the .parcel-plugin-replace.js with the values from the .env file
        const functionCallPart1 = `uploadTestPart1('${Cypress.env('WIKIDATA_USERNAME')}', '${Cypress.env('WIKIDATA_PASSWORD')}')`;
        const functionCallPart2 = `uploadTestPart2('${Cypress.env('WIKIDATA_USERNAME')}', '${Cypress.env('WIKIDATA_PASSWORD')}')`;
        const functionCallPart3 = `uploadTestPart3('${Cypress.env('WIKIDATA_USERNAME')}', '${Cypress.env('WIKIDATA_PASSWORD')}')`;

        cy.window().then((win) => {
            try {
                win.eval(functionCallPart1);
                const body1 = cy.get('body');
                const snapshot1 = fs.readFileSync(path.join(__dirname, "./snapshot/upload/part1.json"), 'utf8');
                body1.should('equal', snapshot1);

                win.eval(functionCallPart2);
                const body2 = cy.get('body');
                const snapshot2 = fs.readFileSync(path.join(__dirname, "./snapshot/upload/part2.json"), 'utf8');
                body2.should('equal', snapshot2);

                win.eval(functionCallPart3);
                const body3 = cy.get('body');
                const snapshot3 = fs.readFileSync(path.join(__dirname, "./snapshot/upload/part3.json"), 'utf8');
                body3.should('equal', snapshot3);                
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        });
    });
});
