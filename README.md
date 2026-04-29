Este projeto permite cadastrar, listar, buscar, atualizar, excluir e visualizar registros de casos de doenças em um mapa interativo. Os dados são persistidos em banco MySQL e consumidos pelo frontend via API REST.

O sistema foi pensado para funcionar localmente em `localhost`, com o Spring Boot servindo tanto a API quanto os arquivos estáticos do frontend.

### Funcionalidades

- Cadastro de novos registros de casos.
- Listagem de todos os registros salvos.
- Busca de casos por cidade.
- Atualização e exclusão de registros.
- Mapa interativo com Leaflet.
- Marcadores para 5 cidades da Grande Sao Paulo.
- Cores por nível de casos:
  - Verde: baixo.
  - Amarelo: médio.
  - Vermelho: alto.
- Formulário web integrado à API.
- Tabela com ações de editar e excluir.

### Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Java 17, Spring Boot, Spring Web, Spring Data JPA, Bean Validation |
| Banco de dados | MySQL 8 |
| Frontend | HTML5, CSS3, JavaScript puro, Leaflet |
| Build | Maven |

### Estrutura do Projeto

```text
.
+-- database/
|   +-- schema.sql
+-- src/
|   +-- main/
|       +-- java/com/monitoramento/epidemia/
|       |   +-- controller/
|       |   +-- exception/
|       |   +-- model/
|       |   +-- repository/
|       |   +-- service/
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

### Modelo de Dados

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `Long` | Identificador único do registro |
| `cidade` | `String` | Nome da cidade |
| `dataColeta` | `LocalDate` | Data da coleta dos dados |
| `casos` | `int` | Número de casos registrados |
| `populacao` | `int` | População da cidade |

### Cidades Monitoradas

- São Paulo
- Guarulhos
- Osasco
- Santo André
- São Bernardo do Campo

As coordenadas estão definidas diretamente em `src/main/resources/static/app.js`.

### Pré-requisitos

- Java 17 ou superior.
- Maven 3.9 ou superior.
- MySQL 8 ou superior.
- VS Code com extensões Java e Spring Boot Extension Pack.

### Configuração do Banco de Dados

Execute o script SQL para criar o banco `epidemia`, criar a tabela `casos` e inserir dados iniciais:

```bash
mysql -u root -p < database/schema.sql
```

Configuração padrão em `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/epidemia
spring.datasource.username=root
spring.datasource.password=root
```

Se o usuário ou senha forem diferentes, altere o arquivo `application.properties` ou use variáveis de ambiente.

No PowerShell:

```powershell
$env:DB_USER="seu_usuario"
$env:DB_PASSWORD="sua_senha"
mvn spring-boot:run
```

No Bash:

```bash
DB_USER=seu_usuario DB_PASSWORD=sua_senha mvn spring-boot:run
```

### Como Executar

1. Clone ou abra este projeto no VS Code.
2. Inicie o MySQL.
3. Execute `database/schema.sql`.
4. Ajuste as credenciais do banco, se necessário.
5. Rode o backend:

```bash
mvn spring-boot:run
```

O Spring Boot serve automaticamente o frontend localizado em `src/main/resources/static`.

### Endpoints da API

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/api/casos` | Cria um novo registro |
| `GET` | `/api/casos` | Lista todos os registros |
| `GET` | `/api/casos/{id}` | Busca um registro por ID |
| `GET` | `/api/casos/cidade/{cidade}` | Busca registros por cidade |
| `PUT` | `/api/casos/{id}` | Atualiza um registro |
| `DELETE` | `/api/casos/{id}` | Remove um registro |

### Regras de Cores no Mapa

| Total de casos | Cor | Nível |
| --- | --- | --- |
| Menos de 100 | Verde | Baixo |
| 100 a 499 | Amarelo | Médio |
| 500 ou mais | Vermelho | Alto |

### Observações

- A API e o banco funcionam localmente.
- O mapa usa Leaflet com tiles do OpenStreetMap via CDN.
- Para visualizar o fundo do mapa, é necessário acesso à internet.