import React, { useState, useEffect } from "react";
import axios from 'axios';

const Display = () => {
    const [details, setDetails] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentDetails, setCurrentDetails] = useState({
        id: null, name: '', address: '', position: '', salary: '', experience: '', phone: '', email: ''
    });

    useEffect(() => {
        axios.get('https://aiswarya2325.pythonanywhere.com/employemanagement/employees/')
            .then(response => setDetails(response.data))
            .catch(error => console.log(error));
    }, []);

    const editDetails = (detail) => {
        setEditing(true);
        setCurrentDetails(detail);
    };

    const updateDetail = (id, updatedDetail) => {
        setEditing(false);
        axios.put(`https://aiswarya2325.pythonanywhere.com/employemanagement/employees/${id}/`, updatedDetail)
            .then(response => {
                setDetails(details.map(detail => (detail.id === id ? response.data : detail)));
            })
            .catch(error => console.log(error));
    };

    const deleteDetail = (id) => {
        axios.delete(`https://aiswarya2325.pythonanywhere.com/employemanagement/employees/${id}/`)
            .then(() => {
                setDetails(details.filter(detail => detail.id !== id));
            })
            .catch(error => console.log(error));
    };

    return (
        <div className="container mt-2">
            <h2>User Details</h2>
            <table className="table table-bordered table-hover">
                {details.map(detail => (
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
