const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Data storage
const TESTIMONIALS_FILE = path.join(__dirname, 'data', 'testimonials.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
  }

  // Initialize testimonials file if it doesn't exist
  if (!fs.existsSync(TESTIMONIALS_FILE)) {
    fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify([], null, 2));
  }
} catch (error) {
  console.error('Error initializing data directory or files:', error);
}

// Helper function to read testimonials
function getTestimonials() {
  try {
    const data = fs.readFileSync(TESTIMONIALS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return [];
  }
}

// Routes
app.get('/', (req, res) => {
  const testimonials = getTestimonials();
  res.render('index', { testimonials: testimonials.slice(0, 3) });
});

app.get('/calculator', (req, res) => {
  res.render('calculator');
});

app.get('/meanings', (req, res) => {
  res.render('meanings');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/services', (req, res) => {
  res.render('services');
});

app.get('/booking', (req, res) => {
  res.render('booking');
});

app.get('/pricing', (req, res) => {
  res.render('pricing');
});

app.get('/testimonials', (req, res) => {
  const testimonials = getTestimonials();
  res.render('testimonials', { testimonials });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/faq', (req, res) => {
  res.render('faq');
});

app.get('/submit-review', (req, res) => {
  res.render('submit-review');
});

// API routes
app.post('/api/submit-review', (req, res) => {
  try {
    const { name, email, serviceType, rating, reviewTitle, reviewContent } = req.body;
    
    // Validate required fields
    if (!name || !email || !serviceType || !rating || !reviewContent) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }
    
    // Create new testimonial object
    const newTestimonial = {
      id: Date.now().toString(),
      name,
      serviceType,
      rating: parseInt(rating),
      title: reviewTitle || '',
      content: reviewContent,
      date: new Date().toISOString(),
      approved: true // Auto-approve testimonials
    };
    
    // Read existing testimonials
    const testimonials = getTestimonials();
    
    // Add new testimonial
    testimonials.push(newTestimonial);
    
    // Save updated testimonials
    fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(testimonials, null, 2));
    
    res.json({ success: true, message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, message: 'An error occurred while submitting your review' });
  }
});

app.post('/api/calculate', (req, res) => {
  const { name, birthdate } = req.body;
  
  // Calculate Life Path Number
  const lifePathNumber = calculateLifePathNumber(birthdate);
  
  // Calculate Destiny Number
  const destinyNumber = calculateDestinyNumber(name);
  
  // Calculate Personality Number
  const personalityNumber = calculatePersonalityNumber(name);
  
  res.json({
    lifePathNumber,
    destinyNumber,
    personalityNumber
  });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;

// Numerology calculation functions
function calculateLifePathNumber(birthdate) {
  // Remove any non-numeric characters
  const cleanDate = birthdate.replace(/\D/g, '');
  
  // Add all digits together
  let sum = 0;
  for (let i = 0; i < cleanDate.length; i++) {
    sum += parseInt(cleanDate[i]);
  }
  
  // Reduce to a single digit (except master numbers 11, 22, 33)
  return reduceToSingleDigit(sum);
}

function calculateDestinyNumber(name) {
  // Remove any non-alphabetic characters and convert to uppercase
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  
  // Map each letter to its numerological value
  const letterValues = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };
  
  // Calculate sum of letter values
  let sum = 0;
  for (let i = 0; i < cleanName.length; i++) {
    sum += letterValues[cleanName[i]] || 0;
  }
  
  // Reduce to a single digit (except master numbers)
  return reduceToSingleDigit(sum);
}

function calculatePersonalityNumber(name) {
  // Remove any non-alphabetic characters and convert to uppercase
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  
  // Map consonants to their numerological value
  const consonantValues = {
    'B': 2, 'C': 3, 'D': 4, 'F': 6, 'G': 7, 'H': 8, 'J': 1, 'K': 2, 'L': 3,
    'M': 4, 'N': 5, 'P': 7, 'Q': 8, 'R': 9, 'S': 1, 'T': 2, 'V': 4, 'W': 5,
    'X': 6, 'Z': 8
  };
  
  // Calculate sum of consonant values
  let sum = 0;
  for (let i = 0; i < cleanName.length; i++) {
    if (consonantValues[cleanName[i]]) {
      sum += consonantValues[cleanName[i]];
    }
  }
  
  // Reduce to a single digit (except master numbers)
  return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(number) {
  // Check for master numbers
  if (number === 11 || number === 22 || number === 33) {
    return number;
  }
  
  // Reduce to a single digit
  while (number > 9) {
    let sum = 0;
    while (number > 0) {
      sum += number % 10;
      number = Math.floor(number / 10);
    }
    number = sum;
  }
  
  return number;
}
