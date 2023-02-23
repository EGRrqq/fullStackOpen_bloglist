import React from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div style={blogStyle} className='blog-container'>
            {blog.title} {blog.author}
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
}

export default Blog