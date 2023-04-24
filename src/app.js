const express = require('express');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

const readFile = async () => {
    const movies = await fs.readFile('src/movies.json', 'utf-8');
        return JSON.parse(movies);
    };
    
const writeFile = async (moviesArr) => {
    await fs.writeFile('src/movies.json', JSON.stringify(moviesArr));
};

// Utilizado para buscar algum id por parametro convertido em número uma vez que inicialmente URL é string.
app.get('/movies/:id', async (req, res) => {
    const movies = await readFile();
    const movieFound = movies.find(
        (movie) => movie.id === Number(req.params.id),
    );
    return res.status(200).json(movieFound);
});

app.get('/movies', async (req, res) => {
    const movies = await readFile();
    return res.status(200).json(movies);
});

app.post('/movies', async (req, res) => {
    const movies = await readFile();
    movies.push(req.body);

    await writeFile(movies);

    return res.status(201).json(req.body);
});

app.put('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { movie, price } = req.body;

        const movies = await readFile();
        const index = movies.findIndex((element) => element.id === Number(id));
        movies[index] = { id: Number(id), movie, price };

        const updatedMovies = JSON.stringify(movies);
        await writeFile(updatedMovies);

        return res.status(200).json(movies[index]);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = app;