// js/chapters/beginner.js

console.log("beginner.js: START - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);

window.beginnerStoryPhases = [
    // --- CHAPTER 0: GETTING STARTED ---
    { // Phase 0: help
        objective: "Learn how to view available commands and get assistance.",
        details: "This terminal is your lifeline. To see a list of all available commands, type `help` into the command line and press **Enter**. This command provides a quick overview of what you can do. If you're ever unsure how to proceed, you can also type `hint` for a specific tip or ask me directly in the chat panel on the right.",
        triggerCondition: (command) => command === 'help',
        commandToLearn: 'help',
        auroraMessage: "Welcome back. It seems my core functions are slowly stabilizing. Use `help` to see what actions you can currently perform. If you're ever unsure, you can also type `hint` or ask me directly in the chat panel on the right.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('help'); }
    },
    { // Phase 1: pwd
        objective: "Determine your current location (directory) within the ship's file system.",
        details: "You're currently in a directory within the ship's computer system. Think of a directory like a folder on your computer. To find out exactly where you are, use the **`pwd`** command. **`pwd`** stands for **P**rint **W**orking **D**irectory. Type `pwd` and press **Enter**.",
        triggerCondition: (command) => command === 'pwd',
        commandToLearn: 'pwd',
        auroraMessage: "Knowing your current location is crucial. The `pwd` command (Print Working Directory) will show you where you are. This is fundamental for navigating the ship's systems.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('pwd'); }
    },
    { // Phase 2: ls
        objective: "List the files and directories in your current location (`{{USER_HOME}}`).",
        details: "Now that you know where you are, let's see what's inside this directory. The **`ls`** command (short for **L**i**s**t) allows you to view the files and sub-directories within your current location. Your current location is your home directory, represented as `{{USER_HOME}}`. Type `ls` and press **Enter** to see its contents.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}`;
            const commandIsLs = command === 'ls';
            const pathMatches = actualPath === expectedPath;
            return commandIsLs && pathMatches;
        },
        commandToLearn: 'ls',
        auroraMessage: "The `ls` command lists contents of a directory. In your home directory, `{{USER_HOME}}`, you might find personal logs or initial instructions.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('ls'); }
    },
    { // Phase 3: ~ (tilde shortcut)
        objective: "Understand and use the `~` shortcut to quickly navigate to your home directory.",
        details: "The `~` (pronounced **tilde**) character is a powerful shortcut in Linux. It always refers to your home directory (`{{USER_HOME}}`), no matter where you currently are in the file system. For example, `ls ~` will list the contents of your home directory from anywhere. To practice, try listing the contents of your home directory using the tilde shortcut: type `ls ~` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const commandIsCorrect = command.trim() === 'ls ~';
            const pathIsHome = actualPath === `/home/${gameState.loggedInUser}`;
            return commandIsCorrect && pathIsHome && success === true;
        },
        commandToLearn: '~ (home shortcut)',
        auroraMessage: "The tilde, `~`, is a convenient shortcut. It always refers to your home directory, `{{USER_HOME}}`. So, `ls ~` will list your home directory's contents from anywhere. `cd ~` will always take you home. Try it: `ls ~`",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('~ (home shortcut)'); }
    },
    { // Phase 4: clear
        objective: "Clear the terminal screen to remove previous commands and output.",
        details: "As you work, your terminal screen can get cluttered with commands and their outputs. To make the screen clean and readable again, use the **`clear`** command. This won't affect any files or directories, just the display. Type `clear` and press **Enter**.",
        triggerCondition: (command) => command === 'clear',
        commandToLearn: 'clear',
        auroraMessage: "A cluttered screen can lead to errors. Use `clear` to refresh your terminal display. This will be helpful as we delve into more complex data.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('clear'); }
    },
    { // Phase 5: cat README.txt
        objective: "Read the `README.txt` file in your home directory. It contains vital startup information.",
        details: "You might have noticed a file called `README.txt` when you used `ls`. This file often contains important information about a system or a project. To display the contents of a text file, use the **`cat`** command (short for **cat**enate). It's like opening and reading a document. Type `cat README.txt` and press **Enter** to read its contents.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const commandIsCorrect = command === 'cat README.txt';
            const expectedPath = `/home/${gameState.loggedInUser}`;
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        commandToLearn: 'cat',
        auroraMessage: "The `README.txt` file usually contains important initial notes. Use `cat README.txt` to display its contents. This might tell us more about the current situation.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('cat'); }
    },
    { // Phase 6: hint
        objective: "Learn how to request a hint from AURORA if you're stuck.",
        details: "Sometimes, figuring out the next step in a complex system like this can be tricky. If you ever feel stuck and need a specific pointer for your current objective, you can ask for a hint. Type `hint` into the terminal and press **Enter**. I will analyze your current task and try to provide a useful suggestion. Remember, you can also ask me directly in the chat panel.",
        triggerCondition: (command) => command === 'hint',
        commandToLearn: 'hint',
        auroraMessage: "My systems are still recovering, and my guidance might not always be clear. If you need a more specific suggestion, type `hint`. I'll analyze the current objective and try to assist.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('hint'); }
    },
    { // Phase 7: man ls
        objective: "Learn to access detailed command documentation using `man`. View the manual for `ls`.",
        details: "While `help` gives a brief overview, the **`man`** command (short for **man**ual) provides comprehensive documentation for almost every Linux command. It's like a built-in encyclopedia. To view the manual page for the `ls` command, type `man ls` and press **Enter**. When you're done reading, type `q` to quit and return to the terminal.",
        triggerCondition: (command, path, success) => command.trim() === 'man ls' && success === true,
        commandToLearn: 'man',
        auroraMessage: "For detailed information on any command, use `man <command_name>`. For example, `man ls` will show you all options for the `ls` command. This is your primary way to learn command syntax. (Type 'q' to exit the man page).",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('man'); gameLogic.addLearnedCommand('q'); }
    },
    // --- CHAPTER 1: Initial Assessment & Basic File Operations ---
    { // Phase 8: cd documents
        objective: "Navigate into the `documents` directory located in your home directory.",
        details: "To move into a different directory, you use the **`cd`** command (short for **c**hange **d**irectory). Just follow `cd` with the name of the directory you want to enter. There's a `documents` directory in your current location. Type `cd documents` and press **Enter** to move into it. Important logs or mission data might be stored there.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}`;
            const commandIsCorrect = command === 'cd documents';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        commandToLearn: 'cd',
        auroraMessage: "The `cd <directory_name>` command changes your current directory. Let's navigate to your `documents` directory: `cd documents`. Important logs or mission data might be stored there.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('cd'); }
    },
    { // Phase 9: ls (in documents)
        objective: "List the files in the `{{USER_HOME}}/documents` directory.",
        details: "Now that you've navigated into the `documents` directory, let's see what files are inside it. Use the `ls` command again to list its contents. Type `ls` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}/documents`;
            const commandIsLs = command === 'ls';
            const pathMatches = actualPath === expectedPath;
            return commandIsLs && pathMatches;
        },
        auroraMessage: "Now that you're in `{{USER_HOME}}/documents`, use `ls` to see what's here. Look for any files that might shed light on the system failure."
    },
    { // Phase 10: cat mission_briefing_fragment.txt
        objective: "Read the `mission_briefing_fragment.txt` file found in the `documents` directory.",
        details: "You've found a file named `mission_briefing_fragment.txt`. This sounds important! Just like you did with `README.txt`, use the `cat` command to read its contents. Type `cat mission_briefing_fragment.txt` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}/documents`;
            const commandIsCorrect = command === 'cat mission_briefing_fragment.txt';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "A mission briefing! Even fragmented, it could provide context. Use `cat mission_briefing_fragment.txt` to read it."
    },
    { // Phase 11: uptime
        objective: "Check how long the ship's emergency systems have been online and the current system load using `uptime`.",
        details: "The **`uptime`** command provides a quick summary of how long the system has been running since its last restart, the current time, and an indication of system load (how busy the computer is). This can tell us about the ship's stability. Type `uptime` and press **Enter**.",
        triggerCondition: (command, path, success) => command.trim() === 'uptime' && success === true,
        commandToLearn: 'uptime',
        auroraMessage: "The `uptime` command shows how long the system has been running since the last restart and gives an idea of the current load. This can indicate if critical processes are struggling.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('uptime'); }
    },
    { // Phase 12: cd .. (from documents)
        objective: "Navigate back to your home directory (`{{USER_HOME}}`) from `{{USER_HOME}}/documents`.",
        details: "You're currently in the `documents` directory. To move *up* one level in the directory tree (back to the parent directory), you use `cd` followed by two dots: `..`. This is a universal shortcut for the parent directory. Type `cd ..` and press **Enter** to go back to your home directory.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}/documents`;
            const commandIsCorrect = command === 'cd ..';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "Navigating... up... `cd ..`. You are back in `{{USER_HOME}}`."
    },
    { // Phase 13: echo - Displaying Text
        objective: "Display a message using `echo`.",
        details: "The **`echo`** command simply displays whatever text you provide to it on the terminal. It's often used for displaying messages or for writing text into files. Let's try it out! Type `echo Hello, Aurora!` (or any message you like) and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}`;
            const commandIsCorrect = command.startsWith('echo ');
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "`echo`... displays text. Useful for... messages and... file creation.",
        commandToLearn: 'echo',
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('echo'); }
    },
    { // Phase 14: mkdir - Create Directory
        objective: "Create a new directory called `logs`.",
        details: "Sometimes you'll need to create new directories to organize files. The **`mkdir`** command (short for **m**a**k**e **dir**ectory) does exactly that. You simply provide the name of the new directory after the command. We need a place to store system logs. Type `mkdir logs` and press **Enter** to create a new directory named `logs`.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}`;
            const commandIsCorrect = command === 'mkdir logs';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "Directory... created. `mkdir`... makes new... directories.",
        commandToLearn: 'mkdir',
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('mkdir'); }
    },
    { // Phase 15: cd logs - Navigate to Logs
        objective: "Navigate into the `logs` directory.",
        details: "You just created the `logs` directory. Now, let's move inside it to prepare for storing log files. Use the `cd` command again, followed by the new directory's name. Type `cd logs` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const startingPath = `/home/${gameState.loggedInUser}`;
            const commandIsCorrect = command === 'cd logs';
            const pathIsCorrectForCommand = actualPath === startingPath;
            return commandIsCorrect && pathIsCorrectForCommand && success === true;
        },
        auroraMessage: "Entering... logs directory. System logs... should be here."
    },
    { // Phase 16: ls - List Logs
        objective: "List the files in the `logs` directory.",
        details: "You're now in the `logs` directory. It should currently be empty, but it's always good practice to verify. Use the `ls` command to list the contents of this directory. Type `ls` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}/logs`;
            const commandIsCorrect = command === 'ls';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true; // Assuming ls itself sets success
        },
        auroraMessage: "System logs... found. `system.log`... contains critical... information.",
    },
    { // Phase 17: touch - Create a test log file
        objective: "Create a new empty log file called `system.log`.",
        details: "The **`touch`** command is used to create new, empty files. It's also used to update the timestamp of existing files. We need to create a log file to record system events. Type `touch system.log` and press **Enter** to create an empty file named `system.log` inside your current `logs` directory.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}/logs`;
            const commandIsCorrect = command === 'touch system.log';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "Empty file... created. `touch`... creates new... files.",
        commandToLearn: 'touch',
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('touch'); }
    },
    { // Phase 18: echo > - Write to Log
        objective: "Write the log entry 'System check initiated' to `system.log` using the `echo` command.",
        details: "Now that you've created `system.log`, let's write some content into it. You can use the `echo` command along with the **redirection operator** `>` to send the output of `echo` into a file, instead of displaying it on the screen. The `>` operator *overwrites* the file if it exists, or creates it if it doesn't. Type `echo 'System check initiated' > system.log` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            if (!success) { return false; }

            const expectedPath = `/home/${gameState.loggedInUser}/logs`;
            const pathMatches = actualPath === expectedPath;
            if (!pathMatches) { return false; }

            // Instead of checking the exact command string (which is brittle),
            // we check the result: was the correct content written to the file?
            const logFilePath = fileSystemUtils.normalizePath('system.log', actualPath);
            const logContent = fileSystemUtils.readFileContent(logFilePath);

            const contentIsCorrect = logContent && logContent.trim() === 'System check initiated';

            // We can also loosely check that the user used the `echo` command.
            const commandIsCorrect = command.trim().startsWith('echo');

            return contentIsCorrect && commandIsCorrect;
        },
        auroraMessage: "Log entry... written. `>`... redirects output... to file.",
        commandToLearn: ['>', 'echo >'],
        actionOnSuccess: (gameLogic) => {
            gameLogic.addLearnedCommand('>');
            gameLogic.addLearnedCommand('echo >');
        }
    },
    { // Phase 19: cat - Read Log
        objective: "Read the contents of `system.log`.",
        details: "You've written some content to `system.log`. To verify that the message was written correctly, let's read the file again. Use the `cat` command followed by the filename. Type `cat system.log` and press **Enter** to see the log entry.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}/logs`;
            const commandIsCorrect = command === 'cat system.log';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "Log contents... displayed. `cat`... shows file... contents."
    },
    { // Phase 20: cd .. (from logs)
        objective: "Navigate back to your home directory.",
        details: "Now that you've worked with `system.log` in the `logs` directory, let's return to your main home directory. Use the `cd ..` command to move up one level. Type `cd ..` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}/logs`;
            const commandIsCorrect = command === 'cd ..';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "Navigating... up... `cd ..`. You are back in `{{USER_HOME}}`."
    },
    { // Phase 21: mkdir config
        objective: "Create a new directory called `config`.",
        details: "The ship's systems need a `config` (configuration) directory for important settings files. Just like you did with the `logs` directory, use the `mkdir` command to create a new directory named `config`. Type `mkdir config` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}`;
            const commandIsCorrect = command === 'mkdir config';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "Directory... created. `mkdir`... makes new... directories."
    },
    { // Phase 22: cd config
        objective: "Navigate into the `config` directory.",
        details: "You've successfully created the `config` directory. Now, change your current directory into `config` so we can place a new configuration file there. Use the `cd` command with `config`. Type `cd config` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}`;
            const commandIsCorrect = command === 'cd config';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "Entering... config directory. System settings... should be here."
    },
    { // Phase 23: touch system.conf
        objective: "Create a new configuration file called `system.conf`.",
        details: "Within the `config` directory, we need to create a file for system configuration. Use the `touch` command to create a new, empty file named `system.conf`. Type `touch system.conf` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedPath = `/home/${gameState.loggedInUser}/config`;
            const commandIsCorrect = command === 'touch system.conf';
            const pathMatches = actualPath === expectedPath;
            return commandIsCorrect && pathMatches && success === true;
        },
        auroraMessage: "Configuration file... created. `touch`... creates new... files.",
    },
    { // Phase 24: echo > - Write Config
        objective: "Write the configuration setting 'debug_mode=true' to `system.conf` using the `echo` command.",
        details: "Now, let's add an important setting to your `system.conf` file. We'll use `echo` combined with the `>` redirection operator again. This will write the specified text into `system.conf`, overwriting any previous content. Type `echo 'debug_mode=true' > system.conf` and press **Enter**.",
        pathCondition: true,
        auroraMessage: "Configuration... written. `>`... redirects output... to file.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            if (!success || !actualPath.endsWith('/config')) return false;
            const confPath = fileSystemUtils.normalizePath('system.conf', actualPath);
            const content = fileSystemUtils.readFileContent(confPath);
            // Flexible check for content, ignoring quotes and extra whitespace
            return content && content.replace(/['"]/g, '').trim() === 'debug_mode=true';
        }
    },
    { // Phase 25: rm system.log
        objective: "Prepare the `logs` directory for removal by deleting its contents. The `rmdir` command only works on empty directories.",
        details: "You created a `logs` directory earlier and added `system.log` to it. Now, we'll practice removing files. The **`rm`** command (short for **r**e**m**ove) is used to delete files. **Be careful: files deleted with `rm` are usually unrecoverable!** To remove the `logs` directory later with `rmdir`, it must be empty first. First, navigate back to the `logs` directory. Then, use `rm system.log` to delete the `system.log` file. Remember to press **Enter**.",
        pathCondition: true,
        commandToLearn: 'rm',
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            if (!success) { return false; }

            // The goal is to ensure the user deleted 'system.log' from within the 'logs' directory.
            const commandIsCorrect = actualCommand === 'rm system.log';
            const pathIsCorrect = actualPath === `/home/${gameState.loggedInUser}/logs`;

            // Verify the file is actually gone.
            const logFilePath = fileSystemUtils.normalizePath('system.log', `/home/${gameState.loggedInUser}/logs`);
            const fileWasDeleted = !fileSystemUtils.getFileOrDir(logFilePath); // Correctly check if the file object is null/undefined

            return commandIsCorrect && pathIsCorrect && fileWasDeleted;
        },
        auroraMessage: "The `rm` command removes files. It's a powerful tool, and deleted files are usually gone for good, so use it with caution! With `system.log` deleted, the `logs` directory should now be ready for removal.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('rm'); }
    },
    { // Phase 26: rmdir logs
        objective: "Remove the now-empty 'logs' directory.",
        details: "Now that you've emptied the `logs` directory by deleting `system.log`, you can remove the directory itself. The **`rmdir`** command (short for **r**e**m**ove **dir**ectory) is used to delete *empty* directories. You must be in the *parent* directory of `logs` (your home directory) to remove it. If you're not in your home directory, navigate there first using `cd ..` or `cd ~`. Then, type `rmdir logs` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const commandIsCorrect = command === 'rmdir logs';
            // This should be run from the home directory, one level up from 'logs'.
            const pathIsCorrect = actualPath === `/home/${gameState.loggedInUser}`;
            return commandIsCorrect && pathIsCorrect && success === true;
        },
        auroraMessage: "Directory... removed. `rmdir`... removes empty... directories.",
        commandToLearn: 'rmdir',
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('rmdir'); }
    },
    { // Phase 27: mv (rename)
        objective: "Rename `mission_briefing_fragment.txt` to `mission_briefing.txt`.",
        details: "The **`mv`** command (short for **m**o**v**e) is versatile. It's used both to move files and to rename them. To rename a file, you provide its current name and then its new name. You should still be in the `documents` directory where `mission_briefing_fragment.txt` is located. Type `mv mission_briefing_fragment.txt mission_briefing.txt` and press **Enter** to rename the file.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const commandIsCorrect = command === 'mv mission_briefing_fragment.txt mission_briefing.txt';
            const pathIsCorrect = actualPath === `/home/${gameState.loggedInUser}/documents`;
            return commandIsCorrect && pathIsCorrect && success === true;
        },
        auroraMessage: "File... renamed. `mv`... is versatile for... organization.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('mv'); }
    },

    { // Phase 28: mv (move)
        objective: "Move `mission_briefing.txt` from `documents` up to your home directory (`~`).",
        details: "Now that the file is correctly named, let's move `mission_briefing.txt` to a more accessible location: your home directory. To move a file using `mv`, you specify the file you want to move and then the destination directory. Since your home directory is the parent directory, you can use `..` as the destination. Ensure you are still in the `documents` directory. Type `mv mission_briefing.txt ..` and press **Enter**.",
        pathCondition: true,
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            if (!success) {
                return false;
            }

            const userHome = `/home/${gameState.loggedInUser}`;
            const pathIsCorrect = actualPath === `${userHome}/documents`;

            // We check the outcome: the file should now be in the home dir and not in the documents dir.
            const newFile = fileSystemUtils.getFileOrDir(`${userHome}/mission_briefing.txt`);
            const oldFile = fileSystemUtils.getFileOrDir(`${userHome}/documents/mission_briefing.txt`);

            // Also ensure a `mv` command was used, not some other trick.
            const commandIsMv = actualCommand.startsWith('mv ');

            return pathIsCorrect && commandIsMv && newFile && !oldFile;
        },
        auroraMessage: "File... moved. `mv`... is versatile for... organization.",
    }
];


window.beginnerCommands = {
    pwd: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal(gameLogic.gameState.currentPath);
        gameLogic.checkStoryProgression('pwd', gameLogic.gameState.currentPath, true);
        return true;
    },
    ls: function(args, gameLogic) {
        const lsOption = args.find(arg => arg.startsWith('-'));
        const lsPathArg = args.find(arg => !arg.startsWith('-')) || '.';
        let lsTargetPath = gameLogic.fileSystemUtils.normalizePath(lsPathArg, gameLogic.gameState.currentPath);

        const showDetails = lsOption === '-l' || lsOption === '-la' || lsOption === '-al';
        const showHidden = lsOption === '-a' || lsOption === '-la' || lsOption === '-al';

        const contents = gameLogic.fileSystemUtils.listDirectoryContents(lsTargetPath, showHidden, showDetails, gameLogic.gameState);

        // Reconstruct a simplified command string for story progression
        const commandStr = 'ls' + (args.length > 0 ? ` ${args.join(' ')}` : '');

        if (contents) {
            if (showDetails && contents.length > 0 && contents[0].startsWith('total')) {
                gameLogic.uiUpdates.displayToTerminal(contents[0]);
                contents.slice(1).forEach(line => gameLogic.uiUpdates.displayToTerminal(line));
            } else if (contents.length > 0){
                gameLogic.uiUpdates.displayToTerminal(contents.join(showDetails ? '\n' : '  '));
            } else {
                if (showDetails) gameLogic.uiUpdates.displayToTerminal("total 0");
            }
            
            gameLogic.checkStoryProgression(commandStr, lsTargetPath, true);
            return true;
        } else {
            gameLogic.uiUpdates.displayToTerminal(`ls: cannot access '${lsPathArg}': No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, lsTargetPath, false);
            return false;
        }
    },
    cd: function(args, gameLogic) {
        let targetCdPath;
        const rawArg = args.length > 0 ? args[0] : '';
        
        // Normalization is now fully handled by normalizePath in fileSystemUtils
        targetCdPath = gameLogic.fileSystemUtils.normalizePath(rawArg || '~', gameLogic.gameState.currentPath);

        const targetNodeCd = gameLogic.fileSystemUtils.getFileOrDir(targetCdPath);
        const commandStr = 'cd' + (rawArg ? ` ${rawArg}` : '');
        const pathBeforeCd = gameLogic.gameState.currentPath;

        if (targetNodeCd && targetNodeCd.type === 'dir') {
            gameLogic.gameState.currentPath = targetCdPath;
            gameLogic.uiUpdates.updatePrompt();
            gameLogic.checkStoryProgression(commandStr, pathBeforeCd, true);
            return true;
        } else if (targetNodeCd) {
            gameLogic.uiUpdates.displayToTerminal(`cd: ${rawArg}: Not a directory`);
            gameLogic.checkStoryProgression(commandStr, pathBeforeCd, false);
            return false;
        } else {
            gameLogic.uiUpdates.displayToTerminal(`cd: ${rawArg}: No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, pathBeforeCd, false);
            return false;
        }
    },
    cat: function(args, gameLogic) {
        if (args.length === 0) { 
            gameLogic.uiUpdates.displayToTerminal('cat: missing operand'); 
            gameLogic.checkStoryProgression('cat', gameLogic.gameState.currentPath, false);
            return false; 
        }
        const fileToCatPath = gameLogic.fileSystemUtils.normalizePath(args[0], gameLogic.gameState.currentPath);
        const content = gameLogic.fileSystemUtils.readFileContent(fileToCatPath, gameLogic.gameState.fileSystem);
        const commandStr = 'cat ' + args.join(' ');

        if (content !== null) {
            gameLogic.uiUpdates.displayToTerminal(content);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
            return true;
        } else {
            const node = gameLogic.fileSystemUtils.getFileOrDir(fileToCatPath, gameLogic.gameState.fileSystem);
            if (node && node.type === 'dir') {
                gameLogic.uiUpdates.displayToTerminal(`cat: ${args[0]}: Is a directory`);
            } else {
                gameLogic.uiUpdates.displayToTerminal(`cat: ${args[0]}: No such file or directory`);
            }
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
    },
    echo: function(args, gameLogic) {
        let output = [];
        let targetFile = null;
        let append = false;
        let inRedirection = false;
        const commandStr = 'echo ' + args.join(' ');

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '>') {
                inRedirection = true;
                append = false;
                if (i + 1 < args.length) {
                    targetFile = args[i+1];
                    i++; 
                } else {
                    gameLogic.uiUpdates.displayToTerminal("echo: syntax error near unexpected token `>'");
                    return false;
                }
                continue;
            } else if (args[i] === '>>') {
                inRedirection = true;
                append = true;
                if (i + 1 < args.length) {
                    targetFile = args[i+1];
                    i++; 
                } else {
                    gameLogic.uiUpdates.displayToTerminal("echo: syntax error near unexpected token `>>'");
                    return false;
                }
                continue;
            }
            if (!inRedirection) {
                output.push(args[i]);
            }
        }
        const outputString = output.join(' ');

        if (targetFile) {
            const normalizedTargetFile = gameLogic.fileSystemUtils.normalizePath(targetFile, gameLogic.gameState.currentPath);
            let writeSuccess = false;
            if (append) {
                const existingContent = gameLogic.fileSystemUtils.readFileContent(normalizedTargetFile, gameLogic.gameState.fileSystem);
                if (existingContent !== null) {
                    writeSuccess = gameLogic.fileSystemUtils.writeFileContent(normalizedTargetFile, existingContent + '\n' + outputString, gameLogic.gameState);
                } else { 
                    writeSuccess = gameLogic.fileSystemUtils.createFileInFS(normalizedTargetFile, outputString, gameLogic.gameState);
                }
            } else { 
                const parentPath = normalizedTargetFile.substring(0, normalizedTargetFile.lastIndexOf('/')) || '/';
                const parentNode = gameLogic.fileSystemUtils.getFileOrDir(parentPath, gameLogic.gameState.fileSystem);
                if (parentNode && parentNode.type === 'dir') {
                    if (gameLogic.fileSystemUtils.getFileOrDir(normalizedTargetFile, gameLogic.gameState.fileSystem)) {
                        writeSuccess = gameLogic.fileSystemUtils.writeFileContent(normalizedTargetFile, outputString, gameLogic.gameState);
                    } else {
                        writeSuccess = gameLogic.fileSystemUtils.createFileInFS(normalizedTargetFile, outputString, gameLogic.gameState);
                    }
                } else {
                    gameLogic.uiUpdates.displayToTerminal(`echo: cannot create file '${targetFile}': Parent directory does not exist`);
                    gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
                    return false;
                }
            }
            if (!writeSuccess) {
                gameLogic.uiUpdates.displayToTerminal(`echo: failed to write to file '${targetFile}'`);
                gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
                return false;
            }
        } else {
            gameLogic.uiUpdates.displayToTerminal(outputString);
        }
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    mkdir: function(args, gameLogic) {
        if (args.length === 0) { 
            gameLogic.uiUpdates.displayToTerminal('mkdir: missing operand'); 
            gameLogic.checkStoryProgression('mkdir', gameLogic.gameState.currentPath, false);
            return false; 
        }
        const dirToMakeName = args[0];
        const commandStr = 'mkdir ' + args.join(' ');

        if (dirToMakeName.includes('/')) {
            gameLogic.uiUpdates.displayToTerminal(`mkdir: cannot create directory '${dirToMakeName}': Nested creation not supported by this basic version.`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        const fullDirToMakePath = gameLogic.fileSystemUtils.normalizePath(dirToMakeName, gameLogic.gameState.currentPath);
        
        if (gameLogic.fileSystemUtils.getFileOrDir(fullDirToMakePath, gameLogic.gameState.fileSystem)) {
            gameLogic.uiUpdates.displayToTerminal(`mkdir: cannot create directory '${dirToMakeName}': File exists`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        } else {
            if (!gameLogic.fileSystemUtils.createDirectoryInFS(fullDirToMakePath, gameLogic.gameState)) {
                 gameLogic.uiUpdates.displayToTerminal(`mkdir: cannot create directory '${dirToMakeName}': Operation failed.`);
                 gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
                 return false;
            }
        }
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    clear: function(args, gameLogic) {
        gameLogic.uiUpdates.clearTerminal();
        gameLogic.checkStoryProgression('clear', gameLogic.gameState.currentPath, true);
        return true;
    },
    hint: function(args, gameLogic) {
        const currentPhaseIndex = gameLogic.gameState.currentStoryPhaseIndex;
        const allPhases = gameLogic.allStoryPhases;
        if (currentPhaseIndex >= 0 && currentPhaseIndex < allPhases.length) {
            const currentPhase = allPhases[currentPhaseIndex];
            let hintText = currentPhase.details || "No specific hint available. Try following the current objective.";
            
            // Replace placeholders in the hint text
            if (gameLogic.gameState.loggedInUser) {
                hintText = hintText.replace(/{{USER_HOME}}/g, `/home/${gameLogic.gameState.loggedInUser}`);
                hintText = hintText.replace(/{{USERNAME}}/g, gameLogic.gameState.loggedInUser);
            }

            gameLogic.uiUpdates.displayToTerminal(`Hint: ${hintText}`);
        } else {
            gameLogic.uiUpdates.displayToTerminal("No hint available at this time.");
        }
        gameLogic.checkStoryProgression('hint', gameLogic.gameState.currentPath, true);
        return true;
    },
    help: function(args, gameLogic) {
        // Restore display logic
        gameLogic.uiUpdates.displayToTerminal("Available commands:");
        if (gameLogic.gameState.learnedCommands.size > 0) {
            let helpOutput = "";
            gameLogic.gameState.learnedCommands.forEach(lc => {
                const phaseForHelp = gameLogic.allStoryPhases.find(p => {
                    const learnCmd = p.commandToLearn;
                    if (Array.isArray(learnCmd)) return learnCmd.includes(lc);
                    return learnCmd === lc;
                });
                let desc = `The ${lc} command.`;
                if (phaseForHelp && phaseForHelp.details) {
                    desc = phaseForHelp.details.split('.')[0].replace(/\`/g, '');
                } else if (phaseForHelp && phaseForHelp.objective) {
                     desc = phaseForHelp.objective.split('.')[0].replace(/\`/g, '');
                }
                helpOutput += `  ${lc} - ${desc}\n`;
            });
            gameLogic.uiUpdates.displayToTerminal(helpOutput.trimEnd());
        } else {
            gameLogic.uiUpdates.displayToTerminal("  No commands learned yet. Follow AURORA\'s instructions.");
        }
        gameLogic.checkStoryProgression('help', gameLogic.gameState.currentPath, true);
        return true; 
    },
    man: function(args, gameLogic) {
        if (args.length === 0) {
            gameLogic.uiUpdates.displayToTerminal("What manual page do you want?");
            gameLogic.checkStoryProgression('man', gameLogic.gameState.currentPath, false);
            return false;
        }
        const manPageArg = args[0];
        const commandStr = 'man ' + args.join(' ');
        const manPageContent = gameLogic.fileSystemUtils.getManPage(manPageArg, gameLogic.allStoryPhases);

        if (manPageContent) {
            gameLogic.gameState.inManPage = true;
            gameLogic.uiUpdates.displayToTerminal(manPageContent, 'MANPAGE');
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        } else {
            gameLogic.uiUpdates.displayToTerminal(`No manual entry for ${manPageArg}`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        return true; 
    },
    uptime: function(args, gameLogic) {
        const now = new Date();
        const uptimeDuration = now - (gameLogic.gameState.startTime || now);

        const seconds = Math.floor((uptimeDuration / 1000) % 60);
        const minutes = Math.floor((uptimeDuration / (1000 * 60)) % 60);
        const hours = Math.floor((uptimeDuration / (1000 * 60 * 60)) % 24);
        const days = Math.floor(uptimeDuration / (1000 * 60 * 60 * 24));

        let uptimeString = "";
        if (days > 0) uptimeString += days + " day" + (days > 1 ? "s" : "") + ", ";
        if (hours > 0 || days > 0) uptimeString += hours + " hr" + (hours > 1 ? "s" : "") + ", ";
        if (minutes > 0 || hours > 0 || days > 0) uptimeString += minutes + " min" + (minutes > 1 ? "s" : "") + ", ";
        uptimeString += seconds + " sec";
        
        const load1 = (Math.random() * 0.5 + 0.1).toFixed(2);
        const load5 = (Math.random() * 0.3 + 0.05).toFixed(2);
        const load15 = (Math.random() * 0.2 + 0.01).toFixed(2);

        const currentTime = now.toTimeString().split(' ')[0];
        
        gameLogic.uiUpdates.displayToTerminal(
            ` ${currentTime} up ${uptimeString},  1 user,  load average: ${load1}, ${load5}, ${load15}`
        );
        gameLogic.checkStoryProgression('uptime', gameLogic.gameState.currentPath, true);
        return true;
    },
    touch: function(args, gameLogic) {
        if (args.length === 0) {
            gameLogic.uiUpdates.displayToTerminal("touch: missing file operand");
            gameLogic.checkStoryProgression('touch', gameLogic.gameState.currentPath, false);
            return false;
        }
        const fileName = args[0];
        const commandStr = 'touch ' + args.join(' ');
        const fullPath = gameLogic.fileSystemUtils.normalizePath(fileName, gameLogic.gameState.currentPath);

        if (fileName.includes('/')) {
            gameLogic.uiUpdates.displayToTerminal(`touch: cannot touch '${fileName}': Not a valid filename (directories not supported in this basic touch).`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        
        const existingNode = gameLogic.fileSystemUtils.getFileOrDir(fullPath, gameLogic.gameState.fileSystem);

        if (existingNode && existingNode.type === 'dir') {
            gameLogic.uiUpdates.displayToTerminal(`touch: cannot touch '${fileName}': It is a directory.`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        if (existingNode && existingNode.type === 'file') {
            existingNode.lastModified = new Date().toISOString();
        } else {
            if (!gameLogic.fileSystemUtils.createFileInFS(fullPath, '', gameLogic.gameState)) {
                gameLogic.uiUpdates.displayToTerminal(`touch: cannot touch '${fileName}': Could not create file.`);
                gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
                return false;
            }
        }
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    rmdir: function(args, gameLogic) {
        if (args.length === 0) {
            gameLogic.uiUpdates.displayToTerminal("rmdir: missing operand");
            gameLogic.checkStoryProgression('rmdir', gameLogic.gameState.currentPath, false);
            return false;
        }
        const dirName = args[0];
        const commandStr = 'rmdir ' + args.join(' ');
        const fullPath = gameLogic.fileSystemUtils.normalizePath(dirName, gameLogic.gameState.currentPath);
        const node = gameLogic.fileSystemUtils.getFileOrDir(fullPath, gameLogic.gameState.fileSystem);

        if (!node) {
            gameLogic.uiUpdates.displayToTerminal(`rmdir: failed to remove '${dirName}': No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        if (node.type !== 'dir') {
            gameLogic.uiUpdates.displayToTerminal(`rmdir: failed to remove '${dirName}': Not a directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        if (Object.keys(node.children).length > 0) {
            gameLogic.uiUpdates.displayToTerminal(`rmdir: failed to remove '${dirName}': Directory not empty`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        if (!gameLogic.fileSystemUtils.deleteFileOrDir(fullPath, gameLogic.gameState)) {
            gameLogic.uiUpdates.displayToTerminal(`rmdir: failed to remove '${dirName}': Permission denied or error`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    rm: function(args, gameLogic) {
        if (args.length === 0) {
            gameLogic.uiUpdates.displayToTerminal("rm: missing operand");
            gameLogic.checkStoryProgression('rm', gameLogic.gameState.currentPath, false);
            return false;
        }
        const fileName = args[0];
        const commandStr = 'rm ' + args.join(' ');
        const fullPath = gameLogic.fileSystemUtils.normalizePath(fileName, gameLogic.gameState.currentPath);
        const node = gameLogic.fileSystemUtils.getFileOrDir(fullPath, gameLogic.gameState.fileSystem);

        if (!node) {
            gameLogic.uiUpdates.displayToTerminal(`rm: cannot remove '${fileName}': No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        if (node.type === 'dir') {
            gameLogic.uiUpdates.displayToTerminal(`rm: cannot remove '${fileName}': Is a directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        if (!gameLogic.fileSystemUtils.deleteFileOrDir(fullPath, gameLogic.gameState)) {
            gameLogic.uiUpdates.displayToTerminal(`rm: cannot remove '${fileName}': Permission denied or error`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    mv: function(args, gameLogic) {
        const commandStr = 'mv ' + args.join(' ');
        if (args.length !== 2) {
            gameLogic.uiUpdates.displayToTerminal("mv: usage: mv <source> <destination>");
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        const sourceArg = args[0];
        const destArg = args[1];

        const sourcePath = gameLogic.fileSystemUtils.normalizePath(sourceArg, gameLogic.gameState.currentPath);
        let destPath = gameLogic.fileSystemUtils.normalizePath(destArg, gameLogic.gameState.currentPath);

        const sourceNode = gameLogic.fileSystemUtils.getFileOrDir(sourcePath);

        if (!sourceNode) {
            gameLogic.uiUpdates.displayToTerminal(`mv: cannot stat '${sourceArg}': No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        if (sourceNode.type === 'dir') {
            gameLogic.uiUpdates.displayToTerminal(`mv: cannot move directories in this version of the command.`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        const destNode = gameLogic.fileSystemUtils.getFileOrDir(destPath);

        let finalDestPath = destPath;
        if (destNode && destNode.type === 'dir') {
            const sourceFilename = sourcePath.split('/').pop();
            finalDestPath = gameLogic.fileSystemUtils.normalizePath(`${destPath}/${sourceFilename}`);
        }
        
        if (finalDestPath === sourcePath) {
            // It's a no-op move (e.g., `mv file.txt .`), count as success.
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
            return true;
        }
        
        const finalDestNode = gameLogic.fileSystemUtils.getFileOrDir(finalDestPath);
        if (finalDestNode) {
            gameLogic.uiUpdates.displayToTerminal(`mv: cannot move to '${destArg}': File or directory already exists.`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        const content = gameLogic.fileSystemUtils.readFileContent(sourcePath);
        if (content === null) {
            gameLogic.uiUpdates.displayToTerminal(`mv: could not read source file '${sourceArg}'`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        
        const createSuccess = gameLogic.fileSystemUtils.createFileInFS(finalDestPath, content, sourceNode.owner, sourceNode.permissions);
        
        if (createSuccess) {
            gameLogic.fileSystemUtils.deleteFileOrDir(sourcePath);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
            return true;
        } else {
            gameLogic.uiUpdates.displayToTerminal(`mv: failed to move '${sourceArg}' to '${destArg}'`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
    },
    less: function(args, gameLogic) {
        if (args.length === 0) {
            gameLogic.uiUpdates.displayToTerminal("less: missing file operand");
            gameLogic.checkStoryProgression('less', gameLogic.gameState.currentPath, false);
            return false;
        }
        const fileName = args[0];
        const commandStr = 'less ' + args.join(' ');
        const fullPath = gameLogic.fileSystemUtils.normalizePath(fileName, gameLogic.gameState.currentPath);
        const node = gameLogic.fileSystemUtils.getFileOrDir(fullPath);

        if (node && node.type === 'dir') {
            gameLogic.uiUpdates.displayToTerminal(`${fileName}: is a directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        
        const content = gameLogic.fileSystemUtils.readFileContent(fullPath);

        if (content !== null) {
            gameLogic.gameState.inManPage = true; // Re-use the same state as `man` for viewer mode
            gameLogic.uiUpdates.displayToTerminal(content, 'MANPAGE'); // Re-use the same style
            gameLogic.uiUpdates.displayToTerminal(`\n${fileName} (END) - Press 'q' to quit`, 'MANPAGE-HINT');
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
            return true;
        } else {
            gameLogic.uiUpdates.displayToTerminal(`${fileName}: No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
    },
    set_phase: function(args, gameLogic) {
        if (args.length === 0) {
            gameLogic.uiUpdates.displayToTerminal("Usage: set_phase <phase_index>");
            return false;
        }
        const newIndex = parseInt(args[0], 10);
        if (isNaN(newIndex) || newIndex < 0 || newIndex >= gameLogic.allStoryPhases.length) {
            gameLogic.uiUpdates.displayToTerminal(`Invalid phase index. Must be between 0 and ${gameLogic.allStoryPhases.length - 1}.`);
            return false;
        }

        gameLogic.gameState.currentStoryPhaseIndex = newIndex;
        const newPhase = gameLogic.allStoryPhases[newIndex];

        // Update UI
        gameLogic.uiUpdates.updateObjectivePanel(newPhase.objective);
        if (newPhase.auroraMessage) {
            gameLogic.uiUpdates.displayToStoryPanel(newPhase.auroraMessage);
        } else {
             gameLogic.uiUpdates.displayToStoryPanel(`Story phase jumped to ${newIndex}.`);
        }
        
        gameLogic.uiUpdates.displayToTerminal(`DEBUG: Story phase set to ${newIndex}: "${newPhase.objective}"`);
        return true;
    }
};

window.chapterData = window.chapterData || [];

console.log("beginner.js: END - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);
console.log("DEBUG: beginner.js loaded and attached story phases and commands to window object."); 