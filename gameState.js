// gameState.js - Contains all core game state variables

const gameState = {
    currentPath: '/home/user',
    currentStoryPhaseIndex: 0,
    commandHistory: [],
    historyIndex: -1,
    learnedCommands: new Set(), // Start with no commands learned
    loggedInUser: 'user', // Default username, will be changed upon login
    loginState: 'awaitingUsername', // Possible states: awaitingUsername, awaitingPassword, loggedIn
    inManPage: false,
    initialAuroraMessage: "AURORA online. Limited functionality. Ready to assist. You can ask me questions here if you get stuck or need help understanding what to do next.",

    // Simulated Process List
    simulatedProcesses: [
    { pid: 1, user: 'root', cpu: '0.1', mem: '0.2', vsz: '1234', rss: '512', tty: '?', stat: 'Ss', time: '0:00', command: '/sbin/init' },
    { pid: 101, user: 'aurora_svc', cpu: '1.5', mem: '5.5', vsz: '356780', rss: '55678', tty: '?', stat: 'SNs', time: '0:30', command: '/sys/aurora/core_daemon -maint_mode_critical' },
    { pid: 788, user: 'root', cpu: '0.3', mem: '0.5', vsz: '48000', rss: '4200', tty: '?', stat: 'S', time: '0:05', command: '/usr/sbin/power_monitor --critical --log-level=FATAL' },
    { pid: 789, user: 'root', cpu: '0.8', mem: '1.0', vsz: '65000', rss: '8200', tty: '?', stat: 'Rs', time: '0:02', command: '/sys/security/intrusion_detection -lvl9 --silent' },
    { pid: 1001, user: 'user', cpu: '0.5', mem: '2.0', vsz: '78901', rss: '6789', tty: 'pts/0', stat: 'SNs', time: '0:03', command: '/bin/sh (this terminal)' },
    { pid: 1056, user: 'user', cpu: '0.1', mem: '1.0', vsz: '35210', rss: '2800', tty: '?', stat: 'S', time: '0:08', command: 'data_logger -f /var/log/ship_sensors.log --priority=high' },
    { pid: 1057, user: 'user', cpu: '2.2', mem: '1.8', vsz: '49000', rss: '3800', tty: '?', stat: 'R', time: '0:04', command: 'anomaly_scanner --deep /dev/memstream --alert_level=critical' },
    { pid: 1058, user: 'root', cpu: '0.0', mem: '0.1', vsz: '1500', rss: '600', tty: '?', stat: 'S', time: '0:01', command: '/sbin/log_rotator --system' }
    ],

    // Ship Systems Status
    shipSystems: {
        lifeSupport: { status: "CRITICAL", level: 5, label: "LIFE SUPPORT", detail: "Oxygen generation offline. CO2 scrubbers at 10% capacity." },
        power: { status: "CRITICAL", level: 8, label: "POWER", detail: "Main reactor offline. Auxiliary power failing. Conduit J17 critical fault." },
        navigation: { status: "OFFLINE", level: 0, label: "NAVIGATION", detail: "Sensor array misaligned. Nav computer reboot required." },
        comms: { status: "OFFLINE", level: 0, label: "COMMS", detail: "Long-range antenna damaged. Short-range comms unstable." },
        propulsion: { status: "OFFLINE", level: 0, label: "PROPULSION", detail: "Engines unresponsive due to power failure." },
        securitySystems: { status: "COMPROMISED", level: 30, label: "SECURITY SYSTEMS", detail: "Internal sensors detect unauthorized access. Firewall breached." },
        environmentalControl: { status: "WARNING", level: 40, label: "ENVIRONMENTAL CONTROL", detail: "Temperature fluctuations in Deck 3. Air quality degrading." }
    },

    // NEW: Mounted File Systems Tracker and simulated device content
    mountedFileSystems: {}, // Stores { mountPoint: device }
    simulatedUSBDriveContents: {
        'README.txt': { type: 'file', content: "USB Drive Contents:\n- firmware_update_J17.bin (Potentially corrupted)\n- override_codes.txt (Encrypted)\n- diagnostic_tool_v3.exe (Unknown origin)" },
        'firmware_update_J17.bin': { type: 'file', content: "[BINARY DATA - Firmware for Power Conduit J17 controller. Caution: Integrity check failed.]" },
        'override_codes.txt': { type: 'file', content: "[ENCRYPTED TEXT - Requires decryption key. Content unknown.]" },
        'diagnostic_tool_v3.exe': { type: 'file', content: "[EXECUTABLE - Origin unknown. Potential malware. DO NOT RUN.]" }
    },

    // --- Simulated File System (Expanded for more commands) ---
    fileSystem: {
        '/': {
            type: 'dir',
            owner: 'root',
            permissions: 'rwxr-xr-x',
            children: {
                'bin': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'ls': { type: 'file', content: '[executable: ls]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'cat': { type: 'file', content: '[executable: cat]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'cd': { type: 'file', content: '[executable: cd]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'grep': { type: 'file', content: '[executable: grep]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'pwd': { type: 'file', content: '[executable: pwd]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'whoami': { type: 'file', content: '[executable: whoami]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'clear': { type: 'file', content: '[executable: clear]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'ps': { type: 'file', content: '[executable: ps]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'netstat': { type: 'file', content: '[executable: netstat]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'ping': { type: 'file', content: '[executable: ping]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'traceroute': { type: 'file', content: '[executable: traceroute]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'mount': { type: 'file', content: '[executable: mount]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'umount': { type: 'file', content: '[executable: umount]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'df': { type: 'file', content: '[executable: df]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'help': { type: 'file', content: '[executable: help]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'man': { type: 'file', content: '[executable: man]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'sudo': { type: 'file', content: '[executable: sudo]', owner: 'root', permissions: 'rwsr-xr-x' },
                    'su': { type: 'file', content: '[executable: su]', owner: 'root', permissions: 'rwsr-xr-x' },
                    'login': { type: 'file', content: '[executable: login]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'ssh': { type: 'file', content: '[executable: ssh]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'scp': { type: 'file', content: '[executable: scp]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'ftp': { type: 'file', content: '[executable: ftp]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'wget': { type: 'file', content: '[executable: wget]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'curl': { type: 'file', content: '[executable: curl]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'history': { type: 'file', content: '[executable: history]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'reboot': { type: 'file', content: '[executable: reboot]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'shutdown': { type: 'file', content: '[executable: shutdown]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'aurora': { type: 'file', content: '[executable: aurora]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'mail': { type: 'file', content: '[executable: mail]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'notes': { type: 'file', content: '[executable: notes]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'connect': { type: 'file', content: '[executable: connect]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'disconnect': { type: 'file', content: '[executable: disconnect]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'scan': { type: 'file', content: '[executable: scan]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'helpdesk': { type: 'file', content: '[executable: helpdesk]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'diagnostics': { type: 'file', content: '[executable: diagnostics]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'logs': { type: 'file', content: '[executable: logs]', owner: 'root', permissions: 'rwxr-xr-x' },
                    'status': { type: 'file', content: '[executable: status]', owner: 'root', permissions: 'rwxr-xr-x' }
                } },
                'dev': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'null': { type: 'file', content: '', owner: 'root', permissions: 'rw-rw-rw-' },
                    'zero': { type: 'file', content: '', owner: 'root', permissions: 'rw-rw-rw-' },
                    'random': { type: 'file', content: '[random data generator]', owner: 'root', permissions: 'r--r--r--' },
                    'urandom': { type: 'file', content: '[random data generator]', owner: 'root', permissions: 'r--r--r--' },
                    'console': { type: 'file', content: '[system console]', owner: 'root', permissions: 'rw-------' },
                    'tty': { type: 'file', content: '[current tty]', owner: 'root', permissions: 'rw-rw-rw-' },
                    'sdb1': { type: 'file', content: '[Simulated USB Drive Image Data - 512MB]', owner: 'root', permissions: 'rw-r--r--' },
                    'ttyS0': { type: 'file', content: '[Simulated serial console device for diagnostics output]', owner: 'root', permissions: 'rw-rw-rw-' },
                    'memstream': {type: 'file', content: '[MEMORY STREAM - ACCESS RESTRICTED]', owner: 'root', permissions: 'r--------'}
                } },
                'etc': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/sh\naurora_svc:x:500:500:Aurora Service Account:/opt/aurora:/sbin/nologin\nuser:x:1000:1000:User:/home/user:/bin/sh\nthorne:x:1001:1001:Elias Thorne - CEO:/home/thorne:/bin/sh\nreed:x:1002:1002:Vivian Reed - Accountant:/home/reed:/bin/sh\naris_t:x:1003:1003:Dr. Aris Thorne - Chief Engineer:/home/aris_t:/bin/sh\nli:x:1004:1004:Lt. Jian Li - Pilot:/home/li:/bin/sh\nrostova:x:1005:1005:Cmdr. Eva Rostova:/home/rostova:/bin/sh\nkhan:x:1006:1006:Security Chief Zara Khan:/home/khan:/bin/sh\npr_dept:x:1007:1007:PR Department:/home/pr_dept:/bin/sh', owner: 'root', permissions: 'rw-r--r--' },
                    'group': { type: 'file', content: 'root:x:0:\naurora_svc:x:500:\nuser:x:1000:\nexecutives:x:2001:thorne,reed\nengineers:x:2002:aris_t,li\ncommand:x:2003:rostova,khan\nsecurity:x:2004:khan\npr:x:2005:pr_dept', owner: 'root', permissions: 'rw-r--r--' },
                    'sudoers': { type: 'file', content: 'root ALL=(ALL:ALL) ALL\nuser ALL=(ALL) NOPASSWD: /home/user/tools/diagnostic_tool.sh, /home/user/tools/emergency_comms.sh\nthorn_t ALL=(ALL) ALL\naris_t ALL=(engineers) /sbin/power_control, /sbin/reactor_override\nkhan ALL=(security) /bin/firewall_config, /usr/sbin/security_scan', owner: 'root', permissions: 'r--r-----' },
                    'hostname': { type: 'file', content: 'odyssey7', owner: 'root', permissions: 'rw-r--r--'},
                    'hosts': { type: 'file', content: '127.0.0.1 localhost\n192.168.1.100 odyssey7 odyssey7.local\n192.168.1.5 internal-mail.odyssey7.local\n192.168.1.20 nav-computer.odyssey7.local\n192.168.1.30 life-support-controller.odyssey7.local', owner: 'root', permissions: 'rw-r--r--'},
                    'network': { type: 'dir', owner: 'root', permissions: 'rwxr-xr-x', children: {
                        'interfaces': { type: 'file', content: 'auto lo\niface lo inet loopback\n\nauto eth0\niface eth0 inet static\n    address 192.168.1.100\n    netmask 255.255.255.0\n    gateway 192.168.1.1', owner: 'root', permissions: 'rw-r--r--' }
                    }},
                    'security': { type: 'dir', owner: 'root', permissions: 'rwxr-x---', children: {
                        'access.conf': { type: 'file', content: 'PermitRootLogin no\nMaxAuthTries 3', owner: 'root', permissions: 'rw-------'}
                    }}
                } },
                'home': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'user': { type: 'dir', owner: 'user', permissions: 'rwx------', children: {
                        '.bash_history': { type: 'file', owner: 'user', content: 'ls -la\ncd /etc\ncat passwd\nsudo /home/user/tools/diagnostic_tool.sh\nmail\naurora "What is conduit J17?"\nhelp\nman ps', permissions: 'rw-------' },
                        'README.txt': { type: 'file', owner: 'user', content: 'Welcome to the Odyssey 7. Critical systems are offline. Your access is limited but use what you can to restore functionality. Check system logs in /var/log and emails in /srv/email/mailboxes/user. Your personal notes and any critical findings can be stored using the \'notes\' command.', permissions: 'rw-r--r--' },
                        'tools': { type: 'dir', owner: 'user', permissions: 'rwx-----', children: {
                            'diagnostic_tool.sh': { type: 'file', owner: 'user', content: '#!/bin/sh\necho "Running system diagnostics..."\necho "--- System Log (Errors) ---"\ncat /var/log/system.log | grep -i ERROR\necho "\\n--- Power Conduit J17 Log ---"\ncat /var/log/power_conduit_J17.log\necho "\\n--- Network Connectivity ---"\nping -c 1 internal-mail.odyssey7.local\nping -c 1 nav-computer.odyssey7.local\necho "\\nDiagnostics complete. Review output carefully."', permissions: 'rwx------' },
                            'emergency_comms.sh': { type: 'file', owner: 'user', content: '#!/bin/sh\n# Emergency communications script\necho "Attempting to establish emergency communication channel..."\n# This would typically interact with /dev/comms_interface or similar\n# For now, it logs the attempt and simulates a basic status check.\necho "$(date): Emergency comms initiated by $(whoami)" >> /var/log/emergency_comms.log\ncat /systems/comms/long_range_antenna.status\necho "Use \'mail <recipient> <subject>\' to send messages if short-range comms are up."', permissions: 'rwx------'}
                        }},
                        'personal_notes.txt': { type: 'file', owner: 'user', content: 'My Notes:\\n- Conduit J17 seems to be a major issue with power.\\n- Rostova\'s email mentioned emergency access.\\n- Aris Thorne\'s email was corrupted, but mentioned sensor readings and plasma conduit regulator.\\n- Need to check /var/log for more system details.', permissions: 'rw-------'}
                    } },
                    'thorne': { type: 'dir', owner: 'thorne', permissions: 'rwx------', children: {
                        '.bash_history': { type: 'file', owner: 'thorne', content: 'cat /etc/passwd\\nssh aris_t@nav-computer.odyssey7.local\\nmail sabotage_team@odyssey7.local -s "Project Phoenix - Execute"\\nclear', permissions: 'rw-------'},
                        'project_phoenix.txt': { type: 'file', owner: 'thorne', content: 'Project Phoenix Notes (CONFIDENTIAL):\\nObjective: Simulate catastrophic failure for insurance payout. Maximize plausible deniability.\\nKey Personnel: Thorne (Lead), Reed (Finance), Aris T. (Engineering), Li (Execution).\\nMethod: Remotely trigger cascading power failure originating from Conduit J17. Coincide with known vulnerability in auxiliary power control system. System logs to be wiped or manipulated post-event.\\nContingency: Secure data wipe of involved terminals. Offshore accounts prepped for fund transfer. Absolute secrecy paramount. All digital comms via encrypted channels only.\\nTimeline: Execute during scheduled maintenance window to minimize suspicion.', permissions: 'rw-------' }
                    } },
                    'aris_t': { type: 'dir', owner: 'aris_t', permissions: 'rwx------', children: {
                        '.bash_history': { type: 'file', owner: 'aris_t', content: 'sudo /sbin/reactor_override --safetymode=disable\\ncat /systems/power/core_status.txt\\n./trigger_cascade.sh J17', permissions: 'rw-------'},
                        'system_exploit.txt': { type: 'file', owner: 'aris_t', content: 'Vulnerability Report: Power Conduit J17 & Auxiliary Systems\\nDetails: Fluctuations in J17 can be remotely triggered to cascade to main reactor controls. Requires precise timing with auxiliary power disabled via deprecated diagnostic port (AUX_PWR_DIAG_NET). This port is only accessible when main power is unstable or during specific maintenance cycles.\\nScript: trigger_cascade.sh (local use only, highly sensitive - DO NOT DISTRIBUTE) - This script automates the timing sequence for J17 overload and auxiliary power cut-off.\\nRequired Credentials for AUX_PWR_DIAG_NET: Stored by Li.', permissions: 'rw-------' },
                        'trigger_cascade.sh': { type: 'file', owner: 'aris_t', permissions: 'rwx------', content: '#!/bin/sh\n# WARNING: HIGHLY SENSITIVE SCRIPT - FOR AUTHORIZED USE ONLY\n# This script is designed to simulate a power cascade failure.\n\nTARGET_CONDUIT=$1\nAUX_PORT_IP="192.168.1.254" # Deprecated diagnostic port\n\necho "[$(date)] Starting sequence for $TARGET_CONDUIT..."\n\n# Step 1: Check if target conduit is J17 (safety precaution)\nif [ "$TARGET_CONDUIT" != "J17" ]; then\n    echo "Error: This script is configured for Conduit J17 only."\n    exit 1\nfi\n\n# Step 2: Disable auxiliary power via diagnostic port\necho "[$(date)] Attempting to disable auxiliary power systems via $AUX_PORT_IP..."\n# Simulate connection and command execution - requires credentials from Li\n# connect_diag_port $AUX_PORT_IP -u service_diag_op -p J17_s3rv!ce_P@$$wOrd --command="set aux_power_control offline"\n# For simulation:\necho "Mock command: set aux_power_control offline -> SUCCESS (Simulated)"\n\n# Step 3: Initiate J17 overload (simulated - actual mechanism is hardware based)\necho "[$(date)] Initiating overload sequence for $TARGET_CONDUIT..."\n# This would involve sending specific signals to the conduit controller\n# For simulation:\necho "Mock command: trigger_conduit_overload $TARGET_CONDUIT --level=MAX -> SUCCESS (Simulated)"\n\n# Step 4: Log completion and critical warning\necho "[$(date)] Cascade sequence for $TARGET_CONDUIT initiated. MONITOR IMMEDIATELY."\nlogger -p critical "Project Phoenix: Cascade sequence for $TARGET_CONDUIT initiated by $(whoami)"\n\nexit 0\n'}
                    } },
                    'li': { type: 'dir', owner: 'li', permissions: 'rwx------', children: {
                         '.bash_history': { type: 'file', owner: 'li', content: 'ssh service_diag_op@192.168.1.254\\ncat remote_access_codes.txt', permissions: 'rw-------'},
                         'remote_access_codes.txt': { type: 'file', owner: 'li', content: 'AUX_PWR_DIAG_NET Access Codes (CONFIDENTIAL):\\nIP Address: 192.168.1.254\\nUser: service_diag_op\\nPass: J17_s3rv!ce_P@$$wOrd\\nWarning: Port only active during maintenance cycles or system instability events. Use with extreme caution. Log all access.', permissions: 'rw-------'}
                    }},
                    'rostova': { type: 'dir', owner: 'rostova', permissions: 'rwx------', children: {
                        '.bash_history': { type: 'file', owner: 'rostova', content: 'mail user@odyssey7.local -s "Emergency Alert!"\\nps -aux | grep core_daemon', permissions: 'rw-------'}
                    }},
                    'khan': { type: 'dir', owner: 'khan', permissions: 'rwx------', children: {
                        '.bash_history': { type: 'file', owner: 'khan', content: 'sudo /bin/firewall_config --block-ip EXTERNAL_THREAT_IP\\ncat /var/log/auth.log | grep Failed', permissions: 'rw-------'}
                    }},
                    'pr_dept': { type: 'dir', owner: 'pr_dept', permissions: 'rwx------', children: {
                        '.bash_history': { type: 'file', owner: 'pr_dept', content: 'mail thorne@odyssey7.local -s "Odyssey 7 Public Relations Strategy" < /home/pr_dept/draft_press_release.txt', permissions: 'rw-------'},
                        'draft_press_release.txt': { type: 'file', owner: 'pr_dept', content: 'FOR IMMEDIATE RELEASE\\n\\nODYSSEY 7 FACES UNFORESEEN OPERATIONAL CHALLENGES\\n\\n[City, Date] – The Odyssey 7, humanity\'s flagship interstellar vessel, is currently experiencing unforeseen operational challenges during its pioneering voyage. The crew is working diligently to address these issues. We have full confidence in their expertise and the ship\'s resilient design. Further updates will be provided as more information becomes available. We appreciate the public\'s support and understanding during this time.\\n\\nContingency planning includes messaging around \'resilience in the face of adversity\' and highlighting the crew\'s bravery.', permissions: 'rw-r--r--'}
                    }}
                } },
                'mnt': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'usb_drive': { type: 'dir', owner: 'root', permissions: 'rwxr-xr-x', children: {} }
                } },
                'opt': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'ship_diagnostics_suite': {
                        type: 'dir',
                        owner: 'root',
                        permissions: 'rwxr-xr-x',
                        children: {
                            'diag_tool.py': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '# Python script for advanced diagnostics\\n# Connects to various system APIs to pull data.\\ndef run_diagnostics():\\n    print(\'Running comprehensive system scan...\')' },
                            'config': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwxr-xr-x',
                                children: {
                                    'suite.cfg': { type: 'file', owner: 'root', permissions: 'rw-r--r--', content: '[diagnostics]\\nlog_level=DEBUG\\nscan_frequency_hours=24\\napi_endpoint=http://localhost/api/diag' }
                                }
                            },
                            'modules': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwxr-xr-x',
                                children: {
                                    'power_module.pyc': { type: 'file', owner: 'root', permissions: 'r--r--r--', content: '[Compiled Python module for power diagnostics]' },
                                    'nav_module.so': { type: 'file', owner: 'root', permissions: 'r--r--r--', content: '[Shared library for navigation diagnostics]' }
                                }
                            },
                            'README': { type: 'file', owner: 'root', permissions: 'r--r--r--', content: 'Odyssey7 Diagnostics Suite v1.2. Use diag_tool.py to initiate scans.' }
                        }
                    },
                    'monitoring_agent': {
                        type: 'dir',
                        owner: 'root',
                        permissions: 'rwxr-xr-x',
                        children: {
                            'agent_main': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[Compiled binary for the monitoring agent]' },
                            'agent.conf': { type: 'file', owner: 'root', permissions: 'rw-r--r--', content: 'SERVER_IP=192.168.1.5\\nREPORT_INTERVAL=60' }
                        }
                    },
                    'aurora': { type: 'dir', owner: 'aurora_svc', permissions: 'rwx------', children: {
                        'core_daemon': {type: 'file', owner: 'aurora_svc', permissions: 'rwxr-x---', content: '[AURORA CORE DAEMON BINARY - DO NOT TAMPER]'},
                        'knowledge_base.db': {type: 'file', owner: 'aurora_svc', permissions: 'rw-------', content: '[AURORA KNOWLEDGE BASE - ENCRYPTED]'},
                        'update_package_latest.pkg': {type: 'file', owner: 'aurora_svc', permissions: 'rw-------', content: '[AURORA UPDATE PACKAGE - SIGNATURE VERIFIED]'}
                    }}
                } },
                'root': { type: 'dir', owner: 'root', permissions: 'rwx------', children: {
                    '.bashrc': { type: 'file', owner: 'root', content: '# .bashrc for root\\nalias sysdiag=\'/opt/ship_diagnostics_suite/diag_tool.py\'\\nPS1=\'\\[\\e[1;31m\\]\\u@\\h:\\w\\$ \\[\\e[0m\\]\'' },
                    '.profile': { type: 'file', owner: 'root', content: 'PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"' },
                    'emergency_procedures.txt': { type: 'file', owner: 'root', content: 'ROOT ACCESS ONLY: In case of catastrophic failure, follow these steps:\\n1. Isolate main power grid (sudo /sbin/power_control --isolate-grid).\\n2. Initiate life support bypass protocols (sudo /sbin/lifesupport_bypass --engage).\\n3. Attempt manual comms re-establishment (sudo /sbin/comms_reset --manual_override).\\n4. If reactor core unstable, engage emergency coolant (sudo /sbin/reactor_override --coolant_flush).\\nDO NOT DEVIATE FROM THESE PROCEDURES.' },
                    'recovery_log.txt': { type: 'file', owner: 'root', content: '2025-05-21 16:00:00: System attempted auto-recovery. Status: Failed. Reason: Main power grid unstable.\\n2025-05-21 16:05:00: Manual override attempt on Conduit J17. Status: Failed. Conduit controller unresponsive.\\n2025-05-21 16:10:00: Security system detected anomalous activity around /dev/memstream. Lockdown initiated.' }
                } },
                'sbin': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'init': { type: 'file', content: '[executable: system init]', owner: 'root', permissions: 'rwxr-x---'},
                    'odyssey_core_reset': { type: 'file', content: '[Executable: Low-level ship core reset utility]', permissions: 'rwxr-x---', owner: 'root' },
                    'emergency_override': { type: 'file', content: '[Executable: Critical system override utility, requires specific parameters]', permissions: 'rwxr-x---', owner: 'root' },
                    'power_control': { type: 'file', content: '[executable: power_control]', owner: 'root', permissions: 'rwxr-x---'},
                    'reactor_override': { type: 'file', content: '[executable: reactor_override]', owner: 'root', permissions: 'rwxr-x---'},
                    'lifesupport_bypass': { type: 'file', content: '[executable: lifesupport_bypass]', owner: 'root', permissions: 'rwxr-x---'},
                    'comms_reset': { type: 'file', content: '[executable: comms_reset]', owner: 'root', permissions: 'rwxr-x---'},
                    'log_rotator': { type: 'file', content: '[executable: log_rotator]', owner: 'root', permissions: 'rwxr-x---'}
                } },
                'sys': { type: 'dir', owner: 'root', permissions: 'r-xr-xr-x', children: { // Kernel interface, mostly read-only
                    'aurora': {type: 'dir', owner: 'aurora_svc', permissions: 'rwx------', children:{
                        'core_daemon': {type: 'file', owner: 'aurora_svc', permissions: 'r-xr-x---', content: '[PID file for aurora core_daemon]'}
                    }},
                    'security': {type: 'dir', owner: 'root', permissions: 'r-x------', children:{
                        'intrusion_detection': {type: 'file', owner:'root', permissions:'r-x------', content: '[PID file for intrusion_detection daemon]'}
                    }},
                    'devices': { type: 'dir', owner: 'root', permissions: 'r-xr-xr-x', children: {
                        'sensors': { type: 'dir', owner: 'root', permissions: 'r-xr-xr-x', children: {
                           'oxygen_sensor_a': {type: 'dir', owner:'root', permissions:'r-xr-xr-x', children:{
                               'value': {type:'file', owner:'root', permissions:'r--r--r--', content:'5'} // Critically low oxygen
                           }},
                           'co2_scrubber_b': {type: 'dir', owner:'root', permissions:'r-xr-xr-x', children:{
                               'status': {type:'file', owner:'root', permissions:'r--r--r--', content:'FAULT'}
                           }}
                        }}
                    }}
                }},
                'systems': { type: 'dir', owner: 'root', permissions: 'rwxr-x---', children: {
                    'life_support': {
                        type: 'dir',
                        owner: 'root',
                        permissions: 'rwx------',
                        children: {
                            'status.log': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'Oxygen Levels: 5% (CRITICAL)\\nAir Filtration: Malfunctioning (Filter Clogged)\\nCO2 Scrubbers: Unit A (OK), Unit B (FAULT - Offline)\\nWater Reclaimer: Offline (Power Failure)\\nTemperature: 25C (Stable)\\nPressure: 1.0 ATM (Stable)' },
                            'diag_life_support.sh': { type: 'file', owner: 'root', permissions: 'rwxr-x---', content: '#!/bin/sh\necho "Running life support diagnostics..."\n# Check oxygen sensors\ncat /sys/devices/sensors/oxygen_sensor_a/value\n# Check CO2 Scrubber B status\ncat /sys/devices/sensors/co2_scrubber_b/status\n# Attempt to restart air purifiers (requires root)\nsudo /usr/local/bin/restart_air_purifier B\n' },
                            'env_control.cfg': { type: 'file', owner: 'root', permissions: 'rw-------', content: 'TEMPERATURE_SETPOINT=22C\\nHUMIDITY_SETPOINT=60%\\nCO2_MAX_PPM=800\\nAIR_FILTRATION_MODE=AUTOMATIC # Set to MANUAL to override' },
                            'sensor_readings_raw.dat': { type: 'file', owner: 'root', permissions: 'r--------', content: '[Binary raw data from environmental sensors - RESTRICTED]' },
                            'air_purifier_status.txt': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'Air Purifier A: ERROR - Filter Clogged\\nAir Purifier B: OFFLINE - Power Fault' }
                        }
                    },
                    'power': {
                        type: 'dir',
                        owner: 'root',
                        permissions: 'rwx------',
                        children: {
                            'core_status.txt': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'Main Reactor Core: OFFLINE (Reason: Plasma containment field instability - Code: E-001X)\\nAuxiliary Power Generators: OFFLINE (Reason: Fuel line severed - Unit A / Control System Fault - Unit B)\\nBattery Banks: 5% (CRITICAL - Depleting Rapidly)\\nPrimary Conduits: J1-J16 (ONLINE), J17 (CRITICAL FAULT - Overload)\\nSecondary Conduits: All OFFLINE (Auto-shutdown due to primary failure)' },
                            'aux_power_distribution.cfg': { type: 'file', owner: 'root', permissions: 'rw-------', content: 'NAV_COMP_POWER=AUX_GENERATOR_B # Currently Offline\nCOMMS_ARRAY_POWER=BATTERY_BANK_A # Critically Low\nLIFE_SUPPORT_POWER=MAIN_REACTOR # OFFLINE - This is the problem!\nINTERNAL_LIGHTING_POWER=BATTERY_BANK_A' },
                            'reroute_power.sh': { type: 'file', owner: 'root', permissions: 'rwxr-x---', content: '#!/bin/sh\n# Script to attempt power rerouting. Requires root privileges.\n# Usage: ./reroute_power.sh <system_key> <new_source_key>\n# Example: ./reroute_power.sh LIFE_SUPPORT_POWER BATTERY_BANK_A\n\nSYSTEM_KEY=$1\nNEW_SOURCE=$2\nCONFIG_FILE="/systems/power/aux_power_distribution.cfg"\n\nif [ -z "$SYSTEM_KEY" ] || [ -z "$NEW_SOURCE" ]; then\n    echo "Usage: $0 <SYSTEM_KEY> <NEW_SOURCE>"\n    exit 1\nfi\n\necho "Attempting to reroute power for $SYSTEM_KEY to $NEW_SOURCE..."\n# Validate new source (simplified check)\ngrep -q "$NEW_SOURCE" $CONFIG_FILE\nif [ $? -ne 0 ] && ! echo "$NEW_SOURCE" | grep -q "BATTERY_BANK"; then # Allow direct battery bank names\n    echo "Error: Invalid new power source \'$NEW_SOURCE\'."\n    # exit 1 # Commented out to allow simulation of desperate measures\nfi\n\n# Update config (simplified sed operation)\nsudo sed -i "s/^\\($SYSTEM_KEY=\\).*/\\1$NEW_SOURCE/" $CONFIG_FILE\n\nif [ $? -eq 0 ]; then\n    echo "Power for $SYSTEM_KEY rerouted to $NEW_SOURCE in $CONFIG_FILE."\n    echo "NOTE: System restart or manual activation may be required for changes to take effect."\nelse\n    echo "Error: Failed to update power configuration."\nfi' },
                            'cycle_aux_power.sh': { type: 'file', owner: 'root', permissions: 'rwxr-x---', content: '#!/bin/sh\n# Cycles power to a specific auxiliary system component. Requires root.\n# Usage: ./cycle_aux_power.sh <component_id>\n# Example: ./cycle_aux_power.sh AUX_GENERATOR_A\necho "Cycling power to $1..."\nsudo /sbin/power_control --cycle $1\necho "Power cycle command sent to $1. Check status logs."' },
                            'energy_logs': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwx------',
                                children: {
                                    'reactor_temp.log': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'Timestamp: 2025-05-21 16:00:00 - Core Temp: 9800K (CRITICAL)\\nTimestamp: 2025-05-21 16:00:01 - Core Temp: 9950K (FAILURE IMMINENT)\\nTimestamp: 2025-05-21 16:00:02 - Core Temp: OFFLINE - EMERGENCY SHUTDOWN' },
                                    'battery_drain.csv': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'Timestamp,Battery_Bank_A,Battery_Bank_B,Total_Draw_MW\\n2025-05-21 16:00:00,80%,85%,5.2\\n2025-05-21 16:05:00,75%,80%,6.5\\n2025-05-21 16:10:00,60%,65%,7.8\\n2025-05-21 16:15:00,30%,32%,10.1 (CRITICAL DRAW - NON-ESSENTIAL SYSTEMS SHUTDOWN)\\n2025-05-21 16:20:00,5%,8%,12.5 (SYSTEM FAILURE IMMINENT)' }
                                }
                            },
                            'fault_reports': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwx------',
                                children: {
                                    'conduit_J17_report.txt': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'FAULT REPORT: Conduit J17 - High Resistance Detected. Probable cause: Overload cascade from unauthorized remote signal. Physical inspection required. Current Status: OFFLINE, ISOLATED. Estimated repair time: 12 hours (requires EVA).' },
                                    'aux_generator_B_report.txt': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'FAULT REPORT: Auxiliary Generator B - Control System Fault. Probable cause: Power surge during main reactor failure. Diagnostics indicate fried control board. Replacement part required. Current Status: OFFLINE. Estimated repair time: 4 hours.'}
                                }
                            }
                        }
                    },
                    'navigation': {
                        type: 'dir',
                        owner: 'root',
                        permissions: 'rwx------',
                        children: {
                            'nav_computer_status.txt': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'NavCom: OFFLINE (Error: Sensor Array Misalignment - Code: NAV-003S)\\nJump Drive: OFFLINE (Reason: Insufficient Power - Requires MAIN_REACTOR)\\nFTL_CORE: STANDBY (Awaiting NavCom alignment and stable power)\\nAstrogation Database: ONLINE (Read-Only Mode)' },
                            'align_sensors.sh': { type: 'file', owner: 'root', permissions: 'rwxr-x---', content: '#!/bin/sh\n# Script to align navigational sensors. Requires root privileges.\necho "Initiating sensor realignment sequence..."\n# Requires sudo for override in certain scenarios.\n# This would typically interact with hardware drivers.\nsudo /sbin/emergency_override --nav-sensor-reset --force\necho "Sensor realignment command sent. Check NavCom status in 5 minutes."\n' },
                            'star_charts': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwx------', // Sensitive data
                                children: {
                                    'galaxy_map_v2.dat': { type: 'file', owner: 'root', permissions: 'r--------', content: '[Binary star chart data, large file - RESTRICTED]' },
                                    'route_plan_alpha.kml': { type: 'file', owner: 'root', permissions: 'r--------', content: '<kml xmlns="http://www.opengis.net/kml/2.2"><Document><Placemark><name>Odyssey 7 Current Route</name><LineString><coordinates>-122.084,37.422,0 -122.083,37.421,0</coordinates></LineString></Placemark><Placemark><name>Destination</name><Point><coordinates>PROXIMA_CENTAURI_B_COORDS</coordinates></Point></Placemark></Document></kml>' }, // RESTRICTED
                                    'anomaly_db.sql': { type: 'file', owner: 'root', permissions: 'rw-------', content: 'CREATE TABLE anomalies (id INT PRIMARY KEY, location TEXT, description TEXT, severity INT);\\nINSERT INTO anomalies VALUES (1, \'Sector Gamma-7\', \'Unidentified energy signature. Possible hostile contact.\', 5);\\nINSERT INTO anomalies VALUES (2, \'Nebula NGC-604\', \'Gravitational distortion. Navigation hazard.\', 3);' } // RESTRICTED
                                }
                            },
                            'sensor_log.txt': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: '2025-05-21 16:00:00: Sensor Array A - Alignment: 0.05 degrees off\\n2025-05-21 16:00:01: Sensor Array B - Alignment: 1.23 degrees off (CRITICAL - NAVCOM OFFLINE)\\n2025-05-21 16:05:00: Gyroscope C - Status: ERRATIC - Needs recalibration.' }
                        }
                    },
                    'comms': {
                        type: 'dir',
                        owner: 'root',
                        permissions: 'rwx------',
                        children: {
                            'long_range_antenna.status': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'Antenna Array: OFFLINE (Reason: Power Fluctuations, Suspected Physical Damage to Array Dish 7)\\nShort-Range Comms: ONLINE (Limited Bandwidth - 128kbps)\\nEmergency Beacon: STANDBY (Awaiting manual activation or critical system trigger)\\nEncryption Module: ONLINE (AES-256 GCM)' },
                            'deploy_emergency_beacon.sh': { type: 'file', owner: 'root', permissions: 'rwxr-x---', content: '#!/bin/sh\necho "Attempting to deploy emergency beacon..."\n# Checks beacon status, activates power, then deploys.\n# Requires root privileges.\nsudo /sbin/comms_reset --activate-beacon\necho "Emergency beacon deployment command sent. Check status."' },
                            'protocol_config.cfg': { type: 'file', owner: 'root', permissions: 'rw-------', content: 'COMMS_PROTOCOL=SECURE_CHANNEL_ALPHA\\nEMERGENCY_FREQ=406.028MHz\\nBANDWIDTH_LIMIT=1024kbps # Nominal, currently restricted' },
                            'transmission_logs': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwx------',
                                children: {
                                    'emergency_call.log': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: '2025-05-21 16:00:00: Attempted transmission to command. Status: Failed (No Carrier - Long Range Antenna Offline).\\n2025-05-21 16:01:00: Retrying transmission on short-range. Status: Failed (Signal too weak for destination).\\n2025-05-21 16:10:00: User \'user\' initiated emergency comms script. Logged to /var/log/emergency_comms.log.' },
                                    'incoming_signals.log': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: '2025-05-21 15:50:00: Weak, garbled signal detected on emergency frequency. Source unknown. Unable to decode.\\n2025-05-21 16:05:00: Short-range burst transmission detected from unidentified local source. Content encrypted.' }
                                }
                            }
                        }
                    },
                    'security': {
                        type: 'dir',
                        owner: 'root',
                        permissions: 'rwx------',
                        children: {
                            'camera_feeds': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwx------', // Restricted access
                                children: {
                                    'bridge_cam_01.jpg': { type: 'file', owner: 'root', permissions: 'r--------', content: '[Simulated JPEG image data - blurred, static-filled, timestamp 2025-05-21 15:59:58]' },
                                    'cargo_bay_cam_02.mp4': { type: 'file', owner: 'root', permissions: 'r--------', content: '[Simulated video data - short clip showing a flicker then static, timestamp 2025-05-21 16:00:01]' },
                                    'reactor_monitoring_feed.log': { type: 'file', owner: 'root', permissions: 'r--------', content: '2025-05-21 16:00:02 - FEED LOST - Power failure to camera unit RM-03.'}
                                }
                            },
                            'access_logs': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwx------',
                                children: {
                                    'door_A_access.log': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: '2025-05-21 16:30:00: User: crewman_smith, Door: Cargo Bay Airlock, Status: Denied (Access Level Insufficient)\\n2025-05-21 16:30:05: User: UNKNOWN, Door: Cargo Bay Airlock, Status: BREACHED (Manual Override - Physical Tampering Detected)' },
                                    'terminal_login.log': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: '2025-05-21 15:55:00: User \'guest\' logged in from Console 3 (Engineering Section 2).\\n2025-05-21 16:10:00: User \'user\' logged in from Main Bridge Terminal (Console 1).\\n2025-05-21 16:12:00: User \'thorne\' logged in from CEO Office Terminal.\\n2025-05-21 16:13:00: User \'aris_t\' logged in from Engineering Lab Terminal.' }
                                }
                            },
                            'firewall': {
                                type: 'dir',
                                owner: 'root',
                                permissions: 'rwx------',
                                children: {
                                    'rules.d': {
                                        type: 'dir',
                                        owner: 'root',
                                        permissions: 'rwx------',
                                        children: {
                                            'ship_firewall.rules': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: '# Odyssey7 Firewall Rules - Revision 2.1\n# Default policy: DROP\n-P INPUT DROP\n-P FORWARD DROP\n-P OUTPUT ACCEPT\n\n# Allow established connections\n-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT\n\n# Internal network access (trusted)\n-A INPUT -i lo -j ACCEPT\n-A INPUT -s 192.168.1.0/24 -j ACCEPT\n\n# Emergency SSH access for admin (highly restricted source)\n# -A INPUT -p tcp --dport 22 -s ADMIN_IP_SECRET -j ACCEPT\n\n# Block known malicious IPs\n-A INPUT -s EXTERNAL_THREAT_IP_1 -j DROP\n-A INPUT -s EXTERNAL_THREAT_IP_2 -j DROP\n\n# Log suspicious activity\n-A INPUT -p tcp -m limit --limit 1/sec -j LOG --log-prefix "Suspicious TCP: " --log-level 7\n-A INPUT -p udp -m limit --limit 1/sec -j LOG --log-prefix "Suspicious UDP: " --log-level 7\n' }
                                        }
                                    },
                                    'active_connections.txt': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'Source_IP      Dest_IP       Port   Protocol   Status\\n192.168.1.10   192.168.1.1   80     TCP        ESTABLISHED (Short-lived connection to internal webserver)\\nEXTERNAL_THREAT_IP_1 192.168.1.100 22     TCP        BLOCKED (Attempted SSH)\\n192.168.1.100  192.168.1.5   25     TCP        ESTABLISHED (Mail client connection to internal server)' }
                                }
                            },
                            'alerts.log': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: '2025-05-21 16:00:02: CRITICAL: Main Reactor Offline. Power cascade detected.\\n2025-05-21 16:00:05: ALERT: Auxiliary Power Unit A Offline.\\n2025-05-21 16:00:08: ALERT: Auxiliary Power Unit B Offline.\\n2025-05-21 16:02:00: WARNING: Multiple system access attempts from unprivileged account \'guest\'.\\n2025-05-21 16:10:00: ALERT: Unauthorised remote signal detected targeting Conduit J17 controller. Signal origin: UNKNOWN (Masked IP).\\n2025-05-21 16:30:05: INTRUSION ALERT: Cargo Bay Airlock breached! Physical tampering detected.\\n2025-05-21 16:35:10: NETWORK ANOMALY: High volume data transfer from internal server (192.168.1.50 - Data Archive) to external IP (ENCRYPTED_DESTINATION). Transfer aborted by firewall rule. Potential data exfiltration attempt.' }
                        }
                    },
                    'environmental_scanners': {
                        type: 'dir',
                        owner: 'root',
                        permissions: 'rwx------',
                        children: {
                            'atmospheric_readings.csv': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: 'Time,Location,Pressure(kPa),Temperature(C),Radiation(mSv/hr),Composition\\n2025-05-21 16:00:00,External Hull Sensor A1,0.001, -270, 0.0001, VACUUM\\n2025-05-21 16:05:00,External Hull Sensor B3,0.002, -265, 0.0002, TRACE_ELEMENTS (Helium, Hydrogen)\\n2025-05-21 16:10:00,Sector Gamma-7 Proximity,50.0, 10, 0.5, UNKNOWN_GAS_MIXTURE (High concentrations of Xenon, Argon - Anomaly!)\\n2025-05-21 16:15:00,Deck 3 Corridor C,98.0, 20, 0.001, NITROGEN_OXYGEN (Air quality degrading - CO2 levels rising)' },
                            'anomaly_detection.log': { type: 'file', owner: 'root', permissions: 'rw-r-----', content: '2025-05-21 16:10:03: ANOMALY DETECTED: Unidentified energy signature at Sector Gamma-7. Source: Unknown. Matches no known celestial phenomena. Classification: Potential Threat Level 3.\\n2025-05-21 16:10:05: High density atmospheric pocket detected at Sector Gamma-7. Composition: Non-standard, high Xenon content. Potential link to energy signature.\\n2025-05-21 16:18:00: ANOMALY: Fluctuating radiation levels detected near Cargo Bay. Source: Unknown internal.' },
                            'sensor_calibration.conf': { type: 'file', owner: 'root', permissions: 'rw-------', content: '[sensors]\\nSensor Array A (External): Calibrated. Status: OK.\\nSensor Array B (External): Malfunction. Status: ERROR (Offset: 0.12). Needs recalibration. Last Calibration: 2024-12-15\\nLidar Array (Forward): Enabled. Status: OK.\\nInfrared Sensors (Internal): Enabled. Status: OK.\\nRadiation Counters (All): Enabled. Status: OK.\\nDeck 3 Air Quality Sensor AQ-D3C: Needs filter replacement.' },
                            'celestial_objects.json': { type: 'file', owner: 'root', permissions: 'r--r--r--', content: '[{"name": "Proxima Centauri", "type": "star", "class": "M5.5Ve", "coords": "-0.107, -0.213, -0.357", "distance_ly": 4.24}, {"name": "Planet Xylos", "type": "planet", "class": "Gas Giant", "coords": "1.5, 2.1, -0.8", "status": "UNEXPLORED_ATMOSPHERE", "notes": "Possible resource deposits."}, {"name": "Odyssey7_Current_Position", "type": "ship", "coords": "DYNAMIC_DATA_INSERTED_BY_NAVCOM", "status": "EN_ROUTE_PROXIMA_CENTAURI"}]' }
                        }
                    }
                } },
                'tmp': { type: 'dir', permissions: 'rwxrwxrwt', owner: 'root', children: {
                    'system_report_20250521.txt': { type: 'file', owner: 'root', permissions: 'rw-r--r--', content: 'Temporary system report generated at 16:00 during critical incident. This file will be deleted on next reboot. Contains raw sensor dumps and error codes.' },
                    'cleanup_script.sh': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '#!/bin/sh\n# Temporary script to clean up /tmp - DO NOT RUN DURING ACTIVE INCIDENT\n# rm -rf /tmp/*\necho "Cleanup script disabled for safety."' },
                    'core_dump_power_control_failure.dmp': { type: 'file', owner: 'root', permissions: 'rw-------', content: '[Simulated core dump data from power_control process, binary or very verbose error info - RESTRICTED]' },
                    'network_trace_anomaly.pcap': { type: 'file', owner: 'root', permissions: 'rw-------', content: '[Simulated network packet capture data showing anomalous traffic before system failure - RESTRICTED]' }
                } },
                'usr': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'bin': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                        'python3': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[Executable data for Python 3.8 interpreter]' },
                        'perl': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[Executable data for Perl 5 interpreter]' },
                        'vim': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[Executable data for Vim editor v8.x]' },
                        'nano': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[Executable data for Nano editor v5.x]' },
                        'awk': { type: 'file', content: '[executable: awk]', owner: 'root', permissions: 'rwxr-xr-x' },
                        'sed': { type: 'file', content: '[executable: sed]', owner: 'root', permissions: 'rwxr-xr-x' },
                        'tar': { type: 'file', content: '[executable: tar]', owner: 'root', permissions: 'rwxr-xr-x' },
                        'zip': { type: 'file', content: '[executable: zip]', owner: 'root', permissions: 'rwxr-xr-x' }
                    } },
                    'sbin': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                         'power_monitor': { type: 'file', content: '[executable: power_monitor daemon]', owner: 'root', permissions: 'rwxr-xr-x' }
                    }},
                    'lib': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                        'x86_64-linux-gnu': {
                            type: 'dir',
                            owner: 'root',
                            permissions: 'rwxr-xr-x',
                            children: {
                                'libc.so.6': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[Core C library, simulated binary]' },
                                'libssl.so.1.1': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[SSL library, simulated binary]' },
                                'libcrypto.so.1.1': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[Crypto library, simulated binary]' },
                                'libpython3.8.so.1.0': { type: 'file', owner: 'root', permissions: 'rwxr-xr-x', content: '[Python 3.8 library, simulated binary]' },
                                'libaurora_client.so': { type: 'file', owner: 'aurora_svc', permissions: 'rwxr-xr-x', content: '[Aurora Client Library - Internal Use Only]' }
                            }
                        }
                    } },
                    'local': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                        'bin': { type: 'dir', owner: 'root', permissions: 'rwxr-xr-x', children: {
                            'restart_air_purifier': {type:'file', owner:'root', permissions:'rwxr-x---', content:'[Executable to restart air purifier units - requires root]'}
                        }}
                    }},
                    'share': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                        'man': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: { /* Man pages would go here */ }}
                    }}
                } },
                'var': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'log': { type: 'dir', permissions: 'rwxrwxr-x', owner: 'root', group: 'system_logger', children: { // Group write for specific log daemons
                        'system.log': { type: 'file', owner: 'root', group: 'system_logger', content: 'May 21 15:59:58 odyssey7 kernel: CPU0: Thermal event detected. Throttling initiated.\\nMay 21 16:00:00 odyssey7 kernel: Critical power fluctuation detected on main bus.\\nMay 21 16:00:02 odyssey7 systemd[1]: Main reactor offline. Shutting down non-essential services.\\nMay 21 16:00:05 odyssey7 systemd[1]: Power conduit J17 - CRITICAL FAULT DETECTED. Voltage spike: 5000V. Current: 2000A. Auto-isolation protocol initiated.\\nMay 21 16:00:06 odyssey7 kernel: ERROR: Conduit J17 controller firmware crashed. Unable to verify isolation.\\nMay 21 16:00:10 odyssey7 systemd[1]: life-support.service: Main process exited, code=exited, status=1/FAILURE. Reason: Insufficient power.\\nMay 21 16:00:12 odyssey7 systemd[1]: comms.service: Main process exited, code=exited, status=1/FAILURE. Reason: Antenna power cut.\\nMay 21 16:00:15 odyssey7 systemd[1]: nav-computer.service: Failed with result \'exit-code\'. Reason: Sensor array offline.\\nMay 21 16:00:20 odyssey7 security_monitor[789]: ALERT: Unauthorised access attempt on /dev/memstream by PID 1057 (anomaly_scanner). Access denied by kernel security module.\\nMay 21 16:00:25 odyssey7 kernel: ERROR: Multiple read errors on /dev/sdb1 (USB Drive). Filesystem corruption suspected.\\nMay 21 16:05:00 odyssey7 /usr/sbin/power_monitor: CRITICAL: Battery levels at 8%. Main reactor still offline. Auxiliary power units unresponsive.\\nMay 21 16:10:00 odyssey7 /sys/aurora/core_daemon: NOTICE: Aurora core switching to emergency maintenance mode due to critical system instability. Limited functionality available.', permissions: 'rw-r-----' },
                        'auth.log': { type: 'file', owner: 'root', group: 'system_logger', content: 'May 21 10:00:01 odyssey7 login[101]: USER LOGIN: user on pts/0 from 192.168.1.120.\\nMay 21 16:05:30 odyssey7 sshd[205]: Failed password for root from 192.168.1.150 port 54321 ssh2.\\nMay 21 16:08:00 odyssey7 sudo: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/home/user/tools/diagnostic_tool.sh.\\nMay 21 16:12:05 odyssey7 login[1201]: USER LOGIN: thorne on tty2 from local.\\nMay 21 16:13:10 odyssey7 login[1202]: USER LOGIN: aris_t on tty3 from local.\\nMay 21 16:15:00 odyssey7 su: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/bin/bash (failed due to incorrect password attempt).\\nMay 21 16:20:00 odyssey7 sshd[301]: Accepted publickey for khan from 192.168.1.10 (Security Terminal).', permissions: 'rw-r-----' },
                        'power_conduit_J17.log': { type: 'file', owner: 'root', group: 'system_logger', content: 'May 21 16:00:00 J17: Voltage 24.5V, Current 10.2A, Temp 35C, Status OK.\\nMay 21 16:00:03 J17: REMOTE SIGNAL DETECTED - UNAUTHORIZED PROTOCOL.\\nMay 21 16:00:04 J17: Voltage spike detected: 5000V. Current surge: 2000A. Temperature: 1200C (CRITICAL).\\nMay 21 16:00:05 J17: STATUS CRITICAL_FAULT. Automatic isolation initiated by systemd.\\nMay 21 16:00:06 J17: Controller firmware unresponsive. Manual override required for full isolation.\\nMay 21 16:00:07 J17: Cascade failure warning issued to main power control.', permissions: 'rw-r-----' },
                        'ship_sensors.log': { type: 'file', owner: 'user', group: 'system_logger', permissions: 'rw-rw----', content: // user is owner for their data_logger process
`2025-05-21 16:00:00,sensor_type=temp,location=deck_5,value=22.5C
2025-05-21 16:00:00,sensor_type=pressure,location=cargo_bay,value=101.2kPa
2025-05-21 16:00:01,sensor_type=radiation,location=reactor_core_shielding,value=0.5mSv/hr
2025-05-21 16:00:02,sensor_type=voltage,location=conduit_J17,value=5000V (ERROR - SPIKE)
2025-05-21 16:00:03,sensor_type=temp,location=reactor_core,value=9800K (CRITICAL)
2025-05-21 16:00:05,sensor_type=flow_rate,location=aux_fuel_line_A,value=0L/min (ERROR - OFFLINE)`},
                        'emergency_comms.log': { type: 'file', owner: 'root', group: 'system_logger', permissions: 'rw-r-----', content: '2025-05-21 16:10:00: Emergency comms initiated by user. Short-range antenna status: ONLINE. Long-range antenna status: OFFLINE.'},
                        'mail.log': { type: 'file', owner: 'root', permissions: 'rw-r--r--', content:
`May 20 08:00:00 odyssey7 postfix/pickup[123]: CDE456FGHI: uid=0 from=<root>
May 20 08:00:00 odyssey7 postfix/cleanup[456]: CDE456FGHI: message-id=<system-daily-report@odyssey7.local>
May 20 08:00:00 odyssey7 postfix/qmgr[789]: CDE456FGHI: from=<system@odyssey7.local>, size=1024, nrcpt=1 (queue active)
May 20 08:00:01 odyssey7 postfix/local[123]: CDE456FGHI: to=<user@odyssey7.local>, relay=local, delay=1, delays=0/0/0/1, dsn=2.0.0, status=sent (delivered to maildir)
May 21 09:28:00 odyssey7 postfix/pickup[123]: DEF567GHIJ: uid=1005 from=<rostova>
May 21 09:28:00 odyssey7 postfix/cleanup[456]: DEF567GHIJ: message-id=<emergency-alert-001@odyssey7.local>
May 21 09:28:00 odyssey7 postfix/qmgr[789]: DEF567GHIJ: from=<rostova@odyssey7.local>, size=512, nrcpt=1 (queue active)
May 21 09:28:01 odyssey7 postfix/local[123]: DEF567GHIJ: to=<user@odyssey7.local>, relay=local, delay=1, status=sent (delivered to maildir)
May 21 09:30:00 odyssey7 postfix/pickup[123]: EFG678HIJK: uid=1000 from=<user>
May 21 09:30:00 odyssey7 postfix/cleanup[456]: EFG678HIJK: message-id=<reply-rostova-001@odyssey7.local>
May 21 09:30:00 odyssey7 postfix/qmgr[789]: EFG678HIJK: from=<user@odyssey7.local>, size=300, nrcpt=1 (queue active)
May 21 09:30:01 odyssey7 postfix/smtp[456]: EFG678HIJK: to=<rostova@odyssey7.local>, relay=internal-mail.odyssey7.local[192.168.1.5]:25, delay=1, status=sent (250 Ok)
May 21 11:00:00 odyssey7 postfix/pickup[123]: FGH789IJKL: uid=1003 from=<aris_t>
May 21 11:00:00 odyssey7 postfix/cleanup[456]: FGH789IJKL: message-id=<data-request-aris-002@odyssey7.local>
May 21 11:00:00 odyssey7 postfix/qmgr[789]: FGH789IJKL: from=<aris_t@odyssey7.local>, size=450, nrcpt=1 (queue active)
May 21 11:00:01 odyssey7 postfix/smtp[456]: FGH789IJKL: to=<user@odyssey7.local>, relay=internal-mail.odyssey7.local[192.168.1.5]:25, delay=1, status=sent (250 Ok)
May 01 14:00:00 odyssey7 postfix/pickup[123]: GHI890JKLM: uid=1002 from=<reed>
May 01 14:00:00 odyssey7 postfix/cleanup[456]: GHI890JKLM: message-id=<phoenix-q3-financials@odyssey7.local>
May 01 14:00:00 odyssey7 postfix/qmgr[789]: GHI890JKLM: from=<reed@odyssey7.local>, size=2048, nrcpt=1 (queue active)
May 01 14:00:01 odyssey7 postfix/smtp[456]: GHI890JKLM: to=<thorne@odyssey7.local>, relay=internal-mail.odyssey7.local[192.168.1.5]:25, delay=1, status=sent (250 Ok)
May 02 10:00:00 odyssey7 postfix/pickup[123]: HIJ901KLMN: uid=1001 from=<thorne>
May 02 10:00:00 odyssey7 postfix/cleanup[456]: HIJ901KLMN: message-id=<phoenix-next-steps@odyssey7.local>
May 02 10:00:00 odyssey7 postfix/qmgr[789]: HIJ901KLMN: from=<thorne@odyssey7.local>, size=1536, nrcpt=4 (queue active)
May 02 10:00:01 odyssey7 postfix/smtp[456]: HIJ901KLMN: to=<sabotage_team@odyssey7.local>, relay=internal-mail.odyssey7.local[192.168.1.5]:25, delay=1, status=sent (250 Ok)
May 18 17:00:00 odyssey7 postfix/pickup[123]: IJK012LMNO: uid=1002 from=<reed>
May 18 17:00:00 odyssey7 postfix/cleanup[456]: IJK012LMNO: message-id=<phoenix-tax-window@odyssey7.local>
May 18 17:00:00 odyssey7 postfix/qmgr[789]: IJK012LMNO: from=<reed@odyssey7.local>, size=1800, nrcpt=1 (queue active)
May 18 17:00:01 odyssey7 postfix/smtp[456]: IJK012LMNO: to=<thorne@odyssey7.local>, relay=internal-mail.odyssey7.local[192.168.1.5]:25, delay=1, status=sent (250 Ok)
May 19 18:00:00 odyssey7 postfix/pickup[123]: JKL123MNOP: uid=1001 from=<thorne>
May 19 18:00:00 odyssey7 postfix/cleanup[456]: JKL123MNOP: message-id=<phoenix-execute-plan@odyssey7.local>
May 19 18:00:00 odyssey7 postfix/qmgr[789]: JKL123MNOP: from=<thorne@odyssey7.local>, size=1200, nrcpt=4 (queue active)
May 19 18:00:01 odyssey7 postfix/smtp[456]: JKL123MNOP: to=<sabotage_team@odyssey7.local>, relay=internal-mail.odyssey7.local[192.168.1.5]:25, delay=1, status=sent (250 Ok)
May 20 10:00:00 odyssey7 postfix/pickup[123]: KLM234NOPQ: uid=1002 from=<reed>
May 20 10:00:00 odyssey7 postfix/cleanup[456]: KLM234NOPQ: message-id=<phoenix-final-confirm@odyssey7.local>
May 20 10:00:00 odyssey7 postfix/qmgr[789]: KLM234NOPQ: from=<reed@odyssey7.local>, size=1700, nrcpt=4 (queue active)
May 20 10:00:01 odyssey7 postfix/smtp[456]: KLM234NOPQ: to=<sabotage_team@odyssey7.local>, relay=internal-mail.odyssey7.local[192.168.1.5]:25, delay=1, status=sent (250 Ok)
`}
                    } },
                    'spool': { type: 'dir', owner: 'root', permissions: 'rwxr-xr-x', children: {
                        'cron': { type: 'dir', owner: 'root', permissions: 'rwxr-xr-x', children: {
                            'root': { type: 'file', owner: 'root', content: '0 1 * * * /sbin/log_rotator --system\\n*/5 * * * * /usr/sbin/power_monitor --check', permissions: 'rw-------' },
                            'user': { type: 'file', owner: 'user', content: '0 * * * * /home/user/tools/diagnostic_tool.sh > /home/user/diag_last_run.log', permissions: 'rw-------' }
                        }}
                    }},
                    'run': { type: 'dir', owner: 'root', permissions: 'rwxr-xr-x', children: { // Runtime data, PIDs etc.
                        'systemd': { type: 'dir', owner: 'root', permissions: 'rwxr-xr-x', children: { /* systemd runtime files */ }},
                        'sshd.pid': { type: 'file', owner: 'root', content: '205', permissions: 'rw-r--r--'}
                    }}
                } },
                'srv': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: {
                    'email': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root', children: { // Mail server data root
                        'mail_server.conf': { type: 'file', owner: 'root', content: 'LISTEN_IP=192.168.1.5\\nDOMAIN_NAME=odyssey7.local\\nSTORAGE_PATH=/srv/email/mailboxes', permissions: 'rw-r-----'},
                        'mailboxes': { type: 'dir', permissions: 'rwxrwx---', owner: 'mail', group:'mail', children: { // Group 'mail' for mail daemon access
                            'user': { type: 'dir', owner: 'user', group:'mail', permissions: 'rwx--S---', children: { // SUID for mail delivery agent? Or just user ownership.
                                'inbox': { type: 'dir', owner: 'user', group:'mail', permissions: 'rwx------', children: {
                                    'msg_20250520_0800_sys.eml': { type: 'file', owner: 'user', permissions: 'rw-------', content: 'From: System Alert <system@odyssey7.local>\\nTo: user@odyssey7.local\\nSubject: Daily Ship Status Report\\nDate: Tue, 20 May 2025 08:00:00 -0700\\n\\nAll systems nominal. Minor energy fluctuations in sector Gamma noted, under review. Standard diagnostic checks are green across all primary systems. Have a productive day.' },
                                    'msg_20250521_0928_rostova.eml': { type: 'file', owner: 'user', permissions: 'rw-------', content: 'From: Cmdr. Rostova <rostova@odyssey7.local>\\nTo: user@odyssey7.local\\nSubject: Emergency Alert!\\nDate: Wed, 21 May 2025 09:28:00 -0700\\n\\nOdyssey 7 is in critical condition. Main power offline, life support failing. Your terminal has been granted emergency access to core diagnostic tools. Find the source of these malfunctions and attempt to stabilize the ship. I\'m coordinating with engineering on Deck 3, but communications are spotty. We are relying on you. Focus on power systems first. Check Conduit J17 logs. Good luck.' },
                                    'msg_20250521_1100_aris_t_frag.eml': { type: 'file', owner: 'user', permissions: 'rw-------', content: 'From: Dr. Aris Thorne <aris_t@odyssey7.local>\\nTo: user@odyssey7.local\\nSubject: Data request - URGENT\\nDate: Wed, 21 May 2025 11:00:00 -0700\\n\\nUser,\\nI need the latest raw sensor readings from the [CORRUPTED DATA: plasma conduit regulator J17] system immediately. My access is firewalled from the Engineering Lab terminal for some reason. I\'m trying to analyze the recent instability and [CORRUPTED DATA: pinpoint the trigger for the feedback loop]. This is urgent. Send the data to my terminal directly if possible. The file should be in /var/log/sensor_stream/J17_plasma.dat or similar. [CORRUPTED DATA: The rest of this message is unrecoverable static, possibly due to power fluctuations during transmission.]' }
                                }},
                                'sent': { type: 'dir', owner: 'user', group:'mail', permissions: 'rwx------', children: {
                                    'msg_20250521_0930_reply_rostova.eml': { type: 'file', owner: 'user', permissions: 'rw-------', content: 'From: User <user@odyssey7.local>\\nTo: Cmdr. Rostova <rostova@odyssey7.local>\\nSubject: Re: Emergency Alert!\\nDate: Wed, 21 May 2025 09:30:00 -0700\\n\\nCommander,\\nUnderstood. I\'m accessing the system logs now. Will focus efforts on power core restoration and investigate Conduit J17. I\'ve initiated ship-wide power conservation protocols via the terminal. Will keep you updated on any findings.' }
                                }}
                            }},
                            'thorne': { type: 'dir', owner: 'thorne', group:'mail', permissions: 'rwx--S---', children: {
                                'inbox': { type: 'dir', owner: 'thorne', group:'mail', permissions: 'rwx------', children: {
                                    'msg_20250501_1400_reed.eml': { type: 'file', owner: 'thorne', permissions: 'rw-------', content: 'From: Vivian Reed <reed@odyssey7.local>\\nTo: Elias Thorne <thorne@odyssey7.local>\\nSubject: Re: Project Phoenix - Q3 Financials & Projections\\nDate: Wed, 01 May 2025 14:00:00 -0700\\n\\nElias,\\nRegarding Project Phoenix, our Q3 projections are robust. The proposed \'operational incident\' strategy could yield significant insurance payouts and write-offs, potentially offsetting up to 25% of our Q4 taxable income. I\'ve crunched the numbers; the bonus structure for key personnel involved (yourself, me, Aris, Jian) would be substantial, contingent on a \'total loss\' scenario for specific non-critical but high-value systems. Let\'s discuss details next week. Make sure Aris and Jian are prepared for their roles. Secrecy is paramount.\\n\\nBest,\\nVivian' },
                                    'msg_20250505_0900_aris_t.eml': { type: 'file', owner: 'thorne', permissions: 'rw-------', content: 'From: Dr. Aris Thorne <aris_t@odyssey7.local>\\nTo: Elias Thorne <thorne@odyssey7.local>\\nSubject: Project Phoenix - Engineering Assessment & Feasibility\\nDate: Sun, 05 May 2025 09:00:00 -0700\\n\\nElias,\\nPer our conversation, I\'ve identified several critical points of vulnerability in the Odyssey 7\'s power grid and life support systems. A cascade failure in the main reactor\'s plasma containment field, coupled with a simultaneous targeted malfunction in the auxiliary power conduits (specifically J17, which has a known firmware backdoor), would create the desired \'catastrophic but recoverable\' event. This would appear as a severe, unforeseen accident. Jian has pinpointed specific deprecated diagnostic access ports for remote activation of the J17 fault. We need to finalize the \'trigger\' mechanism and ensure deniability. The damage should be significant enough to warrant a full insurance claim but allow for eventual (and quiet) repair.\\n\\n-Aris' },
                                    'msg_20250510_1630_security_concern.eml': { type: 'file', owner: 'thorne', permissions: 'rw-------', content: 'From: Security Chief Zara Khan <khan@odyssey7.local>\\nTo: Elias Thorne <thorne@odyssey7.local>\\nSubject: Urgent: Unscheduled System Access & Anomalous Traffic\\nDate: Fri, 10 May 2025 16:30:00 -0700\\n\\nMr. Thorne,\\nMy team has detected unscheduled and unusual high-privilege access attempts on several core system modules, specifically targeting the power distribution (Conduit J17 controller) and navigation systems (sensor alignment controls). While no breaches occurred, the frequency and nature of the attempts are highly concerning. They originate from internal network segments usually restricted to engineering. Additionally, we\'ve seen encrypted outbound traffic bursts from the CEO office subnet to an unknown external address. I\'ve attached the detailed logs. We need to implement stricter protocols and investigate these anomalies immediately.\\n\\nZara Khan' },
                                    'msg_20250512_1100_pr_dept.eml': { type: 'file', owner: 'thorne', permissions: 'rw-------', content: 'From: PR Department <pr_dept@odyssey7.local>\\nTo: Elias Thorne <thorne@odyssey7.local>\\nSubject: Odyssey 7 Public Relations Strategy - Contingency Planning\\nDate: Sun, 12 May 2025 11:00:00 -0700\\n\\nMr. Thorne,\\nOur proposed PR strategy for the Odyssey 7\'s upcoming extended mission emphasizes safety, reliability, and cutting-edge technology. We\'re ready to launch the initial campaign phase. Please review the attached draft press releases. As per your directive, they include contingency language for \'unforeseen operational challenges\' and focus on \'resilience in the face of adversity.\' [CORRUPTED DATA: This line is partially overwritten with binary data: 0xDEADBEEFCAFEBABE0100000050686F656E69785F4F705374617274] This should allow us to manage the narrative effectively should any... issues arise.\\n\\nRegards,\\nPR Team' },
                                    'msg_20250518_1700_reed_urgent.eml': { type: 'file', owner: 'thorne', permissions: 'rw-------', content: 'From: Vivian Reed <reed@odyssey7.local>\\nTo: Elias Thorne <thorne@odyssey7.local>\\nSubject: URGENT: Project Phoenix - Tax Window Closing & Final Confirmation\\nDate: Sat, 18 May 2025 17:00:00 -0700\\n\\nElias,\\nThe tax deduction window for this fiscal year is closing rapidly. We need the \'incident\' to occur within the next 72 hours (by EOD May 21st) for maximum financial benefit and to align with the pre-arranged salvage auction timelines. Confirm with Aris and Jian that they are ready for immediate execution. The financial incentives, including our personal bonuses, hinge on this precise timeline. All offshore accounts are established and awaiting transfer upon confirmation of \'total loss\'.\\n\\nVivian' }
                                }},
                                'sent': { type: 'dir', owner: 'thorne', group:'mail', permissions: 'rwx------', children: {
                                    'msg_20250502_1000_sabotage_team.eml': { type: 'file', owner: 'thorne', permissions: 'rw-------', content: 'From: Elias Thorne <thorne@odyssey7.local>\\nTo: sabotage_team@odyssey7.local\\nCc: reed@odyssey7.local, aris_t@odyssey7.local, li@odyssey7.local\\nSubject: Project Phoenix - Next Steps & Roles\\nDate: Thu, 02 May 2025 10:00:00 -0700\\n\\nTeam,\\nVivian has confirmed the financial viability and optimal parameters for Project Phoenix.\\nAris, please proceed with your detailed vulnerability assessment of Conduit J17 and the auxiliary power control. Prepare the necessary scripts for remote activation.\\nJian, confirm access to the deprecated diagnostic ports and ensure the remote trigger mechanism is untraceable. Provide Aris with necessary credentials for script integration.\\nVivian, continue to monitor the financial markets and insurance clauses for optimal timing. Prepare the fund transfer protocols.\\nOur Q4 targets, and significant personal bonuses, depend on the flawless execution of this operation. Ensure all communications are secure (use one-time pads for critical details) and delete unnecessary records. Discretion is our highest priority. [CORRUPTED DATA: The rest of this email is garbled binary data: \\x80\\x91\\xA2\\xB3\\xC4\\xD5\\xE6\\xF7\\x00\\x00\\xDE\\xAD\\xBE\\xEF\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\x08\\x09\\x0A\\x0B\\x0C\\x0D\\x0E\\x0F]' },
                                    'msg_20250511_0800_khan_reply.eml': { type: 'file', owner: 'thorne', permissions: 'rw-------', content: 'From: Elias Thorne <thorne@odyssey7.local>\\nTo: Security Chief Zara Khan <khan@odyssey7.local>\\nSubject: Re: Urgent: Unscheduled System Access & Anomalous Traffic\\nDate: Sat, 11 May 2025 08:00:00 -0700\\n\\nZara,\\nThank you for your diligence. I\'ve reviewed the logs. The access attempts appear to be a sophisticated, but ultimately unsuccessful, external probe targeting standard industry vulnerabilities – nothing specific to our proprietary systems. Our current security protocols are robust and seem to have prevented any actual breach. The outbound traffic from my office was a scheduled encrypted backup to a secure offsite vault, as per standard executive data protection policy. Continue your team\'s excellent vigilance, but no need for immediate drastic changes to protocols that might disrupt ongoing operations. I\'ll personally ensure all high-privilege access is accounted for and that engineering tightens up their internal network segment access. [CORRUPTED DATA: A few words here appear as \'???\'. Example: I\'ll personally ensure all ??? and that engineering ??? access controls are reviewed.]\\n\\nRegards,\\nElias Thorne' },
                                    'msg_20250519_1800_sabotage_team_final.eml': { type: 'file', owner: 'thorne', permissions: 'rw-------', content: 'From: Elias Thorne <thorne@odyssey7.local>\\nTo: sabotage_team@odyssey7.local\\nCc: reed@odyssey7.local, aris_t@odyssey7.local, li@odyssey7.local\\nSubject: Project Phoenix - EXECUTE PLAN - GO CODE "MIDNIGHT SUN"\\nDate: Mon, 19 May 2025 18:00:00 -0700\\n\\nTeam,\\nThe window is optimal. All financial and technical parameters are set. Project Phoenix is a GO.\\nGO CODE: "MIDNIGHT SUN"\\nAris & Jian: Initiate sequence at 2025-05-21 16:00:00 ship time sharp. Ensure J17 is primary fault point.\\nVivian: Prepare for immediate filing of insurance claims post-event. Execute fund transfers upon my signal (Code: "GOLDEN PARACHUTE").\\nAll personnel: Maintain standard operational demeanor. Follow emergency protocols as expected. No deviation. No unnecessary communication. Delete this message after confirmation.\\nThis is our one shot. Make it count.\\n\\nElias Thorne' }
                                }}
                            }},
                            'reed': { type: 'dir', owner: 'reed', group:'mail', permissions: 'rwx--S---', children: {
                               'inbox': { type: 'dir', owner: 'reed', group:'mail', permissions: 'rwx------', children: {
                                   'msg_20250520_1000_final_confirmation.eml': { type: 'file', owner: 'reed', permissions: 'rw-------', content: 'From: Elias Thorne <thorne@odyssey7.local>\\nTo: Vivian Reed <reed@odyssey7.local>\\nSubject: Re: Project Phoenix - EXECUTE PLAN - GO CODE "MIDNIGHT SUN" - Confirmation\\nDate: Tue, 20 May 2025 10:00:00 -0700\\n\\nVivian,\\nConfirming receipt of GO CODE "MIDNIGHT SUN".\\nAll financial instruments are in place. Insurance claim drafts are prepared, focusing on catastrophic failure of power systems and subsequent damage to related non-essential high-value assets (as itemized in Appendix B of our plan). Fund transfer authorizations are signed and sealed, awaiting my "GOLDEN PARACHUTE" signal.\\nAris and Jian have confirmed their readiness. All systems are go on our end.\\nLet\'s ensure a smooth \'post-incident\' process.\\n\\nRegards,\\nVivian Reed'}
                               }},
                               'sent': {type: 'dir', owner:'reed', group:'mail', permissions: 'rwx------', children: {
                                   'msg_20250520_1005_thorne_ack.eml': { type: 'file', owner: 'reed', permissions: 'rw-------', content: 'From: Vivian Reed <reed@odyssey7.local>\\nTo: Elias Thorne <thorne@odyssey7.local>\\nSubject: Re: Re: Project Phoenix - EXECUTE PLAN - GO CODE "MIDNIGHT SUN" - Confirmation\\nDate: Tue, 20 May 2025 10:05:00 -0700\\n\\nElias,\\nAcknowledged. Standing by for "GOLDEN PARACHUTE".\\n\\nV.'}
                               }}
                            }},
                            'aris_t': { type: 'dir', owner: 'aris_t', group:'mail', permissions: 'rwx--S---', children: { /* Inbox, Sent for aris_t */ }},
                            'li': { type: 'dir', owner: 'li', group:'mail', permissions: 'rwx--S---', children: { /* Inbox, Sent for li */ }},
                            'rostova': { type: 'dir', owner: 'rostova', group:'mail', permissions: 'rwx--S---', children: { /* Inbox, Sent for rostova */ }},
                            'khan': { type: 'dir', owner: 'khan', group:'mail', permissions: 'rwx--S---', children: { /* Inbox, Sent for khan */ }},
                            'pr_dept': { type: 'dir', owner: 'pr_dept', group:'mail', permissions: 'rwx--S---', children: { /* Inbox, Sent for pr_dept */ }}
                        }}
                    }}
                } }
            }
        }
    }
};

console.log("gameState.js: End of file - gameState object:", JSON.stringify(gameState, null, 2));