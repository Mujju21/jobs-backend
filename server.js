const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
const DATA_FILE = path.join(__dirname, 'jobs.json');

app.get('/', (req, res) => {
  res.send('Jobs backend API is running');
});

//Read 
app.get('/jobs',(req,res) => {
    try{
        const jobs = JSON.parse(fs.readFileSync(DATA_FILE));
        res.json(jobs);
    }catch(error){
        res.status(500).json({ error: 'Could not read jobs file' });
    }

});

//Add 
app.post('/jobs',(req,res) => {
    try{
        const jobs = JSON.parse(fs.readFileSync(DATA_FILE));
        const newJob = req.body;

        // Generate serial ID
        const lastId = jobs.length > 0 ? jobs[jobs.length - 1].id : 0;
        newJob.id = lastId + 1;

        jobs.push(newJob);
        fs.writeFileSync(DATA_FILE,JSON.stringify(jobs,null,2));
        res.json(newJob);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Could not add job' });
    }

});

//update
app.put('/jobs/:id', (req, res) => {
    try{
        let jobs = JSON.parse(fs.readFileSync(DATA_FILE));
        const jobId = (req.params.id);
        jobs = jobs.map(job => job.id === jobId ? {...job, ...req.body} : job);
        fs.writeFileSync(DATA_FILE, JSON.stringify(jobs,null,2));
        res.json({ success: true});
    }catch(error){
        res.status(500).json({ error: 'Could not update job' });
    }
    
});

//delete
app.delete('/jobs/:id', (req,res) => {
    try{
        let jobs = JSON.parse(fs.readFileSync(DATA_FILE));
        const jobId = (req.params.id);
        jobs = jobs.filter(job => job.id !== jobId);
        fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));
        res.json({ success: true });
    }catch(error){
        res.status(500).json({ error: 'Could not delete job' });
    }

});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


