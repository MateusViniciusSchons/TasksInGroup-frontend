import React from 'react' 
import { useHistory } from 'react-router-dom' 
import { Plus } from 'react-feather' 

import './style.css'

export default function NewTaskButton() {

    const history = useHistory()

    return(
        <button className="new-task-button" onClick={e => history.push('/tasks/new')}>
            <div className="new-task-icon"><Plus /></div>
            <h3 className="new-task-text">Nova Tarefa</h3>
        </button>
    );
}