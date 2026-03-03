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

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function showTodos(filename){
    let lines = readFile(filename).split('\n');
    for (let line of lines) {
        if (line.startsWith('// TODO ')){
            return line.substring(8, line.length);
        }
    }
}