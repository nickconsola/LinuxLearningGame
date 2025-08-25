console.log("fileSystemUtils.js: START (immediate) - typeof gameState:", typeof gameState, "typeof gameState.fileSystem:", typeof gameState?.fileSystem, "typeof gameState.fileSystem?.['/']:", typeof gameState?.fileSystem?.['/'], "typeof gameState.fileSystem?.['/']?.children:", typeof gameState?.fileSystem?.['/']?.children, "typeof gameState.fileSystem?.['/']?.children?.systems:", typeof gameState?.fileSystem?.['/']?.children?.systems, "life_support object:", gameState?.fileSystem?.['/']?.children?.systems?.children?.life_support);
// fileSystemUtils.js - Contains utility functions for interacting with the simulated file system

// Note: These functions rely on global variables from gameState.js: 
// 'gameState.currentPath' (string)
// 'gameState.loggedInUser' (string)
// 'gameState.fileSystem' (object)

window.fileSystemUtils = {
    getFileOrDir: function(path) {
        console.log("DEBUG: fileSystemUtils.js - getFileOrDir - path:", path, "- gameState.fileSystem['/'].children.home exists?", !!(gameState.fileSystem && gameState.fileSystem['/'] && gameState.fileSystem['/'].children && gameState.fileSystem['/'].children.home)); // Debug line
        let resolvedPath = path;
        // Resolve ~ and ~/
        if (path === '~' || path.startsWith('~/')) {
            resolvedPath = `/home/${gameState.loggedInUser}` + path.substring(1);
        } 
        // If not absolute, make it absolute based on currentDirectory (gameState.currentPath)
        else if (!path.startsWith('/')) {
            resolvedPath = (gameState.currentPath === '/' ? '/' : gameState.currentPath + '/') + path; 
            // Basic normalization for cases like /foo/ + bar or / + bar
            resolvedPath = resolvedPath.replace(/\/\//g, '/'); // Replace // with /
            if (resolvedPath !== '/' && resolvedPath.endsWith('/')) {
                 resolvedPath = resolvedPath.slice(0, -1);
            }
        }

        const segments = resolvedPath.split('/').filter(Boolean);
        let currentNode = gameState.fileSystem['/'];
        const pathStack = []; // Used to correctly handle '..' for absolute paths

        // If it's an absolute path, the first segment (after filtering Boolean) should correspond to a child of root.
        // Or, if segments is empty, it means the path was '/'.
        if (resolvedPath === '/') return gameState.fileSystem['/'];

        for (const segment of segments) {
            if (segment === '.') continue;
            if (segment === '..') {
                if (pathStack.length > 0) {
                    pathStack.pop();
                }
                // If pathStack is empty here, it means we tried to '..' above root.
                // In a real system, this would resolve to root. Our loop structure handles this by resetting current node to root.
            } else {
                pathStack.push(segment);
            }
        }
        
        // Traverse using the processed pathStack
        currentNode = gameState.fileSystem['/']; // Always start from root for the resolved pathStack
        for (const segment of pathStack) {
            if (currentNode && currentNode.type === 'dir' && currentNode.children && currentNode.children[segment]) {
                currentNode = currentNode.children[segment];
            } else {
                return null; // Segment not found
            }
        }
        return currentNode;
    },

    readFileContent: function(path) {
        const node = this.getFileOrDir(path);
        if (node && node.type === 'file') {
            return node.content;
        } else if (node && node.type === 'link' && node.target) {
            const targetNode = this.getFileOrDir(node.target);
            if (targetNode && targetNode.type === 'file') {
                return targetNode.content;
            }
        }
        return null; 
    },

    writeFileContent: function(path, content) {
        const node = this.getFileOrDir(path);
        if (node && node.type === 'file') {
            node.content = content;
            node.modified = new Date().toLocaleString();
            return true;
        } else if (node && node.type === 'link' && node.target) {
            const targetNode = this.getFileOrDir(node.target);
            if (targetNode && targetNode.type === 'file') {
                targetNode.content = content;
                targetNode.modified = new Date().toLocaleString();
                return true;
            }
        }
        return false;
    },

    createDirectoryInFS: function(path, owner = gameState.loggedInUser, permissions = 'rwxr-xr-x') {
        const normalizedPathValue = this.normalizePath(path, gameState.currentPath);
        const parentPath = normalizedPathValue.substring(0, normalizedPathValue.lastIndexOf('/')) || '/';
        const dirName = normalizedPathValue.substring(normalizedPathValue.lastIndexOf('/') + 1);
        if (!dirName) return false; 

        const parentNode = this.getFileOrDir(parentPath);
        if (parentNode && parentNode.type === 'dir') {
            if (parentNode.children[dirName]) {
                return false; // Already exists
            }
            parentNode.children[dirName] = { type: 'dir', children: {}, owner, permissions, modified: new Date().toLocaleString() };
            return true;
        }
        return false;
    },

    createFileInFS: function(path, content = '', owner = gameState.loggedInUser, permissions = 'rw-r--r--') {
        const normalizedPathValue = this.normalizePath(path);
        const parentPath = normalizedPathValue.substring(0, normalizedPathValue.lastIndexOf('/')) || '/';
        const fileName = normalizedPathValue.substring(normalizedPathValue.lastIndexOf('/') + 1);
        if (!fileName) return 'INVALID_FILENAME'; 

        const parentNode = this.getFileOrDir(parentPath);
        if (parentNode && parentNode.type === 'dir') {
            if (parentNode.children[fileName]) {
                const existingFile = parentNode.children[fileName];
                if (existingFile.type === 'file') {
                    existingFile.modified = new Date().toLocaleString(); 
                    return 'EXISTS_UPDATED_TIMESTAMP'; 
                }
                return 'EXISTS_NOT_A_FILE'; 
            }
            parentNode.children[fileName] = { type: 'file', content, owner, permissions, modified: new Date().toLocaleString() }; 
            return true; 
        }
        return 'PARENT_NOT_FOUND_OR_NOT_DIR'; 
    },

    deleteNodeInFS: function(path) {
        const normalizedPathValue = this.normalizePath(path);
        const parentPath = normalizedPathValue.substring(0, normalizedPathValue.lastIndexOf('/')) || '/';
        const nodeName = normalizedPathValue.substring(normalizedPathValue.lastIndexOf('/') + 1);
        if (!nodeName || normalizedPathValue === '/') return false; // Cannot delete root or empty name

        const parentNode = this.getFileOrDir(parentPath);
        if (parentNode && parentNode.type === 'dir' && parentNode.children[nodeName]) {
            const nodeToDelete = parentNode.children[nodeName];
            if (nodeToDelete.type === 'dir' && Object.keys(nodeToDelete.children).length > 0) {
                return 'DIR_NOT_EMPTY'; 
            }
            delete parentNode.children[nodeName];
            return true;
        }
        return false;
    },

    listDirectoryContents: function(path, showHidden = false, showDetails = false) {
        const dirNode = this.getFileOrDir(path);
        const output = [];
        if (dirNode && dirNode.type === 'dir') {
            if (dirNode.children && Object.keys(dirNode.children).length > 0) {
                Object.entries(dirNode.children).sort((a,b) => a[0].localeCompare(b[0])).forEach(([name, item]) => {
                    if (!showHidden && name.startsWith('.')) return;
                    if (showDetails) {
                        const type = item.type === 'dir' ? 'd' : (item.type === 'link' ? 'l' : '-');
                        const perms = item.permissions || (item.type === 'dir' ? 'rwxr-xr-x' : 'rw-r--r--');
                        const owner = item.owner || gameState.loggedInUser;
                        const group = item.group || 'users'; 
                        const size = item.type === 'dir' ? '4096' : (item.content ? String(item.content.length) : '0');
                        const date = item.modified || new Date(Date.now() - Math.floor(Math.random()*1000000000)).toLocaleDateString('en-US',{month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit'}).replace(',','').replace(' PM','').replace(' AM','');
                        let nameDisplay = name;
                        if (item.type === 'link' && item.target) nameDisplay += ` -> ${item.target}`;
                        // Simulating ls -l output more closely (example: -rw-r--r--  1 user users   123 May 15 10:00 filename)
                        output.push(`${type}${perms}  1 ${owner.padEnd(8)} ${group.padEnd(8)} ${size.padStart(5)} ${date} ${nameDisplay}`);
                    } else {
                        output.push(name);
                    }
                });
            }
            if (showDetails && output.length > 0) {
               return [`total ${output.length}`, ...output];
            }
            return output;
        } else {
            return null; 
        }
    },

    getNodeMetadata: function(path) {
        const node = this.getFileOrDir(path);
        if (node) {
            return {
                type: node.type,
                owner: node.owner || (node.type === 'dir' ? 'root' : gameState.loggedInUser),
                permissions: node.permissions || (node.type === 'dir' ? 'rwxr-xr-x' : 'rw-r--r--'),
                size: node.content ? node.content.length : (node.type === 'dir' ? 4096 : 0),
                modified: node.modified || new Date().toLocaleString(),
                target: node.target 
            };
        }
        return null;
    },

    normalizePath: function(path, currentDirectory = gameState.currentPath) {
        let newPath = path.trim();
        
        if (newPath === '~' || newPath.startsWith('~/')) {
            newPath = `/home/${gameState.loggedInUser}` + newPath.substring(1);
        }
        else if (!newPath.startsWith('/')) {
            newPath = (currentDirectory === '/' ? '/' : currentDirectory) + '/' + newPath;
        }

        const segments = newPath.split('/');
        const resolvedSegments = [];
        let atRoot = true; // Keep track if we are effectively at the root directory

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            if (segment === '' && i === 0) { // Handles the first segment if path starts with '/'
                resolvedSegments.push('');
                atRoot = true;
                continue;
            }
            if (segment === '' || segment === '.') {
                if (resolvedSegments.length === 0) resolvedSegments.push(''); // Ensure root path integrity if it was empty
                continue;
            }
            if (segment === '..') {
                if (resolvedSegments.length > 0 && resolvedSegments[resolvedSegments.length - 1] !== '') {
                    resolvedSegments.pop();
                     if (resolvedSegments.length === 1 && resolvedSegments[0] === '') atRoot = true;
                     else if (resolvedSegments.length === 0) atRoot = true; // Went above starting relative dir
                     else atRoot = false;
                } else if (atRoot && resolvedSegments.length > 0 && resolvedSegments[0] === ''){
                    // Already at root (e.g. path was '/' or became '/' after '..'), do nothing
                } else if (resolvedSegments.length === 0 && !path.startsWith('/')){
                     // Trying to go '..' from an empty relative path, effectively stays there (or conceptual error)
                     // For simplicity, let's assume it means the resolution stays empty, to be joined to nothing or '/'
                } else {
                     // This can happen if currentDirectory was root and path is like '../file' or segments was ['', '.. ']
                     // Effectively means it tries to go above actual root. Resolve to root.
                     if (resolvedSegments.length === 0 || resolvedSegments[0] !== '') resolvedSegments.unshift('');
                     while(resolvedSegments.length > 1) resolvedSegments.pop(); // ensure only [''] remains
                     atRoot = true;
                }
            } else {
                if (atRoot && resolvedSegments.length === 1 && resolvedSegments[0] === '' && segment !== '') {
                     // Coming from root, so just add the segment
                     resolvedSegments.push(segment);
                } else if (resolvedSegments.length === 0 && segment !== '') {
                     // First segment of a relative path
                     resolvedSegments.push(segment);
                } else if (segment !== '') {
                     resolvedSegments.push(segment);
                }
                atRoot = false;
            }
        }

        if (resolvedSegments.length === 0) return '/'; // e.g. path was '.' or '' from root
        if (resolvedSegments.length === 1 && resolvedSegments[0] === '') return '/'; // Path resolved to root like /../../
        
        let finalPath = resolvedSegments.join('/');
        
        // If original path was relative and resolvedSegments is empty (e.g. `cd ..` from `/foo`), finalPath should be `/`
        // if (resolvedSegments.length === 0 && !path.startsWith('/')) return '/';

        // If it ended up like '/path' it's fine. If 'path', it implies from root, so add leading '/'.
        // However, if original was relative and resolved to something, it should remain relative to be joined with current path later if needed.
        // BUT, our getFileOrDir expects absolute, so this normalizePath should always return absolute.

        if (finalPath === '') return '/'; // Should have been caught earlier
        if (finalPath[0] !== '/') finalPath = '/' + finalPath;
        
        // Remove trailing slash for directories, unless it's the root.
        if (finalPath.length > 1 && finalPath.endsWith('/')) {
            finalPath = finalPath.slice(0, -1);
        }
        return finalPath;
    },

    manPages: {
        'help': {
            name: 'help - display information about available commands',
            synopsis: 'help',
            description: 'The help command lists all the commands you have learned so far. For each command, a brief description of its function is provided.'
        },
        'pwd': {
            name: 'pwd - print name of current/working directory',
            synopsis: 'pwd',
            description: 'The pwd utility writes the absolute pathname of the current working directory to the standard output.'
        },
        'ls': {
            name: 'ls - list directory contents',
            synopsis: 'ls [path...]',
            description: 'For each operand that names a file of a type other than directory, ls displays its name as well as any requested, associated information. For each operand that names a file of type directory, ls displays the names of files contained within that directory, as well as any requested, associated information.'
        },
        'clear': {
            name: 'clear - clear the terminal screen',
            synopsis: 'clear',
            description: 'The clear utility clears your screen if this is possible.'
        },
        'cat': {
            name: 'cat - concatenate and print files',
            synopsis: 'cat [file ...]',
            description: 'The cat utility reads files sequentially, writing them to the standard output. The file operands are processed in command-line order.'
        },
        'man': {
            name: 'man - format and display the on-line manual pages',
            synopsis: 'man [command]',
            description: 'The man utility finds and displays the manual page for a given command.'
        },
        'cd': {
            name: 'cd - change working directory',
            synopsis: 'cd [directory]',
            description: 'The cd utility changes the current working directory to the directory specified. If no directory is given, it defaults to the user\'s home directory (~).'
        },
        'uptime': {
            name: 'uptime - show how long system has been running',
            synopsis: 'uptime',
            description: 'The uptime utility displays the current time, the length of time the system has been up, the number of users, and the load average of the system over the last 1, 5, and 15 minutes.'
        },
        'echo': {
            name: 'echo - write arguments to the standard output',
            synopsis: 'echo [string ...]',
            description: 'The echo utility writes any specified operands, separated by single blank (\' \') characters and followed by a newline (\'\\n\') character, to the standard output.'
        },
        'mkdir': {
            name: 'mkdir - make directories',
            synopsis: 'mkdir [directory_name]',
            description: 'The mkdir utility creates the directories named as operands, in the order specified.'
        },
        'touch': {
            name: 'touch - change file access and modification times',
            synopsis: 'touch [file...]',
            description: 'The touch utility sets the modification and access times of files. If a file does not exist, it is created with default permissions.'
        },
        'rm': {
            name: 'rm - remove directory entries',
            synopsis: 'rm [file...]',
            description: 'The rm utility attempts to remove the non-directory type files specified on the command line. Use with caution, as this is permanent.'
        },
        'rmdir': {
            name: 'rmdir - remove directories',
            synopsis: 'rmdir [directory...]',
            description: 'The rmdir utility removes the directory entry specified by each directory argument, provided it is empty.'
        },
        'mv': {
            name: 'mv - move files',
            synopsis: 'mv [source] [target]',
            description: 'In its first form, the mv utility renames the file named by the source operand to the destination path named by the target operand. In its second form, mv moves each file named by a source operand to a destination file in the existing directory named by the directory operand.'
        },
        'less': {
            name: 'less - opposite of more',
            synopsis: 'less [file...]',
            description: 'Less is a program similar to more, but which allows backward movement in the file as well as forward movement. Also, less does not have to read the entire input file before starting, so with large input files it starts up faster than text editors like vi.'
        },
        'grep': {
            name: 'grep - print lines matching a pattern',
            synopsis: 'grep [pattern] [file...]',
            description: 'The grep utility searches any given input files, selecting lines that match one or more patterns. By default, a pattern is a basic regular expression. grep prints the lines that contain matches.'
        },
        'find': {
            name: 'find - walk a file hierarchy',
            synopsis: 'find [path...] [expression]',
            description: 'The find utility recursively descends the directory tree for each path specified, evaluating an expression in terms of each file in the tree.'
        },
        'head': {
            name: 'head - display first part of a file',
            synopsis: 'head [-n count] [file...]',
            description: 'The head utility displays the first few lines of a file. The -n option specifies the number of lines to be shown.'
        },
        'tail': {
            name: 'tail - display last part of a file',
            synopsis: 'tail [-n count] [file...]',
            description: 'The tail utility displays the last few lines of a file. The -n option specifies the number of lines to be shown.'
        },
        'wc': {
            name: 'wc - word, line, character, and byte count',
            synopsis: 'wc [file...]',
            description: 'The wc utility displays the number of lines, words, and bytes contained in each input file, or standard input (if no file is specified) to the standard output.'
        },
        'sort': {
            name: 'sort - sort lines of text files',
            synopsis: 'sort [file...]',
            description: 'The sort utility sorts the contents of a text file, line by line. The sorted output is written to standard output.'
        },
        'uniq': {
            name: 'uniq - report or omit repeated lines',
            synopsis: 'uniq [input [output]]',
            description: 'The uniq utility reads from the standard input or a file, compares adjacent lines, and writes a copy of each unique line to the standard output. For uniq to work correctly, the file must first be sorted.'
        },
        'diff': {
            name: 'diff - compare files line by line',
            synopsis: 'diff [file1] [file2]',
            description: 'The diff utility compares the contents of file1 and file2 and writes to the standard output the list of changes necessary to convert file1 into file2.'
        },
        'cmp': {
            name: 'cmp - compare two files byte by byte',
            synopsis: 'cmp [file1] [file2]',
            description: 'The cmp utility compares two files of any type and writes the results to the standard output. By default, cmp is silent if the files are the same; if they differ, the byte and line number at which the first difference occurred is reported.'
        },
        'tree': {
            name: 'tree - list contents of directories in a tree-like format',
            synopsis: 'tree [directory...]',
            description: 'The tree utility recursively displays the contents of a directory in a tree-like format, showing subdirectories and files.'
        },
        'ln': {
            name: 'ln - make links between files',
            synopsis: 'ln [-s] [source_file] [target_file]',
            description: 'The ln utility creates a new directory entry (link) for the file name specified by target_file. The -s option creates a symbolic link.'
        },
        'uname': {
            name: 'uname - print system information',
            synopsis: 'uname [-a]',
            description: 'The uname utility writes symbolic information concerning the system to standard output. The -a option prints all available information.'
        },
        'whoami': {
            name: 'whoami - print effective user name',
            synopsis: 'whoami',
            description: 'The whoami utility displays your effective user name.'
        },
        'groups': {
            name: 'groups - print group memberships for a user',
            synopsis: 'groups [user]',
            description: 'The groups utility prints the groups a user is in.'
        },
        'dmesg': {
            name: 'dmesg - print or control the kernel ring buffer',
            synopsis: 'dmesg',
            description: 'The dmesg utility is used to examine or control the kernel ring buffer. It is useful for examining kernel boot messages.'
        },
        'free': {
            name: 'free - display amount of free and used memory in the system',
            synopsis: 'free [-h]',
            description: 'The free utility displays the total amount of free and used physical and swap memory in the system, as well as the buffers and caches used by the kernel. The -h option shows output in a human-readable format.'
        },
        'df': {
            name: 'df - display free disk space',
            synopsis: 'df [-h]',
            description: 'The df utility displays statistics about the amount of free disk space on the specified file system. The -h option shows output in a human-readable format.'
        },
        'du': {
            name: 'du - estimate file space usage',
            synopsis: 'du [-sh] [file...]',
            description: 'The du utility displays the file system block usage for each file argument and for each directory in the file hierarchy. The -s option displays a summary for each specified file. The -h option shows output in a human-readable format.'
        },
        'file': {
            name: 'file - determine file type',
            synopsis: 'file [file...]',
            description: 'The file utility tests each argument in an attempt to classify it. It will print the file type.'
        },
        'cut': {
            name: 'cut - cut out sections from each line of a file',
            synopsis: 'cut [-d delimiter] [-f fields]',
            description: 'The cut utility cuts out sections from each line of a file. The -d option specifies the delimiter, and -f specifies the field number to extract.'
        },
        'tr': {
            name: 'tr - translate or delete characters',
            synopsis: 'tr [string1] [string2]',
            description: 'The tr utility copies the standard input to the standard output with substitution or deletion of selected characters.'
        },
        'tee': {
            name: 'tee - read from standard input and write to standard output and files',
            synopsis: 'tee [file...]',
            description: 'The tee utility copies standard input to standard output, making a copy in zero or more files. The output is unbuffered.'
        },
        'locate': {
            name: 'locate - find files by name',
            synopsis: 'locate [pattern]',
            description: 'The locate utility finds file names that match a given pattern. It searches a prebuilt database for speed.'
        },
        'chmod': {
            name: 'chmod - change file modes or Access Control Lists',
            synopsis: 'chmod [mode] [file...]',
            description: 'The chmod utility modifies the file mode bits of the listed files as specified by the mode operand.'
        },
        'chown': {
            name: 'chown - change file owner and group',
            synopsis: 'chown [owner[:group]] [file...]',
            description: 'The chown utility changes the user ID and/or the group ID of the specified files.'
        },
        'sudo': {
            name: 'sudo - execute a command as another user',
            synopsis: 'sudo [command]',
            description: 'The sudo utility allows a permitted user to execute a command as the superuser or another user, as specified by the security policy.'
        },
        'umask': {
            name: 'umask - set file mode creation mask',
            synopsis: 'umask',
            description: 'The umask utility sets the file mode creation mask of the current shell execution environment to the value specified by the mask operand.'
        },
        'split': {
            name: 'split - split a file into pieces',
            synopsis: 'split [-b size] [file [prefix]]',
            description: 'The split utility reads the given file and breaks it up into pieces. The -b option splits the file by size.'
        },
        'paste': {
            name: 'paste - merge lines of files',
            synopsis: 'paste [-d list] [file...]',
            description: 'The paste utility concatenates the corresponding lines of the given input files, and writes the resulting lines to standard output. The -d option allows specifying a list of delimiters.'
        },
        'join': {
            name: 'join - join lines of two files on a common field',
            synopsis: 'join [file1] [file2]',
            description: 'The join utility performs an equality join on two files. The files must be sorted on the join field.'
        },
        'tar': {
            name: 'tar - manipulate tape archives',
            synopsis: 'tar [-czvf] [archive-file] [file...]',
            description: 'The tar utility creates, maintains, modifies, and extracts files that are archived in the tar format. Common flags are -c (create), -z (compress with gzip), -v (verbose), and -f (specify file).'
        },
        'gzip': {
            name: 'gzip - compress or expand files',
            synopsis: 'gzip [file]',
            description: 'The gzip utility reduces the size of the named files using Lempel-Ziv coding (LZ77). When a file is compressed, it is replaced by one with a .gz extension.'
        },
        'gunzip': {
            name: 'gunzip - compress or expand files',
            synopsis: 'gunzip [file.gz]',
            description: 'The gunzip utility is equivalent to gzip -d. It decompresses files compressed by gzip.'
        },
        'zip': {
            name: 'zip - package and compress (archive) files',
            synopsis: 'zip [archive.zip] [file...]',
            description: 'The zip utility is a compression and file packaging utility. It creates a .zip archive.'
        },
        'unzip': {
            name: 'unzip - list, test and extract compressed files in a ZIP archive',
            synopsis: 'unzip [archive.zip]',
            description: 'The unzip utility will extract files from a ZIP archive.'
        },
        'sed': {
            name: 'sed - stream editor for filtering and transforming text',
            synopsis: 'sed [script] [file...]',
            description: 'The sed utility reads the specified files, or the standard input if no files are specified, modifying the input as specified by a list of commands.'
        },
        'awk': {
            name: 'awk - pattern-directed scanning and processing language',
            synopsis: 'awk [-F fs] [program] [file...]',
            description: 'The awk utility is a powerful tool for text processing. It views a text file as a series of records (usually lines) and fields separated by a field separator.'
        },
        'ping': {
            name: 'ping - send ICMP ECHO_REQUEST packets to network hosts',
            synopsis: 'ping [host]',
            description: 'The ping utility uses the ICMP protocol\'s mandatory ECHO_REQUEST datagram to elicit an ICMP ECHO_RESPONSE from a host or gateway.'
        },
        'traceroute': {
            name: 'traceroute - print the route packets take to network host',
            synopsis: 'traceroute [host]',
            description: 'The traceroute utility attempts to trace the route an IP packet would follow to some internet host by launching probe packets with a small ttl (time to live) then listening for an ICMP "time exceeded" reply from a gateway.'
        },
        'curl': {
            name: 'curl - transfer a URL',
            synopsis: 'curl [options] [URL...]',
            description: 'curl is a tool to transfer data from or to a server, using one of the supported protocols (HTTP, HTTPS, FTP, etc.).'
        },
        'ps': {
            name: 'ps - report a snapshot of the current processes',
            synopsis: 'ps [options]',
            description: 'The ps utility displays a header line, followed by lines containing information about all of your processes that have controlling terminals. Common options include `aux` to show all processes from all users.'
        },
        'top': {
            name: 'top - display Linux processes',
            synopsis: 'top',
            description: 'The top program provides a dynamic real-time view of a running system. It can display system summary information as well as a list of tasks currently being managed by the Linux kernel.'
        },
        'htop': {
            name: 'htop - interactive process viewer',
            synopsis: 'htop',
            description: 'htop is an interactive text-mode process viewer for Unix systems. It aims to be a better `top`.'
        },
        'netstat': {
            name: 'netstat - Print network connections, routing tables, interface statistics, masquerade connections, and multicast memberships',
            synopsis: 'netstat [options]',
            description: 'The netstat utility displays the state of network connections. Common options are -t (TCP), -u (UDP), -l (listening), -n (numeric), -p (program).'
        },
        'kill': {
            name: 'kill - terminate a process',
            synopsis: 'kill [PID]',
            description: 'The kill utility sends a signal to a process. The default signal is TERM (terminate). The process is specified by its process ID (PID).'
        },
        'pkill': {
            name: 'pkill - signal processes based on name and other attributes',
            synopsis: 'pkill [pattern]',
            description: 'The pkill utility looks through the currently running processes and lists the process IDs which match the selection criteria to stdout. All the criteria have to match.'
        },
        'iostat': {
            name: 'iostat - Report Central Processing Unit (CPU) statistics and input/output statistics for devices and partitions',
            synopsis: 'iostat',
            description: 'The iostat command is used for monitoring system input/output device loading by observing the time the devices are active in relation to their average transfer rates.'
        },
        'vmstat': {
            name: 'vmstat - Report virtual memory statistics',
            synopsis: 'vmstat',
            description: 'vmstat reports information about processes, memory, paging, block IO, traps, disks and cpu activity.'
        },
        'sar': {
            name: 'sar - Collect, report, or save system activity information',
            synopsis: 'sar',
            description: 'The sar command writes to standard output the contents of selected cumulative activity counters in the operating system.'
        },
        'passwd': {
            name: 'passwd - update user\'s authentication tokens',
            synopsis: 'passwd [user]',
            description: 'The passwd utility is used to update a user\'s authentication tokens (passwords).'
        },
        'groupadd': {
            name: 'groupadd - create a new group',
            synopsis: 'groupadd [group]',
            description: 'The groupadd command creates a new group account using the values specified on the command line plus the default values from the system.'
        },
        'useradd': {
            name: 'useradd - create a new user or update default new user information',
            synopsis: 'useradd [options] [user]',
            description: 'useradd is a low-level utility for adding users. On Debian, administrators should usually use adduser(8) instead.'
        },
        'usermod': {
            name: 'usermod - modify a user account',
            synopsis: 'usermod [options] [user]',
            description: 'The usermod command modifies the system account files to reflect the changes that are specified on the command line. A common option is -aG to add a user to a supplementary group.'
        },
        'userdel': {
            name: 'userdel - delete a user account and related files',
            synopsis: 'userdel [user]',
            description: 'The userdel command is a low-level utility for removing users.'
        },
        'groupdel': {
            name: 'groupdel - delete a group',
            synopsis: 'groupdel [group]',
            description: 'The groupdel command modifies the system account files, deleting all entries that refer to group. The named group must exist.'
        },
        'systemctl': {
            name: 'systemctl - control the systemd system and service manager',
            synopsis: 'systemctl [command] [name...]',
            description: 'systemctl may be used to introspect and control the state of the systemd system and service manager. Common commands include status, start, stop, and restart.'
        },
        'bg': {
            name: 'bg - send jobs to background',
            synopsis: 'bg [job_spec]',
            description: 'Continues a stopped job in the background. If job_spec is not present, the shell\'s notion of the current job is used.'
        },
        'fg': {
            name: 'fg - run jobs in foreground',
            synopsis: 'fg [job_spec]',
            description: 'Continues a stopped job by bringing it to the foreground. If job_spec is not present, the shell\'s notion of the current job is used.'
        },
        'jobs': {
            name: 'jobs - list active jobs',
            synopsis: 'jobs',
            description: 'The jobs command lists the active jobs.'
        },
        'mount': {
            name: 'mount - mount a filesystem',
            synopsis: 'mount [device] [directory]',
            description: 'The mount command serves to attach the filesystem found on some device to the big file tree.'
        },
        'umount': {
            name: 'umount - unmount file systems',
            synopsis: 'umount [directory|device]',
            description: 'The umount command detaches the file system(s) mentioned from the file hierarchy.'
        },
        'rsync': {
            name: 'rsync - a fast, versatile, remote (and local) file-copying tool',
            synopsis: 'rsync [options] [source] [destination]',
            description: 'rsync is a utility for efficiently transferring and synchronizing files between a computer and an external hard drive and across networks. Common options are -a (archive) and -v (verbose).'
        },
        'dd': {
            name: 'dd - convert and copy a file',
            synopsis: 'dd if=[source] of=[destination] [options]',
            description: 'dd is a command-line utility for Unix and Unix-like operating systems whose primary purpose is to convert and copy files.'
        },
        'lsof': {
            name: 'lsof - list open files',
            synopsis: 'lsof [file]',
            description: 'lsof is a command meaning "list open files", which is used in many Unix-like systems to report a list of all open files and the processes that opened them.'
        },
        'crontab': {
            name: 'crontab - maintain crontab files for individual users',
            synopsis: 'crontab [-l | -e]',
            description: 'crontab is the program used to install, deinstall or list the tables used to drive the cron daemon. The -l option lists the current crontab. The -e option is used to edit the current crontab.'
        }
    },

    getManPage: function(commandName) {
        const page = this.manPages[commandName];
        if (!page) {
             const phase = window.allStoryPhases.find(p => p.commandToLearn === commandName || (Array.isArray(p.commandToLearn) && p.commandToLearn.includes(commandName)));
            if (!phase) return `No manual entry for ${commandName}`;

            let manOutput = `NAME\n    ${commandName}`;
            
            const allPhasesForCommand = window.allStoryPhases.filter(p => p.commandToLearn === commandName || (Array.isArray(p.commandToLearn) && p.commandToLearn.includes(commandName)));
            const objectives = [...new Set(allPhasesForCommand.map(p => p.objective.split('.')[0]))];
            manOutput += ` - ${objectives.join(', ')}\n\n`;

            manOutput += `DESCRIPTION\n    ${phase.details.replace(/`/g, '')}\n\n`;
            return manOutput;
        }

        let manOutput = `NAME\n    ${page.name}\n\n`;
        manOutput += `SYNOPSIS\n    ${page.synopsis}\n\n`;
        manOutput += `DESCRIPTION\n    ${page.description}\n`;

        return manOutput;
    },

    getCurrentDirectory: function() { 
        // Depends on getFileOrDir from this file and gameState.currentPath
        return this.getFileOrDir(gameState.currentPath); 
    },

    changeNodeOwnerAndPermissions: function(path, newOwner, newPermissions) {
        const node = this.getFileOrDir(path);
        if (node) {
            if (newOwner) {
                node.owner = newOwner;
            }
            if (newPermissions) {
                node.permissions = newPermissions;
            }
            node.modified = new Date().toLocaleString();
            return true;
        }
        return false;
    },

    findInFileSystem: function(nameToFind, startPath = '/') {
        const results = [];
        const startNode = this.getFileOrDir(startPath);

        function recurseFind(currentNode, currentPath) {
            if (!currentNode || typeof currentNode !== 'object') {
                return;
            }

            // Check current node name (for directories, as files are children)
            // This part is a bit tricky because 'nameToFind' could be part of 'currentPath' for the startNode itself.
            // For simplicity, this find will primarily look for children matching the name.

            if (currentNode.type === 'dir' && currentNode.children) {
                for (const childName in currentNode.children) {
                    const childNode = currentNode.children[childName];
                    const childPath = (currentPath === '/' ? '' : currentPath) + '/' + childName;
                    
                    if (childName.includes(nameToFind)) {
                        results.push(childPath);
                    }
                    if (childNode.type === 'dir') {
                        recurseFind(childNode, childPath);
                    }
                }
            }
        }

        // Check if the starting node itself matches, if it's not the root path
        if (startPath !== '/' && startPath.substring(startPath.lastIndexOf('/') + 1).includes(nameToFind)) {
            // Check if startNode exists to avoid adding invalid paths
            if (startNode) {
                 results.push(startPath);
            }
        }
        
        recurseFind(startNode, startPath);
        // Deduplicate results (e.g. if startPath itself matches and is also found in recursion)
        return [...new Set(results)];
    },

    getAbsolutePath: function(path) {
        let resolvedPath = path.trim();
        // Resolve ~ and ~/
        if (resolvedPath === '~' || resolvedPath.startsWith('~/')) {
            resolvedPath = `/home/${gameState.loggedInUser}` + resolvedPath.substring(1);
        } 
        // If not absolute, make it absolute based on currentDirectory (gameState.currentPath)
        else if (!resolvedPath.startsWith('/')) {
            const currentDirectory = gameState.currentPath;
            resolvedPath = (currentDirectory === '/' ? '/' : currentDirectory + '/') + resolvedPath;
        }

        // Normalize path (remove . and .. segments, remove multiple slashes)
        const segments = resolvedPath.split('/').filter(s => s !== '' && s !== '.');
        const finalSegments = [];
        for (const segment of segments) {
            if (segment === '..') {
                if (finalSegments.length > 0) {
                    finalSegments.pop();
                }
            } else {
                finalSegments.push(segment);
            }
        }
        
        let normalizedPath = '/' + finalSegments.join('/');
        if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
           // normalizedPath = normalizedPath.slice(0, -1); // Keep trailing slash for dirs if that's desired, or remove. For now, remove.
        }
         // Special case: if the original path ended with /, and it wasn't just "/", preserve it if it's a directory
        const originalNode = this.getFileOrDir(path); // Check original path type
        if (path.endsWith('/') && path !== '/' && originalNode && originalNode.type === 'dir' && !normalizedPath.endsWith('/')) {
            normalizedPath += '/';
        }


        return normalizedPath === '' ? '/' : normalizedPath; // Ensure root path is represented as '/'
    },

    renameFileOrDirectory: function(oldPath, newPath) {
        const oldNormalized = this.normalizePath(oldPath);
        const newNormalized = this.normalizePath(newPath);

        const oldParentPath = oldNormalized.substring(0, oldNormalized.lastIndexOf('/')) || '/';
        const oldName = oldNormalized.substring(oldNormalized.lastIndexOf('/') + 1);

        const newParentPath = newNormalized.substring(0, newNormalized.lastIndexOf('/')) || '/';
        const newName = newNormalized.substring(newNormalized.lastIndexOf('/') + 1);

        if (!oldName || !newName || oldNormalized === '/' || oldParentPath === newNormalized ) { // Cannot rename root or to its own parent
            return 'INVALID_PATH';
        }
        
        // Check if newPath already exists
        const newPathNode = this.getFileOrDir(newNormalized);
        if (newPathNode) {
            return 'TARGET_EXISTS';
        }

        const oldParentNode = this.getFileOrDir(oldParentPath);
        if (!oldParentNode || oldParentNode.type !== 'dir' || !oldParentNode.children[oldName]) {
            return 'SOURCE_NOT_FOUND';
        }
        
        const nodeToMove = oldParentNode.children[oldName];

        // If newParentPath is different from oldParentPath, it's a move + rename.
        // If they are the same, it's just a rename in place.
        const newParentNode = this.getFileOrDir(newParentPath);
        if (!newParentNode || newParentNode.type !== 'dir') {
            return 'TARGET_PARENT_NOT_FOUND_OR_NOT_DIR';
        }

        // Add to new parent
        newParentNode.children[newName] = nodeToMove;
        nodeToMove.modified = new Date().toLocaleString(); // Update timestamp

        // Delete from old parent
        delete oldParentNode.children[oldName];
        
        // If oldPath was currentPath, update currentPath
        if (gameState.currentPath === oldNormalized) {
            gameState.currentPath = newNormalized;
        } else if (gameState.currentPath.startsWith(oldNormalized + '/')) { // If current path was inside the moved dir
            gameState.currentPath = newNormalized + gameState.currentPath.substring(oldNormalized.length);
        }

        return true;
    },

    pathExists: function(path) {
        return this.getFileOrDir(path) !== null;
    },

    deleteFileOrDir: function(path) {
        const normalizedPath = this.normalizePath(path, gameState.currentPath);
        if (normalizedPath === '/') {
            // Should not be able to delete root.
            return false;
        }

        const parentPath = normalizedPath.substring(0, normalizedPath.lastIndexOf('/')) || '/';
        const nodeName = normalizedPath.substring(normalizedPath.lastIndexOf('/') + 1);

        const parentNode = this.getFileOrDir(parentPath);

        if (parentNode && parentNode.type === 'dir' && parentNode.children && parentNode.children[nodeName]) {
            // TODO: check permissions before deleting
            delete parentNode.children[nodeName];
            return true;
        }

        return false;
    }
};