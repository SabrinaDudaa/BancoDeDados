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
