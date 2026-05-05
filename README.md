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

## Configuração do banco de dados

O projeto usa H2 em memória por padrão para desenvolvimento local. Se quiser conectar ao MySQL, defina as variáveis de ambiente abaixo.

Valores opcionais em `application.properties`:

```properties
DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo&useUnicode=true&characterEncoding=UTF-8
DB_USER=root
DB_PASSWORD=root
```

### Criar o banco MySQL

Execute o script em `database/schema.sql` ou crie o banco manualmente:

```sql
CREATE DATABASE epidemia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Como rodar

### Pré-requisitos

- Java 17
- Maven 3 ou superior

> A API já pode rodar localmente usando H2 em memória sem MySQL.

### Passos no Windows CMD

1. Abra o Prompt de Comando (CMD).
2. Navegue até a pasta do projeto:

```cmd
cd C:\Users\force\OneDrive\Documentos\GitHub\vigilanciaEpidemiologica
```

3. Se quiser usar MySQL em vez de H2, defina as variáveis de ambiente antes de iniciar (opcional):

```cmd
set DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo&useUnicode=true&characterEncoding=UTF-8
set DB_USER=root
set DB_PASSWORD=root
```

4. Execute o backend:

```cmd
mvn -DskipTests spring-boot:run
```

5. Abra no navegador:

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
- A API agora pode rodar localmente com H2 em memória por padrão. Use MySQL apenas se quiser conectar ao banco externo configurando `DB_URL`, `DB_USER` e `DB_PASSWORD`.
- Caso use outra porta, ajuste o navegador para o valor configurado em `server.port`.
