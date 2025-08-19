let token = ''
let idCarrinho = ''

describe('API - teste funcional do carrinho', () => {
    it('Deve realizar o login com sucesso', async () => {
        const response = await cy.apiLogin('fulano@qa.com', 'teste')

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Login realizado com sucesso')

        token = response.body.authorization
    });

    it('Deve listar os carrinhos cadastrados', async () => {
        const request = await cy.request({
            method: 'GET',
            url: 'http://localhost:3000/carrinhos',
        })

        const cartQuantity = request.body.quantidade
        const carts = request.body.carrinhos

        expect(request.status).to.equal(200)
        expect(cartQuantity).to.equal(carts.length)
    })

    it('Não deve concluir a compra se não houver produtos no carrinho', () => {
        cy.request({
            method: 'DELETE',
            url: 'http://localhost:3000/carrinhos/concluir-compra',
            headers: {
                Authorization: token
            }
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Não foi encontrado carrinho para esse usuário')
        })
    })

    it('Não deve cancelar compra se não houver produtos no carrinho', () => {
         cy.request({
            method: 'DELETE',
            url: 'http://localhost:3000/carrinhos/cancelar-compra',
            headers: {
                Authorization: token
            }
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Não foi encontrado carrinho para esse usuário')
        })
    })

    it('Deve cadastrar produtos no carrinho com sucesso', () => {
        const products = [
            {
                idProduto: "kYlsXZ8sGz7KZrnZ",
                quantidade: 1
            },
            {
                idProduto: "Fi4xb2NLq4T0qP4a",
                quantidade: 1
            }
        ]

        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/carrinhos',
            headers: {
                Authorization: token
            },
            body: {
                produtos: products
            }
        }).then(response => {
            idCarrinho = response.body._id

            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    })

    it('Deve listar um carrinho pelo id', () => {
        cy.request({
            method: 'GET',
            url: `http://localhost:3000/carrinhos/${idCarrinho}`,
            headers: {
                Authorization: token
            }
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body._id).to.equal(idCarrinho)
        })
    })

    it('Deve concluir a compra com sucesso', () => {
        cy.request({
            method: 'DELETE',
            url: 'http://localhost:3000/carrinhos/concluir-compra',
            headers: {
                Authorization: token
            }
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Registro excluído com sucesso')
        })
    })
})