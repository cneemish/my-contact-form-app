// const express = require('express');
//const fetch = require('node-fetch'); // You'll likely need to install this: npm install node-fetch

import express from 'express';
import fetch from 'node-fetch'; 

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import dotenv from 'dotenv'; //for .env file 
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000; // Or any port you prefer

app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json()); // To parse JSON data

function generateRandomTitle(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random()   
   * chars.length));
    }
    return result;
  } // Function to generate a random alphanumeric string


// Serve the HTML form (you'll create this in the next step)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/contact.html'); 
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { name, mobile_number, email } = req.body;

const title = generateRandomTitle(10);  // Generate a random 10-character title

  const data = {
    entry: {
      title: title,
      name: name,
      mobile_number: mobile_number,
      email: email 
    }
  };

  try {
    const response = await fetch('https://api.contentstack.io/v3/content_types/submit_button/entries?', { // Replace placeholders
      method: 'POST',
      headers: {
        'api_key': process.env.CONTENTSTACK_API_KEY, // Replace with your actual API key
        'authorization': process.env.CONTENTSTACK_MANAGEMENT_TOKEN, // Replace with your actual management token
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
        res.send(`
          <script>
            alert('Form submitted successfully!');
            window.location.href = '/'; // Redirect back to the form after success
          </script>
        `);
      } else {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData);
        res.send(`
          <script>
            alert('An error occurred while submitting the form. Please try again later.');
            document.getElementById('contactForm').reset(); // Reset the form
          </script>
        `);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      res.status(500).send(`
        <script>
          alert('An error occurred while submitting the form. Please try again later.');
          document.getElementById('contactForm').reset(); // Reset the form
        </script>
      `);
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});