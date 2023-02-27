const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)


const User = require('../models/user')

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        jest.setTimeout(30000)
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        jest.setTimeout(30000)
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'pudge2134',
            password: 'yessir'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        jest.setTimeout(30000)
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if username is missing', async () => {
        jest.setTimeout(30000)
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            password: '111111111'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('\'username\' is missing')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if password is missing', async () => {
        jest.setTimeout(30000)
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'qqqqqqqq'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('\'password\' is missing')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if username is less than 3 characters', async () => {
        jest.setTimeout(30000)
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'e',
            password: '111111111'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('\'username\' must be at least 3 characters')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails if password is less than 3 characters', async () => {
        jest.setTimeout(30000)
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'qqqqqqqqqqqq',
            password: '1'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('\'password\' must be at least 3 characters')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

})

afterAll(() => {
    mongoose.connection.close()
})