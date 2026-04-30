# Epidemia Monitoramento

Este projeto permite cadastrar, listar, buscar, atualizar, excluir e visualizar registros de casos de doenças em um mapa interativo. Os dados são persistidos em banco MySQL e consumidos pelo frontend via API REST.

O sistema foi pensado para funcionar localmente em `localhost`, com o Spring Boot servindo tanto a API quanto os arquivos estáticos do frontend.

## Funcionalidades

- Cadastro de novos registros de casos.
- Listagem de todos os registros salvos.
- Busca de casos por cidade.
- Atualização e exclusão de registros.
- Mapa interativo com Leaflet.
- Marcadores para 5 cidades da Grande São Paulo.
- Cores por nível de casos:
  - Verde: baixo (menos de 100 casos).
  - Amarelo: médio (100 a 499 casos).
  - Vermelho: alto (500 ou mais casos).
- Formulário web integrado à API.
- Tabela com ações de editar e excluir.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Bean Validation |
| Banco de dados | MySQL 8 |
| Frontend | HTML5, CSS3, JavaScript puro, Leaflet |
| Build | Maven |

## Estrutura do Projeto

```
.
+-- database/
|   +-- schema.sql
+-- src/
|   +-- main/
|       +-- java/com/monitoramento/epidemia/
|       |   +-- controller/
|       |   |   +-- CasoController.java
|       |   +-- exception/
|       |   |   +-- ApiErro.java
|       |   |   +-- ApiExceptionHandler.java
|       |   |   +-- RecursoNaoEncontradoException.java
|       |   +-- model/
|       |   |   +-- Caso.java
|       |   +-- repository/
|       |   |   +-- CasoRepository.java
|       |   +-- service/
|       |   |   +-- CasoService.java
|       |   +-- EpidemiaApplication.java
|       +-- resources/
|           +-- static/
|           |   +-- app.js
|           |   +-- index.html
|           |   +-- styles.css
|           +-- application.properties
+-- pom.xml
+-- README.md
```

## Modelo de Dados

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | Long | Identificador único (auto-incremento) |
| cidade | String | Nome da cidade (obrigatório, máx. 100 caracteres) |
| dataColeta | LocalDate | Data da coleta dos dados (obrigatório) |
| casos | int | Número de casos registrados (≥ 0) |
| populacao | int | População da cidade (> 0) |

## Cidades Monitoradas

- São Paulo (população: 11.451.245)
- Guarulhos (população: 1.291.784)
- Osasco (população: 728.615)
- Santo André (população: 748.919)
- São Bernardo do Campo (população: 810.729)

## Dependências do Spring Initializr

- **Project**: Maven
- **Language**: Java
- **Spring Boot**: 3.3.5
- **Group**: com.monitoramento
- **Artifact**: epidemia-monitoramento
- **Package name**: com.monitoramento.epidemia
- **Packaging**: Jar
- **Java**: 17
- **Dependencies**:
  - Spring Web
  - Spring Data JPA
  - MySQL Driver
  - Validation
  - Spring Boot DevTools

## Como Configurar o MySQL

1. Instale o MySQL 8 no seu sistema.
2. Crie um banco de dados chamado `epidemia`:
   ```sql
   CREATE DATABASE epidemia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Execute o script `database/schema.sql` para criar a tabela e inserir dados iniciais.
4. Configure um usuário com permissões no banco (padrão: `root`/`root`).

## Como Rodar no VS Code

### Pré-requisitos

- Java 17 instalado
- Maven instalado
- MySQL 8 rodando localmente
- VS Code com extensão Java (recomendado)

### Passos

1. Clone ou baixe o projeto.
2. Abra o projeto no VS Code.
3. Configure as variáveis de ambiente (opcional):
   - `DB_URL`: URL do banco (padrão: `jdbc:mysql://localhost:3306/epidemia`)
   - `DB_USER`: Usuário do banco (padrão: `root`)
   - `DB_PASSWORD`: Senha do banco (padrão: `root`)
4. Execute o script SQL em `database/schema.sql` no MySQL.
5. No terminal do VS Code, execute:
   ```bash
   mvn spring-boot:run
   ```
6. Abra o navegador em `http://localhost:8080`.

## Endpoints da API

| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/api/casos` | Criar novo registro |
| GET | `/api/casos` | Listar todos os registros |
| GET | `/api/casos/{id}` | Buscar por ID |
| GET | `/api/casos/cidade/{cidade}` | Buscar por cidade |
| PUT | `/api/casos/{id}` | Atualizar registro |
| DELETE | `/api/casos/{id}` | Deletar registro |

### Exemplo JSON para POST

```json
{
  "cidade": "São Paulo",
  "dataColeta": "2026-04-30",
  "casos": 150,
  "populacao": 11451245
}
```

## Regras de Cores do Mapa

- **Verde** (#1f9d55): Menos de 100 casos totais
- **Amarelo** (#d5a514): 100 a 499 casos totais
- **Vermelho** (#d94b3d): 500 ou mais casos totais