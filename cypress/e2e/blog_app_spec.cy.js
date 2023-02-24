describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      username: 'ilovejerseyclub',
      name: 'eeeeee',
      password: 'ilovejerseyclub'
    }

    const anotherUser = {
      username: 'ilovejerseyclubtoo',
      name: 'qqqqqq',
      password: 'ilovejerseyclubtoo'
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', anotherUser)
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function() {
    cy.contains('log in to application')

    cy.get('#username')
    cy.get('#password')

    cy.contains('button', 'login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('ilovejerseyclub')
      cy.get('#password').type('ilovejerseyclub')

      cy.contains('button', 'login').click()
      cy.contains('ilovejerseyclub logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')

      cy.contains('button', 'login').click()
      cy.contains('invalid username or password')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'ilovejerseyclub', password: 'ilovejerseyclub' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()

      cy.get('#title').type('ilovejerseyclub')
      cy.get('#author').type('e')
      cy.get('#url').type('https://soundcloud.com/')

      cy.contains('button', 'create').click()
      cy.contains('a new blog ilovejerseyclub by e added')
    })

    describe('one blog is added', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'ilovejerseyclubsomuch', author: 'e', url: 'https://soundcloud.com/' })
      })

      it('a blog can be liked', function() {
        cy.contains('button', 'show').click()
        cy.contains('button', 'like').click()
        cy.contains('likes: 1')
      })

      it('a blog can be deleted', function() {
        cy.contains('button', 'show').click()
        cy.contains('button', 'remove').click()
        cy.get('html')
            .should('not.contain', 'ilovejerseyclubsomuch')
      })

      it('other user cannot delete the blog', function () {
        cy.login({ username: 'ilovejerseyclubtoo', password: 'ilovejerseyclubtoo' })

        cy.contains('button', 'show').click()
        cy.contains('button', 'remove').click()
        cy.contains('only the author of the blog can delete it')
      })
    })

    describe('several blogs are added', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'must be the LAST', author: 'e', url: '.com' })
        cy.createBlog({ title: 'must be the FIRST', author: 'e', url: '.com', likes: 534 })
        cy.createBlog({ title: 'must be the SECOND', author: 'e', url: '.com', likes: 3 })
      })

      it('blogs should be sorted correctly', function() {
        cy.get('.blog-container').eq(0).should('contain', 'FIRST')
        cy.get('.blog-container').eq(1).should('contain', 'SECOND')
        cy.get('.blog-container').eq(2).should('contain', 'LAST')
      })
    })
  })
})