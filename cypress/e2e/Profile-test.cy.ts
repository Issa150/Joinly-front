describe('Profile page tests', () => {
    beforeEach(() => {
        // Use the custom login command
        //@ts-ignore
        cy.login('lucas.davis@example.com', 'StrongPassword123');
        cy.visit('/my_profile'); // Navigate to the profile page
    });


    it('Should Login user successfully', () => { 
        cy.contains('Profil')
        cy.get('h5') // username
        cy.contains('Email')
    })
    
    it("Should contains user's informations", () => { 
        cy.get('h5') // username
        cy.contains('Email') // email   address
    })
})