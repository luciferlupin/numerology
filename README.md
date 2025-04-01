# Numerology Insights Website

A modern, interactive numerology website that allows users to calculate and interpret their key numerology numbers based on their name and birthdate.

## Features

- **Numerology Calculator**: Calculate Life Path Number, Destiny Number, and Personality Number
- **Detailed Interpretations**: Comprehensive meanings for each numerology number
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern Interface**: Clean, intuitive user experience

## Technologies Used

- Node.js
- Express.js
- EJS templating
- MongoDB (optional for user accounts and saved readings)
- HTML5/CSS3
- JavaScript

## Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Navigate to the project directory:
```
cd numerology-project
```

3. Install dependencies:
```
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/numerology-db
```

5. Start the development server:
```
npm run dev
```

6. Open your browser and visit `http://localhost:3000`

## Project Structure

```
numerology-project/
├── public/               # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   └── images/           # Images
├── views/                # EJS templates
│   ├── partials/         # Reusable template parts
│   ├── index.ejs         # Homepage
│   ├── calculator.ejs    # Numerology calculator
│   ├── meanings.ejs      # Number meanings
│   └── about.ejs         # About page
├── server.js             # Main application file
├── package.json          # Project dependencies
└── .env                  # Environment variables
```

## Numerology Calculations

The application calculates the following numerology numbers:

1. **Life Path Number**: Derived from your birth date, reveals your life's purpose
2. **Destiny Number**: Calculated from your full name, shows your goals and abilities
3. **Personality Number**: Based on the consonants in your name, shows how others perceive you

## Future Enhancements

- User accounts to save readings
- Compatibility calculator
- Personal year and month calculations
- Detailed birth chart analysis
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Numerology resources and reference materials
- Modern UI/UX design inspiration
- Open-source community for various libraries used
