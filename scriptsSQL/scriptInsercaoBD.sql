WITH
insCidade AS (
  INSERT INTO Cidade (nomeCidade, Bairro, UF) VALUES
    ('São Paulo', 'Centro', 'SP'),
    ('Rio de Janeiro', 'Zona Sul', 'RJ'),
    ('Belo Horizonte', 'Savassi', 'MG')
  RETURNING idCidade, nomeCidade
),

insEndereco AS (
  INSERT INTO Endereco (Logradouro, Referencia, idCidade)
  SELECT * FROM (VALUES
    ('Rua A', '12345-678', (SELECT idCidade FROM insCidade WHERE nomeCidade = 'São Paulo')),
    ('Rua B', '23456-789', (SELECT idCidade FROM insCidade WHERE nomeCidade = 'Rio de Janeiro')),
    ('Rua C', '34567-890', (SELECT idCidade FROM insCidade WHERE nomeCidade = 'Belo Horizonte'))
  ) AS vals(Logradouro, Referencia, idCidade)
  RETURNING idEndereco, Logradouro
),

insPessoa AS (
  INSERT INTO Pessoa (nomePessoa, Idade, Email, CPF, Telefone1, Telefone2, idEndereco, idCidade)
  SELECT p.nomePessoa, p.Idade, p.Email, p.CPF, p.Telefone1, p.Telefone2,
         e.idEndereco,
         c.idCidade
  FROM (VALUES
    ('Maria Silva', 30, 'maria@example.com', '12345678900', '111111111', '222222222', 'Rua A', 'São Paulo'),
    ('João Souza', 40, 'joao@example.com', '09876543211', '333333333', NULL, 'Rua B', 'Rio de Janeiro'),
    ('Ana Pereira', 25, 'ana@example.com', '11223344556', '444444444', '555555555', 'Rua C', 'Belo Horizonte')
  ) AS p(nomePessoa, Idade, Email, CPF, Telefone1, Telefone2, Logradouro, nomeCidade)
  JOIN insEndereco e ON e.Logradouro = p.Logradouro
  JOIN insCidade c ON c.nomeCidade = p.nomeCidade
  RETURNING idPessoa, nomePessoa
),

insAdotante AS (
  INSERT INTO Adotante (idAdotante)
  SELECT idPessoa FROM insPessoa
  RETURNING idAdotante
),

insPets AS (
  INSERT INTO Pet (Especie, nomePet, Raca, Chegada, Idade) VALUES
    ('Cachorro', 'Rex', 'Labrador', '2023-02-10', 5),
    ('Gato', 'Mimi', 'Siamês', '2023-05-20', 3),
    ('Gato', 'Pipoca', 'Anão', '2023-07-15', 2),
    ('Cachorro', 'Bolt', 'Pastor Alemão', '2023-08-01', 4)
  RETURNING idPet, nomePet
),

insContratoAdocao AS (
  INSERT INTO ContratoAdocao (Situacao, Data, Pet_idPet, Adotante_idAdotante)
  SELECT
    ado.situacao,
    ado.data,
    pet.idPet,
    adot.idAdotante
  FROM
    (VALUES
      ('Ativo', '2023-08-10'::DATE, 'Rex', 'Maria Silva'),
      ('Ativo', '2023-08-15'::DATE, 'Mimi', 'João Souza'),
      ('Inativo', '2023-07-20'::DATE, 'Pipoca', 'Ana Pereira')
    ) AS ado(situacao, data, nomePet, nomePessoa)
  JOIN insPets pet ON pet.nomePet = ado.nomePet
  JOIN insPessoa p ON p.nomePessoa = ado.nomePessoa
  JOIN insAdotante adot ON adot.idAdotante = p.idPessoa
  RETURNING idContratoAdocao
)

SELECT 'Inserções concluídas com sucesso!';
