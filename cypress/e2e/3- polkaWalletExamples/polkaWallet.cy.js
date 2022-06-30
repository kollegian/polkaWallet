describe("Opens pablo and approves wallet", function () {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    before("authorize wallet", function () {
        cy.task('initPuppeteer');
        cy.task("initializeWallet");
    });
    before("opens pablo page", function () {
        cy.viewport(1024, 768)
        cy.visit("https://app.aave.com/");
    })
    it("Opens connect wallet", function () {
        cy.pause();
        cy.get("button").contains("Connect").click();
        cy.wait(2000);
    });
    it("Clicks connect button", function(){
        cy.get('.css-1ay9vb9').click({force: true});
        cy.wait(2000);
    });
    it("Authorize wallet", function(){
        cy.task("authorizePablo");
        cy.wait(20000);
    });
})