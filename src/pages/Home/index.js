import React, { useState, useEffect } from 'react'

import Header from '../components/Header/index.js'
import NewTaskButton from './components/NewTaskButton/index.js'
import Stage from './components/Stage'

import api from '../../services/api'
import { connect, disconnect, addNewTask, removeTask, updateStage } from '../../services/socket'

import './style.css'

export default function Home() {
    const [ tasks, setTasks ] = useState({
        todo: [],
        doing: [],
        done: []
    })

    useEffect(() => {
        addNewTask(newTask => {
            if(!tasks.todo.some(task => task.id === newTask.id)) {
                let tasksToDo = [...tasks.todo]
                tasksToDo.unshift(newTask)
                setTasks({...tasks, todo: tasksToDo})
            }
        })

        removeTask(taskId => {
            let todo = tasks.todo.filter(task => task.id !== Number(taskId))
            let doing = tasks.doing.filter(task => task.id !== Number(taskId))
            let done = tasks.done.filter(task => task.id !== Number(taskId))
            setTasks({
                todo,
                doing, 
                done, 
            })
        })

        updateStage((taskUpdated) => {
            // faz uma cópia do estado
                let newTasks = {...tasks}

            // pega a tarefa que será atuializada
                let taskInfos = newTasks[taskUpdated.lastStage].filter(task => task.id === taskUpdated.taskId)

            // retira a tarefa que será atualizada da lista de tarefas do estado anterior
            let tasksLastStage = newTasks[taskUpdated.lastStage].filter(task => task.id !== taskUpdated.taskId)
            
            // caso a tarefa já esteja na etapa atualizada (isso pode ocorrer no cliente que atualizou) a tarefa é "renovada"
                let tasksNewStage = newTasks[taskUpdated.newStage].filter(task => task.id !== taskUpdated.taskId)
                tasksNewStage.unshift({ ...taskInfos[0], id: taskUpdated.taskId, actualStage: taskUpdated.newStage, userDoing: taskUpdated.userDoing, userDoingId: Number(taskUpdated.userDoingId) })
            
                // Muda o estado das tarefas
                setTasks({
                    ...tasks, 
                    [taskUpdated.lastStage]: [
                        ...tasksLastStage
                    ],
                    [taskUpdated.newStage]: [
                        ...tasksNewStage
                    ]
                })
        })
    }, [tasks])

    function setupWebSocket() {
        disconnect();

        connect();

    }

    useEffect(() => {
        async function getTasks() {
            const response = await api.get('/tasks')
            setTasks(response.data)
        }
        getTasks();
        setupWebSocket();
        
    }, [])

     async function changeStage(taskId, actualStage) {
        let stages = ['todo', 'doing', 'done']
        
        //let newTasks = tasks
        let newTasks = { ...tasks }

        let taskToChange = newTasks[actualStage].filter(task => task.id === taskId)
        let normalTasks = newTasks[actualStage].filter(task => task.id !== taskId)
        
        let newStage = stages[Number(stages.indexOf(actualStage) + 1)]
        
        //let diferentStage = stages.filter(stage => stage !== actualStage && stage !== newStage)

        taskToChange[0].actualStage = newStage
        taskToChange[0].userDoing = localStorage.getItem('userNameTasksSite')
        taskToChange[0].userDoingId = localStorage.getItem('userIdTasksSite')
        setTasks({...tasks, [actualStage]: normalTasks, [newStage]: [ ...tasks[newStage], taskToChange[0] ] })
        //chamar a api
        await api.put(`/tasks/stage`, { taskId }, { headers: { userid: localStorage.getItem('userIdTasksSite') } })
        if(newStage === 'done') {
            await api.delete(`/tasks/${taskId}?withTimeout=true`, { headers: { userid: localStorage.getItem('userIdTasksSite') } })
        }

    }
    
    return(
        <>
            <Header />
            <NewTaskButton />
            <section className="stages-sections">
                <Stage stageName="Para Fazer" backgroundColor="#D87567" tasks={tasks.todo} changeStage={changeStage} />
                <Stage stageName="Sendo Feitas" backgroundColor="#D38355" tasks={tasks.doing} changeStage={changeStage} />
                <Stage stageName="Concluídas" backgroundColor="#56C1BB" tasks={tasks.done} changeStage={changeStage} />
            </section>
        </>
    )
}