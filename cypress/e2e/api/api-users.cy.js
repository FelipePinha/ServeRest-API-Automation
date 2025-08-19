/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

let userId = ''
let usedEmail = ''

describe('Api - teste funcional de usuários', () => {
    it('Deve cadastrar usuário corretamente', () => {
        const newUser = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: String(faker.datatype.boolean())
        }

        usedEmail = newUser.email
        
        cy.request({
            url: 'http://localhost:3000/usuarios',
            method: 'POST',
            body: newUser
        }).then(response => {
            userId = response.body._id

            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            expect(response.body).to.have.property('_id').and.not.be.empty
        })
    })

    it('Deve falhar ao tentar cadastrar usuário com o mesmo email', () => {
        cy.request({
            url: 'http://localhost:3000/usuarios',
            method: 'POST',
            body: {
                nome: faker.person.fullName(),
                email: usedEmail,
                password: faker.internet.password(),
                administrador: String(faker.datatype.boolean())
            },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Este email já está sendo usado')
        })
    })

    it('Deve editar o nome do usuário com sucesso', () => {
        cy.request({
            url: `http://localhost:3000/usuarios/${userId}`,
            method: 'PUT',
            body: {
                nome: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                administrador: String(faker.datatype.boolean())
            }
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
    })

    it('Deve excluir a conta do usuário com sucesso', () => {
        cy.request({
            url: `http://localhost:3000/usuarios/${userId}`,
            method: 'DELETE'
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Registro excluído com sucesso')
        })
    })
})