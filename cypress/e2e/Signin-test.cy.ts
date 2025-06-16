describe('"JOINLY" Login page validation tests', () => {
  beforeEach(() => {
    cy.visit('/signin')
  })

  it('Should load Login page', () => {
    cy.contains('Connectez vous')
  })

  it('Should display : email format error', () => {
    cy.contains('Connectez vous')
    cy.get('[data-cy="msg-error"]').should('not.exist')
    cy.get('input[name="email"]').type('david@@gmail.com')
    cy.get('input[name="password"]').type('Gflflflfl8')
    cy.get('button[type="submit"]').click()
    cy.get('[data-cy="email-error"]').should('exist')
  })

  it('Should display : email not found', () => {
    cy.contains('Connectez vous')
    cy.get('[data-cy="msg-error"]').should('not.exist')
    cy.get('input[name="email"]').type('david@gmail.com')
    cy.get('input[name="password"]').type('Gflflflfl8')
    cy.get('button[type="submit"]').click()
    cy.get('[data-cy="server-res-error"]').should('exist')
  })

  it('Should display : password error', () => {
    cy.contains('Connectez vous')
    cy.get('[data-cy="msg-error"]').should('not.exist')
    cy.get('input[name="email"]').type('david@gmail.com')
    cy.get('input[name="password"]').type('Gflflflfl8')
    cy.get('button[type="submit"]').click()
    cy.get('[data-cy="server-res-error"]').should('exist')
  })

  it('Should NOT have any error + Home page', () => {
    cy.contains('Connectez vous')
    cy.get('[data-cy="msg-error"]').should('not.exist')
    cy.get('input[name="email"]').type('lucas.davis@example.com')
    cy.get('input[name="password"]').type('StrongPassword123')
    cy.get('button[type="submit"]').click()
    cy.get('[data-cy="server-res-error"]').should('not.exist')
    cy.contains('ÉVÉNEMENTS')
  })
})