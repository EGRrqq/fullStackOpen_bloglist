const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})

describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogToView)
    })

    test('id of the blog is correct', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach((blog) => {
            expect(blog.id).toBeDefined()
        })
    })

})

describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
        const newBlog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
        }

        const userRoot = {
            username: 'root',
            password: 'sekret'
        }

        const userRootLogin = await api.post('/api/login').send(userRoot)

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${userRootLogin.body.token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length + 1
        )

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
            'Canonical string reduction'
        )
    })

    test('fails with status code 401 if token is invalid', async () => {
        const newBlog = {
            title: 'jersey',
            author: 'jersey',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with status code 400 if url is invalid', async () => {
        const newBlog = {
            title: 'yeeeeeet',
            author: 'yeat',
        }

        const userRoot = {
            username: 'root',
            password: 'sekret'
        }

        const userRootLogin = await api.post('/api/login').send(userRoot)

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${userRootLogin.body.token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with status code 400 if title is invalid', async () => {
        const newBlog = {
            author: 'Thaiboy Goon',
            url: 'genius.com',
        }

        const userRoot = {
            username: 'root',
            password: 'sekret'
        }

        const userRootLogin = await api.post('/api/login').send(userRoot)

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${userRootLogin.body.token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('if likes is missing, the default value will be 0', async () => {
        const newBlog = {
            title: 'YOOooooooo',
            url: 'google.com',
        }

        const userRoot = {
            username: 'root',
            password: 'sekret'
        }

        const userRootLogin = await api.post('/api/login').send(userRoot)

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${userRootLogin.body.token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length + 1
        )

        const blog = blogsAtEnd[helper.initialBlogs.length].likes
        expect(blog).toBe(0)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const newBlogToDelete = {
            title: 'DELETE',
            author: 'DELETE',
            url: 'DELETE',
            likes: 523,
        }

        const userRoot = {
            username: 'root',
            password: 'sekret'
        }

        const userRootLogin = await api.post('/api/login').send(userRoot)

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${userRootLogin.body.token}`)
            .send(newBlogToDelete)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsToFind = await helper.blogsInDb()
        const blogToDelete = blogsToFind[blogsToFind.length - 1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${userRootLogin.body.token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length
        )

        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})