console.log("uiUpdates.js: START - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);
// uiUpdates.js - Contains functions for updating the game's UI

window.uiUpdates = {}; // Create the uiUpdates object on the window

window.uiUpdates.displayToTerminal = function(message, className = '') {
    // Note: 'terminal' is a global from dom.js
    if (typeof terminal === 'undefined' || !terminal) return;
    const messageElement = document.createElement('div');
    if (className) messageElement.className = className;
    messageElement.textContent = message; // Use textContent to prevent HTML injection
    terminal.appendChild(messageElement);
    terminal.scrollTop = terminal.scrollHeight;
}

window.uiUpdates.clearTerminal = function() {
    // Note: 'terminal' is a global from dom.js
    if (typeof terminal !== 'undefined' && terminal) {
        terminal.innerHTML = '';
    }
}

window.uiUpdates.displayToStoryPanel = function(message, sender = "AURORA") {
    // Note: 'storyMessages' is a global from dom.js
    // Note: 'speechEnabled' is a global from speech.js (or gameState.js if moved there)
    // Note: 'queueSpeech' is a global from speech.js
    if (typeof storyMessages === 'undefined' || !storyMessages) return;
    const messageElement = document.createElement('div');
    if (sender === "AURORA") {
        messageElement.className = 'aurora-message';
        messageElement.textContent = `AURORA: "${message}"`;
        if (typeof speechEnabled !== 'undefined' && speechEnabled && typeof queueSpeech === 'function') {
            queueSpeech(message);
        }
    } else if (sender === "SYSTEM") {
        messageElement.className = 'system-message';
        messageElement.textContent = `* ${message} *`;
    }
    storyMessages.appendChild(messageElement);
    storyMessages.scrollTop = storyMessages.scrollHeight;
}

window.uiUpdates.updateObjectivePanel = function(objectiveDescription, hintPromptVisible = true) {
    // Note: 'objectiveTextElement', 'objectiveHintPromptElement' are globals from dom.js
    // Note: 'currentStoryPhaseIndex', 'storyPhases' are globals from gameState.js
    if (typeof objectiveTextElement !== 'undefined' && objectiveTextElement) {
        objectiveTextElement.textContent = objectiveDescription;
    }
    if (typeof objectiveHintPromptElement !== 'undefined' && objectiveHintPromptElement) {
        if (hintPromptVisible && typeof currentStoryPhaseIndex !== 'undefined' && typeof storyPhases !== 'undefined' && currentStoryPhaseIndex < storyPhases.length) {
            objectiveHintPromptElement.textContent = "Ask AURORA in chat if you need a hint, or type 'hint' in the terminal.";
            objectiveHintPromptElement.style.display = 'block';
        } else {
            objectiveHintPromptElement.textContent = "";
            objectiveHintPromptElement.style.display = 'none';
        }
    }

    const objectiveTitleElement = document.querySelector('.objective h3');
    if (objectiveTitleElement) {
        if (typeof currentStoryPhaseIndex !== 'undefined' && typeof storyPhases !== 'undefined' && 
            currentStoryPhaseIndex > 0 && currentStoryPhaseIndex <= storyPhases.length && 
            storyPhases[currentStoryPhaseIndex - 1]?.isMajorCompletion) {
            objectiveTitleElement.textContent = "OBJECTIVE COMPLETE:";
        } else {
            objectiveTitleElement.textContent = "CURRENT OBJECTIVE:";
        }
    }
}

window.uiUpdates.updateShipSystemStatus = function(systemKey, newStatus, newLevel = null) {
    // Note: 'shipSystems' is a global from gameState.js
    // DOM elements for system status (e.g., shipSystems[systemKey].indicator, shipSystems[systemKey].textElement)
    // are expected to be part of the shipSystems object, originally initialized with getElementById from dom.js
    if (typeof shipSystems !== 'undefined' && shipSystems[systemKey]) {
        const system = shipSystems[systemKey];
        system.status = newStatus;
        if (newLevel !== null) system.level = newLevel;

        if (system.textElement) {
            system.textElement.textContent = `${system.label}: ${system.status.toUpperCase()}` + (newLevel !== null ? ` (${system.level}%)` : '');
        }
        if (system.indicator) {
            system.indicator.className = 'status-indicator'; // Reset classes
            if (newStatus.toLowerCase().includes('critical') || newStatus.toLowerCase().includes('offline')) {
                system.indicator.classList.add('status-critical');
            } else if (newStatus.toLowerCase().includes('warning') || newStatus.toLowerCase().includes('low') || newStatus.toLowerCase().includes('limited') || newStatus.toLowerCase().includes('partial')) {
                system.indicator.classList.add('status-warning');
            } else { // OK, Stable, Online
                system.indicator.classList.add('status-ok');
            }
        }
    }
}

window.uiUpdates.formatPromptPath = function(path) {
    if (!path) return ''; // Should not happen if path is always gameState.currentPath
    const userHome = `/home/${gameState.loggedInUser}`;
    if (path === userHome) return '~';
    if (path.startsWith(userHome + '/')) return '~' + path.substring(userHome.length);
    return path;
}

window.uiUpdates.updatePrompt = function() {
    if (typeof commandPrompt !== 'undefined' && commandPrompt && typeof gameState !== 'undefined') {
        const username = gameState.loggedInUser || 'user';
        const path = window.uiUpdates.formatPromptPath(gameState.currentPath) || '~';
        commandPrompt.textContent = `${username}@odyssey7:${path}$ `;
    }
}

window.uiUpdates.updateCursorPosition = function() {
    // Note: 'commandInput', 'cursor' are globals from dom.js
    if (typeof commandInput === 'undefined' || !commandInput || typeof cursor === 'undefined' || !cursor) return;
    const inputStyle = window.getComputedStyle(commandInput);
    const tempSpan = document.createElement('span');
    Object.assign(tempSpan.style, {
        font: inputStyle.font, fontSize: inputStyle.fontSize, letterSpacing: inputStyle.letterSpacing,
        position: 'absolute', visibility: 'hidden', whiteSpace: 'pre'
    });
    document.body.appendChild(tempSpan);
    tempSpan.textContent = commandInput.value.substring(0, commandInput.selectionStart);
    cursor.style.left = tempSpan.getBoundingClientRect().width + 'px';
    document.body.removeChild(tempSpan);
}

window.uiUpdates.addChatMessageToPanel = function(message, sender) {
    // Note: 'chatMessages' is global from dom.js
    // Note: 'speechEnabled' is global from speech.js (or gameState.js)
    // Note: 'queueSpeech' is global from speech.js
    if (typeof chatMessages === 'undefined' || !chatMessages) return;
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'player-message' : 'aurora-message';
    messageElement.textContent = `${sender === 'user' ? 'YOU' : sender}: "${message}"`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (sender === 'AURORA' && typeof speechEnabled !== 'undefined' && speechEnabled && typeof queueSpeech === 'function') {
        queueSpeech(message);
    }
} 