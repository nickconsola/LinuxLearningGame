console.log("speech.js: START - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);
// speech.js - Handles speech synthesis functionality

const synth = window.speechSynthesis;
let speechEnabled = false; // Speech OFF by default. Will be initialized by initializeGame or theme change listeners.
let speechQueue = [];
let isSpeaking = false;

function queueSpeech(text) {
    if (!speechEnabled || !text || !synth) return; // Check synth too
    let processedText = text;
    // Speech damage simulation (less aggressive than before)
    // Note: currentStoryPhaseIndex will be a global from gameState.js
    if (typeof currentStoryPhaseIndex !== 'undefined' && currentStoryPhaseIndex < 2) { // Very early game
        processedText = text.split(' ').map(word => word.length > 3 ? word.split('').join('.') : word).join('... ');
    } else if (typeof currentStoryPhaseIndex !== 'undefined' && currentStoryPhaseIndex < 5) {
        processedText = text.replace(/[aeiou]/g, '$&.').replace(/ /g, '.. ');
    }
    speechQueue.push(processedText);
    if (!isSpeaking) processSpeechQueue();
}

function processSpeechQueue() {
    if (!speechEnabled || speechQueue.length === 0 || !synth) { // Check synth
        isSpeaking = false;
        // Note: voiceIndicator will be a global from dom.js
        if(typeof voiceIndicator !== 'undefined' && voiceIndicator) voiceIndicator.style.display = 'none';
        return;
    }
    isSpeaking = true;
    if(typeof voiceIndicator !== 'undefined' && voiceIndicator) voiceIndicator.style.display = 'flex';

    const text = speechQueue.shift();
    const utterance = new SpeechSynthesisUtterance(text);
    // Note: currentStoryPhaseIndex will be a global from gameState.js
    utterance.rate = (typeof currentStoryPhaseIndex !== 'undefined' && currentStoryPhaseIndex < 2) ? 0.65 : 0.85;
    utterance.pitch = (typeof currentStoryPhaseIndex !== 'undefined' && currentStoryPhaseIndex < 2) ? 0.8 : 1.0;

    const voices = synth.getVoices();
    if (voices.length > 0) { // Ensure voices are loaded
        const femaleVoice = voices.find(voice => voice.lang.startsWith('en') && (voice.name.includes('Female') || voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('samantha')));
        if (femaleVoice) utterance.voice = femaleVoice;
        else utterance.voice = voices.find(voice => voice.lang.startsWith('en')) || voices[0]; // Fallback
    }

    utterance.onend = () => {
        if (speechQueue.length === 0) {
            isSpeaking = false;
            if(typeof voiceIndicator !== 'undefined' && voiceIndicator) voiceIndicator.style.display = 'none';
        } else {
            setTimeout(processSpeechQueue, 100);
        }
    };
    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        isSpeaking = false; if(typeof voiceIndicator !== 'undefined' && voiceIndicator) voiceIndicator.style.display = 'none';
        if (speechQueue.length > 0) setTimeout(processSpeechQueue, 100);
    };
    try {
      synth.speak(utterance);
    } catch (e) {
      console.error("Error speaking:", e);
      isSpeaking = false; if(typeof voiceIndicator !== 'undefined' && voiceIndicator) voiceIndicator.style.display = 'none';
    }
} 