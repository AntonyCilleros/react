import React, { useState, useRef } from 'react';
import { EditText } from 'react-edit-text'; // Assuming you're using react-edit-text
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPenToSquare } from '@fortawesome/free-solid-svg-icons'; // Icons for calendar and close button
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Fonction pour gérer le changement de texte d'une tâche
const handleTaskTextChange = (taskId, newText) => {
  // trouver la tâche correspondante
  const task = tasks.find((t) => t.id === taskId);
  // Mettre à jour le texte de la tâche
  task.text = newText;
  setTasks([...tasks]);
};

// Fonction pour gérer le changement de date d'une tâche
const handleDateChange = (taskId, value, setTasks) => {
  setTasks((prevTasks) =>
    prevTasks.map((task) => (task.id === taskId ? { ...task, date: value } : task))
  );
};


// Composant pour afficher une tâche
const Task = ({ task, index, isCalendarOpen, handleCheckboxChange, handleCalendarOpen, handleCalendarClose, removeTask, calendarRef, handleDateChange, setTasks }) => (
  <div className={`task_n_calendar ${task.isChecked ? 'active' : ''}`} key={task.id}>
    <div className='task-container bubble'>
      <input
        type="checkbox"
        id={`checkbox-${task.id}`}
        checked={task.isChecked}
        onChange={() => handleCheckboxChange(index)}
      />
      <div className="task-content">
        <EditText
          defaultValue={task.text}
          onChange={(newText) => handleTaskTextChange(task.id, newText)}
          showEditButton
          inline
          editButtonContent={<FontAwesomeIcon icon={faPenToSquare} />}
          className="editTextWithInlineButton"
        />
        <button className="delete-button" onClick={() => removeTask(task.id)}>
          <i className="fas fa-trash"></i>
        </button>
        <button className="calendar-button" onClick={() => handleCalendarOpen(index)}>
          <FontAwesomeIcon icon={faCalendarAlt} />
        </button>
      </div>
    </div>
    {isCalendarOpen && (
      <div className="calendar-popup" ref={calendarRef}>
        <Calendar
          onChange={(value) => handleDateChange(task.id, value, setTasks)}
          value={task.date}
        />
        <button className="close-button" onClick={(event) => handleCalendarClose(event, index)} />
      </div>
    )}
  </div>
);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskIndex, setTaskIndex] = useState(0); // Index de tâche
  const [isCalendarOpen, setIsCalendarOpen] = useState({});
  const calendarRefs = useRef([]);

  // Ajouter une nouvelle tâche
  const addTask = () => {
    const newTaskIndex = taskIndex + 1; // Incrémenter l'index de tâche
    setTaskIndex(newTaskIndex);
    setTasks((prevTasks) => [...prevTasks, { id: newTaskIndex, text: `Tâche ${tasks.length+1}`, isChecked: false, date: new Date() }]);
    calendarRefs.current.push(React.createRef()); // Initialiser la référence pour la nouvelle tâche
  };


  // Supprimer une tâche
  const removeTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    calendarRefs.current = calendarRefs.current.filter((ref, index) => {
      if (index === id) {
        // Supprimer la référence correspondant à la tâche supprimée
        return false;
      }
      return true;
    });
  };

  // Gérer le changement d'état de la case à cocher
  const handleCheckboxChange = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, isChecked: !task.isChecked } : task
      )
    );
  };

  // Gérer l'ouverture du calendrier
  const handleCalendarOpen = (index) => {
    setIsCalendarOpen({ ...isCalendarOpen, [index]: !isCalendarOpen[index] });
  };

  // Gérer la fermeture du calendrier
  const handleCalendarClose = (event, index) => {
    if (calendarRefs.current[index] && !calendarRefs.current[index].current.contains(event.target)) {
      setIsCalendarOpen({ ...isCalendarOpen, [index]: false });
    }
  };

  return (
    <div className="app-container">
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          isCalendarOpen={isCalendarOpen[index]}
          handleCheckboxChange={handleCheckboxChange}
          handleCalendarOpen={handleCalendarOpen}
          handleCalendarClose={handleCalendarClose}
          removeTask={removeTask}
          calendarRef={calendarRefs.current[index]}
          handleDateChange={handleDateChange}
          setTasks={setTasks}
        />
      ))}
      <button className="add-button" onClick={addTask}>
        +
      </button>
    </div>
  );
}
