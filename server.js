const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db');

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
    tiposPessoa = []
  } = req.body;

  console.log('Tipos recebidos no servidor:', tiposPessoa);

  try {
    // Iniciar transação
    await db.query('BEGIN');

    // 1. Inserir cidade
    const cidadeResult = await db.query(
      `INSERT INTO Cidade (nomeCidade, Bairro, UF) 
       VALUES ($1, $2, $3)
       RETURNING idCidade`,
      [cidade, bairro, uf]
    );
    const idCidade = cidadeResult.rows[0].idcidade;

    // 2. Inserir endereço
    const enderecoResult = await db.query(
      `INSERT INTO Endereco (Logradouro, Referencia, idCidade)
       VALUES ($1, $2, $3)
       RETURNING idEndereco`,
      [rua, cep, idCidade]
    );
    const idEndereco = enderecoResult.rows[0].idendereco;

    // 3. Inserir pessoa
    const pessoaResult = await db.query(
      `INSERT INTO Pessoa 
       (nomePessoa, CPF, Idade, Email, Telefone1, Telefone2, idEndereco, idCidade)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING idPessoa`,
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
    const idPessoa = pessoaResult.rows[0].idpessoa;

    // 4. Inserir nos cargos conforme selecionado
    if (tiposPessoa.includes('adotante')) {
      await db.query(`INSERT INTO Adotante (idAdotante) VALUES ($1)`, [idPessoa]);
      console.log('Inserido como adotante');
    }
    if (tiposPessoa.includes('voluntario')) {
      await db.query(`INSERT INTO Voluntario (idVoluntario) VALUES ($1)`, [idPessoa]);
      console.log('Inserido como voluntário');
    }
    if (tiposPessoa.includes('doador')) {
      await db.query(`INSERT INTO Doador (idDoador) VALUES ($1)`, [idPessoa]);
      console.log('Inserido como doador');
    }

    // Commit da transação
    await db.query('COMMIT');
    res.status(201).json({ message: 'Pessoa cadastrada com sucesso!' });
  } catch (error) {
    // Rollback em caso de erro
    await db.query('ROLLBACK');
    console.error('Erro ao salvar no banco:', error);
    res.status(500).json({ error: 'Erro ao cadastrar pessoa', details: error.message });
  }
});

app.get('/api/pessoas', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*, 
        e.Logradouro AS rua, 
        e.Referencia AS cep, 
        c.nomeCidade AS cidade, 
        c.Bairro AS bairro, 
        c.UF AS uf,
        EXISTS(SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa) AS is_adotante,
        EXISTS(SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa) AS is_voluntario,
        EXISTS(SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa) AS is_doador
      FROM Pessoa p
      JOIN Endereco e ON p.idEndereco = e.idEndereco
      JOIN Cidade c ON p.idCidade = c.idCidade
      ORDER BY p.idPessoa DESC
    `);

    // Transformar os booleanos em uma lista de cargos
    const pessoasComCargos = result.rows.map(pessoa => {
      const cargos = [];
      if (pessoa.is_adotante) cargos.push('Adotante');
      if (pessoa.is_voluntario) cargos.push('Voluntário');
      if (pessoa.is_doador) cargos.push('Doador');
      
      return {
        ...pessoa,
        cargos: cargos.length > 0 ? cargos.join(', ') : 'Nenhum cargo'
      };
    });

    console.log('Pessoas retornadas:', pessoasComCargos);
    res.json(pessoasComCargos);
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    res.status(500).json({ error: 'Erro ao buscar pessoas', details: error.message });
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
    res.status(500).json({ error: 'Erro ao cadastrar pet', details: error.message });
  }
});

app.get('/api/pet', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM Pet ORDER BY idPet DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({ error: 'Erro ao buscar pets', details: error.message });
  }
});

app.get('/api/pets-adotados-ativos', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*
      FROM Pet p
      JOIN ContratoAdocao ca ON p.idPet = ca.Pet_idPet
      WHERE ca.Situacao = 'Ativo'
      ORDER BY p.nomePet
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar pets adotados ativos:', error);
    res.status(500).json({ error: 'Erro ao buscar pets adotados ativos', details: error.message });
  }
});

app.get('/api/pets-disponiveis', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM Pet p
      WHERE p.idPet NOT IN (
        SELECT Pet_idPet
        FROM ContratoAdocao
        WHERE Situacao = 'Ativo'
      )
      ORDER BY p.nomePet
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar pets disponíveis:', error);
    res.status(500).json({ error: 'Erro ao buscar pets disponíveis', details: error.message });
  }
});
// Rota para contar combinações de cargos das pessoas
app.get('/api/tipos-pessoas', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) FILTER (
          WHERE NOT EXISTS (SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa)
          AND NOT EXISTS (SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa)
          AND NOT EXISTS (SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa)
        ) AS nenhum,

        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa)
          AND NOT EXISTS (SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa)
          AND NOT EXISTS (SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa)
        ) AS voluntario,

        COUNT(*) FILTER (
          WHERE NOT EXISTS (SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa)
          AND EXISTS (SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa)
          AND NOT EXISTS (SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa)
        ) AS adotante,

        COUNT(*) FILTER (
          WHERE NOT EXISTS (SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa)
          AND NOT EXISTS (SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa)
          AND EXISTS (SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa)
        ) AS doador,

        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa)
          AND EXISTS (SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa)
          AND NOT EXISTS (SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa)
        ) AS voluntario_adotante,

        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa)
          AND NOT EXISTS (SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa)
          AND EXISTS (SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa)
        ) AS voluntario_doador,

        COUNT(*) FILTER (
          WHERE NOT EXISTS (SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa)
          AND EXISTS (SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa)
          AND EXISTS (SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa)
        ) AS doador_adotante,

        COUNT(*) FILTER (
          WHERE EXISTS (SELECT 1 FROM Voluntario v WHERE v.idVoluntario = p.idPessoa)
          AND EXISTS (SELECT 1 FROM Adotante a WHERE a.idAdotante = p.idPessoa)
          AND EXISTS (SELECT 1 FROM Doador d WHERE d.idDoador = p.idPessoa)
        ) AS voluntario_adotante_doador
      FROM Pessoa p
    `;

    const result = await db.query(query);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar tipos de pessoas');
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
    res.status(500).json({ error: 'Erro ao buscar dados de pets por tipo', details: error.message });
  }
});

/* -------------------- ROTAS ADOTANTE -------------------- */
app.get('/api/adotantes', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.idPessoa, p.nomePessoa, p.cpf
      FROM Adotante a
      JOIN Pessoa p ON a.idAdotante = p.idPessoa
      ORDER BY p.nomePessoa
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar adotantes:', error);
    res.status(500).json({ error: 'Erro ao buscar adotantes', details: error.message });
  }
});

/* -------------------- ROTAS CONTRATO DE ADOÇÃO -------------------- */
app.post('/api/adocao', async (req, res) => {
  const { idAdotante, idPet, dataAdocao } = req.body;

  if (!idAdotante || !idPet || !dataAdocao) {
    return res.status(400).json({ error: 'Campos idAdotante, idPet e dataAdocao são obrigatórios' });
  }

  try {
    await db.query(
      `INSERT INTO ContratoAdocao (Situacao, Data, Pet_idPet, Adotante_idAdotante) 
       VALUES ($1, $2, $3, $4)`,
      ['Ativo', dataAdocao, idPet, idAdotante]
    );

    res.status(201).json({ message: 'Adoção cadastrada com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar adoção:', error);
    res.status(500).json({ error: 'Erro ao cadastrar adoção', details: error.message });
  }
});

// Rota para verificar CPF
app.get('/api/verificar-cpf', async (req, res) => {
  try {
    const { cpf } = req.query;
    
    // Validação básica
    if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    // Consulta ao banco de dados
    const result = await db.query(
      'SELECT 1 FROM Pessoa WHERE CPF = $1 LIMIT 1',
      [cpf]
    );
    
    res.json({ existe: result.rowCount > 0 });
    
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});
/* -------------------- INICIAR SERVIDOR -------------------- */
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});