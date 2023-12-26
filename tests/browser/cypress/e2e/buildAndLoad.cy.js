describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://localho.st:1234/buildAndLoad.html');
        cy.get('body').should('contain', 'Douglas Adams');
    });
});
