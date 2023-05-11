const fs = require('fs/promises');
const path = require('path');

const PERSON_PATH = path.resolve(__dirname, './movies.json');

const readPersonFiles = async () => {
    try {
        const data = await fs.readFile(PERSON_PATH);
        return JSON.parse(data);
    } catch (Error) {
        console.error(`Arquivo não pôde ser lido: ${Error}`);
    }
};
 
module.exports = { readPersonFiles, PERSON_PATH };