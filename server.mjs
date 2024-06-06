import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
const port = 80;

// Import the necessary functions from the Firebase Admin SDK
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Provide the path to your service account key JSON file
import serviceAccount from './edunet-423522-8e3abe7c1f3b.json' assert { type: 'json' };

// Initialize the app with a service account, granting admin privileges
initializeApp({
  credential: cert(serviceAccount),
});

// Initialize Firestore
const db = getFirestore();

// Middleware to enable CORS
app.use(cors());

// const corsOptions = {
//     origin: 'http://localhost:3000', // Allow only this origin
//     optionsSuccessStatus: 200 // Some legacy browsers choke on 204
//   };
//   app.use(cors(corsOptions));

app.options('*', cors())


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, this is EDUNET server!' });
});
// Sign-Up Function
async function signUp(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userDoc = db.collection('users').doc(email);

  await userDoc.set({
    email: email,
    password: hashedPassword,
  });

  res.status(200).send(`User ${email} signed up successfully.`);
}

// Sign-In Function
async function signIn(req, res) {
  const { email, password } = req.body;
  console.log(email)
  console.log(password)


  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const userDoc = db.collection('users').doc(email);
  const userSnapshot = await userDoc.get();

  if (!userSnapshot.exists) {
    return res.status(400).send('User not found.');
  }

  const userData = userSnapshot.data();
  const isPasswordValid = await bcrypt.compare(password, userData.password);

  if (isPasswordValid) {
    res.status(200).send(`User ${email} signed in successfully.`);
  } else {
    res.status(400).send('Invalid password.');
  }
}

// Routes
app.post('/signup', signUp);
app.post('/signin', signIn);




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});