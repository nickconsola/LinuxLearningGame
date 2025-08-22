// js/gameLogic.js - Core game logic, command processing, and story progression

// --- Global Game State & Utilities ---
// gameState (from gameState.js)
// fileSystemUtils (from fileSystemUtils.js)
// uiUpdates (from uiUpdates.js)

// To be populated by chapter files
window.allStoryPhases = [];
window.allCommands = {}; // Stores command handler functions
window.storyPhasesReady = false; // Flag to indicate if story phases are loaded

// Define the gameLogic object on the window
window.gameLogic = {};

console.log("gameLogic.js: START - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);

// --- Game Initialization ---
async function initializeGameLogic() {
    // Defensively ensure the necessary parent objects/directories exist
    const fsRoot = gameState.fileSystem?.['/'];
    if (!fsRoot || !fsRoot.children) {
        console.error("CRITICAL: gameState.fileSystem['/'] or its children are missing!");
        // Attempt to initialize to prevent further errors, though this indicates a deeper issue
        if (!fsRoot) gameState.fileSystem['/'] = { type: 'dir', children: {} };
        if (!gameState.fileSystem['/'].children) gameState.fileSystem['/'].children = {};
        // It's risky to continue if the root is broken, but let's try to patch for the specific items.
    }
    const fsRootChildren = gameState.fileSystem['/'].children;

    // Ensure 'systems' path
    if (!fsRootChildren.systems) {
        console.warn("gameLogic.js: initialGameLogic - gameState.fileSystem['/'].children.systems missing, creating.");
        fsRootChildren.systems = { type: 'dir', owner: 'root', permissions: 'rwxr-x---', children: {} };
    } else if (!fsRootChildren.systems.children) { // Should not happen if systems is an object from gameState.js
        console.warn("gameLogic.js: initialGameLogic - gameState.fileSystem['/'].children.systems.children missing, creating.");
        fsRootChildren.systems.children = {};
    }
    const systemsChildren = fsRootChildren.systems.children; // Now systemsChildren should be valid

    if (!systemsChildren.life_support) {
        console.warn("gameLogic.js: initialGameLogic - ...systems.children.life_support missing, creating.");
        systemsChildren.life_support = { type: 'dir', owner: 'root', permissions: 'rwx------', children: {} };
    }
    if (!systemsChildren.power) {
        console.warn("gameLogic.js: initialGameLogic - ...systems.children.power missing, creating.");
        systemsChildren.power = { type: 'dir', owner: 'root', permissions: 'rwx------', children: {} };
    }
    if (!systemsChildren.navigation) {
        console.warn("gameLogic.js: initialGameLogic - ...systems.children.navigation missing, creating.");
        systemsChildren.navigation = { type: 'dir', owner: 'root', permissions: 'rwx------', children: {} };
    }
    if (!systemsChildren.comms) {
        console.warn("gameLogic.js: initialGameLogic - ...systems.children.comms missing, creating.");
        systemsChildren.comms = { type: 'dir', owner: 'root', permissions: 'rwx------', children: {} };
    }

    // Ensure 'var' and 'var/backups' path
    if (!fsRootChildren.var) {
        console.warn("gameLogic.js: initialGameLogic - gameState.fileSystem['/'].children.var missing, creating.");
        fsRootChildren.var = { type: 'dir', owner: 'root', children: {} }; // Added owner
    } else if (!fsRootChildren.var.children) { // Should not happen
         console.warn("gameLogic.js: initialGameLogic - gameState.fileSystem['/'].children.var.children missing, creating.");
        fsRootChildren.var.children = {};
    }
    const varChildren = fsRootChildren.var.children; // Now varChildren should be valid

    if (!varChildren.backups) {
        console.warn("gameLogic.js: initialGameLogic - ...var.children.backups missing, creating.");
        varChildren.backups = { type: 'dir', owner: 'root', children: {} };
    }
    
    // Now, the Object.assign calls should be safer as their parent 'children' objects are ensured.
    Object.assign(gameState.fileSystem['/'].children.systems.children.life_support.children, {
        'status.log': { type: 'file', owner: 'root', content: "Oxygen Levels: 10%\nCO2 Levels: HIGH\nAir Recycler: OFFLINE\nFilter Integrity: UNKNOWN\nACTION REQUIRED: Run diagnostics script `diag_life_support.sh`" },
        'diag_life_support.sh': { type: 'file', owner: 'root', permissions: 'rwx------', content: "#!/bin/sh\necho 'Running Life Support Diagnostics...';\necho 'Oxygen Recycler: MALFUNCTION - Code LF001 (Filter Clogged)';\necho 'CO2 Scrubber: OFFLINE - Requires power cycle and filter replacement.';\necho 'To fix filter: `touch /systems/life_support/filter_replaced.flag`';\necho 'To cycle power: `sh /systems/power/cycle_aux_power.sh life_support_scrubber`'" }
    });
    Object.assign(gameState.fileSystem['/'].children.systems.children.power.children, {
        'core_status.txt': { type: 'file', owner: 'root', content: "Main Reactor Core: OFFLINE - Emergency Shutdown Initiated.\nAuxiliary Power: ACTIVE - Output 15%\nDistribution Matrix: ERRORS DETECTED.\nACTION: Check `aux_power_distribution.cfg` and run `reroute_power.sh`" },
        'aux_power_distribution.cfg': { type: 'file', owner: 'root', permissions: 'rw-------', content: "LIFE_SUPPORT=50\nTERMINAL=10\nNAVIGATION=0\nCOMMS=0\nENGINEERING=0" },
        'reroute_power.sh': { type: 'file', owner: 'root', permissions: 'rwx------', content: "#!/bin/sh\necho 'Attempting to reroute auxiliary power based on aux_power_distribution.cfg...';\necho 'Power rerouted. Check individual system status.'" },
        'cycle_aux_power.sh': { type: 'file', owner: 'root', permissions: 'rwx------', content: "#!/bin/sh\necho \"Cycling power to $1...\";\necho \"Device $1 power cycled.\""}
    });
    Object.assign(gameState.fileSystem['/'].children.systems.children.navigation.children, {
        'nav_computer_status.txt': { type: 'file', owner: 'root', content: "NavCom: OFFLINE\nStar Charts DB: CORRUPTED\nSensor Array: OFFLINE - No power / Misaligned\nACTION: Restore `star_charts_backup.tar.gz` from `/var/backups/`. Align sensors via `align_sensors.sh`" },
        'align_sensors.sh': { type: 'file', owner: 'root', permissions: 'rwx------', content: "#!/bin/sh\necho 'Aligning sensor array...';\necho 'ERROR: Gyroscope calibration failed. Manual override possible with root privileges.';\necho 'Use: sudo /systems/critical_override.sh nav_gyro_calibrate'" }
    });
    Object.assign(gameState.fileSystem['/'].children.systems.children.comms.children, {
        'long_range_antenna.status': { type: 'file', owner: 'root', content: "Antenna Array: OFFLINE - Misaligned / No Power\nTransmitter: OFFLINE\nReceiver: OFFLINE\nACTION: Run `deploy_emergency_beacon.sh` (low power)" },
        'deploy_emergency_beacon.sh': { type: 'file', owner: 'root', permissions: 'rwx------', content: "#!/bin/sh\necho 'Deploying low-power emergency beacon...';\necho 'Beacon active. Signal strength: WEAK.'" }
    });

    Object.assign(gameState.fileSystem['/'].children.var.children.backups.children, {
        'star_charts_backup.tar.gz': { type: 'file', owner: 'root', content: '[Simulated TAR.GZ archive of star chart data]' },
        'system_config_prev.bak': {type: 'file', owner: 'root', content: '# Previous system config snapshot'}
    });

    // Combine story phases from all chapters
    if (window.beginnerStoryPhases) {
        window.allStoryPhases = window.allStoryPhases.concat(window.beginnerStoryPhases);
    }
    if (window.intermediateStoryPhases) {
        window.allStoryPhases = window.allStoryPhases.concat(window.intermediateStoryPhases);
    }
    if (window.advancedStoryPhases) {
        window.allStoryPhases = window.allStoryPhases.concat(window.advancedStoryPhases);
    }
    // ... and so on for future chapter files

    if (typeof gameState !== 'undefined' && window.allStoryPhases.length > 0) {
        gameState.storyPhases = window.allStoryPhases;
        console.log(`DEBUG: gameLogic.js - Combined ${gameState.storyPhases.length} story phases.`);
    } else {
        console.error('GAME LOGIC Error: gameState or story phases not available for initialization.');
        return;
    }

    // Combine commands from all chapters
    if (window.beginnerCommands) {
        console.log("DEBUG: gameLogic.js initializeGameLogic - typeof window.beginnerCommands.help BEFORE assign:", typeof window.beginnerCommands.help);
        Object.assign(window.allCommands, window.beginnerCommands);
    }
    if (window.intermediateCommands) {
        Object.assign(window.allCommands, window.intermediateCommands);
    }
    if (window.advancedCommands) {
        Object.assign(window.allCommands, window.advancedCommands);
    }
    // ... and so on for future chapter files
    console.log(`DEBUG: gameLogic.js - Combined ${Object.keys(window.allCommands).length} command handlers.`);

    // --- Original initializeGame logic from script.js ---
    console.log("DEBUG: gameLogic.js - initializeGame() called. Setting up initial game state.");

    if (typeof window.fileSystemUtils.createDirectoryInFS !== 'undefined' && typeof gameState !== 'undefined' && gameState.loggedInUser && typeof window.fileSystemUtils.getFileOrDir !== 'undefined' && typeof window.fileSystemUtils.createFileInFS !== 'undefined') {
        const userHomePath = `/home/${gameState.loggedInUser}`;
        if (!window.fileSystemUtils.getFileOrDir(userHomePath)) {
            window.fileSystemUtils.createDirectoryInFS(userHomePath);
            console.log(`DEBUG: gameLogic.js - Created home directory: ${userHomePath}`);
        }
        // Create default files/directories from original script.js setup
        window.fileSystemUtils.createFileInFS(`${userHomePath}/README.txt`, "Welcome, Survivor. Check your objectives. Use 'help' for available commands.", gameState.loggedInUser);
        window.fileSystemUtils.createDirectoryInFS(`${userHomePath}/documents`, gameState.loggedInUser);
        window.fileSystemUtils.createFileInFS(`${userHomePath}/documents/mission_briefing_fragment.txt`, "Interstellar Ark 'Odyssey 7' - Mission Critical Failure - Unknown Anomaly - Evacuate. Remaining automated systems... minimal. Primary AI 'AURORA' operating on emergency power. Objective: Restore essential ship functions. Last log entry: ...data corrupted...", gameState.loggedInUser);
        window.fileSystemUtils.createDirectoryInFS(`${userHomePath}/script_examples`, gameState.loggedInUser);
        window.fileSystemUtils.createFileInFS(`${userHomePath}/script_examples/hello.sh`, `#!/bin/sh\necho "Hello from script!"`, gameState.loggedInUser, 'rw-r--r--'); // Initially not executable
        window.fileSystemUtils.createFileInFS(`${userHomePath}/script_examples/system_check.sh`, `#!/bin/sh\necho "Performing system integrity check..."\necho "Core systems nominal. (Simulated)"`, gameState.loggedInUser, 'rw-r--r--');
        window.fileSystemUtils.createDirectoryInFS(`${userHomePath}/text_processing_data`);
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/unsorted_errors.log`, "ERROR: Module C failed\nWARNING: Low power\nERROR: Module A failed\nINFO: System scan started\nERROR: Module C failed");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/file_to_compare_A.txt`, "Line 1\nLine 2 different\nLine 3\nExtra Line A");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/file_to_compare_B.txt`, "Line 1\nLine 2 also different\nLine 3\nExtra Line B");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/sensor_readings.txt`, "ID001:TEMP:35C\nID002:PRESSURE:1012hPa\nID003:TEMP:37C\nID004:VOLTAGE:5.01V");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/garbled_comms.txt`, "S#S M#yb#y... Pl#@s# r#sp%nd... Any%n# th#r#?");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/config_to_edit.cfg`, "MAX_TEMP=85\nMIN_TEMP=10\nLOG_LEVEL=INFO");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/large_log_file.log`, Array.from({length: 120}, (_, i) => `Log entry line ${i + 1}`).join('\n'));
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/personnel_A.txt`, "101:Cmdr. Eva Rostova\n102:Lt. Jian Li\n103:Dr. Aris Thorne");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/text_processing_data/personnel_B.txt`, "101:Commander\n102:Pilot\n103:Chief Medical Officer");
        window.fileSystemUtils.createDirectoryInFS(`${userHomePath}/my_files_for_compression`);
        window.fileSystemUtils.createFileInFS(`${userHomePath}/my_files_for_compression/report1.txt`, "This is report 1.");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/my_files_for_compression/data.log`, "Log data...");
        window.fileSystemUtils.createFileInFS(`${userHomePath}/my_personal_log.txt`, "My personal thoughts on this dire situation.", gameState.loggedInUser);


        // Initialize /var/log and some system files (from original script.js)
        if (!window.fileSystemUtils.getFileOrDir('/var')) window.fileSystemUtils.createDirectoryInFS('/var', 'root', 'rwxr-xr-x');
        if (!window.fileSystemUtils.getFileOrDir('/var/log')) window.fileSystemUtils.createDirectoryInFS('/var/log', 'root', 'rwxr-xr-x');
        let systemLogContent = [
            "[0.000000] Kernel Booting...",
            "[0.500000] Initializing core systems...",
            "[1.000000] ERROR: Navigation system offline.",
            "[1.500000] WARNING: Life support at 70%.",
            "[2.000000] Hull breach detected sector 7G.",
            "[2.500000] ERROR: Comms array damaged.",
            "[3.000000] Emergency power active.",
            "[3.500000] AURORA AI initializing emergency protocols.",
            "[4.000000] User 'survivor' login detected.",
            "[4.500000] System integrity check... FAILED.",
            "[5.000000] Attempting to stabilize core temperature...",
            "[5.500000] ERROR: Main reactor offline.",
            "[6.000000] Auxiliary power unit activated.",
            "[6.500000] Sensor calibration failed for sectors A-D.",
            "[7.000000] Network interface eth0: UP",
            "[7.500000] Security subsystem: Degraded.",
            "[8.000000] FATAL ERROR: Filesystem corruption on /data detected.",
            "[8.500000] Recovery module initiated.",
            "[9.000000] Welcome to Emergency Shell.",
            "[9.500000] Type 'help' for assistance."
        ].join("\n");
        window.fileSystemUtils.createFileInFS('/var/log/system.log', systemLogContent, 'root', 'rw-r--r--');
        window.fileSystemUtils.createFileInFS('/var/log/auth.log', "User 'survivor' logged in from console.", 'root', 'rw-r--r--');
        if (!window.fileSystemUtils.getFileOrDir('/etc')) window.fileSystemUtils.createDirectoryInFS('/etc', 'root', 'rwxr-xr-x');
        const passwdContent = `root:x:0:0:root:/root:/bin/bash\n${gameState.loggedInUser}:x:1000:1000:${gameState.loggedInUser}:/home/${gameState.loggedInUser}:/bin/bash`;
        window.fileSystemUtils.createFileInFS('/etc/passwd', passwdContent, 'root', 'rw-r--r--');
        const groupContent = `root:x:0:\n${gameState.loggedInUser}:x:1000:`;
        window.fileSystemUtils.createFileInFS('/etc/group', groupContent, 'root', 'rw-r--r--');
        if (!window.fileSystemUtils.getFileOrDir('/tmp')) window.fileSystemUtils.createDirectoryInFS('/tmp', 'root', 'rwxrwxrwt'); // Sticky bit for /tmp
        if (!window.fileSystemUtils.getFileOrDir('/mnt')) window.fileSystemUtils.createDirectoryInFS('/mnt', 'root', 'rwxr-xr-x');
        if (!window.fileSystemUtils.getFileOrDir('/var/backups')) window.fileSystemUtils.createDirectoryInFS('/var/backups', 'root', 'rwxr-xr-x');
        window.fileSystemUtils.createFileInFS('/var/backups/star_charts_backup.tar.gz', "simulated_gzipped_tar_data_for_star_charts", 'root', 'rw-r--r--');

    }


    if (typeof gameState !== 'undefined' && gameState.storyPhases && gameState.storyPhases.length > 0) {
        const initialPhase = gameState.storyPhases[0];
        let objectiveText = initialPhase.objective;
        if (objectiveText && typeof objectiveText === 'string' && gameState.loggedInUser) {
            objectiveText = objectiveText.replace(/{{USER_HOME}}/g, `/home/${gameState.loggedInUser}`);
        }
        if (typeof updateObjectivePanel !== 'undefined') {
            updateObjectivePanel(objectiveText);
        }
        if (initialPhase.auroraMessage && typeof displayToStoryPanel !== 'undefined') {
            let auroraMessageText = initialPhase.auroraMessage;
            if (auroraMessageText && typeof auroraMessageText === 'string' && gameState.loggedInUser) {
                auroraMessageText = auroraMessageText.replace(/{{USER_HOME}}/g, `/home/${gameState.loggedInUser}`);
            }
            displayToStoryPanel(auroraMessageText, "AURORA");
        }
    }

    if (typeof formatPromptPath !== 'undefined' && typeof gameState !== 'undefined' && typeof updatePromptDisplay !== 'undefined') {
        updatePromptDisplay(formatPromptPath(gameState.currentPath));
    }
    
    console.log("DEBUG: gameLogic.js - Game initialized. Ready for player input.");
    console.log("gameLogic.js: END of initializeGameLogic - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);
    // End of original initializeGame logic
    window.storyPhasesReady = true;
    console.log("DEBUG: gameLogic.js - window.storyPhasesReady set to true.");
}

// Assign functions to window.gameLogic AFTER they are defined
window.gameLogic.initializeGameLogic = initializeGameLogic;
window.gameLogic.processCommand = processCommand;
// Potentially add other functions like addLearnedCommand, checkStoryProgression if they need to be globally callable via window.gameLogic
// For now, only adding the ones explicitly called via window.gameLogic from script.js

console.log("DEBUG: gameLogic.js - window.gameLogic object initialized with functions.");

// --- Command Learning & Story Progression ---
// Moved from story.js
function addLearnedCommand(cmd, gameLogic) {
    if (!gameLogic || !gameLogic.gameState || !gameLogic.uiUpdates || !gameLogic.gameState.storyPhases) return;
    if (!gameLogic.gameState.learnedCommands.has(cmd)) {
        gameLogic.gameState.learnedCommands.add(cmd);
        gameLogic.uiUpdates.displayToStoryPanel(`New command learned: \`${cmd}\``, "SYSTEM");
        if (typeof helpCommandsList !== 'undefined' && helpCommandsList) {
            const helpItem = document.createElement('li');
            const phaseForHelp = gameLogic.gameState.storyPhases.find(p => 
                p.commandToLearn === cmd || 
                (Array.isArray(p.commandToLearn) && p.commandToLearn.includes(cmd)) ||
                (p.details?.replace(/{{USER_HOME}}/g, `/home/${gameLogic.gameState.loggedInUser}`)?.includes(`\`${cmd}\``))
            );
            let helpDesc = phaseForHelp?.objective || `The ${cmd} command.`;
            helpDesc = helpDesc.replace(/{{USER_HOME}}/g, `/home/${gameLogic.gameState.loggedInUser}`);
            
            helpItem.innerHTML = `<code>${cmd}</code> - ${helpDesc.split('.')[0]}`;
            helpCommandsList.appendChild(helpItem);
        }
    }
}
// Moved from story.js
function checkStoryProgression(command, pathForTrigger, successStatus, gameLogic) {
    if (!gameLogic || !gameLogic.gameState || !gameLogic.uiUpdates) return;

    console.log(`DEBUG: gameLogic.js checkStoryProgression -- ENTRY -- Command: '${command}', Path: '${pathForTrigger}', Success: ${successStatus}, CurrentPhaseIndex: ${gameLogic.gameState.currentStoryPhaseIndex}`);

    if (!gameLogic.gameState.storyPhases || gameLogic.gameState.storyPhases.length === 0 || gameLogic.gameState.currentStoryPhaseIndex >= gameLogic.gameState.storyPhases.length) {
        console.warn(`DEBUG: gameLogic.js checkStoryProgression -- EXIT (Invalid phase index or no phases) -- Length: ${gameLogic.gameState.storyPhases?.length}, Index: ${gameLogic.gameState.currentStoryPhaseIndex}`);
        return; 
    }

    const phase = gameLogic.gameState.storyPhases[gameLogic.gameState.currentStoryPhaseIndex];
    if (!phase) {
        console.error(`DEBUG: gameLogic.js checkStoryProgression -- EXIT (Phase object not found at index ${gameLogic.gameState.currentStoryPhaseIndex})`);
        return;
    }
    console.log(`DEBUG: gameLogic.js checkStoryProgression -- Current phase object: "${phase.objective}" (Index: ${gameLogic.gameState.currentStoryPhaseIndex})`, phase);
    
    const actualCmdForTrigger = phase.commandToExecute || command; 
    const actualPathForTrigger = phase.pathCondition ? pathForTrigger : undefined;

    console.log(`DEBUG: gameLogic.js checkStoryProgression -- Evaluating triggerCondition with: command='${command}', pathForTrigger='${pathForTrigger}', successStatus=${successStatus}, actualCmdForTrigger='${actualCmdForTrigger}', actualPathForTrigger='${actualPathForTrigger}'`);
    const triggerMet = phase.triggerCondition && phase.triggerCondition(command, pathForTrigger, successStatus, actualCmdForTrigger, actualPathForTrigger, gameLogic.gameState, window.fileSystemUtils); // Pass gameState and fileSystemUtils
    console.log(`DEBUG: gameLogic.js checkStoryProgression -- Trigger condition MET: ${triggerMet}`);

    if (triggerMet) {
        console.log(`DEBUG: gameLogic.js checkStoryProgression -- Trigger met for phase ${gameLogic.gameState.currentStoryPhaseIndex} ('${phase.objective}')`);
        if (phase.actionOnSuccess) {
            console.log(`DEBUG: gameLogic.js checkStoryProgression -- Calling actionOnSuccess for phase ${gameLogic.gameState.currentStoryPhaseIndex}`);
            try {
                phase.actionOnSuccess(gameLogic);
            } catch (e) {
                console.error(`DEBUG: gameLogic.js checkStoryProgression -- ERROR in actionOnSuccess for phase ${gameLogic.gameState.currentStoryPhaseIndex}:`, e);
            }
            console.log(`DEBUG: gameLogic.js checkStoryProgression -- actionOnSuccess COMPLETED for phase ${gameLogic.gameState.currentStoryPhaseIndex}`);
        }

        const nextPhaseIndex = gameLogic.gameState.currentStoryPhaseIndex + 1;
        console.log(`DEBUG: gameLogic.js checkStoryProgression -- Advancing to nextPhaseIndex: ${nextPhaseIndex}`);
        gameLogic.gameState.currentStoryPhaseIndex = nextPhaseIndex;


        if (nextPhaseIndex < gameLogic.gameState.storyPhases.length) {
            const newPhase = gameLogic.gameState.storyPhases[nextPhaseIndex];
            console.log(`DEBUG: gameLogic.js checkStoryProgression -- New phase object (Index ${nextPhaseIndex}):`, newPhase);
            let objectiveText = newPhase.objective;
            let auroraMessageText = newPhase.auroraMessage;

            if (objectiveText && typeof objectiveText === 'string' && gameLogic.gameState.loggedInUser) {
                objectiveText = objectiveText.replace(/{{USER_HOME}}/g, `/home/${gameLogic.gameState.loggedInUser}`);
                objectiveText = objectiveText.replace(/{{USERNAME}}/g, gameLogic.gameState.loggedInUser);
            }
            if (auroraMessageText && typeof auroraMessageText === 'string' && gameLogic.gameState.loggedInUser) {
                auroraMessageText = auroraMessageText.replace(/{{USER_HOME}}/g, `/home/${gameLogic.gameState.loggedInUser}`);
                auroraMessageText = auroraMessageText.replace(/{{USERNAME}}/g, gameLogic.gameState.loggedInUser);
            }

            console.log(`DEBUG: gameLogic.js checkStoryProgression -- Calling updateObjectivePanel with: '${objectiveText}'`);
            gameLogic.uiUpdates.updateObjectivePanel(objectiveText); 
            if (auroraMessageText) {
                console.log(`DEBUG: gameLogic.js checkStoryProgression -- Calling displayToStoryPanel (AURORA) with: '${auroraMessageText}'`);
                gameLogic.uiUpdates.displayToStoryPanel(auroraMessageText, "AURORA");
            }
            // Display postCompleteMessage if it exists for the *previous* (just completed) phase
            if (phase.postCompleteMessage) {
                 let postMessage = phase.postCompleteMessage;
                 if (postMessage && typeof postMessage === 'string' && gameLogic.gameState.loggedInUser) {
                    postMessage = postMessage.replace(/{{USER_HOME}}/g, `/home/${gameLogic.gameState.loggedInUser}`);
                    postMessage = postMessage.replace(/{{USERNAME}}/g, gameLogic.gameState.loggedInUser);
                 }
                console.log(`DEBUG: gameLogic.js checkStoryProgression -- Calling displayToStoryPanel (AURORA - PostComplete) with: '${postMessage}'`);
                gameLogic.uiUpdates.displayToStoryPanel(postMessage, "AURORA");
            }

        } else {
            console.log(`DEBUG: gameLogic.js checkStoryProgression -- All phases completed. Current index: ${nextPhaseIndex}, Total phases: ${gameLogic.gameState.storyPhases.length}`);
            gameLogic.uiUpdates.updateObjectivePanel("All primary objectives completed! Stand by for further instructions.");
            gameLogic.uiUpdates.displayToStoryPanel("You've successfully navigated the initial crisis. System recovery is proceeding.", "AURORA");
            // Display postCompleteMessage for the final phase if it exists
            if (phase.postCompleteMessage) {
                let postMessage = phase.postCompleteMessage;
                if (postMessage && typeof postMessage === 'string' && gameLogic.gameState.loggedInUser) {
                   postMessage = postMessage.replace(/{{USER_HOME}}/g, `/home/${gameLogic.gameState.loggedInUser}`);
                   postMessage = postMessage.replace(/{{USERNAME}}/g, gameLogic.gameState.loggedInUser);
                }
               console.log(`DEBUG: gameLogic.js checkStoryProgression -- Calling displayToStoryPanel (AURORA - Final PostComplete) with: '${postMessage}'`);
               gameLogic.uiUpdates.displayToStoryPanel(postMessage, "AURORA");
           }
        }

        if (phase.commandToLearn) {
            const commandsToLearn = Array.isArray(phase.commandToLearn) ? phase.commandToLearn : [phase.commandToLearn];
            console.log(`DEBUG: gameLogic.js checkStoryProgression -- Processing commandToLearn:`, commandsToLearn);
            commandsToLearn.forEach(cmdToLearn => {
                if (!gameLogic.gameState.learnedCommands.has(cmdToLearn)) {
                    console.log(`DEBUG: gameLogic.js checkStoryProgression -- Calling addLearnedCommand for: ${cmdToLearn} (from phase.commandToLearn)`);
                    addLearnedCommand(cmdToLearn, gameLogic);
                }
            });
        }
    } else {
        console.log(`DEBUG: gameLogic.js checkStoryProgression -- Trigger condition NOT MET for phase ${gameLogic.gameState.currentStoryPhaseIndex} ('${phase.objective}')`);
    }
    console.log(`DEBUG: gameLogic.js checkStoryProgression -- EXIT -- CurrentPhaseIndex: ${gameLogic.gameState.currentStoryPhaseIndex}`);
}


// --- Main Command Processor ---
function parseCommand(commandStr) {
    const parts = commandStr.match(/(?:[^\s"']+|\"[^\"]*\"|\'[^\']*\'|\`[^\`]*\`)+/g) || [];
    return parts.map(part => {
        if ((part.startsWith('"') && part.endsWith('"')) ||
            (part.startsWith("'") && part.endsWith("'")) ||
            (part.startsWith('`') && part.endsWith('`'))) {
            return part.slice(1, -1);
        }
        return part;
    });
}

async function processCommand(currentSegmentCommand, pipedInputLinesArray = null, topLevelFullCommand = null) {
    console.log("DEBUG: gameLogic.js processCommand - FUNCTION ENTRY POINT. Raw currentSegmentCommand:", currentSegmentCommand, "Type:", typeof currentSegmentCommand);
    const originalFullCommand = topLevelFullCommand || currentSegmentCommand;
    const pathBeforeCommand = gameState.currentPath;
    let commandProcessedSuccessfully = false;

    // Trim leading/trailing whitespace from the command segment being processed.
    console.log("DEBUG: gameLogic.js processCommand - Before trim. currentSegmentCommand:", currentSegmentCommand);
    const trimmedSegmentCommand = currentSegmentCommand.trim();
    console.log("DEBUG: gameLogic.js processCommand - After trim. trimmedSegmentCommand:", trimmedSegmentCommand);

    // Handle 'q' to exit man/less pages FIRST (before any other processing)
    // This logic is moved from script.js
    if (trimmedSegmentCommand.toLowerCase() === 'q' && (gameState.inManPage || gameState.inLessOutput)) {
        gameState.inManPage = false;
        gameState.inLessOutput = false;
        if (window.commandInput) { // Assuming commandInput is a global DOM reference
            window.commandInput.focus();
        }
        if (window.commandInput) window.commandInput.value = ''; 
        if (typeof uiUpdates.updateCursorPosition === 'function') uiUpdates.updateCursorPosition();
        return; 
    }

    // Parse command and arguments from the current (potentially piped) segment
    const parsedParts = parseCommand(trimmedSegmentCommand);
    const commandName = parsedParts[0] ? parsedParts[0].toLowerCase() : '';
    const args = parsedParts.slice(1);

    // TODO: Implement Sudo handling (if commandName is 'sudo')
    // TODO: Implement Pipe handling (if trimmedSegmentCommand contains '|' and not already processing piped input)

    // Command Execution from allCommands
    if (window.allCommands[commandName]) {
        const commandToExecute = window.allCommands[commandName];
        console.log("DEBUG: gameLogic.js processCommand - About to execute command: " + commandName + ". Function body: ", String(commandToExecute));
        
        // Log to inspect window.uiUpdates
        console.log("DEBUG: gameLogic.js processCommand - Inspecting window.uiUpdates. Type:", typeof window.uiUpdates, "Value:", window.uiUpdates);
        if (window.uiUpdates) {
            console.log("DEBUG: gameLogic.js processCommand - Inspecting window.uiUpdates.displayToTerminal. Type:", typeof window.uiUpdates.displayToTerminal, "Value:", window.uiUpdates.displayToTerminal);
        }
        // Log to inspect window.gameState
        console.log("DEBUG: gameLogic.js processCommand - Inspecting window.gameState. Type:", typeof window.gameState, "Value:", window.gameState);
        if (window.gameState) {
            console.log("DEBUG: gameLogic.js processCommand - Inspecting window.gameState.learnedCommands. Type:", typeof window.gameState.learnedCommands);
        }

        try {
            const gameLogicInterface = {
                gameState: gameState,
                fileSystemUtils: window.fileSystemUtils,
                uiUpdates: window.uiUpdates,
                allStoryPhases: window.allStoryPhases,
                allCommands: window.allCommands
            };
            // Bind the interface to the functions that need it
            gameLogicInterface.addLearnedCommand = (cmd) => addLearnedCommand(cmd, gameLogicInterface);
            gameLogicInterface.checkStoryProgression = (command, path, success) => checkStoryProgression(command, path, success, gameLogicInterface);

            const result = commandToExecute(args, gameLogicInterface);
            if (result === false) { // Explicitly check for false if commands return it on failure
                 commandProcessedSuccessfully = false;
            } else {
                 commandProcessedSuccessfully = true; // Assume success if no explicit false and no error
            }
        } catch (error) {
            console.error('Error executing command ' + commandName + ':', error);
            if (typeof uiUpdates !== 'undefined' && typeof uiUpdates.displayToTerminal === 'function') {
                uiUpdates.displayToTerminal(`Error executing command ${commandName}: ${error.message}`, 'error-text');
            }
            commandProcessedSuccessfully = false; // Ensure it's false on error
        }
    } else {
        if (commandName && commandName.trim() !== '') { // Don't show error for empty commands
            if (typeof uiUpdates !== 'undefined' && typeof uiUpdates.displayToTerminal === 'function') {
                uiUpdates.displayToTerminal(`Command not found: ${commandName}`, 'error-text');
            }
        }
        commandProcessedSuccessfully = false; // Command not found is a form of failure
    }
    
    // After command execution attempt (success or failure handled by commandProcessedSuccessfully)
    // Call checkStoryProgression, ensuring it uses the original command and path if relevant
    // The actual command name (commandName) and path might be more relevant than originalFullCommand for some triggers.
    // The trigger conditions themselves will use what they need from the arguments provided.
    // Let's assume checkStoryProgression is robust enough or the individual command handlers call it.
    // Based on current structure, checkStoryProgression is mostly called *inside* command handlers via gameLogicInterface.
    // If it needs to be called here universally, need to decide what path/args to pass.
    // For now, sticking to the pattern that commands call it.

    // Final update of prompt should be handled by UI updates, often triggered by 'cd' or story progression.
    // if (typeof uiUpdates !== 'undefined' && typeof uiUpdates.updatePromptDisplay === 'function' && typeof window.formatPromptPath === 'function') {
    // uiUpdates.updatePromptDisplay(window.formatPromptPath(gameState.currentPath));
    // }


    return commandProcessedSuccessfully;
}

