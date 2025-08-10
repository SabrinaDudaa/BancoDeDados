CREATE TABLE Adotante (
    idAdotante INT NOT NULL,
        CONSTRAINT pkAdotante PRIMARY KEY (idAdotante),
        CONSTRAINT fkAdotantePessoa FOREIGN KEY (idAdotante)
            REFERENCES Pessoa(idPessoa)
);
