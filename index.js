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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTodos(findTodos);
            break;
        case 'important':
            showTodos(findImportantTodos);
            break;


        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function findTodos(file) {
    let lines = file.split('\n');
    let todos = []
    for (let line of lines) {
        if (line.startsWith('// TODO ')) {
            todos.push(line.substring(8, line.length));
        }
    }
    return todos;
}

function findImportantTodos(file) {
    let lines = file.split('\n');
    let todos = []
    for (let line of lines) {
        if (line.startsWith('// TODO ') && line.includes('!')) {
            todos.push(line.substring(8, line.length));
        }
    }
    return todos;
}

function showTodos(finder) {
    let files = getFiles();
    for (let file of files) {
        for (const todo of finder(file)) {
            console.log(todo);
        }
    }
}