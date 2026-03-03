const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const args = command.split(' ');
    const cmd = args[0];
    const param = args[1];
    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTodos(findTodos);
            break;
        case 'important':
            showTodos(findImportantTodos);
            break;
        case 'user':
            showTodos((file) => findUserTodos(file, param));
            break;
        case 'sort':
            showSortedTodos(param);
            break;
        case 'date':
            const dateRegex = /^\d{4}(-\d{2}(-\d{2})?)?$/;
            if (param && dateRegex.test(param)) {
                showTodos((file) => findDateTodos(file, param));
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function findTodos(file) {
    const lines = file.split('\n');
    let todos =[];
    const regex = /\/\/\s*todo\s*:?\s*(.*)/i;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            todos.push(match[1].trim());
        }
    }
    return todos;
}

function findImportantTodos(file) {
    let todos = findTodos(file);
    return todos.filter(todo => todo.includes('!'));
}

function findUserTodos(file, name) {
    let todos = findTodos(file);
    let userTodos =[];
    const searchName = name.toLowerCase();

    for (const todo of todos) {
        let parts = todo.split(';');
        if (parts.length >= 3) {
            let userName = parts[0].trim().toLowerCase();
            if (userName === searchName) {
                userTodos.push(todo);
            }
        }
    }
    return userTodos;
}

function showTodos(finder) {
    for (const file of files) {
        for (const todo of finder(file)) {
            console.log(todo);
        }
    }
}

function getAllTodos() {
    let allTodos =[];
    for (const file of files) {
        allTodos = allTodos.concat(findTodos(file));
    }
    return allTodos;
}

function showSortedTodos(sortType) {
    let todos = getAllTodos();

    if (sortType === 'importance') {
        todos.sort((a, b) => {
            const aExclamations = (a.match(/!/g) || []).length;
            const bExclamations = (b.match(/!/g) || []).length;
            return bExclamations - aExclamations; // По убыванию
        });
    } else if (sortType === 'user') {
        todos.sort((a, b) => {
            const aParts = a.split(';');
            const bParts = b.split(';');

            const aHasUser = aParts.length >= 3;
            const bHasUser = bParts.length >= 3;

            if (aHasUser && bHasUser) {
                const userA = aParts[0].trim().toLowerCase();
                const userB = bParts[0].trim().toLowerCase();
                return userA.localeCompare(userB);
            } else if (aHasUser) {
                return -1;
            } else if (bHasUser) {
                return 1;
            } else {
                return 0;
            }
        });
    } else if (sortType === 'date') {
        todos.sort((a, b) => {
            const aParts = a.split(';');
            const bParts = b.split(';');

            const aHasDate = aParts.length >= 3;
            const bHasDate = bParts.length >= 3;

            const dateA = aHasDate ? new Date(aParts[1].trim()).getTime() : 0;
            const dateB = bHasDate ? new Date(bParts[1].trim()).getTime() : 0;

            return dateB - dateA;
        });
    }

    for (const todo of todos) {
        console.log(todo);
    }
}

function findDateTodos(file, dateArg) {
    let todos = findTodos(file);
    let dateTodos =[];
    const targetTime = new Date(dateArg).getTime();

    for (const todo of todos) {
        let parts = todo.split(';');
        if (parts.length >= 3) {
            let todoDateStr = parts[1].trim();
            let todoTime = new Date(todoDateStr).getTime();
            if (!isNaN(todoTime) && todoTime >= targetTime) {
                dateTodos.push(todo);
            }
        }
    }
    return dateTodos;
}