// --- Game State Variables ---
// Ensure /home/user/backup_destination exists for rsync example
if (!window.fileSystemUtils.pathExists('/home/user/backup_destination')) {
    window.fileSystemUtils.createDirectoryInFS('/home/user/backup_destination');
}
// Ensure /home/user/disk_image.img exists for dd example
if (!window.fileSystemUtils.pathExists('/home/user/disk_image.img')) {
    window.fileSystemUtils.createFileInFS('/home/user/disk_image.img', 'Original disk image data...'.repeat(10));
}

// --- Helper Functions ---
// Redundant local helper functions are removed as they are now centralized in window.uiUpdates
// function formatPromptPath(path) { ... }
// function updateCursorPosition() { ... }

// --- Command Processing ---
async function processCommand(currentSegmentCommand, pipedInputLinesArray = null, topLevelFullCommand = null) {
    // Login state handling remains the first priority in script.js
    if (gameState.loginState === 'awaitingUsername') {
        const username = currentSegmentCommand.trim();
        if (!username) {
            window.uiUpdates.displayToTerminal("Username cannot be empty. Please enter a username.");
            if (commandPrompt) commandPrompt.textContent = 'Enter username: ';
            return;
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            window.uiUpdates.displayToTerminal("Invalid username. Use only letters, numbers, underscores, or hyphens.");
            if (commandPrompt) commandPrompt.textContent = 'Enter username: ';
            return;
        }
        gameState.loggedInUser = username;
        gameState.loginState = 'awaitingPassword';
        if (commandPrompt) commandPrompt.textContent = `Password for ${username}: `;
        if (commandInput) commandInput.type = 'password'; 
        window.uiUpdates.displayToTerminal(`Username accepted: ${username}`);
        return;
    } else if (gameState.loginState === 'awaitingPassword') {
        if (commandInput) commandInput.type = 'text'; 
        await performPostLoginSetup(gameState.loggedInUser); 
        gameState.loginState = 'loggedIn';
        if (commandInput) {
            commandInput.value = '';
            window.uiUpdates.updateCursorPosition(); 
        }
        return;
    }

    console.log(`DEBUG: script.js processCommand - About to call window.gameLogic.processCommand. Command: '${currentSegmentCommand}'`, {pipedInputLinesArray, topLevelFullCommand});
    await window.gameLogic.processCommand(currentSegmentCommand, pipedInputLinesArray, topLevelFullCommand);
    console.log(`DEBUG: script.js processCommand - Returned from window.gameLogic.processCommand. Command: '${currentSegmentCommand}'`);
    
    if (commandInput) {
        const trimmedCommand = currentSegmentCommand.trim();
        if (trimmedCommand !== '' && (gameState.commandHistory.length === 0 || trimmedCommand !== gameState.commandHistory[gameState.commandHistory.length - 1])) {
            gameState.commandHistory.push(trimmedCommand);
        }
        gameState.historyIndex = gameState.commandHistory.length; 
        commandInput.value = '';
        window.uiUpdates.updateCursorPosition(); 
    }
}

async function performPostLoginSetup(username) {
    console.log("DEBUG: SCRIPT.JS performPostLoginSetup - START. Username:", username);

    while (!window.storyPhasesReady) {
        console.log("DEBUG: SCRIPT.JS performPostLoginSetup - Waiting for storyPhasesReady...");
        await new Promise(resolve => setTimeout(resolve, 100)); 
    }
    console.log("DEBUG: SCRIPT.JS performPostLoginSetup - storyPhasesReady is true, proceeding.");

    console.log("DEBUG: SCRIPT.JS performPostLoginSetup - gameState.fileSystem['/'].children.home exists?", !!(gameState.fileSystem && gameState.fileSystem['/'] && gameState.fileSystem['/'].children && gameState.fileSystem['/'].children.home));
    console.log("DEBUG: SCRIPT.JS performPostLoginSetup - gameState.fileSystem['/'].children.home.children.user exists?", !!(gameState.fileSystem && gameState.fileSystem['/'] && gameState.fileSystem['/'].children && gameState.fileSystem['/'].children.home && gameState.fileSystem['/'].children.home.children && gameState.fileSystem['/'].children.home.children.user));

    if (gameState.fileSystem['/'] && gameState.fileSystem['/'].children.home && gameState.fileSystem['/'].children.home.children.user) {
        console.log("DEBUG: SCRIPT.JS performPostLoginSetup - INSIDE IF for /home/user processing.");
        if (username !== 'user') { 
            gameState.fileSystem['/'].children.home.children[username] = gameState.fileSystem['/'].children.home.children.user;
            delete gameState.fileSystem['/'].children.home.children.user;
        }
        let passwdContent = window.fileSystemUtils.readFileContent('/etc/passwd') || "";
        console.log("DEBUG: SCRIPT.JS performPostLoginSetup - passwdContent from readFileContent:", typeof passwdContent, passwdContent.substring(0,100));
        let users = passwdContent.split('\n');
        users = users.map(line => {
            if (line.startsWith('user:')) {
                return `${username}:x:1000:1000:Space Explorer:/home/${username}:/bin/sh`;
            }
            return line;
        });
        if (!users.some(line => line.startsWith(username + ':'))) { 
            users.push(`${username}:x:1000:1000:Space Explorer:/home/${username}:/bin/sh`);
        }
        window.fileSystemUtils.writeFileContent('/etc/passwd', users.join('\n'));
    } else {
        console.log("DEBUG: SCRIPT.JS performPostLoginSetup - SKIPPED IF for /home/user processing.");
    }

    gameState.currentPath = `/home/${username}`;
    if (commandPrompt) {
        commandPrompt.textContent = `${username}@odyssey7:${window.uiUpdates.formatPromptPath(gameState.currentPath)}$ `;
    }

    window.uiUpdates.displayToTerminal('OdysseyOS Emergency Kernel v0.3.1');
    window.uiUpdates.displayToTerminal('Booting from auxiliary power...');
    await new Promise(resolve => setTimeout(resolve, 100));
    window.uiUpdates.displayToTerminal(`Mounted /home/${username}. Welcome, ${username}.`);
    window.uiUpdates.displayToTerminal(`Current directory: ${gameState.currentPath}`);
    
    console.log("DEBUG: SCRIPT.JS performPostLoginSetup - About to check storyPhases. typeof gameState.storyPhases:", typeof gameState.storyPhases);
    if (gameState.storyPhases) { 
        console.log("DEBUG: SCRIPT.JS performPostLoginSetup - gameState.storyPhases.length:", gameState.storyPhases.length);
    }
    console.log("DEBUG: SCRIPT.JS performPostLoginSetup - gameState.currentStoryPhaseIndex:", gameState.currentStoryPhaseIndex);

    if (gameState.storyPhases && 
        gameState.storyPhases.length > 0 && 
        gameState.currentStoryPhaseIndex >= 0 && 
        gameState.currentStoryPhaseIndex < gameState.storyPhases.length && 
        gameState.storyPhases[gameState.currentStoryPhaseIndex]) {
        
        const currentPhase = gameState.storyPhases[gameState.currentStoryPhaseIndex];
        console.log("DEBUG: SCRIPT.JS performPostLoginSetup - Current phase object:", currentPhase);

        if (typeof currentPhase.objective === 'string') {
            const initialObjective = currentPhase.objective.replace(/{{USER_HOME}}/g, `/home/${username}`);
            window.uiUpdates.updateObjectivePanel(initialObjective, true);
        } else {
            console.error("DEBUG: SCRIPT.JS performPostLoginSetup - currentPhase.objective is not a string or is undefined. Value:", currentPhase.objective);
            window.uiUpdates.updateObjectivePanel(`Error: Objective data missing for current phase (${gameState.currentStoryPhaseIndex}). Please check story configuration.`, false);
        }
        
        if (typeof currentPhase.auroraMessage === 'string') {
            const initialAuroraMessage = currentPhase.auroraMessage.replace(/{{USER_HOME}}/g, `/home/${username}`);
            window.uiUpdates.displayToStoryPanel(initialAuroraMessage, "AURORA");
        } else {
            console.error("DEBUG: SCRIPT.JS performPostLoginSetup - currentPhase.auroraMessage is not a string or is undefined. Value:", currentPhase.auroraMessage);
            window.uiUpdates.displayToStoryPanel(`Error: System message missing for current phase (${gameState.currentStoryPhaseIndex}). Please check story configuration.`, "AURORA");
        }
        
        if (!currentPhase.commandToLearn) { 
             window.uiUpdates.displayToTerminal(`Type 'help' and press Enter to see available commands or ask AURORA for guidance via chat.`);
        }

    } else {
        console.error("DEBUG: SCRIPT.JS performPostLoginSetup - Failed story phase condition. gameState.storyPhases:", gameState.storyPhases, "currentStoryPhaseIndex:", gameState.currentStoryPhaseIndex);
        window.uiUpdates.updateObjectivePanel("No objectives loaded or story data is invalid. Please check game configuration.", false);
        window.uiUpdates.displayToStoryPanel("Critical error: Unable to load mission objectives. System integrity compromised.", "AURORA");
    }
    
    window.uiUpdates.addChatMessageToPanel("AURORA online. Limited functionality. Ready to assist.", "AURORA");

    if (commandInput) {
        commandInput.focus();
        window.uiUpdates.updateCursorPosition();
    }
}

// Event Listeners and Initialization (mostly as before, but with speechEnabled=false)
helpButton.addEventListener('click', () => {
    helpPanel.style.display = (helpPanel.style.display === 'none' || helpPanel.style.display === '') ? 'block' : 'none';
});

voiceControl.addEventListener('click', () => {
    speechEnabled = !speechEnabled; 
    voiceControl.textContent = speechEnabled ? 'MUTE VOICE' : 'ENABLE VOICE';
    if (speechEnabled) {
        window.uiUpdates.displayToTerminal("AURORA voice enabled. Synthesizing...", "system-text");
        const testUtterance = new SpeechSynthesisUtterance("Voice systems online.");
        if(synth) synth.speak(testUtterance);
        processSpeechQueue(); 
    } else {
        if(synth) synth.cancel(); 
        speechQueue = [];
        isSpeaking = false;
        if(voiceIndicator) voiceIndicator.style.display = 'none';
        window.uiUpdates.displayToTerminal("AURORA voice muted.", "system-text");
    }
});

commandInput.addEventListener('keydown', async (event) => {
    const allowedKeysWithoutInterrupt = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Tab'];
    if (!allowedKeysWithoutInterrupt.includes(event.key) && isSpeaking && synth) {
        synth.cancel(); speechQueue = []; isSpeaking = false; if(voiceIndicator) voiceIndicator.style.display = 'none';
    }

    if (event.key === 'Enter') {
        event.preventDefault();
        const command = commandInput.value; 
        console.log(`DEBUG: script.js EnterKeyHandler - ENTRY. Key: ${event.key}, Command Raw: '${command}', LoginState: ${gameState.loginState}`);

        if (gameState.loginState === 'loggedIn') {
            const promptText = commandPrompt ? commandPrompt.textContent : `${gameState.loggedInUser}@odyssey7:${window.uiUpdates.formatPromptPath(gameState.currentPath)}$ `;
            if (typeof window.uiUpdates.displayToTerminal === 'function') {
                window.uiUpdates.displayToTerminal(`${promptText}${command}`);
            } else {
                console.error("displayToTerminal function is not available to echo command.");
            }
        }

        commandInput.value = '';
        window.uiUpdates.updateCursorPosition();

        if (gameState.loginState === 'awaitingUsername') {
            await processCommand(command); 
        } else if (gameState.loginState === 'awaitingPassword') {
            commandInput.value = ''; window.uiUpdates.updateCursorPosition(); 
            await processCommand(command); 
        } else if (command.trim()) { 
            console.log(`DEBUG: script.js EnterKeyHandler - LoggedIn Path. gameState.loginState: ${gameState.loginState}, Command: '${command.trim()}'`);
            await processCommand(command); 
        } else { 
            if (gameState.loginState === 'loggedIn' && typeof window.uiUpdates.displayToTerminal === 'function') {
                 const promptText = commandPrompt ? commandPrompt.textContent : `${gameState.loggedInUser}@odyssey7:${window.uiUpdates.formatPromptPath(gameState.currentPath)}$ `;
                 window.uiUpdates.displayToTerminal(`${promptText}`);
            }  
        }

        if (terminal) terminal.scrollTop = terminal.scrollHeight;
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (gameState.commandHistory.length > 0) {
            gameState.historyIndex = Math.max(0, gameState.historyIndex - 1);
            commandInput.value = gameState.commandHistory[gameState.historyIndex] || '';
            commandInput.selectionStart = commandInput.selectionEnd = commandInput.value.length;
            window.uiUpdates.updateCursorPosition();
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (gameState.commandHistory.length > 0 && gameState.historyIndex < gameState.commandHistory.length - 1) {
            gameState.historyIndex++;
            commandInput.value = gameState.commandHistory[gameState.historyIndex];
        } else {
            gameState.historyIndex = gameState.commandHistory.length;
            commandInput.value = '';
        }
        commandInput.selectionStart = commandInput.selectionEnd = commandInput.value.length;
        window.uiUpdates.updateCursorPosition();
    }
});
commandInput.addEventListener('input', window.uiUpdates.updateCursorPosition);
commandInput.addEventListener('click', window.uiUpdates.updateCursorPosition);
commandInput.addEventListener('keyup', window.uiUpdates.updateCursorPosition);

chatInput.addEventListener('keydown', (event) => {
    if (!['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'Tab'].includes(event.key) && isSpeaking && synth) {
        synth.cancel(); speechQueue = []; isSpeaking = false; if(voiceIndicator) voiceIndicator.style.display = 'none';
    }
    if (event.key === 'Enter') {
        event.preventDefault();
        sendChatMessage();
    }
});
chatSend.addEventListener('click', sendChatMessage);

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    window.uiUpdates.addChatMessageToPanel(message, 'user'); 
    chatInput.value = '';
    setTimeout(() => {
        const aiResponse = generateAIChatResponse(message);
        window.uiUpdates.addChatMessageToPanel(aiResponse, 'AURORA');
    }, 600 + Math.random() * 400);
}

function generateAIChatResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    const helpKeywords = ['help', 'stuck', 'what do i do', 'what next', 'what command', 'how do i', 'hint', 'manual', 'man page'];

    if (helpKeywords.some(keyword => msg.includes(keyword))) {
        if (gameState.currentStoryPhaseIndex < gameState.storyPhases.length) {
            const phase = gameState.storyPhases[gameState.currentStoryPhaseIndex];
            if (phase.details) {
                let hintPrefix = "Let me assist... ";
                const prefixes = ["For your current objective, ", "To achieve that, ", "You could try this: ", "Consider the following approach: "];
                hintPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                return `${hintPrefix}${phase.details}`;
            } else {
                return "I'm still analyzing the best course of action. Focus on the objective description for now.";
            }
        } else {
            return "All primary directives seem complete. I have no further specific command instructions.";
        }
    }
    if (msg.includes("aurora") || msg.includes("who are you")) return `I am AURORA. My systems are ${gameState.currentStoryPhaseIndex > 5 ? 'recovering' : 'impaired, but I am assisting'}.`;
    if (msg.includes("status") || msg.includes("ship")) return `Life Support: ${gameState.shipSystems.lifeSupport.status}, Power: ${gameState.shipSystems.power.status}, Nav: ${gameState.shipSystems.navigation.status}, Comms: ${gameState.shipSystems.comms.status}.`;
    if (msg.includes("thank")) return "You are welcome. Collaboration is essential.";
    if (msg.includes("hello") || msg.includes("hi")) return "Hello. Ready for the next objective?";
    return "Understood. Please use the terminal for system interactions, or ask for a hint if needed.";
}

let gameInitialized = false; // Moved to a wider scope to prevent re-initialization

async function initializeGame() {
    if (gameInitialized) {
        console.warn("InitializeGame called more than once. Aborting subsequent calls.");
        return;
    }
    gameInitialized = true; // Set flag immediately

    if (storyMessages) storyMessages.innerHTML = '';
    if (chatMessages) chatMessages.innerHTML = '';
    if (terminal) terminal.innerHTML = ''; 

    if (window.gameLogic && typeof window.gameLogic.initializeGameLogic === 'function') {
        console.log("DEBUG: SCRIPT.JS initializeGame - Calling window.gameLogic.initializeGameLogic()...");
        await window.gameLogic.initializeGameLogic();
        console.log("DEBUG: SCRIPT.JS initializeGame - window.gameLogic.initializeGameLogic() COMPLETED.");
    } else {
        console.error("CRITICAL ERROR: window.gameLogic.initializeGameLogic is not available!");
        if (window.uiUpdates && typeof window.uiUpdates.displayToTerminal === 'function') {
            window.uiUpdates.displayToTerminal("CRITICAL SYSTEM ERROR: Game logic module failed to load. Cannot continue.");
        } else {
            alert("CRITICAL SYSTEM ERROR: Game logic module failed to load AND UI is not available. Cannot continue.");
        }
        return; 
    }

    const infoLog = 'INFO LOG - EMERGENCY BOOT SEQUENCE INITIATED\n' +
                    'PRIORITY ONE ALERT: CRITICAL SYSTEM FAILURE DETECTED. Following a catastrophic event impacting primary ship systems, including the central Aurora AI, a localized emergency protocol has been activated. As the only crew member, you are being directed to the Engineering Bay. Prior to its core shutdown, the main Aurora AI initiated a critical life support rerouting sequence, isolating oxygen supply to the Engineering Bay. This sector houses the primary system terminal, maintained by an independent backup power source, and a simplified localized instance of Aurora capable of limited system diagnostics and repair assistance.\n' +
                    'IMMEDIATE INSTRUCTION: PROCEED TO THE ENGINEERING BAY AND SECURE THE MAIN ACCESS DOOR. Time is of the essence as life support reserves outside this sector are non-existent. The localized Aurora unit within the Engineering Bay terminal is your only immediate resource for assessing the ship\'s critical failures and initiating the long process of bringing essential systems back online. Your survival hinges on utilizing Aurora\'s guidance to navigate the complex task of restoring the Odyssey 7.';

    window.uiUpdates.displayToTerminal(infoLog);
    window.uiUpdates.displayToTerminal("\n-------------------------------------------------------------------------------\n"); 

    window.uiUpdates.updateShipSystemStatus("lifeSupport", "CRITICAL", 10);
    window.uiUpdates.updateShipSystemStatus("power", "CRITICAL", 15);
    window.uiUpdates.updateShipSystemStatus("navigation", "OFFLINE", 0);
    window.uiUpdates.updateShipSystemStatus("comms", "OFFLINE", 0);

    if (commandPrompt) commandPrompt.textContent = 'Enter username: ';
    if (commandInput) {
        commandInput.value = ''; 
        commandInput.focus();
        window.uiUpdates.updateCursorPosition();
    }

    speechEnabled = false;
    if (voiceControl) voiceControl.textContent = 'ENABLE VOICE';
    if (voiceIndicator) voiceIndicator.style.display = 'none';
    initializeTheme(); 
}

window.onload = () => {
    if (synth && typeof synth.getVoices === 'function') {
        synth.getVoices(); 
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                speechSynthesis.onvoiceschanged = null; 
                 if(!gameInitialized) initializeGame(); 
            };
        }
    }
    
    setTimeout(() => {
        if(!gameInitialized) {
            initializeGame();
        }
    }, 200); 

    if (commandInput) commandInput.focus();
    if (window.uiUpdates && typeof window.uiUpdates.updateCursorPosition === 'function') {
        window.uiUpdates.updateCursorPosition(); 
    } else {
        console.warn("uiUpdates not ready for initial cursor position update on window.onload");
    }
};

// --- Theme Switching Functionality ---
function applyTheme(themeName) {
    document.body.dataset.theme = themeName;
    localStorage.setItem('selectedTheme', themeName);
    if (themeSelector.value !== themeName) {
        themeSelector.value = themeName;
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    applyTheme(savedTheme);

    themeSelector.addEventListener('change', (event) => {
        applyTheme(event.target.value);
    });
}

