# Epidemia Monitoramento

Projeto fullstack para monitoramento de registros de casos de doenças em cidades da Grande São Paulo.

O backend é um aplicativo Spring Boot que expõe a API REST em `/api/casos`. O frontend é servido pelos arquivos estáticos em `src/main/resources/static` e usa Leaflet para mostrar os dados no mapa.

## Funcionalidades

- Cadastro, edição e exclusão de registros de casos.
- Listagem de registros em tabela com ações de editar e excluir.
- Mapa interativo com marcadores para cidades.
- Indicadores de risco por cores:
  - Verde: baixo (menos de 100 casos)
  - Amarelo: médio (100 a 499 casos)
  - Vermelho: alto (500 ou mais casos)
- Estatísticas de casos totais, cidades monitoradas e casos do dia.
- Tema claro/escuro.

## Tecnologias

- Java 17
- Spring Boot 3.3.5
- Spring Web
- Spring Data JPA
- Bean Validation
- MySQL
- HTML5, CSS3, JavaScript puro
- Leaflet
- Maven

## Modelo de dados

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `Long` | Identificador único |
| `cidade` | `String` | Nome da cidade |
| `dataColeta` | `LocalDate` | Data da coleta |
| `casos` | `int` | Número de casos (>= 0) |
| `populacao` | `int` | População da cidade |

## Cidades monitoradas

- São Paulo
- Guarulhos
- Osasco
- Santo André
- São Bernardo do Campo

## Configuração do MySQL

O projeto usa MySQL e aceita configuração por variáveis de ambiente.

Valores padrão em `application.properties`:

```properties
DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo&useUnicode=true&characterEncoding=UTF-8
DB_USER=root
DB_PASSWORD=root
```

### Criar o banco

Execute o script em `database/schema.sql` ou crie o banco manualmente:

```sql
CREATE DATABASE epidemia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Como rodar

### Pré-requisitos

- Java 17
- Maven
- MySQL 8

### Passos

1. Abra o projeto no VS Code ou terminal.
2. Ajuste a conexão do MySQL se necessário.
3. Execute:

```bash
mvn spring-boot:run
```

4. Acesse:

```text
http://localhost:8080
```

## Endpoints da API

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/api/casos` | Listar todos os registros |
| `GET` | `/api/casos/{id}` | Buscar registro por ID |
| `GET` | `/api/casos/cidade/{cidade}` | Buscar registros por cidade |
| `POST` | `/api/casos` | Criar novo registro |
| `PUT` | `/api/casos/{id}` | Atualizar registro |
| `DELETE` | `/api/casos/{id}` | Deletar registro |

### Exemplo de payload para `POST`

```json
{
  "cidade": "São Paulo",
  "dataColeta": "2026-04-30",
  "casos": 150,
  "populacao": 11451245
}
```

## Observações

- O frontend está em `src/main/resources/static` e é servido automaticamente pelo Spring Boot.
- Caso use outra porta, ajuste o navegador para o valor configurado em `server.port`.
