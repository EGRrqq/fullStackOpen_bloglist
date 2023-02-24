const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1,
            id: 1,
        })
        .populate('comments', {
            content: 1,
            id: 1,
        })

    response.status(200).json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    /*    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })*/

    const blog = new Blog({
        ...body,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(
        await savedBlog.populate('user', {
            username: 1,
            name: 1,
            id: 1,
        })
    )
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const body = request.body
    const comment = new Comment({
        ...body,
        blog: request.params.id,
    })

    const savedComment = await comment.save()
    const blog = await Blog.findById(request.params.id)
    blog.comments = blog.comments.concat(savedComment)
    await blog.save()

    response.status(201).json(savedComment)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(204).end()
    }

    if (blog.user.toString() !== user._id.toString()) {
        return response
            .status(401)
            .json({ error: 'only the author of the blog can delete it' })
    }

    await blog.remove()
    response.status(204).end()
}
)

blogsRouter.put('/:id', (request, response, next) => {
    const blog = request.body
    blog.user = request.body.user.id

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
        .populate('user', { username: 1, name: 1, id: 1 })
        .populate('comments', { content: 1, id: 1 })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter