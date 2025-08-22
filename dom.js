// dom.js - Contains all DOM element selections

// --- DOM Elements ---
const terminal = document.getElementById('terminal');
const commandInput = document.getElementById('command-input');
const commandPrompt = document.getElementById('command-prompt');
const cursor = document.getElementById('cursor');
const storyMessages = document.getElementById('story-messages');
const objectiveTextElement = document.getElementById('objective-text');
const objectiveHintPromptElement = document.getElementById('objective-hint-prompt');

// Ship Status Indicators
const lifeSupportIndicator = document.getElementById('life-support-indicator');
const lifeSupportStatusText = document.getElementById('life-support-status');
const powerIndicator = document.getElementById('power-indicator');
const powerStatusText = document.getElementById('power-status');
const navigationIndicator = document.getElementById('navigation-indicator');
const navigationStatusText = document.getElementById('navigation-status');
const commsIndicator = document.getElementById('comms-indicator');
const commsStatusText = document.getElementById('comms-status');

// Theme Selector
const themeSelector = document.getElementById('theme-selector');

// Voice Synthesis
const voiceControl = document.getElementById('voice-control');
const voiceIndicator = document.getElementById('voice-indicator');

// Login Elements
const loginContainer = document.getElementById('login-container');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginButton = document.getElementById('login-button');
const loginErrorMessage = document.getElementById('login-error-message');

// Main Game Content Area (to blur during login)
const terminalContainer = document.querySelector('.terminal-container');

// Chat elements
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

// Help Panel
const helpPanel = document.getElementById('help-panel');
const helpCommandsList = document.getElementById('help-commands-list');
const toggleHelpButton = document.getElementById('toggle-help-button');
const helpButton = document.getElementById('help-button'); 