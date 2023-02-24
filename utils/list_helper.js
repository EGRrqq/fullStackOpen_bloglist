const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) return 0
    const reducer = (sum, blog) => sum + blog.likes

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce(function (previousValue, currentValue) {
        return previousValue.likes > currentValue.likes ? previousValue : currentValue
    })
    return favorite
}

const mostBlogs = (blogs) => {
    const authorWithMostBlogs = _.chain(blogs)
        .groupBy('author')
        .map((group, author) => {
            return {
                author: author,
                blogs: group.length
            }
        })
        .maxBy('blogs')
        .value()
    return { ...authorWithMostBlogs }
}

const mostLikes = (blogs) => {
    const authorWithMostLikes = _.chain(blogs)
        .groupBy('author')
        .map((group, author) => {
            return {
                author: author,
                likes: group.reduce((sum, blog) => sum + blog.likes, 0)
            }
        })
        .maxBy('likes')
        .value()
    return { ...authorWithMostLikes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }