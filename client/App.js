import React from 'react'
import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notification, setNotification] = useState({ type: null, content: null })
    const [user, setUser] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (userCredentials) => {
        try {
            const user = await loginService.login(userCredentials)
            blogService.setToken(user.token)
            window.localStorage.setItem(
                'loggedBloglistUser',
                JSON.stringify(user)
            )
            setUser(user)
        } catch (exception) {
            console.log(exception)
            setNotification({
                type: 'error',
                content: exception.response.data.error,
            })
            clearNotification()
        }
    }

    const clearNotification = () => {
        setTimeout(() => {
            setNotification({ type: null, content: null })
        }, 5000)
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBloglistUser')
        setUser(null)
    }

    const addBlog = async (blogObject) => {
        try {
            blogFormRef.current.toggleVisibility()
            const createdBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(createdBlog))
            setNotification({
                type: 'success',
                content: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
            })
            clearNotification()
        } catch (exception) {
            console.log(exception)
            setNotification({
                type: 'error',
                content: exception.response.data.error,
            })
            clearNotification()
        }
    }

    const blogFormRef = useRef()

    const handleLike = async (updatedBlogObj) => {
        try {
            const updatedBlog = await blogService.update(updatedBlogObj)
            setBlogs(
                blogs.map((blog) =>
                    blog.id === updatedBlog.id ? updatedBlog : blog
                )
            )
        } catch (exception) {
            console.log(exception)
            setNotification({
                type: 'error',
                content: exception.response.data.error,
            })
            clearNotification()
        }
    }

    const handleRemove = async (blogId) => {
        try {
            await blogService.remove(blogId)
            setBlogs(blogs.filter((blog) => blog.id !== blogId))
        } catch (exception) {
            console.log(exception)
            setNotification({
                type: 'error',
                content: exception.response.data.error,
            })
            clearNotification()
        }
    }

    if (user === null) {
        return (
            <div>
                <h2>log in to application</h2>

                <Notification message={notification} />
                <LoginForm submitUser={handleLogin} />
            </div>
        )
    }

    return (
        <div>
            <h2>blogs</h2>

            <Notification message={notification} />

            <p>
                {user.username} logged in
                <button onClick={handleLogout}>logout</button>
            </p>

            <h2>create new</h2>

            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
            </Togglable>

            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map(blog =>
                    <Blog key={blog.id} blog={blog} updateBlog={handleLike} deleteBlog={handleRemove}/>
                )}
        </div>
    )
}

export default App
