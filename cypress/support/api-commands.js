Cypress.Commands.add('apiLogin', (email, password) => { 
    cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login',
            body: {
                email: email,
                password: password
            },
            failOnStatusCode: false
        }).then(response => {
            return response
        })
})

Cypress.Commands.add('apiCreateProduct', (token, productData) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:3000/produtos',
        body: productData,
        headers: {
            'Authorization': token
        },
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})