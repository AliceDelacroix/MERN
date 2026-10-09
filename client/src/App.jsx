import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://mern-arisu3.vercel.app";

function App() {

  const[students, setStudents] = useState([]);
  const[name, setName] = useState("");
  const[course, setCourse] = useState("");
  const[age, setAge] = useState("");
  const[editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    axios
      .get(`${API_BASE_URL}/students`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !course || !age) {
      alert("Please fill out all fields.");
      return;
    }

    const payload = {
      name,
      course,
      age: Number(age),
    };

    if (editingId) {
      axios
        .put(`${API_BASE_URL}/students/${editingId}`, payload)
        .then(() => {
          fetchStudents();
          resetForm();
        })
        .catch((error) => {
          console.error("Error updating student:", error);
        });
    } else {
      axios
        .post(`${API_BASE_URL}/students`, payload)
        .then(() => {
          fetchStudents();
          resetForm();
        })
        .catch((error) => {
          console.error("Error adding student:", error);
        });
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_BASE_URL}/students/${id}`)
      .then(() => {
        fetchStudents();
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  const resetForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  return(
    <div style={{padding: "20px", fontFamily: "sans-serif"}}>
      <h1>Student Management System</h1>

      <h2>{editingId ? "Edit Student": "Add Student"} </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
      />

      <br />
      <br />

      <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
      />

      <br />
      <br />

      <button type="submit">
        {editingId ? "Update Student" : "Add Student"}
      </button>

      {editingId && (
        <button
          type="button"
          onClick={resetForm}
          style={{marginLeft: "10px"}}
          >
            Cancel
          </button>
      )}

      </form>

      <hr style={{margin: "20px 0"}} />


      <h2> Students</h2>
      {students.length === 0 ? (
        <p>No Students found.</p>
      ) : (
        students.map((student) => (
          <div 
          key={student._id}>
          style={{
            border: "1px solid #ccc",
            padding: "10ppx",
            marginBottom: "10px",
            borderRadius: "4px",
          }}

          <p>
            <strong>Name:</strong> {student.name}
          </p>

          <p>
            <strong>Course:</strong> {student.course}
          </p>

          <p>
            <strong>Age:</strong>{student.age}
          </p>

          <button onClick={() => handleEdit(student)}>Edit</button>
          <button onClick={() => handleDelete(student._id)}>Delete</button>
        </div>
      ))
    )}
    </div>
  );
}

export default App;