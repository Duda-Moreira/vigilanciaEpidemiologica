# Vigilância Epidemiológica

Projeto fullstack para monitoramento de registros de casos de dengue em cidades da Grande São Paulo. Funciona em qualquer computador com Java 17 e Maven instalados.

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
- Tema claro/escuro otimizado.
- Exportação de relatórios em PDF.

## Tecnologias

- Java 17
- Spring Boot 3.3.5
- Spring Web
- Spring Data JPA
- Bean Validation
- H2 Database (padrão) / MySQL (opcional)
- HTML5, CSS3, JavaScript puro
- Leaflet.js (mapas)
- jsPDF (geração de relatórios)
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

### Opção 1: H2 em memória (padrão - desenvolvimento)

O projeto usa **H2 em memória por padrão**. Não requer configuração adicional. Os dados são mantidos enquanto a aplicação estiver rodando.

### Opção 2: MySQL (produção)

Se quiser conectar ao MySQL, configure as variáveis de ambiente antes de iniciar:

**Windows (CMD):**
```cmd
set DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo&useUnicode=true&characterEncoding=UTF-8
set DB_USER=root
set DB_PASSWORD=sua_senha_aqui
```

**Linux/Mac (Terminal):**
```bash
export DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo&useUnicode=true&characterEncoding=UTF-8
export DB_USER=root
export DB_PASSWORD=sua_senha_aqui
```

Ou crie o banco manualmente executando o script em `database/schema.sql`:

```sql
CREATE DATABASE epidemia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Pré-requisitos

- **Java 17** ou superior ([Download](https://www.oracle.com/java/technologies/downloads/#java17))
- **Maven 3.6.0** ou superior ([Download](https://maven.apache.org/download.cgi))
- (Opcional) **MySQL 8.0** ou superior para usar banco de dados persistente

### Verificar se Java e Maven estão instalados

**Windows (CMD):**
```cmd
java -version
mvn -version
```

**Linux/Mac (Terminal):**
```bash
java -version
mvn -version
```

Se não aparecer a versão, instale Java e Maven conforme links acima.

## Como clonar e rodar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/vigilanciaEpidemiologica.git
cd vigilanciaEpidemiologica
```

### 2. Opção A: Use os scripts de inicialização (recomendado)

**Windows:**
```cmd
start-windows.bat
```

**Linux / macOS:**
```bash
chmod +x start-linux-mac.sh
./start-linux-mac.sh
```

Os scripts verificarão Java e Maven, e oferecerão opções para:
- Rodar com H2 (desenvolvimento)
- Rodar com MySQL (produção)
- Recompilar o projeto
- Ver logs detalhados

### 3. Opção B: Comandos manuais

Compile o projeto:
```bash
mvn clean install -DskipTests
```

Inicie a aplicação:

**Padrão (H2 em memória):**
```bash
mvn spring-boot:run
```

**Com MySQL (após configurar variáveis de ambiente):**
```bash
mvn spring-boot:run
```

### 4. Acesse a aplicação

Abra no navegador:
```text
http://localhost:8080
```

A aplicação carregará com:
- Dashboard com estatísticas
- Mapa interativo
- Formulário de cadastro
- Tabela de registros
- Gerador de relatórios em PDF

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
  "dataColeta": "2026-05-05",
  "casos": 150,
  "populacao": 11451245
}
```

## Variáveis de ambiente (avançado)

Você pode customizar a porta do servidor e outras configurações:

**Windows (CMD):**
```cmd
set SERVER_PORT=9090
set DB_URL=jdbc:mysql://seu_servidor:3306/epidemia
set DB_USER=seu_usuario
set DB_PASSWORD=sua_senha
```

**Linux/Mac (Terminal):**
```bash
export SERVER_PORT=9090
export DB_URL=jdbc:mysql://seu_servidor:3306/epidemia
export DB_USER=seu_usuario
export DB_PASSWORD=sua_senha
```

Em seguida, execute:
```bash
mvn spring-boot:run
```

## Estrutura do projeto

```
vigilanciaEpidemiologica/
├── src/
│   └── main/
│       ├── java/com/monitoramento/epidemia/
│       │   ├── EpidemiaApplication.java       # Classe principal
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   ├── model/
│       │   └── exception/
│       └── resources/
│           ├── application.properties         # Configurações (H2 padrão)
│           └── static/                       # Frontend
│               ├── index.html
│               ├── styles.css
│               └── app.js
├── database/
│   └── schema.sql                           # Script SQL para MySQL (opcional)
├── pom.xml                                  # Dependências Maven
├── README.md                                # Este arquivo
├── application-example.properties           # Exemplo de configuração com MySQL
├── .gitignore                               # Arquivos ignorados pelo Git
├── start-windows.bat                        # Script de inicialização (Windows)
└── start-linux-mac.sh                       # Script de inicialização (Linux/Mac)
```

## Arquivos de configuração

- **application.properties**: Configuração padrão (H2 em memória). Usa variáveis de ambiente com defaults.
- **application-example.properties**: Exemplo de como configurar com MySQL e outras opções avançadas.
- **.gitignore**: Define arquivos que não devem ser versionados (binários, logs, etc).
- **start-windows.bat** e **start-linux-mac.sh**: Scripts que automatizam a inicialização.

## Observações importantes

1. **Frontend automático**: O Spring Boot serve automaticamente os arquivos estáticos de `src/main/resources/static`. Não precisa de servidor web separado.

2. **Banco de dados padrão**: H2 em memória funciona sem configuração. Use MySQL apenas se precisar de persistência ou ambiente de produção.

3. **Porta customizável**: Se 8080 já estiver em uso, configure `SERVER_PORT`:
   ```bash
   set SERVER_PORT=9090
   ```
   E acesse `http://localhost:9090`

4. **Logs da aplicação**: Use `-X` para debug:
   ```bash
   mvn -X spring-boot:run
   ```

5. **Modo desenvolvimento**: O projeto já inclui Hot Reload via Spring Boot DevTools. Qualquer mudança em código Java recompila automaticamente.

## Troubleshooting

### "Java não encontrado"
- Instale Java 17: [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17)
- Adicione Java ao PATH do sistema

### "Maven não encontrado"
- Instale Maven: [Apache Maven](https://maven.apache.org/download.cgi)
- Adicione Maven ao PATH do sistema

### "Porta 8080 já em uso"
```bash
set SERVER_PORT=9090
mvn spring-boot:run
```

### "Banco de dados indisponível"
- Use H2 padrão (sem configurar DB_URL)
- Ou certifique-se MySQL está rodando e configurado corretamente

## Licença

Este projeto é fornecido como está, sem garantias. Use livremente para desenvolvimento e aprendizado.
