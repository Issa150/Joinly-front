describe('"JOINLY" Signup page validation tests', () => {
    beforeEach(() => {
      cy.visit('/signup')
    })
  
    it('Should load the signup page', () => {
      cy.contains('Créer ton compte')
    })
  
    it('Should display "Required fileds error".', () => {
      //cy.get('p.cy-error').should('not.exist') // not data attribute
      cy.get('[data-cy="msg-error"]').should('not.exist') // data attribute
      cy.get('button[type="submit"]').click()
      cy.get('[data-cy="msg-error"]').should('exist')
    })
  
    it('Should display "Password error for containing Letters".', () => {
      //cy.get('p.cy-error').should('not.exist') // not data attribute
      cy.get('[data-cy="msg-error"]').should('not.exist') // data attribute
      cy.get('input[name="lastname"]').type('Santos')
      cy.get('input[name="firstname"]').type('Lucas')
      cy.get('input[name="email"]').type('lucas.santos@gmail.com')
      cy.get('[data-cy="role-select"]').click();
      // cy.get('[data-cy="role-select"]').should('have.value', 'PARTICIPANT');
      cy.get('[data-cy="role-organizer"]').click();
      cy.get('input[name="password"]').type('12345678')
      cy.get('input[name="confirmPassword"]').type('45678')
      cy.get('button[type="submit"]').click()
      cy.get('[data-cy="password-match-error"]').should('exist')
    })
    it('Should display "Password error for containing Uppercase"', () => {
      //cy.get('p.cy-error').should('not.exist') // not data attribute
      cy.get('[data-cy="msg-error"]').should('not.exist') // data attribute
      cy.get('input[name="lastname"]').type('Santos')
      cy.get('input[name="firstname"]').type('Lucas')
      cy.get('input[name="email"]').type('lucas.santos@gmail.com')
      cy.get('[data-cy="role-select"]').click();
      // cy.get('[data-cy="role-select"]').should('have.value', 'PARTICIPANT');
      cy.get('[data-cy="role-organizer"]').click();
      cy.get('input[name="password"]').type('12345678g')
      cy.get('input[name="confirmPassword"]').type('12345678g')
      cy.get('button[type="submit"]').click()
      cy.get('[data-cy="password-error"]').should('exist')
    })
    it('Should display "Password error for containing Lowercase"', () => {
      //cy.get('p.cy-error').should('not.exist') // not data attribute
      cy.get('[data-cy="msg-error"]').should('not.exist') // data attribute
      cy.get('input[name="lastname"]').type('Santos')
      cy.get('input[name="firstname"]').type('Lucas')
      cy.get('input[name="email"]').type('lucas.santos@gmail.com')
      cy.get('[data-cy="role-select"]').click();
      // cy.get('[data-cy="role-select"]').should('have.value', 'PARTICIPANT');
      cy.get('[data-cy="role-organizer"]').click();
      cy.get('input[name="password"]').type('12345678G')
      cy.get('input[name="confirmPassword"]').type('12345678G')
      cy.get('button[type="submit"]').click()
      cy.get('[data-cy="password-error"]').should('exist')
    })
    it('Should display "Password error for containing Numbers".', () => {
      //cy.get('p.cy-error').should('not.exist') // not data attribute
      cy.get('[data-cy="msg-error"]').should('not.exist') // data attribute
      cy.get('input[name="lastname"]').type('Santos')
      cy.get('input[name="firstname"]').type('Lucas')
      cy.get('input[name="email"]').type('lucas.santos@gmail.com')
      cy.get('[data-cy="role-select"]').click();
      // cy.get('[data-cy="role-select"]').should('have.value', 'PARTICIPANT');
      cy.get('[data-cy="role-organizer"]').click();
      cy.get('input[name="password"]').type('Gflflflfl')
      cy.get('input[name="confirmPassword"]').type('Gflflflfl')
      cy.get('button[type="submit"]').click()
      cy.get('[data-cy="password-error"]').should('exist')
    })
    it('Should display "Password error for min length 8 chars".', () => {
      //cy.get('p.cy-error').should('not.exist') // not data attribute
      cy.get('[data-cy="msg-error"]').should('not.exist') // data attribute
      cy.get('input[name="lastname"]').type('Santos')
      cy.get('input[name="firstname"]').type('Lucas')
      cy.get('input[name="email"]').type('lucas.santos@gmail.com')
      cy.get('[data-cy="role-select"]').click();
      cy.get('[data-cy="role-organizer"]').click();
      cy.get('input[name="password"]').type('Gflflf8')
      cy.get('input[name="confirmPassword"]').type('Gflflf8')
      cy.get('button[type="submit"]').click()
      cy.get('[data-cy="password-error"]').should('exist')
    })
    it('Should display "Password & repeat Error match".', () => {
      //cy.get('p.cy-error').should('not.exist') // not data attribute
      cy.get('[data-cy="msg-error"]').should('not.exist') // data attribute
      cy.get('input[name="lastname"]').type('Santos')
      cy.get('input[name="firstname"]').type('Lucas')
      cy.get('input[name="email"]').type('lucas.santos@gmail.com')
      cy.get('[data-cy="role-select"]').click();
      // cy.get('[data-cy="role-select"]').should('have.value', 'PARTICIPANT');
      cy.get('[data-cy="role-organizer"]').click();
      cy.get('input[name="password"]').type('Gflflflfl8')
      cy.get('input[name="confirmPassword"]').type('Gflflflfl9')
      cy.get('button[type="submit"]').click()
      cy.get('[data-cy="password-match-error"]').should('exist')
    })
  }) 