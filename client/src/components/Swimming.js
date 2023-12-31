import React, {useState} from "react";
import {Navigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import {createSwimming} from "../utils/API";
import Header from "./Header";
import swimmingIcon from "../assets/images/swimming.png";

export default function Swimming() {
    const [swimmingForm, setSwimmingForm] = useState({
        name: "",
        lapsCount: "",
        duration: "",
        date: new Date(),
        notes: ""
    });
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const loggedIn = Auth.loggedIn();

    const handleSwimmingChange = (event) => {
        const {name, value} = event.target;
        setSwimmingForm({...swimmingForm, [name]: value});
    }

    const handleDateChange = (date) => {
        setStartDate(date);
        handleSwimmingChange({target: {name: "date", value: date}});
    }

    const validateForm = (form) => {
        return form.name && form.lapsCount && form.duration && form.date;
    }

    const handleSwimmingSubmit = async (event) => {
        event.preventDefault();

        //get token
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;
        
        //get user id
        const userId = Auth.getUserId();

        //Swimming submit
        if (validateForm(swimmingForm)) {
            try {
                swimmingForm.userId = userId;

                const response = await createSwimming(swimmingForm, token);

                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }

                setMessage("Swimming session successfully added!");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } catch (err) {
                console.error(err);
            }
        }

        //clear form
        setSwimmingForm({
            name: "",
            lapsCount: "",
            duration: "",
            date: new Date(),
            notes: ""
        });
    }

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='swimming'>
            <Header />
            <div className="d-flex flex-column align-items-center">
                <h2 className='title text-center'>Add Exercise</h2>
                <form className='swimming-form d-flex flex-column' onSubmit={handleSwimmingSubmit}>
                    <div className='d-flex justify-content-center'><img alt="swimming" src={swimmingIcon} className="exercise-form-icon" /></div>
                    <label >Name:</label>
                    <input type="text" name="name" id="name" placeholder="Backstroke"
                        value={swimmingForm.name} onChange={handleSwimmingChange} />
                    <label >Laps Count (miles):</label>
                    <input type="number" name="lapsCount" id="lapsCount" placeholder="0"
                        value={swimmingForm.lapsCount} onChange={handleSwimmingChange} />
                    <label >Duration (minutes):</label>
                    <input type="number" name="duration" id="duration" placeholder="0"
                        value={swimmingForm.duration} onChange={handleSwimmingChange} />
                    <label>Date:</label>
                    <DatePicker selected={startDate} value={swimmingForm.date} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                    <button className='submit-btn swimming-submit-btn' type="submit" disabled={!validateForm(swimmingForm)} >Add</button>
                </form>
                <p className='message'>{message}</p>
            </div>
        </div>
    )
};
