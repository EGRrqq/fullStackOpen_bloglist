import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
    const blog = {
        title: 'test',
        author: 'Ben',
        url: 'http://tqwe.com',
    }

    const mockHandler = jest.fn()

    test('form calls the event handler when a new blog is created', async () => {
        const { container } = render(
            <BlogForm createBlog={mockHandler} />
        )

        const user = userEvent.setup()

        const titleInput = container.querySelector('[name=title]')
        const authorInput = container.querySelector('[name=author]')
        const urlInput = container.querySelector('[name=url]')

        const submitButton = screen.getByText('create')

        await user.type(titleInput, blog.title)
        await user.type(authorInput, blog.author)
        await user.type(urlInput, blog.url)

        await user.click(submitButton)

        expect(mockHandler.mock.calls).toHaveLength(1)
        expect(mockHandler.mock.calls[0][0]).toEqual( {"author": blog.author, "title": blog.title, "url": blog.url})
    })
})