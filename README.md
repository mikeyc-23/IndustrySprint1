🚀 TD Financial Health Beta Console
This project is a high-concept, fully responsive sign-up console developed for the TD Industry Sprint. It reimagines the onboarding process as an immersive, cyberpunk "initialization sequence" to maximize engagement and demonstrate advanced frontend integration capabilities.

✨ Key Features
This project features a Cyberpunk Aesthetic with a full-screen animation built using HTML5 Canvas for the real-time glitch grid background. It presents a Unified Glass Console, which is a modern glassmorphism UI combining the visual scanner and the sign-up form into a single, cohesive unit. Functionally, it utilizes a Sequential API Handshake for its two-step communication flow (/register followed by POST /signups). This is backed by Robust Client-Side Validation (JavaScript/RegEx) and provides Instant Visual Feedback, turning the TD logo and scanner RED on validation failure before transitioning to a themed Success Screen on completion.

🛠️ Tech Stack
The architecture is built on HTML5 & SCSS for structure and modular, maintainable styling. All core logic, animation, form validation, and API communication are handled by Vanilla JavaScript (ES6+). The low-level, high-performance background rendering is accomplished using the HTML5 Canvas API. Finally, all non-blocking interaction with external services is managed using Asynchronous JavaScript (async/await).

⚙️ Setup and Execution
Prerequisites
You need a simple local web server to run this project (e.g., VS Code's Live Server extension).
Running the Application
Clone this repository to your local machine.
Open the project folder.
Open index.html using a local web server.
The application is immediately active. The scripts/script.js file will handle the animation, form submission, and external API communication.

🌐 API Endpoints Used
The application successfully integrates with the following external endpoints as required by the sprint criteria: GET /register is used to obtain a unique api_key. This key is then used with POST /signups?api_key=... to submit the user's data payload.

Disclaimer: This project was built for educational purposes as part of the Brainstation Industry Project with TD.
