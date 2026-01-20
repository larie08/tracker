'use client'

import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Calendar, Plus, Trash2, Edit2, Save, X, CheckCircle2, Circle } from 'lucide-react';

export default function InternshipTracker() {
  const TOTAL_HOURS_GOAL = 540;
  
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    timeIn: '',
    timeOut: '',
    description: '',
    project: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    status: 'in-progress'
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    projectId: null,
    task: '',
    deadline: '',
    completed: false
  });
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTodoForm, setEditTodoForm] = useState({});

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever entries or todos change
  useEffect(() => {
    if (entries.length > 0) {
      saveData();
    }
  }, [entries]);

  useEffect(() => {
    if (todos.length > 0) {
      saveTodos();
    }
  }, [todos]);

  useEffect(() => {
    if (projects.length > 0) {
      saveProjects();
    }
  }, [projects]);

  const loadData = () => {
    try {
      const result = localStorage.getItem('internship-entries');
      if (result) {
        setEntries(JSON.parse(result));
      }
    } catch (error) {
      console.log('No existing data found');
    }
  };

  const saveData = () => {
    try {
      localStorage.setItem('internship-entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const saveTodos = () => {
    try {
      localStorage.setItem('internship-todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const saveProjects = () => {
    try {
      localStorage.setItem('internship-projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  useEffect(() => {
    try {
      const result = localStorage.getItem('internship-todos');
      if (result) {
        setTodos(JSON.parse(result));
      }
    } catch (error) {
      console.log('No todos found');
    }
  }, []);

  useEffect(() => {
    try {
      const result = localStorage.getItem('internship-projects');
      if (result) {
        setProjects(JSON.parse(result));
      }
    } catch (error) {
      console.log('No projects found');
    }
  }, []);

  const calculateHours = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return 0;
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    const inTotal = inHours * 60 + inMinutes;
    const outTotal = outHours * 60 + outMinutes;
    let diff = outTotal - inTotal;
    if (diff < 0) diff += 24 * 60; // Handle overnight shifts
    return diff / 60;
  };

  const totalHours = entries.reduce((sum, entry) => sum + calculateHours(entry.timeIn, entry.timeOut), 0);
  const remainingHours = TOTAL_HOURS_GOAL - totalHours;
  const progressPercent = Math.min((totalHours / TOTAL_HOURS_GOAL) * 100, 100);

  const addEntry = () => {
    if (newEntry.timeIn && newEntry.timeOut && newEntry.date) {
      setEntries([
        ...entries,
        {
          id: Date.now(),
          ...newEntry
        }
      ]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        timeIn: '',
        timeOut: '',
        description: '',
        project: ''
      });
    }
  };

  const addTodo = () => {
    if (selectedProjectId && newTodo.task && newTodo.deadline) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          projectId: selectedProjectId,
          task: newTodo.task,
          deadline: newTodo.deadline,
          completed: false
        }
      ]);
      setNewTodo({
        projectId: selectedProjectId,
        task: '',
        deadline: '',
        completed: false
      });
    }
  };

  const addProject = () => {
    if (newProject.name) {
      setProjects([
        ...projects,
        {
          id: Date.now(),
          name: newProject.name,
          status: 'in-progress',
          createdAt: new Date().toISOString()
        }
      ]);
      setNewProject({
        name: '',
        status: 'in-progress'
      });
      setSelectedProjectId(null);
    }
  };

  const updateProjectStatus = (projectId, status) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, status } : project
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
    setTodos(todos.filter(todo => todo.projectId !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (todo) => {
    setEditingTodoId(todo.id);
    setEditTodoForm(todo);
  };

  const saveTodoEdit = () => {
    setTodos(todos.map(todo =>
      todo.id === editingTodoId ? editTodoForm : todo
    ));
    setEditingTodoId(null);
    setEditTodoForm({});
  };

  const cancelTodoEdit = () => {
    setEditingTodoId(null);
    setEditTodoForm({});
  };

  const getProjectTodos = (projectId) => {
    return todos.filter(todo => todo.projectId === projectId);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditForm(entry);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    setEntries(entries.map(entry => 
      entry.id === editingId ? editForm : entry
    ));
    setEditingId(null);
    setEditForm({});
  };

  const resetData = async () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      try {
        localStorage.removeItem('internship-entries');
        setEntries([]);
      } catch (error) {
        console.error('Error resetting data:', error);
      }
    }
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  const estimatedCompletion = () => {
    if (entries.length < 2) return null;
    
    const sortedByDate = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDate = new Date(sortedByDate[0].date);
    const lastDate = new Date(sortedByDate[sortedByDate.length - 1].date);
    const daysPassed = Math.max((lastDate - firstDate) / (1000 * 60 * 60 * 24), 1);
    const avgHoursPerDay = totalHours / daysPassed;
    
    if (avgHoursPerDay > 0) {
      const daysRemaining = Math.ceil(remainingHours / avgHoursPerDay);
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + daysRemaining);
      return completionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">UI/UX Internship Tracker</h1>
          <p className="text-gray-600">larie's internship tracker</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100">Hours Completed</span>
                <Clock className="w-5 h-5 text-blue-200" />
              </div>
              <p className="text-3xl font-bold">{totalHours.toFixed(1)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100">Hours Remaining</span>
                <TrendingUp className="w-5 h-5 text-purple-200" />
              </div>
              <p className="text-3xl font-bold">{remainingHours.toFixed(1)}</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-pink-100">Progress</span>
                <Calendar className="w-5 h-5 text-pink-200" />
              </div>
              <p className="text-3xl font-bold">{progressPercent.toFixed(1)}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>0 hrs</span>
              <span className="font-semibold">{totalHours.toFixed(1)} / 540 hrs</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {estimatedCompletion() && (
            <div className="text-center text-sm text-gray-600 mt-4">
              📅 Estimated completion: <span className="font-semibold">{estimatedCompletion()}</span>
            </div>
          )}
        </div>

        {/* Add New Entry */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Log Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time In</label>
              <input
                type="time"
                value={newEntry.timeIn}
                onChange={(e) => setNewEntry({...newEntry, timeIn: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Out</label>
              <input
                type="time"
                value={newEntry.timeOut}
                onChange={(e) => setNewEntry({...newEntry, timeOut: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold">
                {calculateHours(newEntry.timeIn, newEntry.timeOut).toFixed(2)} hrs
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project/Task</label>
              <input
                type="text"
                value={newEntry.project}
                onChange={(e) => setNewEntry({...newEntry, project: e.target.value})}
                placeholder="e.g., Mobile App Redesign"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newEntry.description}
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                placeholder="e.g., Created wireframes for dashboard"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={addEntry}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Add Entry
          </button>
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Work Log</h2>
            {entries.length > 0 && (
              <button
                onClick={resetData}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Reset All Data
              </button>
            )}
          </div>

          {sortedEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Clock className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>No entries yet. Start logging your hours!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sortedEntries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  {editingId === entry.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="time"
                          value={editForm.timeIn}
                          onChange={(e) => setEditForm({...editForm, timeIn: e.target.value})}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="time"
                          value={editForm.timeOut}
                          onChange={(e) => setEditForm({...editForm, timeOut: e.target.value})}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <div className="px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50 font-semibold text-gray-700">
                          {calculateHours(editForm.timeIn, editForm.timeOut).toFixed(2)} hrs
                        </div>
                        <input
                          type="text"
                          value={editForm.project}
                          onChange={(e) => setEditForm({...editForm, project: e.target.value})}
                          placeholder="Project"
                          className="px-3 py-1 border border-gray-300 rounded text-sm col-span-2"
                        />
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          placeholder="Description"
                          className="px-3 py-1 border border-gray-300 rounded text-sm col-span-2"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button onClick={cancelEdit} className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-semibold text-gray-700">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-gray-600">
                            {entry.timeIn} - {entry.timeOut}
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {calculateHours(entry.timeIn, entry.timeOut).toFixed(2)}h
                          </span>
                        </div>
                        {entry.project && (
                          <p className="text-gray-800 font-medium">{entry.project}</p>
                        )}
                        {entry.description && (
                          <p className="text-gray-600 text-sm mt-1">{entry.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEdit(entry)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="text-center mt-6 text-sm text-gray-500">
          💡 Tip: Log your hours daily to stay on track!
        </div>

        {/* To-Do List Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            My Projects
          </h2>

          {/* Add New Project */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Create New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="Enter project name..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addProject}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Create Project
              </button>
            </div>
          </div>

          {/* Projects Display */}
          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Circle className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No projects yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* In Progress Projects */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  In Progress
                </h3>
                <div className="space-y-3">
                  {projects.filter(p => p.status === 'in-progress').length === 0 ? (
                    <p className="text-gray-400 text-sm">No active projects</p>
                  ) : (
                    projects.filter(p => p.status === 'in-progress').map(project => (
                      <div key={project.id} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-md font-bold text-gray-800">{project.name}</h4>
                            <p className="text-xs text-gray-500">
                              {getProjectTodos(project.id).length} task(s) • {getProjectTodos(project.id).filter(t => t.completed).length} completed
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateProjectStatus(project.id, 'completed')}
                              className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 font-semibold"
                            >
                              Mark Complete
                            </button>
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Add Task to Project */}
                        {selectedProjectId === project.id && (
                          <div className="mb-3 p-3 bg-white rounded border border-blue-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={newTodo.task}
                                onChange={(e) => setNewTodo({...newTodo, task: e.target.value})}
                                placeholder="Task description..."
                                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="date"
                                value={newTodo.deadline}
                                onChange={(e) => setNewTodo({...newTodo, deadline: e.target.value})}
                                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={addTodo}
                                  className="flex-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 font-semibold"
                                >
                                  Add Task
                                </button>
                                <button
                                  onClick={() => setSelectedProjectId(null)}
                                  className="flex-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedProjectId !== project.id && (
                          <button
                            onClick={() => {
                              setSelectedProjectId(project.id);
                              setNewTodo({...newTodo, projectId: project.id});
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold mb-3"
                          >
                            + Add Task
                          </button>
                        )}

                        {/* Tasks List */}
                        {getProjectTodos(project.id).length === 0 ? (
                          <p className="text-gray-400 text-xs italic">No tasks yet</p>
                        ) : (
                          <div className="space-y-2">
                            {getProjectTodos(project.id).map((todo) => (
                              <div key={todo.id} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                                {editingTodoId === todo.id ? (
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input
                                      type="text"
                                      value={editTodoForm.task}
                                      onChange={(e) => setEditTodoForm({...editTodoForm, task: e.target.value})}
                                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                    <input
                                      type="date"
                                      value={editTodoForm.deadline}
                                      onChange={(e) => setEditTodoForm({...editTodoForm, deadline: e.target.value})}
                                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                    <div className="flex gap-1">
                                      <button
                                        onClick={saveTodoEdit}
                                        className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={cancelTodoEdit}
                                        className="flex-1 px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        const updated = todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t);
                                        setTodos(updated);
                                      }}
                                      className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                                    >
                                      {todo.completed ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                      ) : (
                                        <Circle className="w-4 h-4" />
                                      )}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs font-medium truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                        {todo.task}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(todo.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </p>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                      <button
                                        onClick={() => editTodo(todo)}
                                        className="text-blue-600 hover:text-blue-700 p-0.5"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                                        className="text-red-600 hover:text-red-700 p-0.5"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Completed Projects */}
              {projects.filter(p => p.status === 'completed').length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Completed
                  </h3>
                  <div className="space-y-3">
                    {projects.filter(p => p.status === 'completed').map(project => (
                      <div key={project.id} className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="text-md font-bold text-gray-700 line-through">{project.name}</h4>
                            <p className="text-xs text-gray-500">
                              {getProjectTodos(project.id).length} task(s) • {getProjectTodos(project.id).filter(t => t.completed).length} completed
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateProjectStatus(project.id, 'in-progress')}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 font-semibold"
                            >
                              Reopen
                            </button>
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="text-center mt-6 text-sm text-gray-500">
          💡 Tip: Log your hours daily and manage your tasks to stay productive!
        </div>
      </div>
    </div>
  );
}