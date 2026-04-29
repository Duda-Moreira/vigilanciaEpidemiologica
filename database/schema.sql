CREATE DATABASE IF NOT EXISTS epidemia
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE epidemia;

CREATE TABLE IF NOT EXISTS casos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cidade VARCHAR(100) NOT NULL,
    data_coleta DATE NOT NULL,
    casos INT NOT NULL,
    populacao INT NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_casos_cidade (cidade),
    INDEX idx_casos_data_coleta (data_coleta),
    CONSTRAINT chk_casos_nao_negativo CHECK (casos >= 0),
    CONSTRAINT chk_populacao_positiva CHECK (populacao > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO casos (cidade, data_coleta, casos, populacao)
SELECT 'São Paulo', '2026-04-01', 820, 11451245
WHERE NOT EXISTS (
    SELECT 1 FROM casos WHERE cidade = 'São Paulo' AND data_coleta = '2026-04-01'
);

INSERT INTO casos (cidade, data_coleta, casos, populacao)
SELECT 'Guarulhos', '2026-04-02', 310, 1291784
WHERE NOT EXISTS (
    SELECT 1 FROM casos WHERE cidade = 'Guarulhos' AND data_coleta = '2026-04-02'
);

INSERT INTO casos (cidade, data_coleta, casos, populacao)
SELECT 'Osasco', '2026-04-03', 95, 728615
WHERE NOT EXISTS (
    SELECT 1 FROM casos WHERE cidade = 'Osasco' AND data_coleta = '2026-04-03'
);

INSERT INTO casos (cidade, data_coleta, casos, populacao)
SELECT 'Santo André', '2026-04-04', 180, 748919
WHERE NOT EXISTS (
    SELECT 1 FROM casos WHERE cidade = 'Santo André' AND data_coleta = '2026-04-04'
);

INSERT INTO casos (cidade, data_coleta, casos, populacao)
SELECT 'São Bernardo do Campo', '2026-04-05', 520, 810729
WHERE NOT EXISTS (
    SELECT 1 FROM casos WHERE cidade = 'São Bernardo do Campo' AND data_coleta = '2026-04-05'
);