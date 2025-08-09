const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db'); // ✅ Usando conexão do arquivo db.js

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* -------------------- ROTAS PESSOA -------------------- */
app.post('/api/pessoas', async (req, res) => {
  const {
    nomePessoa,
    cpf,
    idade,
    email,
    cep,
    rua,
    bairro,
    cidade,
    uf,
    telefone1,
    telefone2,
  } = req.body;

  try {
    const cidadeResult = await db.query(
      `INSERT INTO Cidade (nomeCidade, Bairro, UF) 
       VALUES ($1, $2, $3)
       RETURNING idCidade`,
      [cidade, bairro, uf]
    );
    const idCidade = cidadeResult.rows[0].idcidade;

    const enderecoResult = await db.query(
      `INSERT INTO Endereco (Logradouro, Referencia, idCidade)
       VALUES ($1, $2, $3)
       RETURNING idEndereco`,
      [rua, cep, idCidade]
    );
    const idEndereco = enderecoResult.rows[0].idendereco;

    await db.query(
      `INSERT INTO Pessoa 
       (nomePessoa, CPF, Idade, Email, Telefone1, Telefone2, idEndereco, idCidade)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        nomePessoa,
        cpf,
        parseInt(idade),
        email,
        telefone1,
        telefone2 || null,
        idEndereco,
        idCidade,
      ]
    );

    res.status(201).json({ message: 'Pessoa cadastrada com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar no banco:', error);
    res.status(500).json({ error: 'Erro ao cadastrar pessoa' });
  }
});

app.get('/api/pessoas', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, e.Logradouro AS rua, e.Referencia AS cep, c.nomeCidade AS cidade, c.Bairro AS bairro, c.UF AS uf 
      FROM Pessoa p
      JOIN Endereco e ON p.idEndereco = e.idEndereco
      JOIN Cidade c ON p.idCidade = c.idCidade
      ORDER BY p.idPessoa DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
});

/* -------------------- ROTAS PET -------------------- */
app.post('/api/pet', async (req, res) => {
  const { Especie, nomePet, Raca, Chegada, Idade } = req.body;

  try {
    await db.query(
      `INSERT INTO Pet (Especie, nomePet, Raca, Chegada, Idade) 
       VALUES ($1, $2, $3, $4, $5)`,
      [Especie, nomePet, Raca, Chegada, parseInt(Idade)]
    );

    res.status(201).json({ message: 'Pet cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar pet:', error);
    res.status(500).json({ error: 'Erro ao cadastrar pet' });
  }
});

app.get('/api/pet', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM Pet ORDER BY idPet DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({ error: 'Erro ao buscar pets' });
  }
});

// Rota para contar pessoas
app.get('/api/quantidade-pessoas', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) AS quantidade FROM Pessoa');
        res.json({ quantidade: parseInt(result.rows[0].quantidade, 10) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar quantidade de pessoas');
    }
});

// Rota para contar pets por espécie
app.get('/api/pets-por-tipo', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT Especie, COUNT(*) AS quantidade
            FROM Pet
            GROUP BY Especie
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar dados de pets por tipo');
    }
});

/* -------------------- INICIAR SERVIDOR -------------------- */
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});