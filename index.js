const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let students = [
    {
        id : 1706027,
        name : "Arnav Gupta",
        mentor_id : 1
    },
    {
        id : 1706036,
        name : "Devansh Kashyap",
        mentor_id : 2
    }
];

let mentors = [
    {
        id : 1,
        name : "Venkat",
        students : [1706027]
    },
    {
        id : 2,
        name : "RV",
        students : [1706036]
    },
];

// default page shows all the available urls for get and post
app.get("/", (req, res) => {
    res.send("\tWelcome to Student and Mentor Backend!!! \n\n Student Data : localhost:8080/students \n Mentor Data : localhost:8080/mentors \n Add Student : localhost:8080/add-student \n Add Mentor : localhost:8080/add-mentor \n Edit Student : localhost:8080/edit-student \n Edit Mentor : localhost:8080/edit-mentor \n Delete Student : localhost:8080/delete-student \n Delete Mentor : localhost:8080/delete-mentor \n Assign Students to a mentor : localhost:8080/assign-students \n Assign mentor to a student : localhost:8080/assign-mentor \n Find students by mentor_id : localhost:8080/find-students-by-mentor_id");
});

// get students data
app.get("/students", (req, res) => {
    res.json(students);
});

//get mentors data
app.get("/mentors", (req, res) => {
    res.json(mentors);
});

// add a new student
app.post("/add-student", (req, res) => {
    
    try {
        students.push( req.body );
        res.send(req.body.name + " added to students!");

    } catch (err) {
        res.send("Failed to add student " + req.body.id +  "!");
    }
});

// add a new mentor
app.post("/add-mentor", (req, res) => {

    try {
        mentors.push( req.body );
        res.send(req.body.name + " added to mentors!");

    } catch (err) {
         res.send("Failed to add student " + req.body.id +  "!");
    }
    
});

// update student
app.put("/edit-student", (req, res) => {

    try {
        let index = students.findIndex(x => x.id == req.body.id);
        students[index] = req.body;
        res.send(req.body.name + " edited successfully");

    } catch (err) {
        res.send("Editing student failed!");
    }
    
});

// update mentor
app.put("/edit-mentor", (req, res) => {
    
    try {
        let index = mentors.findIndex(x => x.id == req.body.id);
        mentors[index] = req.body;
        res.send(req.body.name + " edited successfully");

    } catch (err) {
        res.send("Editing mentor failed!");
    }
});

// delete student
app.delete("/delete-student", (req, res) => {
    
    try {
        let index = students.findIndex(x => x.id == req.body.id);
        if(index === -1)
            res.send("Student with id = " + req.body.id + " doesn't exists!");
        else 
        {
            students.splice(index, 1);
            res.send("Student with id = " + req.body.id + " deleted successfully!");
        }

    } catch (err) {
        res.send("Student deletion failed!");
    }
});

// delete mentor
app.delete("/delete-mentor", (req, res) => {
    
    try {
        let index = mentors.findIndex(x => x.id == req.body.id);
        if(index === -1)
            res.send("Mentor with mentor_id = " + req.body.id + " doesn't exists!");
        else
        {
            mentors.splice(index, 1);
            res.send("Mentor with mentor_id = " + req.body.id + " deleted successfully");
        }

    } catch (err) {
        res.send("Mentor deletion failed");
    }
});

// assign student to mentor
app.put("/assign-students", (req, res) => {

    try {
        let mentorIndex = mentors.findIndex(x => x.id == req.body.mentor_id);
        let studentsAssigned = req.body.students;

        // Update the mentor details
        mentors[mentorIndex].students = studentsAssigned;

        // Update the student details
        for(let i in studentsAssigned)
        {
            let studentIndex = students.findIndex(x => x.id == studentsAssigned[i]);
            students[studentIndex].mentor_id = req.body.mentor_id;
        }

        res.send("Students assigned to " +  mentors[mentorIndex].name + " successfully");
    
    } catch (err) {
        res.send("Students assignment failed!");
    }
});

// assign mentor to student
app.put("/assign-mentor", (req, res) => {
    try {
        let studentIndex = students.findIndex(x => x.id == req.body.id);
        let mentorIndex = mentors.findIndex(x => x.id == req.body.mentor_id);

        // Update the student details
        students[studentIndex].mentor_id = req.body.mentor_id;

        // Update the mentor details
        mentors[mentorIndex].students.push(req.body.id);
        
        res.send( mentors[mentorIndex].name + " assigned to " +  students[studentIndex].name + " successfully");

    } catch (error) {
        res.send("Mentor assignment failed!");
    }
});

// Show students by mentor id
app.post("/find-students-by-mentor_id", (req, res) => {
    try {

        let foundStudents = [];
        for(let i in students)
        {
            if(students[i].mentor_id == req.body.mentor_id)
                foundStudents.push(students[i]);
        }
        res.send(foundStudents);

    } catch (err) {
        res.send("No students for mentor_id = " + req.body.mentor_id);
    }
});

app.listen(8080);