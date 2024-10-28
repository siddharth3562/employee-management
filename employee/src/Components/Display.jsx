import React, { useState, useEffect } from "react";
import axios from 'axios';

const Display = () => {
    const [details, setDetails] = useState([]);
    const [seremp,setSerEmp] = useState([])
    const [filteredemp,setFilteredEmp] = useState([])
    const [editing, setEditing] = useState(false);
    const [currentDetails, setCurrentDetails] = useState({
        id: null, name: '', address: '', position: '', salary: '', experience: '', phone: '', email: ''
    });

    useEffect(() => {
        axios.get('https://alan2325.pythonanywhere.com/employe/employees/')
            .then(response => {
                setDetails(response.data)
                setFilteredEmp(response.data)
            })
            .catch(error => console.log(error));
    
    }, []);

    const editDetails = (detail) => {
        setEditing(true);
        setCurrentDetails(detail);
    };

    const updateDetail = (id, updatedDetail) => {
        setEditing(false);
        axios.put(`https://alan2325.pythonanywhere.com/employe/employees/${id}/`, updatedDetail)
            .then(response => {
                setDetails(details.map(detail => (detail.id === id ? response.data : detail)));
            })
            .catch(error => console.log(error));
    };

    const deleteDetail = (id) => {
        axios.delete(`https://alan2325.pythonanywhere.com/employe/employees/${id}/`)
            .then(() => {
                setDetails(details.filter(detail => detail.id !== id));
            })
            .catch(error => console.log(error));
    };

    useEffect(()=>{
        const result=details.filter(emp=>
            emp.name.includes(seremp) || emp.address.includes(seremp) || emp.id.toString().includes(seremp)
        )
        setFilteredEmp(result)
    },[seremp,details])

    return (
        <div className="container mt-2">
            <h2>User Details</h2>
            <input type="text" placeholder="Search" name="" value={seremp} onChange={(e)=>setSerEmp(e.target.value)}/>
            <table className="table table-bordered table-hover">
                {filteredemp.map(detail => (
                    <tr key={detail.id}>
                        <td>{detail.id}</td>
                        <td>{detail.name}</td>
                        <td>{detail.address}</td>
                        <td>{detail.position}</td>
                        <td>{detail.salary}</td>
                        <td>{detail.experience}</td>
                        <td>{detail.phone}</td>
                        <td>{detail.email}</td>
                        <td>
                            <button className="btn btn-warning px-3" onClick={() => editDetails(detail)}>Edit</button>
                        </td>
                        <td>
                            <button className="btn btn-danger" onClick={() => deleteDetail(detail.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </table>
            {editing ? (
                <EditTaskForm
                    currentDetails={currentDetails}
                    updateDetail={updateDetail}
                />
            ) : null}
        </div>
    );
};

const EditTaskForm = ({ currentDetails, updateDetail }) => {
    const [detail, setDetail] = useState(currentDetails);

    useEffect(() => {
        setDetail(currentDetails);
    }, [currentDetails]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDetail({ ...detail, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateDetail(detail.id, detail);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Edit Details</h2>
                <div>
                    <label>Name</label>
                    <input type="text" name='name' value={detail.name} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Address</label>
                    <textarea name="address" value={detail.address} onChange={handleInputChange} />
                </div>
                <button type="submit">Update Detail</button>
            </form>
        </>
    );
};

export default Display;
