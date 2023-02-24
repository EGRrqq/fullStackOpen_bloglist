import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    const blog = {
        title: 'test',
        author: 'Ben',
        url: 'http://tqwe.com',
        likes: 3,
        user: {
            name: 'Ben123'
        }
    }

    const mockHandler = jest.fn()

    test('component, displays only the blog renders and blog title', async () => {
        const { container } = render(
            <Blog
                blog={blog}
                updateBlog={mockHandler}
                deleteBlog={mockHandler}
            />
        )

        const element = container.querySelector('.blog-container')
        const details = container.querySelector('.blog-details')

        expect(element).toBeVisible()
        expect(details).not.toBeVisible()
    })

    test('after clicking on the button, the blog url and number of likes are displayed', async () => {
        const { container } = render(
            <Blog
                blog={blog}
                updateBlog={mockHandler}
                deleteBlog={mockHandler}
            />
        )

        const user = userEvent.setup()

        const button = screen.getByText('show')
        await user.click(button)

        const details = container.querySelector('.blog-details')
        expect(details).toBeVisible()
    })

    test('if the like button is clicked twice, the event handler is called twice', async () => {
        const { container } = render(
            <Blog
                blog={blog}
                updateBlog={mockHandler}
                deleteBlog={mockHandler}
            />
        )

        const user = userEvent.setup()

        const likeButton = screen.getByText('like')

        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockHandler).toHaveBeenCalledTimes(2)
    })
})