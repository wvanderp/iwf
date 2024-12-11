describe('build and load', () => {
    it('the library should load and show the name of the author', () => {
        cy.visit('http://localho.st:1234/buildAndLoad.html');
        cy.get('body').should('contain', 'Douglas Adams');
    });
});
