const fs = require('fs').promises;
const path = require('path');

const MOVIES_PATH = './movies.json';

const readFileMovies = async () => {
    try {
        const data = await fs.readFile(path.resolve(__dirname, MOVIES_PATH));
        const movies = JSON.parse(data);
        return movies;
    } catch (err) {
        console.error(`Arquivo não pôde ser lido: ${err}`);
    }
    };
    
const writeFile = async (moviesArr) => {
    await fs.writeFile(MOVIES_PATH, JSON.stringify(moviesArr));
};

async function updateMovieData(id, updatedMovieData) {
    const oldMovies = await readFileMovies();
    const filmesAtualizados = { id, ...updatedMovieData };
    const updatedMovies = oldMovies.reduce((moviesList, currentMovie) => {
        if (currentMovie.id === filmesAtualizados.id) return [...moviesList, filmesAtualizados];
        return [...moviesList, currentMovie];
    }, []);

    const updatedData = JSON.stringify(updatedMovies);
    try {
        await writeFile(updatedData);
        console.log(`Atualizou missão com o id ${id}`);

        return filmesAtualizados;
    } catch (err) {
        console.error(`Erro na escrita do arquivo: ${err}`);
    }
}

module.exports = { readFileMovies, writeFile, updateMovieData };