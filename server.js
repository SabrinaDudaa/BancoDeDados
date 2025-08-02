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
  res.sendFile(path.join(__dirname, 'public', 'CadPessoa.html'));
});

// Rota POST para cadastrar pessoa
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
    // Inserir cidade (ou bairro/UF) se não existir
    const cidadeResult = await db.query(
      `INSERT INTO Cidade (nomeCidade, Bairro, UF) 
       VALUES ($1, $2, $3)
       RETURNING idCidade`,
      [cidade, bairro, uf]
    );
    const idCidade = cidadeResult.rows[0].idcidade;

    // Inserir endereço
    const enderecoResult = await db.query(
      `INSERT INTO Endereco (Logradouro, Referencia, idCidade)
       VALUES ($1, $2, $3)
       RETURNING idEndereco`,
      [rua, cep, idCidade]
    );
    const idEndereco = enderecoResult.rows[0].idendereco;

    // Inserir pessoa
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

// Rota GET para listar pessoas
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

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
