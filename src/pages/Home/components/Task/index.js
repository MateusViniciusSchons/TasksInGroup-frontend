import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import './style.css'

export default function Task(props) {

    const [ userRelation, setUserRelation ] = useState('')

    const history = useHistory()

    useEffect(() => {
        switch (props.stageName) {
            case "Para Fazer":
                setUserRelation('Criada por ' + (props.task.createdFor === localStorage.getItem('userNameTasksSite')? 'você': props.task.createdFor))
                break;
            case "Sendo Feitas":
                setUserRelation('Sendo feita por ' + (props.task.userDoing === localStorage.getItem('userNameTasksSite')? 'você': props.task.userDoing))
                break;
            case "Concluídas":
                setUserRelation('Feita por ' + (props.task.userDoing === localStorage.getItem('userNameTasksSite')? 'você': props.task.userDoing))
                
                break;
        
            default:
                break;
        }
    }, [props.stageName, props.task.createdFor, props.task.userDoing])

    return (
        <li className="task">
            <span className="user-relation">
                {userRelation}
            </span>
            <div className="task-title">
                { props.task.title }
            </div>
            <button className="see-more-button" onClick={e => history.push(`/tasks/${props.task.id}`)}>Ver Mais</button>
            {
                (props.task.actualStage === 'todo' || (props.task.actualStage === 'doing' && Number(props.task.userDoingId) === Number(localStorage.getItem('userIdTasksSite')))) &&
                <button className="action-button" onClick={event => props.changeStage(props.task.id, props.task.actualStage)}>
                    {
                        props.task.actualStage === 'todo'? 'Fazer': 'Pronto!'
                    }
                </button>
            }
        </li>
    )
}