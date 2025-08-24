console.log("intermediate.js: START - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);

console.log("intermediate.js: START - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);

window.intermediateStoryPhases = [
    // --- CHAPTER 2: Intermediate File Operations & Text Processing ---
    { // Phase 25: less /var/log/system.log
        objective: "View the potentially long system log at `/var/log/system.log` page by page using `less`.",
        details: "Before searching, it's good to know how to view large files without flooding your terminal. `cat` displays everything at once. For longer files like `/var/log/system.log`, `less` is better. First `cd /var/log`. Then use `less system.log`. (Use 'q' to quit `less` - simulated. Arrow keys/PageUp/PageDown would scroll in a real `less`).",
        triggerCondition: (command, path, success) => command.trim() === 'less system.log' && path === '/var/log' && success === true,
        commandToLearn: 'less',
        auroraMessage: "The main system log at `/var/log/system.log` can be very large. `less` allows you to view it page by page. Navigate to `/var/log` then use `less system.log`. (Use 'q' to quit `less`).",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('less'); gameLogic.addLearnedCommand('q'); }
    },
    { // Phase 26: grep ERROR /var/log/system.log
        objective: "Search for lines containing 'ERROR' in `/var/log/system.log` to find critical system issues.",
        details: "You should be in `/var/log`. Use `grep ERROR system.log`. `grep` searches for patterns in files.",
        triggerCondition: (command, path, success) => command.startsWith('grep ERROR system.log') && path === '/var/log' && success === true,
        commandToLearn: 'grep',
        auroraMessage: "`grep` is essential for searching within files. Try `grep ERROR /var/log/system.log` (assuming you are in `/var/log`). This will highlight critical error messages that need our attention.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('grep'); }
    },
    { // Phase 27: find /var -name "*.log"
        objective: "Search the `/var` directory and its subdirectories for any file ending with `.log`.",
        details: "Use the `find` command: `find /var -name \"*.log\"`. The `*` is a wildcard. Quotes are good practice around the pattern.",
        triggerCondition: (command, path, success) => {
            if (!success) return false;
            const parts = command.trim().split(/\s+/);
            // Handles 'find /var -name *.log' after quotes are stripped by parser
            return parts.length === 4 && parts[0] === 'find' && parts[1] === '/var' && parts[2] === '-name' && parts[3] === '*.log';
        },
        commandToLearn: 'find',
        auroraMessage: "`find` is a powerful tool to locate files. `find /var -name \"*.log\"` will search `/var` for all log files. We might uncover logs from subsystems we didn't know existed.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('find'); }
    },
    { // Phase 28: head -n 5 /var/log/system.log
        objective: "View the first 5 lines of `/var/log/system.log` to check the initial boot sequence messages.",
        details: "Use `head -n 5 /var/log/system.log`. The `-n 5` specifies the number of lines.",
        triggerCondition: (command, path, success) => command === 'head -n 5 /var/log/system.log' && success === true,
        commandToLearn: 'head',
        auroraMessage: "`head` displays the beginning of a file. `head -n 5 /var/log/system.log` shows the first few log entries, which can tell us about the system's state at startup.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('head'); }
    },
    { // Phase 29: tail -n 5 /var/log/system.log
        objective: "View the last 5 lines of `/var/log/system.log` to see the most recent system events.",
        details: "Use `tail -n 5 /var/log/system.log`.",
        triggerCondition: (command, path, success) => command === 'tail -n 5 /var/log/system.log' && success === true,
        commandToLearn: 'tail',
        auroraMessage: "`tail` shows the end of a file. `tail -n 5 /var/log/system.log` will display the latest entries, crucial for understanding the most recent events before... this.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('tail'); }
    },
    { // Phase 30: wc /var/log/system.log
        objective: "Count the number of lines, words, and characters in `/var/log/system.log` to gauge its size.",
        details: "Use `wc /var/log/system.log`. It will show lines, words, and bytes.",
        triggerCondition: (command, path, success) => command === 'wc /var/log/system.log' && success === true,
        commandToLearn: 'wc',
        auroraMessage: "`wc` (word count) can tell you the size of a file in lines, words, and bytes. Try `wc /var/log/system.log`. A very small log might indicate it was recently wiped or logging failed.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('wc'); }
    },
    { // Phase 31: sort unsorted_errors.log
        objective: "In `{{USER_HOME}}/text_processing_data`, display the contents of `unsorted_errors.log` sorted alphabetically.",
        details: "First `cd ~/text_processing_data`. Then use `sort unsorted_errors.log`.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => command === 'sort unsorted_errors.log' && actualPath === `/home/${gameState.loggedInUser}/text_processing_data` && success === true,
        commandToLearn: 'sort',
        auroraMessage: "`sort` arranges lines of text. Navigate to `{{USER_HOME}}/text_processing_data` and try `sort unsorted_errors.log`. This helps in organizing data for easier analysis.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('sort'); }
    },
    { // New Phase (before Phase 32): | (pipe)
        objective: "Learn to redirect the output of one command to the input of another using the pipe symbol `|`.",
        details: "The `|` (pipe) character is very powerful. It takes the standard output of the command on its left and 'pipes' it as standard input to the command on its right. For example, `ls -l | grep txt` would list all files and then filter that list to show only lines containing 'txt'. Try a simple pipe to see it in action: `echo 'Test data for pipe' | wc -w` (this will count the words in the echoed string).",
        triggerCondition: (command, path, success) => {
            const expectedCmd = "echo 'Test data for pipe' | wc -w";
            const commandMatch = command.trim() === expectedCmd;
            return commandMatch && success === true;
        },
        commandToLearn: '|',
        auroraMessage: "The pipe `|` is a fundamental concept. It connects commands, making the output of one the input for the next. For instance, `ls -l | grep txt` lists files, then `grep` filters that list. Try this: `echo 'Test data for pipe' | wc -w`",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('|'); }
    },
    { // Phase 32: sort unsorted_errors.log | uniq (Original Phase 32, now after pipe)
        objective: "Display only the unique error lines from `unsorted_errors.log` by piping `sort`'s output to `uniq`.",
        details: "Often `uniq` is used with `sort`. Try `sort unsorted_errors.log | uniq`. The `|` (pipe) sends output of one command to the input of another.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const trimmedCmd = command.trim();
            const expectedCmd = 'sort unsorted_errors.log | uniq';
            const expectedPath = `/home/${gameState.loggedInUser}/text_processing_data`;
            const cmdMatch = trimmedCmd === expectedCmd;
            const pathMatch = actualPath === expectedPath;
            return cmdMatch && pathMatch && success === true;
        },
        commandToLearn: ['uniq', '|'], // Already learned pipe, but reinforce with uniq
        auroraMessage: "`uniq` filters out duplicate adjacent lines. It's often combined with `sort`. In `{{USER_HOME}}/text_processing_data`, try `sort unsorted_errors.log | uniq`. This will give a clean list of unique errors.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('uniq'); if (!gameLogic.gameState.learnedCommands.has('|')) gameLogic.addLearnedCommand('|'); }
    },
    { // Phase 33: diff file_A file_B
        objective: "Compare `file_to_compare_A.txt` and `file_to_compare_B.txt` in `{{USER_HOME}}/text_processing_data` to find their differences.",
        details: "Use `diff file_to_compare_A.txt file_to_compare_B.txt`.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => command === 'diff file_to_compare_A.txt file_to_compare_B.txt' && actualPath === `/home/${gameState.loggedInUser}/text_processing_data` && success === true,
        commandToLearn: 'diff',
        auroraMessage: "`diff` shows differences between two files. In `{{USER_HOME}}/text_processing_data`, use `diff file_to_compare_A.txt file_to_compare_B.txt`. This is vital for comparing configurations or checking file integrity.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('diff'); }
    },
    { // Phase 34: ln -s source link_name
        objective: "Create a symbolic link named `mission_link.txt` in `{{USER_HOME}}` that points to `{{USER_HOME}}/documents/mission_briefing_fragment.txt`.",
        details: "First, ensure you are in your home directory. If you are in `~/text_processing_data` (from the previous step), type `cd ~` to return home. Then, use `ln -s ~/documents/mission_briefing_fragment.txt ~/mission_link.txt`. The `-s` flag creates a symbolic link. This can be useful for creating shortcuts to important files that might be buried deep in the directory structure.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            const expectedUserHomePath = `/home/${gameState.loggedInUser}`;
            const commandString = command.trim();
            const expectedCommand1 = 'ln -s ~/documents/mission_briefing_fragment.txt ~/mission_link.txt';
            const expectedCommand2 = `ln -s /home/${gameState.loggedInUser}/documents/mission_briefing_fragment.txt /home/${gameState.loggedInUser}/mission_link.txt`;
            const commandMatch = (commandString === expectedCommand1 || commandString === expectedCommand2);
            const pathMatch = actualPath === expectedUserHomePath;
            return commandMatch && pathMatch && success === true;
        },
        commandToLearn: 'ln',
        auroraMessage: "`ln -s <target_file> <link_name>` creates a symbolic link, like a shortcut. Try `ln -s ~/documents/mission_briefing_fragment.txt ~/mission_link.txt`. This can make frequently accessed, deeply nested files easier to reach.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('ln'); }
    },
    { // Phase 35: uname -a
        objective: "Display detailed information about the ship's operating system kernel using `uname -a`.",
        details: "To understand the core software we're dealing with, use `uname`. This can tell us the OS name. Sometimes adding `-a` gives all details. Try `uname -a`.",
        triggerCondition: (command, path, success) => command === 'uname -a' && success === true,
        commandToLearn: 'uname',
        auroraMessage: "`uname -a` prints all available system information. This data (kernel version, architecture) is critical for determining compatibility of any recovery software we might find or construct.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('uname'); }
    },
    { // Phase 36: whoami
        objective: "Confirm your current user ID using `whoami`.",
        details: "It's good practice to know who the system thinks you are. Use the `whoami` command. This helps in understanding your current access privileges.",
        triggerCondition: (command, path, success) => command === 'whoami' && success === true,
        commandToLearn: 'whoami',
        auroraMessage: "`whoami` displays your effective user ID. It's a simple but important check, especially if we need to escalate privileges or perform actions as a specific system user.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('whoami'); }
    },
    { // Phase 37: groups
        objective: "List the groups your user account belongs to using `groups`.",
        details: "Permissions are often tied to groups. Use `groups` to see your affiliations. This will show us what system resources you inherently have permission to interact with.",
        triggerCondition: (command, path, success) => command === 'groups' && success === true,
        commandToLearn: 'groups',
        auroraMessage: "User accounts belong to groups, which define permissions. `groups` will show your current group memberships. This helps understand your access rights to various system components.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('groups'); }
    },
    { // Phase 38: dmesg | grep -i error
        objective: "View kernel messages, filtering for lines containing 'error' (case-insensitive) to find hardware or driver issues.",
        details: "The kernel logs critical messages about hardware and drivers to a special buffer called the kernel ring buffer. Use `dmesg` to view these messages. To narrow down the output, you can pipe it to `grep`, for example: `dmesg | grep -i error`.",
        triggerCondition: (command, path, success) => (command.startsWith('dmesg') && (command.includes('| grep -i error') || command.includes('| grep error') || command.trim() === 'dmesg')) && success === true,
        commandToLearn: 'dmesg',
        auroraMessage: "`dmesg` prints kernel ring buffer messages. Piping it to `grep -i error` (e.g., `dmesg | grep -i error`) helps find critical hardware or driver issues quickly. Look for anything related to power or core systems.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('dmesg'); }
    },
    { // Phase 39: free -h
        objective: "Check the ship's available and used system memory in a human-readable format using `free -h`.",
        details: "System responsiveness can be affected by memory. Use `free` to see memory statistics. Try `free -h` for human-readable numbers, which makes it easier to assess if memory is critically low for essential systems.",
        triggerCondition: (command, path, success) => command === 'free -h' && success === true,
        commandToLearn: 'free',
        auroraMessage: "`free -h` shows system memory usage in a human-friendly format. Critically low memory could impair system functions, including my own. We need to monitor this.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('free'); }
    },
    { // Phase 40: df -h
        objective: "Report file system disk space usage in human-readable format using `df -h`.",
        details: "We need to make sure we're not running out of storage for critical data like system logs or potential backups. Use `df -h` (Disk Free, human-readable).",
        triggerCondition: (command, path, success) => command === 'df -h' && success === true,
        commandToLearn: 'df',
        auroraMessage: "`df -h` shows disk space usage. If critical partitions are full, the system can become unstable, and we won't be able to save logs or run recovery tools.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('df'); }
    },
    { // Phase 41: du -sh ~
        objective: "Check the total disk space used by your home directory (`~`) in a human-readable summary using `du -sh ~`.",
        details: "To see how much space specific directories are using, `du` (Disk Usage) is helpful. Try `du -sh ~`. The `-s` is for summary and `-h` for human-readable. This helps identify large files that might be expendable.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => (command === 'du -sh ~' || command === `du -sh /home/${gameState.loggedInUser}`) && success === true,
        commandToLearn: 'du',
        auroraMessage: "`du -sh <directory>` summarizes disk usage for that directory. `du -sh ~` will show how much space your personal files are taking. We might need to clear space later.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('du'); }
    },
    { // Phase 42: tree ~/documents
        objective: "Visualize the directory structure of `{{USER_HOME}}/documents` using `tree`.",
        details: "Sometimes `ls` isn't enough to grasp nested structures, especially when searching for specific configuration files. `tree [directory]` can help. Try `tree ~/documents`.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => (command === 'tree ~/documents' || command === `tree /home/${gameState.loggedInUser}/documents`) && success === true,
        commandToLearn: 'tree',
        auroraMessage: "`tree` displays a directory's contents in a tree-like format, showing nesting. Try `tree ~/documents`. This can be helpful for understanding complex directory layouts.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('tree'); }
    },
    { // Phase 43: file ~/README.txt
        objective: "Determine the file type of `~/README.txt` and `~/script_examples/system_check.sh` using the `file` command.",
        details: "Not all files are plain text. The `file` command inspects a file and tells you its type. This is crucial before trying to execute or read a file, as misinterpreting a binary as text could cause issues. Try `file ~/README.txt` and then `file ~/script_examples/system_check.sh`.",
        triggerCondition: (command, path, success) => command.startsWith('file ~/script_examples/') && command.endsWith('system_check.sh') && success === true,
        commandToLearn: 'file',
        auroraMessage: "The `file` command identifies file types. Try `file ~/README.txt` and then `file ~/script_examples/system_check.sh`. Knowing the type is crucial before attempting to execute or view a file.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('file'); }
    },
    { // Phase 44: cmp fileA fileB
        objective: "Compare `~/text_processing_data/file_to_compare_A.txt` and `~/text_processing_data/file_to_compare_C.txt` byte by byte using `cmp`.",
        details: "While `diff` shows line differences, `cmp` is vital for checking if critical system files or backups are exact copies, byte for byte. Use `cmp ~/text_processing_data/file_to_compare_A.txt ~/text_processing_data/file_to_compare_C.txt`.",
        triggerCondition: (command, path, success) => command.includes('cmp') && command.includes('file_to_compare_A.txt') && command.includes('file_to_compare_C.txt') && success === true,
        commandToLearn: 'cmp',
        auroraMessage: "`cmp` compares two files byte by byte and reports the first difference. This is good for checking if binary files are identical. Compare `~/text_processing_data/file_to_compare_A.txt` with `~/text_processing_data/file_to_compare_C.txt`.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('cmp'); }
    },
    { // Phase 45: cut -d':' -f1 /etc/passwd
        objective: "Extract usernames (the first field) from `/etc/passwd` using `cut`. The delimiter is ':'." ,
        details: "The `cut` command can extract sections from lines. Use `cut -d':' -f1 /etc/passwd`. `-d` specifies delimiter, `-f` the field number. We need to parse sensor data logs.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => command.trim() === "cut -d':' -f1 /etc/passwd" && success === true,
        commandToLearn: 'cut',
        auroraMessage: "`/etc/passwd` stores user account information. Each field is separated by a colon. `cut -d':' -f1 /etc/passwd` will extract just the usernames. This can help us identify all potential system users.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('cut'); }
    },
    { // Phase 46: tr 'a-z' 'A-Z' < ~/text_processing_data/message_to_decode.txt
        objective: "Convert `~/text_processing_data/message_to_decode.txt` to uppercase using `tr` and input redirection `<`.",
        details: "Use `cat ~/text_processing_data/message_to_decode.txt | tr 'a-z' 'A-Z'` or `tr 'a-z' 'A-Z' < ~/text_processing_data/message_to_decode.txt`. `tr` translates characters. The pipe `|` sends `cat`'s output to `tr`, or `<` redirects file content to `tr`'s input.",
        triggerCondition: (command, path, success) => (command.trim() === "tr 'a-z' 'A-Z' < ~/text_processing_data/message_to_decode.txt" || command.trim() === "cat ~/text_processing_data/message_to_decode.txt | tr 'a-z' 'A-Z'") && success === true,
        commandToLearn: ['tr', '<'],
        auroraMessage: "`tr` can translate character sets. `tr 'a-z' 'A-Z' < ~/text_processing_data/message_to_decode.txt` will convert the file content to uppercase. The `<` redirects the file's content as input to `tr`.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('tr'); gameLogic.addLearnedCommand('<');}
    },
    { // Phase 47: tee ~/system_kernel.log
        objective: "Run `dmesg` and save its output to `~/system_kernel.log` while also displaying it, using `tee`.",
        details: "The `tee` command reads from standard input and writes to standard output and files. Use `dmesg | tee ~/system_kernel.log`. This ensures we have a record of critical system states.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => command.trim() === "dmesg | tee ~/system_kernel.log" && actualPath.startsWith(`/home/${gameState.loggedInUser}`) && success === true,
        commandToLearn: 'tee',
        auroraMessage: "`tee` splits output to a file and the screen. `dmesg | tee ~/system_kernel.log` will save the kernel messages for later review and display them now. Essential for logging.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('tee'); }
    },
    { // Phase 48: locate "*.conf"
        objective: "Use `locate` to find all files ending with `.conf` on the system (simulated).",
        details: "The `locate` command quickly finds files by name (using a database, usually). Try `locate \"*.conf\"`. It might find instructions we haven't seen yet.",
        triggerCondition: (command, path, success) => (command === 'locate "*.conf"' || command === "locate '*.conf'") && success === true,
        commandToLearn: 'locate',
        auroraMessage: "`locate \"*.conf\"` will quickly find all configuration files indexed by the system. This can help us find settings for critical systems, if `locate`'s database is intact.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('locate'); }
    },
    { // Phase 49: chmod +x ~/script_examples/advanced_diagnostics.sh
        objective: "Make the `~/script_examples/advanced_diagnostics.sh` script executable for your user.",
        details: "Use `chmod u+x ~/script_examples/advanced_diagnostics.sh`. `u+x` means 'user add execute'. Then try running it with `sh ~/script_examples/advanced_diagnostics.sh`.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            const expectedCmd = 'sh ~/script_examples/advanced_diagnostics.sh';
            const scriptPath = '~/script_examples/advanced_diagnostics.sh';
            const commandMatch = command.trim() === expectedCmd;
            if (!commandMatch) return false;
            const scriptNode = fileSystemUtils.getFileOrDir(scriptPath, gameState);
            if (!scriptNode) return false;
            const isExecutable = scriptNode.permissions && scriptNode.permissions.includes('x'); // Check user execute bit
            return isExecutable && success === true;
        },
        commandToLearn: 'chmod',
        auroraMessage: "Scripts need execute permission to run. Use `chmod u+x ~/script_examples/advanced_diagnostics.sh`. Then you can try running it with `sh ~/script_examples/advanced_diagnostics.sh`.",
        actionOnSuccess: (gameLogic, fileSystemUtils) => {
            gameLogic.addLearnedCommand('chmod');
        },
        postCompleteMessage: "AURORA: Script executed. `chmod` is essential for controlling access and execution rights."
    },
    { // Phase 50: sudo chown root /etc/critical_config.cfg (Simulated)
        objective: "Simulate changing ownership of a critical configuration file `/etc/critical_config.cfg` to 'root' using `sudo chown`.",
        details: "The `chown` command typically requires superuser privileges. Use `sudo chown root /etc/critical_config.cfg`. `sudo` executes the given command as the superuser (root). This ensures the backup service can access the file.",
        triggerCondition: (command, path, success) => command.trim() === 'sudo chown root /etc/critical_config.cfg' && success === true,
        commandToLearn: ['sudo', 'chown'],
        auroraMessage: "`sudo chown root /etc/critical_config.cfg` would change the owner of this (simulated) critical file to 'root'. This is a common administrative task to secure important files.",
        actionOnSuccess: (gameLogic, fileSystemUtils) => {
            gameLogic.addLearnedCommand('sudo');
            gameLogic.addLearnedCommand('chown');
        }
    },
    { // Phase 51: umask (display only)
        objective: "Display the current file mode creation mask using `umask`.",
        details: "`umask` controls default permissions for new files. Just type `umask` to see the current (simulated) mask. This ensures new diagnostic logs have correct default privacy.",
        triggerCondition: (command, path, success) => command === 'umask' && success === true,
        commandToLearn: 'umask',
        auroraMessage: "`umask` shows the default permissions mask for newly created files. Understanding this helps ensure new files have appropriate security settings from the start.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('umask'); }
    },
    { // Phase 52: split -b 1k /var/log/large_binary_log.dat bin_part_
        objective: "Split the large binary file `/var/log/large_binary_log.dat` into 1KB chunks.",
        details: "Navigate to `/var/log`. Use `split -b 1k large_binary_log.dat bin_part_`. This creates files like `bin_part_aa`, `bin_part_ab`. These smaller parts can then be sent individually.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => command.startsWith('split -b 1k large_binary_log.dat') && actualPath === `/var/log` && success === true,
        commandToLearn: 'split',
        auroraMessage: "Binary logs can also be split. `split -b 1k /var/log/large_binary_log.dat bin_part_` will split it by size (1 kilobyte). This is useful for very large data files.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('split'); }
    },
    { // Phase 53: paste -d, file1 file2
        objective: "Merge `~/text_processing_data/sensor_ids.txt` and `~/text_processing_data/sensor_values.txt` side-by-side, using a comma as a delimiter.",
        details: "Use `paste -d, ~/text_processing_data/sensor_ids.txt ~/text_processing_data/sensor_values.txt`. It will merge corresponding lines, separated by a comma. This helps in correlating fragmented data logs.",
        triggerCondition: (command, path, success) => command.trim() === 'paste -d, ~/text_processing_data/sensor_ids.txt ~/text_processing_data/sensor_values.txt' && success === true,
        commandToLearn: 'paste',
        auroraMessage: "`paste -d, sensor_ids.txt sensor_values.txt` (assuming you are in `~/text_processing_data`) will combine these files, separating corresponding lines with a comma. This is useful for creating CSV-like data.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('paste'); }
    },
    { // Phase 54: join -t, sorted_file1 sorted_file2
        objective: "Join `~/text_processing_data/sorted_sensor_data_A.csv` and `~/text_processing_data/sorted_sensor_data_B.csv` on their first field (which is common), using ',' as a delimiter.",
        details: "This is more complex. Ensure files are sorted. Then `join -t, ~/text_processing_data/sorted_sensor_data_A.csv ~/text_processing_data/sorted_sensor_data_B.csv`.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => command.trim() === "join -t, ~/text_processing_data/sorted_sensor_data_A.csv ~/text_processing_data/sorted_sensor_data_B.csv" && actualPath.startsWith(`/home/${gameState.loggedInUser}`) && success === true,
        commandToLearn: 'join',
        auroraMessage: "Assuming the files are sorted and have a common ID field, `join -t, sorted_sensor_data_A.csv sorted_sensor_data_B.csv` (in `~/text_processing_data`) will merge them based on that ID. Powerful for combining related datasets.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('join'); }
    },
    { // Phase 55: tar -czvf backup.tar.gz directory_to_backup
        objective: "Create a compressed tarball named `~/log_backup.tar.gz` from the `/var/log` directory.",
        details: "Use `tar -czvf ~/log_backup.tar.gz /var/log`. `-c` creates, `-z` for gzip, `-v` is verbose, `-f` specifies archive file. This bundles them for easier backup or transfer.",
        triggerCondition: (command, path, success) => command === 'tar -czvf ~/log_backup.tar.gz /var/log' && success === true,
        commandToLearn: 'tar', // tar -c, tar -z
        auroraMessage: "`tar -czvf ~/log_backup.tar.gz /var/log` creates a gzipped archive of `/var/log`. `-c` for create, `-z` for gzip, `-v` for verbose, `-f` for file. Essential for backing up critical log data.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('tar'); }
    },
    { // Phase 56: gzip -d file.gz
        objective: "Decompress `~/log_backup.tar.gz` using `gzip -d`.",
        details: "Use `gzip -d ~/log_backup.tar.gz`. This will create `~/log_backup.tar` and remove the original `.gz` file.",
        triggerCondition: (command, path, success) => command === 'gzip -d ~/log_backup.tar.gz' && success === true,
        commandToLearn: 'gzip -d', // or reinforce gzip
        auroraMessage: "`gzip -d ~/log_backup.tar.gz` is equivalent to `gunzip`. It will decompress the archive, restoring `log_backup.tar`.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('gzip'); } // Reinforce gzip, or add gzip -d specifically
    },
    { // Phase 57: gunzip file.gz
        objective: "Decompress `~/another_archive.gz` (if it existed) using `gunzip`.",
        details: "Use `gunzip ~/another_archive.gz`. This will restore `~/another_archive` and remove the `.gz` file. (This file doesn't exist, so the command will fail, but AURORA will explain its use).",
        triggerCondition: (command, path, success, actualCommand) => actualCommand === 'gunzip ~/another_archive.gz', // Success will be false
        commandToLearn: 'gunzip',
        auroraMessage: "`gunzip another_archive.gz` would decompress it. This command is specific to `.gz` files. The file doesn't exist, but now you know how to use `gunzip`.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('gunzip'); }
    },
    { // Phase 58: tar -xvf archive.tar
        objective: "Extract files from `~/log_backup.tar` into the current directory (assume `~`).",
        details: "Use `tar -xvf ~/log_backup.tar`. `-x` extracts, `-v` verbose, `-f` file. This restores the files from the archive.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => command === 'tar -xvf ~/log_backup.tar' && actualPath === `/home/${gameState.loggedInUser}` && success === true,
        // commandToLearn: 'tar -x', // Reinforce tar
        auroraMessage: "After decompressing, `tar -xvf ~/log_backup.tar` will extract the contents of the tarball into the current directory. This restores the files from the archive.",
        actionOnSuccess: (gameLogic) => { /* gameLogic will handle learning tar if needed based on args */ }
    },
    { // Phase 59: zip archive.zip files_to_zip
        objective: "Create a ZIP archive `~/important_docs.zip` containing all `.txt` files from `~/documents`.",
        details: "Use `zip ~/important_docs.zip ~/documents/*.txt`. (Note: `zip` often requires explicit file listing or recursion flags not fully simulated here).",
        triggerCondition: (command, path, success) => command === 'zip ~/important_docs.zip ~/documents/*.txt' && success === true,
        commandToLearn: 'zip',
        auroraMessage: "`zip ~/important_docs.zip ~/documents/*.txt` will create a zip file. The `*` is a wildcard. Useful for bundling specific file types.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('zip'); }
    },
    { // Phase 60: unzip archive.zip -d destination_folder
        objective: "Extract `~/important_docs.zip` into `~/extracted_documents`.",
        details: "First `mkdir ~/extracted_documents`. Then `cd ~/extracted_documents`. Then use `unzip ~/important_docs.zip`.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => command === 'unzip ~/important_docs.zip' && actualPath === `/home/${gameState.loggedInUser}/extracted_documents` && success === true,
        commandToLearn: 'unzip',
        auroraMessage: "`unzip ~/important_docs.zip -d ~/extracted_documents` extracts the archive into a specific folder. This keeps extracted files organized.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('unzip'); }
    },
    { // Phase 61: sed 's/old/new/g' file.txt
        objective: "In `~/text_processing_data/report_template.txt`, replace all instances of '%%DATE%%' with today's simulated date '2025-05-21'.",
        details: "Use `sed 's/%%DATE%%/2025-05-21/g' ~/text_processing_data/report_template.txt`. The `s` is for substitute. This command shows what would change, without altering the file yet. The `g` flag means global (all occurrences on a line).",
        triggerCondition: (command, path, success) => command.trim() === "sed 's/%%DATE%%/2025-05-21/g' ~/text_processing_data/report_template.txt" && success === true,
        commandToLearn: 'sed',
        auroraMessage: "`sed 's/%%DATE%%/2025-05-21/g' ~/text_processing_data/report_template.txt` will perform a global replacement. The `g` flag means replace all occurrences on each line.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('sed'); }
    },
    { // Phase 62: awk '{print $1}' file.txt
        objective: "From `/etc/passwd`, print only the usernames (the first field, colon-delimited).",
        details: "Use `awk -F: '{print $1}' /etc/passwd`. `-F` sets field separator. `$1` is first field. This helps filter through dense log files.",
        triggerCondition: (command, path, success) => command.trim() === "awk -F: '{print $1}' /etc/passwd" && success === true,
        commandToLearn: 'awk',
        auroraMessage: "`awk -F: '{print $1}' /etc/passwd` extracts and prints the first field (usernames) from the password file. `awk` is excellent for field-based data extraction.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('awk'); }
    },
    { // Phase 63: ping -c 4 external.example.com (Simulated)
        objective: "Simulate pinging an external server 'external.example.com' to check for any off-ship connectivity.",
        details: "Use `ping -c 4 external.example.com`. `-c 4` sends 4 packets. This is a simulation; actual network is offline but this tests the command.",
        triggerCondition: (command, path, success) => command === 'ping -c 4 external.example.com' && success === true,
        commandToLearn: 'ping',
        auroraMessage: "`ping -c 4 external.example.com` would test connectivity to an external site. Given our situation, this is highly unlikely to succeed, but it's a standard diagnostic step.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('ping'); }
    },
    { // Phase 64: traceroute external.example.com (Simulated)
        objective: "Simulate tracing the route to 'external.example.com'.",
        details: "`traceroute external.example.com` shows the network 'hops' to a destination. It can help identify where network communication is breaking down or slowing. (This is a simulation of its output).",
        triggerCondition: (command, path, success) => (command.trim() === 'traceroute external.example.com') && success === true,
        commandToLearn: 'traceroute',
        auroraMessage: "`traceroute external.example.com` would show the network path to an external server. If any part of our external comms array is functional, this might give us clues. (Simulated)",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('traceroute'); }
    },
    { // Phase 65: curl -o local_file.html http://example.com (Simulated)
        objective: "Simulate downloading the homepage of 'http://example.com' and saving it as `~/example_homepage.html`.",
        details: "Use `curl -o ~/example_homepage.html http://example.com`. This will simulate fetching and saving a file. This manifest could contain steps to restore critical systems.",
        triggerCondition: (command, path, success) => command === 'curl -o ~/example_homepage.html http://example.com' && success === true,
        commandToLearn: 'curl',
        auroraMessage: "`curl -o ~/example_homepage.html http://example.com` would attempt to download content from an external website. Unlikely, but if a fragment of the network is up, this could test it.",
        actionOnSuccess: (gameLogic) => { gameLogic.addLearnedCommand('curl'); }
    }
];

window.intermediateCommands = {
    grep: function(args, gameLogic) {
        if (args.length < 2) {
            gameLogic.uiUpdates.displayToTerminal("Usage: grep <pattern> <file>");
            return false;
        }
        const pattern = args[0];
        const fileName = args[1];
        const commandStr = `grep ${pattern} ${fileName}`;
        const fullPath = gameLogic.fileSystemUtils.normalizePath(fileName, gameLogic.gameState.currentPath);

        const content = gameLogic.fileSystemUtils.readFileContent(fullPath);

        if (content === null) {
            gameLogic.uiUpdates.displayToTerminal(`grep: ${fileName}: No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        const lines = content.split('\\n');
        const matchingLines = lines.filter(line => line.includes(pattern));

        if (matchingLines.length > 0) {
            const highlightedOutput = matchingLines.map(line => 
                line.replace(new RegExp(pattern, 'g'), `<span class="highlight-grep">${pattern}</span>`)
            ).join('\\n');
            gameLogic.uiUpdates.displayToTerminal(highlightedOutput);
        }

        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    find: function(args, gameLogic) {
        const commandStr = 'find ' + args.join(' ');
        // Basic simulation for 'find /var -name "*.log"'
        // args will be ['/var', '-name', '*.log'] after parsing
        if (args.length === 3 && args[0] === '/var' && args[1] === '-name' && args[2] === '*.log') {
            gameLogic.uiUpdates.displayToTerminal('/var/log/system.log\n/var/log/auth.log');
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
            return true;
        }
        gameLogic.uiUpdates.displayToTerminal('find: This simulation only supports `find /var -name "*.log"`');
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
        return false;
    },
    head: function(args, gameLogic) {
        if (args.length < 3 || args[0] !== '-n') {
            gameLogic.uiUpdates.displayToTerminal('Usage: head -n <number> <file>');
            return false;
        }
        const numLines = parseInt(args[1], 10);
        const fileName = args[2];
        const commandStr = `head ${args.join(' ')}`;
        const fullPath = gameLogic.fileSystemUtils.normalizePath(fileName, gameLogic.gameState.currentPath);
        const content = gameLogic.fileSystemUtils.readFileContent(fullPath);

        if (content === null) {
            gameLogic.uiUpdates.displayToTerminal(`head: ${fileName}: No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        const lines = content.split('\\n').slice(0, numLines);
        gameLogic.uiUpdates.displayToTerminal(lines.join('\\n'));
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    tail: function(args, gameLogic) {
        if (args.length < 3 || args[0] !== '-n') {
            gameLogic.uiUpdates.displayToTerminal('Usage: tail -n <number> <file>');
            return false;
        }
        const numLines = parseInt(args[1], 10);
        const fileName = args[2];
        const commandStr = `tail ${args.join(' ')}`;
        const fullPath = gameLogic.fileSystemUtils.normalizePath(fileName, gameLogic.gameState.currentPath);
        const content = gameLogic.fileSystemUtils.readFileContent(fullPath);

        if (content === null) {
            gameLogic.uiUpdates.displayToTerminal(`tail: ${fileName}: No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        const lines = content.split('\\n').slice(-numLines);
        gameLogic.uiUpdates.displayToTerminal(lines.join('\\n'));
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    wc: function(args, gameLogic) {
        const fileName = args[0];
        const commandStr = `wc ${fileName || ''}`;
        if (!fileName) {
            gameLogic.uiUpdates.displayToTerminal("Usage: wc <file>");
            return false;
        }
        const fullPath = gameLogic.fileSystemUtils.normalizePath(fileName, gameLogic.gameState.currentPath);
        const content = gameLogic.fileSystemUtils.readFileContent(fullPath);

        if (content === null) {
            gameLogic.uiUpdates.displayToTerminal(`wc: ${fileName}: No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }

        const lines = content.split('\\n').length;
        const words = content.split(/\\s+/).filter(Boolean).length;
        const chars = content.length;
        
        gameLogic.uiUpdates.displayToTerminal(`  ${lines}  ${words}  ${chars} ${fileName}`);
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    sort: function(args, gameLogic) {
        const fileName = args[0];
        const commandStr = `sort ${fileName || ''}`;
        if (!fileName) {
            gameLogic.uiUpdates.displayToTerminal("Usage: sort <file>");
            return false;
        }
        const fullPath = gameLogic.fileSystemUtils.normalizePath(fileName, gameLogic.gameState.currentPath);
        const content = gameLogic.fileSystemUtils.readFileContent(fullPath);

        if (content === null) {
            gameLogic.uiUpdates.displayToTerminal(`sort: ${fileName}: No such file or directory`);
            gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, false);
            return false;
        }
        
        const lines = content.split('\\n').sort();
        gameLogic.uiUpdates.displayToTerminal(lines.join('\\n'));
        gameLogic.checkStoryProgression(commandStr, gameLogic.gameState.currentPath, true);
        return true;
    },
    uniq: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal("uniq simulation: This command would typically remove duplicate adjacent lines from a sorted input.");
        gameLogic.checkStoryProgression('uniq', gameLogic.gameState.currentPath, true);
        return true;
    },
    diff: function(args, gameLogic) {
        if (args.length < 2) {
            gameLogic.uiUpdates.displayToTerminal("Usage: diff <file1> <file2>");
            return false;
        }
        gameLogic.uiUpdates.displayToTerminal(`--- ${args[0]}\n+++ ${args[1]}\n@@ -1,3 +1,3 @@\n- old line simulation\n+ new line simulation`);
        gameLogic.checkStoryProgression(`diff ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    ln: function(args, gameLogic) {
        if (args.length < 3 || args[0] !== '-s') {
            gameLogic.uiUpdates.displayToTerminal("Usage: ln -s <target> <link_name>");
            return false;
        }
        gameLogic.uiUpdates.displayToTerminal(`Symbolic link created (simulated): ${args[2]} -> ${args[1]}`);
        gameLogic.checkStoryProgression(`ln ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    uname: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal('Linux odyssey-7 5.4.0-generic #42-Ubuntu SMP x86_64 GNU/Linux');
        gameLogic.checkStoryProgression('uname -a', gameLogic.gameState.currentPath, true);
        return true;
    },
    whoami: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal(gameLogic.gameState.loggedInUser);
        gameLogic.checkStoryProgression('whoami', gameLogic.gameState.currentPath, true);
        return true;
    },
    groups: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal(`${gameLogic.gameState.loggedInUser} sudo`);
        gameLogic.checkStoryProgression('groups', gameLogic.gameState.currentPath, true);
        return true;
    },
    dmesg: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal('[0.000001] ERROR: Power flux detected in main reactor core.\\n[0.000002] WARNING: Shield integrity at 20%.');
        gameLogic.checkStoryProgression('dmesg', gameLogic.gameState.currentPath, true);
        return true;
    },
    free: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal('              total        used        free\nMem:          16384        8192        8192');
        gameLogic.checkStoryProgression('free -h', gameLogic.gameState.currentPath, true);
        return true;
    },
    df: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal('Filesystem     1K-blocks      Used Available Use% Mounted on\n/dev/sda1      104857600  83886080  20971520  80% /');
        gameLogic.checkStoryProgression('df -h', gameLogic.gameState.currentPath, true);
        return true;
    },
    du: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal('1.2G    .');
        gameLogic.checkStoryProgression('du -sh ~', gameLogic.gameState.currentPath, true);
        return true;
    },
    tree: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal('.\n└── documents\n    └── mission_briefing.txt');
        gameLogic.checkStoryProgression('tree ~/documents', gameLogic.gameState.currentPath, true);
        return true;
    },
    file: function(args, gameLogic) {
        if (!args[0]) {
            gameLogic.uiUpdates.displayToTerminal("Usage: file <filename>");
            return false;
        }
        gameLogic.uiUpdates.displayToTerminal(`${args[0]}: ASCII text`);
        gameLogic.checkStoryProgression(`file ${args[0]}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    cmp: function(args, gameLogic) {
        if (args.length < 2) {
            gameLogic.uiUpdates.displayToTerminal("Usage: cmp <file1> <file2>");
            return false;
        }
        gameLogic.uiUpdates.displayToTerminal(`${args[0]} ${args[1]} differ: byte 1, line 1`);
        gameLogic.checkStoryProgression(`cmp ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    cut: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal(`root\n${gameLogic.gameState.loggedInUser}`);
        gameLogic.checkStoryProgression(`cut ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    tr: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal(`MESSAGE DECODED (SIMULATED)`);
        gameLogic.checkStoryProgression(`tr ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    tee: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal(`(simulated output)\n...output also sent to ${args[0]}`);
        gameLogic.checkStoryProgression(`tee ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    locate: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal(`/etc/system.conf\\n/home/survivor/config/user.conf`);
        gameLogic.checkStoryProgression(`locate ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    chmod: function(args, gameLogic) {
        if (args.length < 2) {
            gameLogic.uiUpdates.displayToTerminal("Usage: chmod <permissions> <file>");
            return false;
        }
        gameLogic.uiUpdates.displayToTerminal(`Permissions of '${args[1]}' changed.`);
        gameLogic.checkStoryProgression(`chmod ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    chown: function(args, gameLogic) {
        if (args.length < 2) {
            gameLogic.uiUpdates.displayToTerminal("Usage: chown <owner> <file>");
            return false;
        }
        gameLogic.uiUpdates.displayToTerminal(`Ownership of '${args[1]}' changed to '${args[0]}'.`);
        gameLogic.checkStoryProgression(`chown ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
        return true;
    },
    sudo: function(args, gameLogic) {
        const commandName = args[0];
        if (window.allCommands[commandName]) {
            gameLogic.uiUpdates.displayToTerminal(`[sudo] Executing ${commandName} with root privileges...`);
            const result = window.allCommands[commandName](args.slice(1), gameLogic);
            gameLogic.checkStoryProgression(`sudo ${args.join(' ')}`, gameLogic.gameState.currentPath, true);
            return result;
        } else {
            gameLogic.uiUpdates.displayToTerminal(`sudo: ${commandName}: command not found`);
            return false;
        }
    },
    umask: function(args, gameLogic) {
        gameLogic.uiUpdates.displayToTerminal('0022');
        gameLogic.checkStoryProgression('umask', gameLogic.gameState.currentPath, true);
        return true;
    },
    split: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('Creating file bin_part_aa...'); gameLogic.checkStoryProgression(`split ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    paste: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('sensor_id,sensor_value'); gameLogic.checkStoryProgression(`paste ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    join: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('id,value,status'); gameLogic.checkStoryProgression(`join ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    tar: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('a /var/log/\na /var/log/system.log'); gameLogic.checkStoryProgression(`tar ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    gzip: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('File compressed (simulated).'); gameLogic.checkStoryProgression(`gzip ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    gunzip: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('File decompressed (simulated).'); gameLogic.checkStoryProgression(`gunzip ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    zip: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('adding: documents/file1.txt (simulated)'); gameLogic.checkStoryProgression(`zip ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    unzip: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('Archive:  important_docs.zip\n  inflating: documents/file1.txt'); gameLogic.checkStoryProgression(`unzip ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    sed: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal('report_template.txt with DATE replaced by 2025-05-21'); gameLogic.checkStoryProgression(`sed ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    awk: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal(`root\n${gameLogic.gameState.loggedInUser}`); gameLogic.checkStoryProgression(`awk ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    ping: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal(`PING external.example.com (93.184.216.34): 56 data bytes\n64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=12.3 ms`); gameLogic.checkStoryProgression(`ping ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    traceroute: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal(`traceroute to external.example.com (93.184.216.34), 30 hops max\n 1  gateway (192.168.1.1)  1.234 ms`); gameLogic.checkStoryProgression(`traceroute ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; },
    curl: function(args, gameLogic) { gameLogic.uiUpdates.displayToTerminal(`Downloaded content saved to ${args[1]} (simulated).`); gameLogic.checkStoryProgression(`curl ${args.join(' ')}`, gameLogic.gameState.currentPath, true); return true; }
}; 