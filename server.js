const express = require('express');
const Datastore = require('nedb');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// Initialize NeDB
const db = new Datastore({ filename: 'tasks.db', autoload: true });

// API to get tasks
app.get('/tasks', (req, res) => {
    db.find({}, (err, tasks) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(tasks);
    });
});

// API to add a task
app.post('/tasks', (req, res) => {
    const task = req.body;
    db.insert(task, (err, newTask) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(newTask);
    });
});

// API to update a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;
    db.update({ _id: id }, { $set: updatedTask }, {}, (err, numReplaced) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ updated: numReplaced });
    });
});

// API to delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ removed: numRemoved });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});