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
app.get('/jobs', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data.jobs); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not read jobs file' });
  }
});

// ADD
app.post('/jobs', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const jobs = data.jobs;

    const newJob = req.body;

    const lastId = jobs.length > 0 ? parseInt(jobs[jobs.length - 1].id) : 0;
    newJob.id = lastId + 1;

    jobs.push(newJob);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newJob);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not add job' });
  }
});

// Update job
app.put('/jobs/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const jobs = data.jobs;
    const jobId = req.params.id;

    const updatedJobs = jobs.map(job =>
      job.id == jobId ? { ...job, ...req.body, id: job.id } : job
    );

    data.jobs = updatedJobs;

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update job' });
  }
});

// Delete job
app.delete('/jobs/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const jobs = data.jobs;
    const jobId = req.params.id;

    const filteredJobs = jobs.filter(job => job.id != jobId);
    data.jobs = filteredJobs;

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete job' });
  }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


