import React, { useState, useRef } from 'react';
import { EditText } from 'react-edit-text'; // Assuming you're using react-edit-text
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPenToSquare } from '@fortawesome/free-solid-svg-icons'; // Icons for calendar and close button
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState({}); // Object for open state
  const calendarRefs = useRef([]); // Array of refs for calendar containers

  const addTask = () => {
    setTasks([...tasks, { text: "", isChecked: false, date: new Date() }]);
    calendarRefs.current.push(React.createRef()); // Add new ref for calendar container
  };

  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    calendarRefs.current.splice(index, 1); // Remove ref for calendar container
  };

  const handleCheckboxChange = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, isChecked: !task.isChecked } : task
      )
    );
  };

  const handleCalendarOpen = (index) => {
    setIsCalendarOpen({ ...isCalendarOpen, [index]: !isCalendarOpen[index] });
  };

  const handleCalendarClose = (event, index) => {
    // Prevent closing the calendar if clicking inside the calendar container
    if (calendarRefs.current[index] && !calendarRefs.current[index].current.contains(event.target)) {
      setIsCalendarOpen({ ...isCalendarOpen, [index]: false });
    }
  };

  return (
    <div className="app-container">
      {tasks.map((task, index) => (
        <div key={index} className={`task-container bubble ${task.isChecked ? 'active' : ''}`}>
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            checked={task.isChecked}
            onChange={() => handleCheckboxChange(index)}
          />
          <EditText
            defaultValue={`Tâche ${index + 1}`}
            showEditButton
            inline
            editButtonContent={<FontAwesomeIcon icon={faPenToSquare} />}
            className="editTextWithInlineButton"
          />
          <button className="delete-button" onClick={() => removeTask(index)}>
            <i className="fas fa-trash"></i>
          </button>
          {/* Calendar popup button */}
          <button className="calendar-button" onClick={() => handleCalendarOpen(index)}>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </button>
          {/* Calendar popup */}
          {isCalendarOpen[index] && (
            <div className="calendar-popup" ref={calendarRefs.current[index]} onClick={(event) => handleCalendarClose(event, index)}>
              <Calendar onChange={(value) => setTasks((prevTasks) => prevTasks.map((t, i) => i === index ? { ...t, date: value } : t))} value={task.date} />
              <button className="close-button" onClick={() => setIsCalendarOpen({ ...isCalendarOpen, [index]: false })} />
            </div>
          )}
        </div>
      ))}
      <button className="add-button" onClick={addTask}>
        +
      </button>
    </div>
  );
}

