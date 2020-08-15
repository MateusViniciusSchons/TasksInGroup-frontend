import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'

import Header from '../components/Header'

import api from '../../services/api'

import './style.css'

export default function CreateTask() {

    const [ task, setTask ] = useState({
        title: '',
        description: ''
    })

    const history = useHistory()

    function changeTask(event) {
        setTask({
            ...task,
            [event.target.name]: event.target.value
        })
    }

    async function createTask(event) {
        event.preventDefault()

        const response = await api.post('/tasks/create', { ...task }, { headers: { userid: localStorage.getItem('userIdTasksSite') } })

        if(!response.data.error) {
            history.push('/home')
        }
    }

    return (
        <>
            <Header />
            <button className="voltar" onClick={e => history.push('/home')}>
                <div className="voltar-icon"><ArrowLeft /></div>
                <div className="voltar-text">Voltar</div>
            </button>
            <div className="new_task-views">
                <form className="new_task-form" onSubmit={createTask}>
                    <input 
                        type="text" 
                        className="new_task-title new_task-input"
                        placeholder="Título da Tarefa: *"
                        required
                        name="title"
                        value={task.title}
                        onChange={changeTask}
                    />
                    <textarea 
                        name="description" 
                        cols="30" 
                        rows="10" 
                        className="new_task-description new_task-input"
                        placeholder="Descrição da Tarefa: *"
                        required
                        value={task.description}
                        onChange={changeTask}

                    >
                    
                    </textarea>
                    <button type="submit" className="new_task-button">Criar</button>
                </form>
            </div>
        </>
    )
}