const canvas = document.getElementById("glitch-bg");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
});

// ANIMATION for glitch effect
let lastTime = 0;
const fps = 15; 
const interval = 1000 / fps;

function draw(currentTime) {
    requestAnimationFrame(draw);

    if (!currentTime) currentTime = 0;
    const deltaTime = currentTime - lastTime;
    if (deltaTime < interval) return;
    lastTime = currentTime - (deltaTime % interval);

    
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = '#003300'; 
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += 40) {
        
        if (Math.random() > 0.995) {
            let yPos = y + (Math.random() * 10 - 5);
            ctx.strokeStyle = '#39ff14'; 
            ctx.beginPath();
            ctx.moveTo(0, yPos);
            ctx.lineTo(canvas.width, yPos);
            ctx.stroke();
            ctx.strokeStyle = '#003300';
        } else {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Vertical line
    for (let x = 0; x < canvas.width; x += 40) {
        if (Math.random() > 0.995) {
            let xPos = x + (Math.random() * 10 - 5);
            ctx.strokeStyle = '#39ff14';
            ctx.beginPath();
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, canvas.height);
            ctx.stroke();
            ctx.strokeStyle = '#003300';
        } else {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }
}
draw(0);

// =
// APPLICATION LOGIC
// =

/**
 * Injects necessary global CSS rules for error states
 */
function injectGlobalStyles() {
    const styleId = 'app-error-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* RED ERROR STATE STYLES */
            .input-error {
                border-color: #ff0000 !important;
                box-shadow: 0 0 10px rgba(255, 0, 0, 0.5) !important;
            }

            .scanner-line.error-state {
                background: #ff0000 !important; /* Scanner line turns red */
                box-shadow: 0 0 20px #ff0000 !important;
            }
            
            .holo-logo.error-state {
                -webkit-text-stroke-color: #ff0000 !important;
                text-shadow: 0 0 30px #ff0000 !important;
            }

            .console-visual.error-state {
                border-right-color: #ff0000 !important;
            }
        `;
        document.head.appendChild(style);
    }
}
injectGlobalStyles(); // Run on load

// DOM & API SETUP
const API_BASE_URL = 'https://industry-sprint-api-365b460ef11e.herokuapp.com';

const form = document.querySelector('form');
//Disable native HTML form validation
form.setAttribute('novalidate', ''); 

const consoleVisual = document.querySelector('.console-visual');
const scannerLine = document.querySelector('.scanner-line');
const holoLogo = document.querySelector('.holo-logo');
const formMessage = document.getElementById('form-message'); 
const submitButton = document.querySelector('button[type="submit"]'); 

const firstNameInput = document.getElementById('firstname');
const lastNameInput = document.getElementById('lastname');
const emailInput = document.getElementById('email');

// Array of all inputs for easy iteration
const allInputs = [firstNameInput, lastNameInput, emailInput];

// VALIDATION FUNCTIONS ---

/**
 * Validates a name (first or last) to ensure it only contains letters and basic punctuation.
 * @param {string} name - The name string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateName(name) {
    // Only allows letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name.trim()) && name.trim().length > 1;
}

/**
 * Validates an email address.
 * @param {string} email
 * @returns {boolean} 
 */
function validateEmail(email) {
    // Standard email validation RegEx 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// STATE HANDLERS

/**
 * Sets the console's visual status
 * @param {string} status - 'error' or 'success'
 */
function setVisualState(status) {
    const isError = status === 'error';
    
    // Toggle class on the main visual container
    consoleVisual.classList.toggle('error-state', isError);

    // Toggle class on the scanner line
    scannerLine.classList.toggle('error-state', isError);
    
    // Toggle class on the logo 
    holoLogo.classList.toggle('error-state', isError);
}

/**
 * Toggles the error class on a specific input field.
 * @param {HTMLElement} input
 * @param {boolean} isValid 
 */
function setInputError(input, isValid) {
    input.classList.toggle('input-error', !isValid);
}

/**
 * Resets the form and console visuals to the default
 */
function resetFormState() {
    allInputs.forEach(input => {
        input.classList.remove('input-error');
    });
    setVisualState('success'); 
    formMessage.textContent = ''; 
    formMessage.classList.remove('active', 'error-glow');
    submitButton.textContent = 'INITIALIZE';
    submitButton.disabled = false;
}

/**
 * Displays a custom error message
 * @param {string} message
 */
function handleError(message) {
    // Inject custom error styles
    const styleId = 'error-message-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .error-glow {
                color: #ff0000;
                text-shadow: 0 0 8px rgba(255, 0, 0, 0.8);
                font-weight: bold;
                animation: errorPulse 0.5s infinite alternate;
            }
            @keyframes errorPulse {
                from { opacity: 1; }
                to { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setVisualState('error');
    formMessage.textContent = message;
    formMessage.classList.add('active', 'error-glow');
    submitButton.textContent = 'INITIALIZE FAILED';
    submitButton.disabled = false;
}

// --- 4. API & Submission Logic ---

/**
 * Handles the multi-step form submission
 * @param {Event} e - The form submission event.
 */
async function handleSubmit(e) {
    e.preventDefault(); 
    resetFormState(); 

    let formIsValid = true;
    let validationErrors = [];
    const formData = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value
    };

    // Client-side
    if (!validateName(formData.firstName)) {
        setInputError(firstNameInput, false);
        validationErrors.push("First Name must contain only letters.");
        formIsValid = false;
    } else {
        setInputError(firstNameInput, true);
    }
    
    if (!validateName(formData.lastName)) {
        setInputError(lastNameInput, false);
        validationErrors.push("Last Name must contain only letters.");
        formIsValid = false;
    } else {
        setInputError(lastNameInput, true);
    }

    if (!validateEmail(formData.email)) {
        setInputError(emailInput, false);
        validationErrors.push("Email address is invalid.");
        formIsValid = false;
    } else {
        setInputError(emailInput, true);
    }

    if (!formIsValid) {
        handleError(validationErrors[0]); 
        return;
    }

    // API CALL
    submitButton.textContent = 'TRANSMITTING...';
    submitButton.disabled = true;
    setVisualState('success'); // Green loading state

    try {
        //Register and get API Key
        const regResponse = await fetch(`${API_BASE_URL}/register`, { method: 'GET' });
        if (!regResponse.ok) throw new Error('API Registration Failed.');
        
        const regData = await regResponse.json();
        const apiKey = regData.api_key; 
        
        if (!apiKey) throw new Error('API Key Not Received.');
        
        //Submit Sign-up Data
        const signupResponse = await fetch(`${API_BASE_URL}/signups?api_key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!signupResponse.ok) {
            let errorDetail = 'Unknown API Submission Error';
            try {
                const errorData = await signupResponse.json();
                errorDetail = errorData.error || errorDetail;
            } catch (e) {
                errorDetail = signupResponse.statusText;
            }
            throw new Error(`Sign-up Failed: ${errorDetail}`);
        }

        //Success
        handleSuccess();

    } catch (error) {
        console.error("Submission Error:", error);
        
        
        handleError("Connection error: Could not initialize account. Please try again.");
    }
}

/**
 * screen to show a successful submission message.
 */
function handleSuccess() {
    const consoleForm = document.querySelector('.console-form');
    
    // Inject the themed success
    consoleForm.innerHTML = `
        <div class="success-screen">
            <i class="fas fa-check-circle success-icon"></i>
            <h2>ACCESS GRANTED</h2>
            <p>Your account has been successfully initialized into the Financial Grid.</p>
            <p>You will receive a confirmation email shortly.</p>
            <button onclick="window.location.reload();" class="reset-button">Restart</button>
        </div>
    `;
    const style = document.createElement('style');
    style.innerHTML = `
        .success-screen {
            text-align: center;
            padding: 20px;
        }
        .success-icon {
            font-size: 80px;
            color: var(--neon-green);
            margin-bottom: 20px;
            text-shadow: 0 0 10px var(--neon-green);
            animation: pulse 1s infinite alternate;
        }
        .success-screen h2 {
            -webkit-text-fill-color: var(--neon-green) !important;
            text-shadow: 0 0 5px var(--neon-green);
        }
        .success-screen p {
            color: #ddd;
            margin-bottom: 30px;
        }
        .reset-button {
            padding: 12px 30px;
            background: var(--td-green);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .reset-button:hover {
            background: var(--neon-green);
            color: black;
        }
        @keyframes pulse {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0.7; transform: scale(1.05); }
        }
    `;
    consoleForm.appendChild(style);


    setVisualState('success');
}

// EVENT LISTENER ---
form.addEventListener('submit', handleSubmit);