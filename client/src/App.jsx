import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = 'https://mern-3c4s.vercel.app/students';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [age, setAge] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { name, course, age: Number(age) });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { name, course, age: Number(age) });
      }
      setName('');
      setCourse('');
      setAge('');
      fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  const handleEdit = (student) => {
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>Student Management System</h1>
      
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Edit Student' : 'Add Student'}</h3>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="Course" 
            value={course} 
            onChange={(e) => setCourse(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="number" 
            placeholder="Age" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {editingId ? 'Update Student' : 'Add Student'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setName(''); setCourse(''); setAge(''); }} 
            style={{ marginLeft: '10px', padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Students</h2>
      {students.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No Students found.</p>
      ) : (
        ulList(students, handleEdit, handleDelete)
      )}
    </div>
  );
}

function ulList(students, handleEdit, handleDelete) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {students.map((student) => (
        <li key={student._id} style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{student.name}</strong> - {student.course} (Age: {student.age})
          </div>
          <div>
            <button onClick={() => handleEdit(student)} style={{ marginRight: '5px', padding: '5px 10px', background: '#ffc107', border: 'none', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => handleDelete(student._id)} style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default App;