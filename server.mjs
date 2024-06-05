import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Middleware to enable CORS
app.use(cors());

// const corsOptions = {
//     origin: 'http://localhost:3000', // Allow only this origin
//     optionsSuccessStatus: 200 // Some legacy browsers choke on 204
//   };
//   app.use(cors(corsOptions));

app.options('*', cors())

// POST endpoint to handle form submission
app.post('/login', (req, res) => {
  console.log(req.body)
  const {  email, password } = req.body;

  console.log('Form data received:', { email, password });

  // Here, you can process the data (e.g., save it to a database, send an email, etc.)
  
  // For now, we just send a response back to the client
  res.status(200).json({ message: 'Form submitted successfully!' });
});

app.get('/', (req, res) => {

  res.status(200).json({ message: 'Hello, this is EDUNET server!' });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});