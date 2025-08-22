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

    getManPage: function(commandName) {
        const phase = window.allStoryPhases.find(p => p.commandToLearn === commandName || (Array.isArray(p.commandToLearn) && p.commandToLearn.includes(commandName)));
        if (!phase) return `No manual entry for ${commandName}`;

        let manOutput = `NAME\n    ${commandName}`;
        
        // Find all aliases/variants
        const allPhasesForCommand = window.allStoryPhases.filter(p => p.commandToLearn === commandName || (Array.isArray(p.commandToLearn) && p.commandToLearn.includes(commandName)));
        const objectives = [...new Set(allPhasesForCommand.map(p => p.objective.split('.')[0]))];
        manOutput += ` - ${objectives.join(', ')}\n\n`;

        manOutput += `SYNOPSIS\n    `;
        const details = [...new Set(allPhasesForCommand.map(p => p.details.split('`').filter((s, i) => i % 2 === 1).join(' ')))];
         manOutput += `${details.join(', ')}\n\n`;


        manOutput += `DESCRIPTION\n    ${phase.details.replace(/`/g, '')}\n\n`;
        manOutput += `HINTS\n    ${phase.auroraMessage.replace(/`/g, '')}\n`;

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