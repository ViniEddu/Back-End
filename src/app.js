const fs = require('fs').promises;
const express = require('express');
const { readPersonFiles, PERSON_PATH } = require('./fsUtils');

const app = express();
app.use(express.json());

app.get('/movies/search', async (req, res) => {
    try {
        const { q } = req.query;
        const pessoas = await readPersonFiles();

        if (q) {
            const pessoasFiltradas = pessoas.filter((element) => element.pessoa.includes(q));
            return res.status(200).json(pessoasFiltradas);
        }
        res.status(200).end();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/pessoas/:id', async (req, res) => {
    try {
        const pessoas = await readPersonFiles();
        const pessoa = pessoas.find(({ id }) => id === Number(req.params.id));
        res.status(200).json(pessoa);
    } catch (Error) {
        res.status(500).send({ message: Error.message });
    }
});

app.get('/pessoas', async (_req, res) => {
    try {
        const pessoas = await readPersonFiles();
        res.status(200).json(pessoas);
    } catch (Error) {
        res.status(500).send({ message: Error.message });
    }
});

app.post('/pessoas', async (req, res) => {
    try {
        const { name, age } = req.body;
        const pessoas = await readPersonFiles();
        const novaPessoa = {
            id: pessoas[pessoas.length - 1].id + 1,
            name,
            age,
        };
        const allPeoples = JSON.stringify([...pessoas, novaPessoa]);
        await fs.writeFile(PERSON_PATH, allPeoples);
        res.status(200).json(novaPessoa);
    } catch (Error) {
        res.status(500).send({ message: Error.message });
    }
});

app.put('/pessoas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;
        const pessoas = await readPersonFiles();
        const index = pessoas.findIndex((element) => element.id === Number(id));
        pessoas[index] = { id: Number(id), name, age };

        const pessoasAtualizadas = JSON.stringify(pessoas, null, 2);
        await fs.writeFile(PERSON_PATH, pessoasAtualizadas);
        res.status(200).json(pessoas[index]);
    } catch (Error) {
        res.status(500).send({ message: Error.message });
    }
});

app.delete('/pessoas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pessoas = await readPersonFiles();
        const pessoasFiltradas = pessoas.filter((pessoa) => pessoa.id !== Number(id));
        const pessoasAtualizadas = JSON.stringify(pessoasFiltradas, null, 2);
        await fs.writeFile(PERSON_PATH, pessoasAtualizadas);
        res.status(204).end();
    } catch (Error) {
        res.status(500).send({ message: Error.message });
    }
});

module.exports = app;