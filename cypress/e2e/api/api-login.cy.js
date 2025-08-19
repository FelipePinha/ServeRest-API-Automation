describe('API - teste funcional de login', () => {
    it('Deve realizar o login com sucesso', async () => {
        const response = await cy.apiLogin('fulano@qa.com', 'teste')

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Login realizado com sucesso')
    })

     it('Validar senha incorreta', async () => {
        const response = await cy.apiLogin('fulano@qa.com', 'senha_incorreta')

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal('Email e/ou senha inválidos')
    })
})
