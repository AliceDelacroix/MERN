import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const[students, setStudents] = useState([]);
  const[name, setName] = useState("");
  const[course, setCourse] = useState("");
  const[age, setAge] = useState("");
  const[editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    axios
      .get("https://localhost:5000/students")
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
        .put(`http://locahost:5000/students/${editingId}`, payload)
        .then(() => {
          fetchStudents();
          resetForm();
        })
        .catch((error) => {
          console.error("Error updating student:", error);
        });
    } else {
      axios
        .post("http://locahost:5000/students", payload)
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
      .delete(`http://localhost:5000/students/${id}`)
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

      <h2>Students</h2>

      {students.map((student) =>  (
        <div key={student.id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
        </div>
      ))}

    </div>
  );
}

export default App;