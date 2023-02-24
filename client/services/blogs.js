import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async (blogObj) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, blogObj, config)
    return response.data
}

const update = async (updatedBlogObj) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.put(`${baseUrl}/${updatedBlogObj.id}`, updatedBlogObj, config)
    return response.data
}

const remove = async (blogId) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.delete(`${baseUrl}/${blogId}`, config)
    return response.data
}

export default { setToken, getAll, create, update, remove }