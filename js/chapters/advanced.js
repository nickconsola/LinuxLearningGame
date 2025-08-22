console.log("advanced.js: START - life_support is:", gameState.fileSystem?.['/']?.children?.systems?.children?.life_support);

window.advancedStoryPhases = [
    // --- ADVANCED COMMANDS START HERE ---
    { // Phase 66: ps aux
        objective: "View all currently running processes to understand system activity and identify potential issues.",
        details: "Use `ps aux` to see a snapshot of all running processes. This can help identify unexpected or resource-intensive tasks. `aux` shows all processes with user and detailed info.",
        triggerCondition: (command, path, success) => command.trim() === 'ps aux' && success === true,
        commandToLearn: 'ps',
        auroraMessage: "Understanding active processes is key. `ps aux` lists all running processes with details. We need to check for rogue tasks or system daemons that are not responding.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('ps'); }
    },
    { // Phase 67: top (simulated)
        objective: "Get a dynamic real-time view of running processes (simulated as a snapshot) using `top`.",
        details: "The `top` command provides a continuously updated list of processes. In this simulation, it will show a single snapshot. Type `top` then `q` (simulated) to exit.",
        triggerCondition: (command, path, success) => command.trim() === 'top' && success === true,
        commandToLearn: 'top',
        auroraMessage: "`top` provides a live-updating view of system resource usage. Even a snapshot can reveal which processes are consuming the most CPU or memory. (Type 'q' to exit `top`).",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('top'); gameLogic.addLearnedCommand('q'); }
    },
    { // Phase 68: htop (simulated)
        objective: "Use `htop` for a more user-friendly, interactive view of processes (simulated as a snapshot).",
        details: "`htop` is an interactive process viewer, often preferred over `top`. This simulation will provide a similar snapshot. Type `htop` then `q` (simulated) to exit.",
        triggerCondition: (command, path, success) => command.trim() === 'htop' && success === true,
        commandToLearn: 'htop',
        auroraMessage: "`htop` is an alternative to `top`, often preferred for its clearer interface and easier navigation. Let's see its representation of the current system state. (Type 'q' to exit `htop`).",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('htop'); gameLogic.addLearnedCommand('q'); }
    },
    { // Phase 69: netstat -tulnp
        objective: "Display network connections, listening ports, and associated programs using `netstat -tulnp`.",
        details: "Use `netstat -tulnp` to show TCP and UDP listening ports, along with program names. This helps identify services running on the ship's network interfaces.",
        triggerCondition: (command, path, success) => command.trim() === 'netstat -tulnp' && success === true,
        commandToLearn: 'netstat',
        auroraMessage: "`netstat -tulnp` shows active network connections and listening services. This is critical for diagnosing network issues or finding unauthorized open ports that could be security vulnerabilities.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('netstat'); }
    },
    { // Phase 70: kill PID
        objective: "A data logging process `data_logger` (PID 1056) is malfunctioning. Terminate it using `kill`.",
        details: "First, use `ps aux` to find the PID of `data_logger` (simulated, it's 1056). Then use `kill 1056`. Terminating critical system processes can be dangerous.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            return command.startsWith('kill 1056') && success === true && (!gameState.simulatedProcesses || !gameState.simulatedProcesses.find(p=>p.pid === 1056 && p.command.includes('data_logger')));
        },
        commandToLearn: 'kill',
        auroraMessage: "If a process is causing problems, `kill <PID>` sends a termination signal. Find `data_logger`'s PID with `ps aux` (it's 1056), then use `kill 1056`. Be very careful with this command.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('kill'); }
    },
    { // Phase 71: pkill name
        objective: "The `anomaly_scanner` process (PID 1057) is consuming too many resources. Terminate it by its name using `pkill`.",
        details: "Use `pkill anomaly_scanner`. `pkill` allows you to terminate processes based on their name or other attributes, which can be more convenient than finding the PID.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            return command.trim() === 'pkill anomaly_scanner' && success === true && (!gameState.simulatedProcesses || !gameState.simulatedProcesses.find(p=>p.pid === 1057 && p.command.includes('anomaly_scanner')));
        },
        commandToLearn: 'pkill',
        auroraMessage: "`pkill anomaly_scanner` stops processes by name. This is useful if the PID changes or multiple instances are running. That scanner is using too many cycles.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('pkill'); }
    },
    { // Phase 72: iostat
        objective: "Report CPU and I/O statistics using `iostat` to check for disk bottlenecks or overloaded processors.",
        details: "Use `iostat`. It provides a snapshot of CPU utilization and device I/O. This can indicate if storage systems are under heavy load.",
        triggerCondition: (command, path, success) => command.trim() === 'iostat' && success === true,
        commandToLearn: 'iostat',
        auroraMessage: "`iostat` helps understand CPU load and disk I/O. High disk activity with low CPU usage might indicate a storage bottleneck, slowing down critical operations.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('iostat'); }
    },
    { // Phase 73: vmstat
        objective: "Report virtual memory statistics using `vmstat` to assess memory pressure and swapping activity.",
        details: "Use `vmstat`. It shows information about processes, memory, paging, block IO, traps, and cpu activity. High swap activity could indicate insufficient physical memory for critical tasks.",
        triggerCondition: (command, path, success) => command.trim() === 'vmstat' && success === true,
        commandToLearn: 'vmstat',
        auroraMessage: "`vmstat` provides insights into memory usage, swapping, and process activity. If the system is constantly swapping to disk, it means we're critically low on RAM for essential tasks.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('vmstat'); }
    },
    { // Phase 74: sar (basic)
        objective: "Collect a basic system activity report using `sar` (snapshot). This tool can track various metrics over time.",
        details: "Use `sar`. It can collect and report on various system activities. For this simulation, it provides a general overview.",
        triggerCondition: (command, path, success) => command.trim() === 'sar' && success === true,
        commandToLearn: 'sar',
        auroraMessage: "`sar` (System Activity Reporter) is powerful for historical performance analysis. A simple `sar` command here will give us a snapshot of recent CPU usage and other metrics.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('sar'); }
    },
    { // Phase 75: passwd (simulated)
        objective: "Simulate changing your user password using `passwd` for security best practices.",
        details: "Type `passwd`. You'll be prompted to enter your current and new password. This is a simulation; no actual password changes occur.",
        triggerCondition: (command, path, success) => command.trim() === 'passwd' && success === true,
        commandToLearn: 'passwd',
        auroraMessage: "Changing passwords regularly is good security. `passwd` is the command for this. Though simulated here, it's a fundamental user management task.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('passwd'); }
    },
    { // Phase 76: groupadd new_group
        objective: "Create a new group named `diagnostics_crew` for users authorized to run restricted diagnostic tools.",
        details: "Use `groupadd diagnostics_crew`. This will add a new group to the system (simulated in `/etc/group`).",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            return command.trim() === 'groupadd diagnostics_crew' && success === true && fileSystemUtils.readFileContent('/etc/group', gameState)?.includes('diagnostics_crew:');
        },
        commandToLearn: 'groupadd',
        auroraMessage: "`groupadd diagnostics_crew` creates a new user group. This will allow us to define specific permissions for sensitive system repair tasks.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('groupadd'); }
    },
    { // Phase 77: useradd -g groupname username
        objective: "Create a new user `diag_tech_01` and assign them to the `diagnostics_crew` group.",
        details: "Use `useradd -g diagnostics_crew diag_tech_01`. This (simulated) adds the user and assigns their primary group.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            return command.trim() === 'useradd -g diagnostics_crew diag_tech_01' && success === true && fileSystemUtils.readFileContent('/etc/passwd', gameState)?.includes('diag_tech_01:');
        },
        commandToLearn: 'useradd',
        auroraMessage: "`useradd -g diagnostics_crew diag_tech_01` creates a new user account. This could be for an automated agent or another specialist if we can establish external comms.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('useradd'); }
    },
    { // Phase 78: usermod -aG groupname username
        objective: "Add your current user (`{{USERNAME}}`) to the `diagnostics_crew` group to grant necessary permissions.",
        details: "Use `usermod -aG diagnostics_crew {{USERNAME}}`. The `-aG` appends to supplementary groups. Check `/etc/group` or use `groups {{USERNAME}}` after.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            if (!(command.trim() === `usermod -aG diagnostics_crew ${gameState.loggedInUser}` && success === true)) return false;
            const groupContent = fileSystemUtils.readFileContent('/etc/group', gameState);
            const groupLine = groupContent?.split('\n').find(line => line.startsWith('diagnostics_crew:'));
            return groupLine ? groupLine.includes(`:${gameState.loggedInUser}`) || groupLine.endsWith(gameState.loggedInUser) : false;
        },
        commandToLearn: 'usermod',
        auroraMessage: "`usermod -aG diagnostics_crew {{USERNAME}}` adds your user to an existing group. This will grant you permissions assigned to the `diagnostics_crew`.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('usermod'); }
    },
    { // Phase 79: userdel username
        objective: "The temporary user `diag_tech_01` is no longer needed. Delete this user account.",
        details: "Use `userdel diag_tech_01`. This will remove the user from the system (simulated in `/etc/passwd` and `/etc/group`).",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            return command.trim() === 'userdel diag_tech_01' && success === true && !fileSystemUtils.readFileContent('/etc/passwd', gameState)?.includes('diag_tech_01:');
        },
        commandToLearn: 'userdel',
        auroraMessage: "`userdel diag_tech_01` removes a user account. It's important to remove unneeded accounts to maintain system security.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('userdel'); }
    },
    { // Phase 80: groupdel groupname
        objective: "The `diagnostics_crew` group is being retired as direct user permissions are now preferred. Delete the group.",
        details: "Use `groupdel diagnostics_crew`. This removes the group. Note: In a real system, you might need to remove users from the group first or ensure it's not a primary group for any user.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            return command.trim() === 'groupdel diagnostics_crew' && success === true && !fileSystemUtils.readFileContent('/etc/group', gameState)?.includes('diagnostics_crew:');
        },
        commandToLearn: 'groupdel',
        auroraMessage: "`groupdel diagnostics_crew` removes a group. Ensure no users rely solely on this group for critical access before removing it.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('groupdel'); }
    },
    { // Phase 81: systemctl status service_name
        objective: "Check the status of the ship's 'comms_array.service' using `systemctl status comms_array.service`.",
        details: "`systemctl` is the primary tool for managing system services (daemons). Use `systemctl status comms_array.service` to view its current state. You can also try `start`, `stop`, or `restart` with a service name (e.g., `systemctl restart core_temp_monitor.service`).",
        triggerCondition: (command, path, success) => (command.trim() === 'systemctl status comms_array.service' || command.trim() === 'systemctl status core_temp_monitor.service' || command.startsWith('systemctl restart ') || command.startsWith('systemctl start ') || command.startsWith('systemctl stop ')) && success === true,
        commandToLearn: 'systemctl',
        auroraMessage: "`systemctl` manages system services. `systemctl status comms_array.service` will show if the communications array control service is active, failed, or needs attention.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('systemctl'); }
    },
    { // Phase 82: bg (simulated)
        objective: "Simulate sending a long-running (hypothetical) network scan `network_analyzer.sh` to the background.",
        details: "Imagine you started `long_diag.sh`. To send it to the background after stopping it with Ctrl+Z (not simulated), you'd type `bg`. This simulation acknowledges the command.",
        triggerCondition: (command, path, success) => command.trim() === 'bg' && success === true,
        commandToLearn: 'bg',
        auroraMessage: "If you start a long task like `network_analyzer.sh`, you can stop it with Ctrl+Z (not simulated) then type `bg` to let it continue in the background, freeing your terminal.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('bg'); }
    },
    { // Phase 83: fg (simulated)
        objective: "Simulate bringing the `network_analyzer.sh` job (e.g., job 1) back to the foreground using `fg %1`.",
        details: "If a job is running in the background (e.g., job 1), you can bring it to the foreground with `fg %1` or just `fg`. This simulation acknowledges the command.",
        triggerCondition: (command, path, success) => (command.trim() === 'fg' || command.trim() === 'fg %1') && success === true,
        commandToLearn: 'fg',
        auroraMessage: "If `network_analyzer.sh` was job %1 in the background, `fg %1` (or just `fg` if it's the most recent) would bring it back to your active terminal view.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('fg'); }
    },
    { // Phase 84: jobs
        objective: "List any tasks currently running in the background or stopped in your session using `jobs`.",
        details: "After sending a job to the background with `bg` (or hypothetically stopping one with Ctrl+Z), the `jobs` command will display these tasks and their status. This helps you keep track of ongoing processes you've launched.",
        triggerCondition: (command, path, success) => command.trim() === 'jobs' && success === true,
        commandToLearn: 'jobs',
        auroraMessage: "`jobs` lists processes you've started and managed in the current session (backgrounded/stopped). Useful for keeping track of multiple tasks.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('jobs'); }
    },
    { // Phase 85: mount /dev/sdb1 /mnt/usb_drive
        objective: "The ship's manifest mentions an emergency firmware update on a USB drive, possibly `/dev/sdb1`. Mount it to `/mnt/usb_drive`.",
        details: "Use `mount /dev/sdb1 /mnt/usb_drive`. This will make the contents of the (simulated) USB drive accessible at the `/mnt/usb_drive` path.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            return command.trim() === 'mount /dev/sdb1 /mnt/usb_drive' && success === true && gameState.mountedFileSystems && gameState.mountedFileSystems['/mnt/usb_drive'] === '/dev/sdb1';
        },
        commandToLearn: 'mount',
        auroraMessage: "External devices like USB drives must be mounted to access their files. `mount /dev/sdb1 /mnt/usb_drive` will attempt to make the device `/dev/sdb1` available at `/mnt/usb_drive`.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('mount'); }
    },
    { // Phase 86: umount /mnt/usb_drive
        objective: "Safely unmount the USB drive from `/mnt/usb_drive` (or `/dev/sdb1`) before hypothetical removal.",
        details: "Use `umount /mnt/usb_drive`. This will detach the filesystem, ensuring data integrity. You can also unmount by device: `umount /dev/sdb1`.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState) => {
            return (command.trim() === 'umount /mnt/usb_drive' || command.trim() === 'umount /dev/sdb1') && success === true && gameState.mountedFileSystems && !gameState.mountedFileSystems['/mnt/usb_drive'];
        },
        commandToLearn: 'umount',
        auroraMessage: "Always unmount removable media before disconnecting it. `umount /mnt/usb_drive` (or `umount /dev/sdb1`) ensures all data is written and prevents corruption.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('umount'); }
    },
    { // Phase 87: rsync -av source/ destination/
        objective: "Synchronize (backup) critical logs from `/var/log/critical/` to `{{USER_HOME}}/log_archive/ using `rsync`.",
        details: "Use `rsync -av /var/log/critical/ {{USER_HOME}}/log_archive/`. The `-a` is for archive mode (preserves permissions, etc.), `-v` is for verbose. Trailing slashes matter!",
        triggerCondition: (command, path, success) => command.startsWith('rsync -av /var/log/critical/') && command.includes('{{USER_HOME}}/log_archive/') && success === true,
        commandToLearn: 'rsync',
        auroraMessage: "`rsync -av /var/log/critical/ {{USER_HOME}}/log_archive/` efficiently copies files, useful for backups. `-a` preserves attributes, `-v` shows progress.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('rsync'); }
    },
    { // Phase 88: dd if=/dev/zero of=~/temp_swap.img bs=1M count=128
        objective: "Create a 128MB temporary swap file `~/temp_swap.img` using `dd` if physical memory is failing.",
        details: "Use `dd if=/dev/zero of=~/temp_swap.img bs=1M count=128`. `if` is input file, `of` is output file, `bs` is block size, `count` is number of blocks.",
        triggerCondition: (command, path, success, actualCommand, actualPath, gameState, fileSystemUtils) => {
            return command.trim() === 'dd if=/dev/zero of=~/temp_swap.img bs=1M count=128' && success === true && fileSystemUtils.getFileOrDir('~/temp_swap.img', gameState)?.content.length === (1024 * 1024 * 128);
        },
        commandToLearn: 'dd',
        auroraMessage: "`dd if=/dev/zero of=~/temp_swap.img bs=1M count=128` creates a 128MB file. This could then be formatted as swap space if RAM is failing (actual swap setup is more complex).",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('dd'); }
    },
    { // Phase 89: lsof /var/log/system.log
        objective: "Check which processes, if any, currently have `/var/log/system.log` open using `lsof`.",
        details: "`lsof` (List Open Files) is a powerful utility that shows which files are opened by which processes. This is invaluable for debugging issues where files are locked or unexpectedly in use. (This is a simulation).",
        triggerCondition: (command, path, success) => command.trim() === 'lsof /var/log/system.log' && success === true,
        commandToLearn: 'lsof',
        auroraMessage: "`lsof /var/log/system.log` lists processes that have this file open. This can help debug issues if, for example, a log rotation script is failing because the file is locked.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('lsof'); }
    },
    { // Phase 90: crontab -l
        objective: "List scheduled tasks for your user with `crontab -l` to check for any unusual automated jobs.",
        details: "`crontab` is used to manage cron jobs, which are tasks scheduled to run automatically at specified intervals. `crontab -l` lists the current user's cron jobs. Editing cron jobs (`crontab -e`) is a more complex topic not fully simulated here.",
        triggerCondition: (command, path, success) => command.trim() === 'crontab -l' && success === true,
        commandToLearn: 'crontab',
        auroraMessage: "`crontab -l` displays tasks scheduled to run automatically. It's wise to check this for any unauthorized scripts that might be running periodically and causing issues.",
        actionOnSuccess: () => { gameLogic.addLearnedCommand('crontab'); }
    },
    { // Phase 91: Advanced Systems Analysis
        objective: "You have a comprehensive toolkit. It's time to synthesize your knowledge: analyze logs, check system processes, and examine network configurations to pinpoint the primary cause of the cascading failures. Focus on power, navigation, and life support interdependencies.",
        details: "You've mastered a wide array of Linux commands. The next phase will involve applying this knowledge to repair core ship systems.",
        triggerCondition: () => false, // Will not auto-trigger
        auroraMessage: "The situation is dire, but you are now equipped with advanced diagnostic commands. Examine `/var/log/system.log`, `/var/log/power_conduit_J17.log`, and other system logs. Check running processes with `ps` or `top`. Look at network status with `netstat`. The answers are in the data. The primary failure seems to stem from the power systems, particularly Conduit J17, which then impacted navigation and life support. I am detecting anomalies around the `/srv/email/mailboxes/thorne/` directory that might contain relevant information. Cross-reference logs with emails if you can access them. Good luck, {{USERNAME}}."
    }
];

window.advancedCommands = {
    // Command logic will be extracted and adapted here later.
}; 