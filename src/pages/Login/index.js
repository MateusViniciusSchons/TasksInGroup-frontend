import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { LogIn } from 'react-feather'

import HeaderWithoutCredentials from '../components/HeaderWithoutCredentials'

import api from '../../services/api'

import './style.css'

export default function Login() {

    const [ user, setUser ] = useState({
        registration: '',
        password: '',
    })

    const history = useHistory()

    function changeUser(event) {
        setUser({ ...user, [event.target.name]: event.target.value })
    }

    async function doLogin(event) {
        event.preventDefault()
        const response = await api.post('/sessions/create', {...user})
        if(!response.data.error) {
            localStorage.setItem('userIdTasksSite',response.data.id)
            localStorage.setItem('userNameTasksSite',response.data.name)
            history.push('/home')
        }
    }

    return(
        <>
            <HeaderWithoutCredentials />
            <div className="login-views">
                <div className="login-icon"><LogIn style={{ height: 100, width: 100, fontWeight: 'lighter' }} /></div>
                <h1 className="login-title">Login</h1>
                <form className="form-login" onSubmit={doLogin}>
                    <input 
                        type="number" 
                        required 
                        className="login-input" 
                        name="registration" 
                        placeholder="Matrícula: *" 
                        onChange={event => changeUser(event)}
                    />
                    <input 
                        type="password"
                        required 
                        className="login-input" 
                        name="password" 
                        placeholder="Senha: *"
                        onChange={event => changeUser(event)}
                    />

                    <button type="submit" className="login-button">Entrar</button>

                </form>
            </div>
        </>
    )
}