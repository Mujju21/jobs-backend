const express = require('express');
const fs = require('fs');
const cors = require('cors');
const port = process.env.PORT || 8000 

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = ',/jobs.json'

app.get('/', (req, res) => {
  res.send('Jobs backend API is running');
});

//Read 
app.get('/jobs',(req,res) => {
    const jobs = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(jobs);
});

//Add 
app.post('/jobs',(req,res) => {
    const jobs = JSON.parse(fs.readFileSync(DATA_FILE));
    const newJob = req.body;

    // Generate serial ID
    const lastId = jobs.length > 0 ? jobs[jobs.length - 1].id : 0;
    newJob.id = lastId + 1;

    jobs.push(newJob);
    fs.writeFileSync(DATA_FILE,JSON.stringify(jobs,null,2));
    res.json(newJob);
});

//update
app.put('/jobs/:id', (req, res) => {
    let jobs = JSON.parse(fs.readFileSync(DATA_FILE));
    const jobID = Number(req.params.id);
    jobs = jobs.map(job => job.id === jobId ? {...job, ...req.body} : job);
    fs.writeFileSync(DATA_FILE, JSON.stringify(jobs,null,2));
    res.json({ success: true});
});

//delete
app.delete('/jobs/:id', (req,res) => {
    let jobs = JSON.parse(fs.readFileSync(DATA_FILE));
    const jobID = Number(req.params.id);
    jobs = jobs.filter(job => job.id ==! job.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));
   res.json({ success: true });
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
