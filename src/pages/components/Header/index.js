import React from 'react' 
import { useHistory } from 'react-router-dom'
import { User, LogOut } from 'react-feather'

import './style.css'

export default function Header() {

    const history = useHistory()

    function handleLogout() {
        localStorage.removeItem('userIdTasksSite')
        localStorage.removeItem('userNameTasksSite')
        history.push('/')
    }
    
    return(
        <header className="header">
            <div className="user">
                <User style={{ width: 56, height: 56, float: 'left', color: 'rgba(255, 255, 255, 0.8)' }} />
                <h1 className="header-title user-name">{localStorage.getItem('userNameTasksSite')}</h1>
            </div>
            <div className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                <LogOut style={{ width: 56, height: 56, float: 'left', color: '#E05252' }} />
                <h1 className="header-title logout-text">Logout</h1>
            </div>

            <div className="app">
                <h1 className="header-title app-name">Sistema de Tarefas</h1>
            </div>
        </header>
    );
}