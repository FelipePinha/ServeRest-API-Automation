import { faker } from '@faker-js/faker'

let token = ''
let productId = ''

describe('API - teste funcional de produtos', () => {
    it('Deve realizar o login com sucesso', async () => {
        const response = await cy.apiLogin('fulano@qa.com', 'teste')

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Login realizado com sucesso')

        token = response.body.authorization
    });

    it('Deve cadastrar um produto com sucesso', async () => {
        const productData = {
            "nome": faker.book.title(),
            "preco": faker.number.int({min: 40, max: 200}),
            "descricao": faker.lorem.sentence(),
            "quantidade": faker.number.int({min: 1, max: 100})
        }

        const response = await cy.apiCreateProduct(token, productData)

        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })

    it('Deve falhar ao cadastrar o produto', async () => {
        const productData = {
            "nome": 'livro teste 1',
            "preco": faker.number.int({min: 40, max: 200}),
            "descricao": faker.lorem.sentence(),
            "quantidade": faker.number.int({min: 1, max: 100})
        }

        const response = await cy.apiCreateProduct(token, productData)

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Já existe produto com esse nome')
    })

    it('Deve listar todos os produtos', async () => {
        const response = await cy.request({
            method: 'GET',
            url: 'http://localhost:3000/produtos',
            headers: {
                'Authorization': token
            }
        })

        const quantity = response.body.quantidade
        const products = response.body.produtos

        productId = products[0]._id

        expect(response.status).to.equal(200)
        expect(quantity).to.equal(products.length)
    })

    it('Deve listar um produto pelo id', async () => {
        const response = await cy.request({
            method: 'GET',
            url: `http://localhost:3000/produtos/${productId}`,
            headers: {
                'Authorization': token
            }
        })

        const product = response.body

        expect(response.status).to.equal(200)
        expect(product._id).to.equal(productId)
    })

    it('Deve editar o produto com sucesso', async () => {
        const productData = {
            "nome": faker.book.title(),
            "preco": faker.number.int({min: 40, max: 200}),
            "descricao": faker.lorem.sentence(),
            "quantidade": faker.number.int({min: 1, max: 100})
        }

        const response = await cy.request({
            method: 'PUT',
            url: `http://localhost:3000/produtos/${productId}`,
            body: productData,
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        })

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
    })

    it('Deve remover o produto pelo id', async () => {
        const response = await cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/produtos/${productId}`,
            headers: {
                'Authorization': token
            }
        })

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
    })
});