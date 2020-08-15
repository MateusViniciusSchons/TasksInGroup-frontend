import React from 'react'

import './style.css'
import Task from '../Task'

export default function Stage(props) {
    return(
        <section className="stage">
            <div className="stage-inside" style={{ backgroundColor: props.backgroundColor }}>
                <h1 className="stage-name">{props.stageName}</h1>
                <ul className="tasks-list">
                    {
                        props.tasks.map(task => (
                            <Task key={Number(task.id)} stageName={props.stageName} task={task} changeStage={props.changeStage} />
                        ))
                    }
                </ul>
            </div>
                
            
        </section>
    );
}