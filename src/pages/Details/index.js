import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ArrowLeft } from 'react-feather' 

import Header from '../components/Header'

import { connect, disconnect, updateStage } from '../../services/socket'
import api from '../../services/api'

import './style.css'

export default function Details(props) {

    const [ task, setTask ] = useState({
        title: '',
        description: '',
        actualStage: '<unknown>',
        createdFor: '<unknown>',
    })

    const [ actualStagePortugues, setActualStagePortugues ] = useState('')

    const [ userRelation, setUserRelation ] = useState('')

    const history = useHistory()

    function setupWebSocket() {
        disconnect();

        connect();

    }

    useEffect(() => {
        updateStage(taskUpdated => {
            if(task.id === taskUpdated.taskId) {
                let newTask =  { ...task, actualStage: taskUpdated.newStage, userDoing: taskUpdated.userDoing, userDoingId: Number(taskUpdated.userDoingId) }
                setTask({ ...newTask })
            }
        })
    }, [task])

    useEffect(() => {
        
        async function getTask() {
            const response = await api.get(`/tasks/${props.match.params.id}`)
            setTask(response.data[0])
        }
        getTask();
        setupWebSocket();

    }, [props.match.params.id])

    useEffect(() => {
            switch (task.actualStage) {
                case 'todo':
                    setUserRelation('Criado por ' + (task.createdFor === localStorage.getItem('userNameTasksSite')? 'você': task.createdFor))
                    setActualStagePortugues('Para Fazer')
                    break;
    
                case 'doing':
                    setUserRelation('Sendo feito por ' + (task.userDoing === localStorage.getItem('userNameTasksSite')? 'você': task.userDoing))
                    setActualStagePortugues('Sendo Feito')
                    break;
    
                case 'done':
                    setUserRelation('Feito por ' + (task.userDoing === localStorage.getItem('userNameTasksSite')? 'você': task.userDoing))
                    setActualStagePortugues('Concluído')
                    break;
                default: 
                    break;
            }
    }, [task, task.actualStage])

    async function changeStage() {
        const response = await api.put('/tasks/stage', { taskId: props.match.params.id }, { headers: {userid: localStorage.getItem('userIdTasksSite')} })
        if(!response.data.error) {
            history.push('/home')
        }
    }

    return (
        <>
            <Header />
            <button className="task_details-voltar" onClick={event => history.goBack()}>
                <div className="voltar-icon"><ArrowLeft /></div>
                <div className="voltar-text">Voltar</div>
            </button>

            <div className="task_details-views">
                <div className="task_details">
                    <span className="task_details-user_relation">{userRelation}</span>
                    <h2 className="task_details-title">{task.title}</h2>
                    <hr />
                    <p className="task_details-description">{task.description}</p>
                    <span className="task_details-actual-stage">Estado Atual: <span className="details-stage" style={{ backgroundColor: task.actualStage === 'todo'? '#D87567': task.actualStage === 'doing'? '#D38355': '#56C1BB'}}>{actualStagePortugues}</span></span>
                    
                        {
                            (task.actualStage === 'todo' || (task.actualStage === 'doing' && task.userDoingId === Number(localStorage.getItem('userIdTasksSite')))) &&
                            <button className="action-button-details" onClick={changeStage}>
                                {
                                    task.actualStage === 'todo'? 'Fazer': 'Pronto!'
                                }
                            </button>
                        }
                </div>
            </div>
        </>
    )
}