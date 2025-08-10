CREATE TABLE Cidade (
    idCidade SERIAL NOT NULL,
    nomeCidade VARCHAR(100) NOT NULL,
    Bairro  VARCHAR(50) NOT NULL,
    UF VARCHAR(50) NOT NULL,
     CONSTRAINT pkCidade PRIMARY KEY (idCidade)
);

CREATE TABLE Endereco (
    idEndereco SERIAL NOT NULL,
    Logradouro VARCHAR(100) NOT NULL,
    Referencia VARCHAR(100),
    idCidade INTEGER NOT NULL, 
        CONSTRAINT pkEndereco PRIMARY KEY (idEndereco),
        CONSTRAINT fkEnderecoCidade FOREIGN KEY (idCidade)
            REFERENCES Cidade(idCidade)
);

CREATE TABLE Pessoa (
    idPessoa SERIAL NOT NULL,
    nomePessoa VARCHAR(100) NOT NULL,
    Idade INTEGER NOT NULL,
    Email VARCHAR(100) NOT NULL,
    CPF VARCHAR(100) NOT NULL,
    Telefone1 VARCHAR(50) NOT NULL,
    Telefone2 VARCHAR(50),
    idEndereco INTEGER NOT NULL, 
    idCidade INTEGER NOT NULL,   
        CONSTRAINT pkPessoa PRIMARY KEY (idPessoa),
        CONSTRAINT fkPessoaEndereco FOREIGN KEY (idEndereco)
            REFERENCES Endereco(idEndereco),
        CONSTRAINT fkPessoaCidade FOREIGN KEY (idCidade)
            REFERENCES Cidade(idCidade)
);

CREATE TABLE Adotante (
    idAdotante INT NOT NULL,
        CONSTRAINT pkAdotante PRIMARY KEY (idAdotante),
        CONSTRAINT fkAdotantePessoa FOREIGN KEY (idAdotante)
            REFERENCES Pessoa(idPessoa)
);

CREATE TABLE Pet(
    idPet SERIAL NOT NULL,
    Especie VARCHAR(100) NOT NULL,
    nomePet VARCHAR(100) NOT NULL,
    Raca VARCHAR(100) NOT NULL,
    Chegada VARCHAR(100) NOT NULL,
    Idade INTEGER NOT NULL,
        CONSTRAINT pkPet PRIMARY KEY (idPet)
);

CREATE TABLE ContratoAdocao (
    idContratoAdocao SERIAL NOT NULL,
    Situacao VARCHAR(45) NOT NULL,
    Data DATE NOT NULL,
    Pet_idPet INTEGER NOT NULL,
    Adotante_idAdotante INTEGER NOT NULL,
        CONSTRAINT pkContratoAdocao PRIMARY KEY (idContratoAdocao),
        CONSTRAINT fkContratoAdocaoPet FOREIGN KEY (Pet_idPet)
            REFERENCES Pet(idPet),
        CONSTRAINT fkContratoAdocaoAdotante FOREIGN KEY (Adotante_idAdotante)
            REFERENCES Adotante(idAdotante)
);

