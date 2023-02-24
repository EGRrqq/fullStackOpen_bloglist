import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ submitUser }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        submitUser({ username, password })
        setUsername('')
        setPassword('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                username
                <input
                    id='username'
                    type='text'
                    name='username'
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
            </div>
            <div>
                password
                <input
                    id='password'
                    type='password'
                    name='password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <button type="submit" id='login-button'>login</button>
        </form>
    )
}

LoginForm.propTypes = {
    submitUser: PropTypes.func.isRequired,
}

export default LoginForm

