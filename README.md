# 🦟 Vigilância Epidemiológica - Sistema de Monitoramento de Dengue

Um **sistema web completo e responsivo** para vigilância e monitoramento em tempo real de casos de dengue em cidades da Grande São Paulo. Desenvolvido em **Spring Boot 3.3.5** com interface intuitiva e mapa interativo.

**Funciona em qualquer computador com Java 17+ e Maven 3.6.0+** instalados. Oferece suporte a banco de dados em memória (H2) por padrão ou MySQL para produção.

### 🏗️ Arquitetura

- **Backend**: API REST Spring Boot (`/api/casos`) com validação de dados e tratamento de erros
- **Frontend**: HTML5, CSS3 e JavaScript puro com Leaflet.js para visualização geográfica
- **Banco de Dados**: H2 em memória (desenvolvimento) ou MySQL (produção)
- **Deployment**: Docker incluso para facilitar deploy em ambientes de produção

## Funcionalidades

### 📊 Gerenciamento de Dados
- ✅ **Cadastro de casos**: Registre novos casos com validação em tempo real
- ✏️ **Edição e exclusão**: Atualize ou remova registros existentes
- 🔍 **Busca avançada**: Pesquise por cidade, data ou visualize todos os registros
- 📋 **Listagem tabular**: Interface limpa com ações rápidas (editar/excluir)

### 🗺️ Visualização Geográfica
- **Mapa interativo** com zoom e pan
- **Marcadores por cidade** com informações em popup
- **Código de cores por risco**:
  - 🟢 **Verde**: Baixo risco (< 100 casos)
  - 🟡 **Amarelo**: Médio risco (100-499 casos)
  - 🔴 **Vermelho**: Alto risco (≥ 500 casos)

### 📈 Estatísticas e Relatórios
- **Dashboard em tempo real** com:
  - Total de casos registrados
  - Número de cidades monitoradas
  - Casos registrados hoje
  - Última atualização do sistema
- 📄 **Exportação em PDF**: Gere relatórios profissionais dos dados

### 🎨 Interface Moderna
- 💡 **Tema claro/escuro**: Alterne entre temas com um clique
- 📱 **Design responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Performance otimizada**: Carregamento rápido e operações fluidas

## 🚀 Início Rápido

### Windows
```cmd
# Terminal CMD
start-windows.bat
```

### Linux/Mac
```bash
# Terminal bash
chmod +x start-linux-mac.sh
./start-linux-mac.sh
```

### Acesso
Abra seu navegador em: **`http://localhost:8080`**

A API REST estará disponível em: **`http://localhost:8080/api/casos`**

---

## 📋 Pré-requisitos

- **Java 17+** ([Download JDK 17](https://www.oracle.com/java/technologies/downloads/#java17))
- **Maven 3.6.0+** ([Download Maven](https://maven.apache.org/download.cgi))
- **(Opcional) MySQL 8.0+** para usar banco de dados persistente

### Verificar instalação

**Windows (CMD):**
```cmd
java -version
mvn -version
```

**Linux/Mac:**
```bash
java -version
mvn -version
```

---

## 💾 Configuração do Banco de Dados

### Opção 1: H2 em memória (Padrão - Desenvolvimento)

✅ **Configuração automática** - sem necessidade de instalação adicional

O projeto usa **H2 em memória por padrão**. Todos os dados são mantidos enquanto a aplicação está rodando. Ideal para testes e desenvolvimento.

### Opção 2: MySQL (Produção Recomendada)

Defina as variáveis de ambiente **antes** de iniciar a aplicação:

**Windows (CMD):**
```cmd
set DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo&useUnicode=true&characterEncoding=UTF-8
set DB_USER=root
set DB_PASSWORD=sua_senha_aqui
```

**Linux/Mac (Bash):**
```bash
export DB_URL=jdbc:mysql://localhost:3306/epidemia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo&useUnicode=true&characterEncoding=UTF-8
export DB_USER=root
export DB_PASSWORD=sua_senha_aqui
```

**Ou execute o script de inicialização do MySQL:**

Para Windows:
```cmd
start-mysql.bat
```

Este script criará o banco de dados automaticamente executando o arquivo `database/schema.sql`.

---

## 🏗️ Tecnologias Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Backend** | Spring Boot | 3.3.5 |
| | Spring Web | 3.3.5 |
| | Spring Data JPA | 3.3.5 |
| | Bean Validation | 3.0 |
| **Banco** | H2 / MySQL | Latest |
| **Frontend** | HTML5 / CSS3 / JavaScript | ES6+ |
| | Leaflet.js | 1.9+ |
| | jsPDF | 2.5+ |
| **Build** | Maven | 3.6.0+ |
| **Runtime** | Java | 17+ |

## 📊 Modelo de Dados

### Entidade: Caso

Representa um registro de dengue em uma cidade específica.

| Campo | Tipo | Validação | Descrição |
|-------|------|-----------|-----------|
| `id` | `Long` | Auto-increment | Identificador único do registro |
| `cidade` | `String` | Obrigatório | Nome da cidade afetada |
| `dataColeta` | `LocalDate` | Obrigatório | Data da coleta do dado |
| `casos` | `int` | ≥ 0 | Número de casos confirmados |
| `populacao` | `int` | > 0 | População da cidade |

---

## 🌍 Cidades Monitoradas

O sistema monitora as seguintes cidades da Grande São Paulo:

| Cidade | Latitude | Longitude | População |
|--------|----------|-----------|-----------|
| São Paulo | -23.55052 | -46.633308 | 11.451.245 |
| Guarulhos | -23.454315 | -46.533652 | 1.291.784 |
| Osasco | -23.532486 | -46.791681 | 728.615 |
| Santo André | -23.66389 | -46.53833 | 748.919 |
| São Bernardo do Campo | -23.69141 | -46.5646 | 810.729 |

---

## 🔌 API REST Endpoints

Todos os endpoints respondent em **JSON** com suporte a CORS.

### Listar todos os casos
```http
GET /api/casos
```
**Response:**
```json
[
  {
    "id": 1,
    "cidade": "São Paulo",
    "dataColeta": "2026-05-12",
    "casos": 450,
    "populacao": 11451245
  }
]
```

### Buscar caso por ID
```http
GET /api/casos/{id}
```

### Buscar casos por cidade
```http
GET /api/casos/cidade/{cidade}
```

### Buscar casos por data
```http
GET /api/casos/data/{data}
```
Format: `YYYY-MM-DD`

### Criar novo caso
```http
POST /api/casos
Content-Type: application/json

{
  "cidade": "São Paulo",
  "dataColeta": "2026-05-12",
  "casos": 500,
  "populacao": 11451245
}
```

### Atualizar caso
```http
PUT /api/casos/{id}
Content-Type: application/json

{
  "cidade": "São Paulo",
  "dataColeta": "2026-05-12",
  "casos": 520,
  "populacao": 11451245
}
```

### Deletar caso
```http
DELETE /api/casos/{id}
```

---

## 📁 Estrutura do Projeto

```
src/main/java/com/monitoramento/epidemia/
├── EpidemiaApplication.java          # Classe principal Spring Boot
├── controller/
│   └── CasoController.java           # REST Controller com endpoints
├── service/
│   └── CasoService.java              # Lógica de negócio
├── repository/
│   └── CasoRepository.java           # Acesso a dados (JPA)
├── model/
│   └── Caso.java                     # Entidade JPA
└── exception/
    ├── ApiExceptionHandler.java      # Tratamento global de erros
    ├── ApiErro.java                  # Modelo de erro
    └── RecursoNaoEncontradoException.java  # Exceção customizada

src/main/resources/
├── application.properties            # Configurações Spring Boot
└── static/
    ├── index.html                    # Interface web
    ├── styles.css                    # Estilos responsivos
    └── app.js                        # Lógica frontend com Leaflet

database/
└── schema.sql                        # Script de criação do banco MySQL
```

---

## 🔧 Configuração do Projeto

O projeto usa o arquivo `application.properties` para configurações:

```properties
spring.application.name=epidemia-monitoramento
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
server.port=8080
```

Para usar variáveis de ambiente com MySQL, as credenciais são automaticamente carregadas das variáveis `DB_URL`, `DB_USER` e `DB_PASSWORD`.

---

## 🐳 Deploy com Docker

O projeto inclui um `Dockerfile` para containerização:

### Construir imagem Docker
```bash
docker build -t epidemia-monitoramento:latest .
```

### Executar container
```bash
docker run -p 8080:8080 epidemia-monitoramento:latest
```

### Com MySQL em container
```bash
# Terminal 1: Inicie MySQL
docker run --name mysql-epidemia -e MYSQL_ROOT_PASSWORD=senha123 -p 3306:3306 mysql:8.0

# Terminal 2: Inicie a aplicação
docker run -p 8080:8080 \
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/epidemia" \
  -e DB_USER=root \
  -e DB_PASSWORD=senha123 \
  epidemia-monitoramento:latest
```

---

## 🚧 Troubleshooting

### ❌ "Java não encontrado"
**Solução:**
1. Instale [Java 17+ JDK](https://www.oracle.com/java/technologies/downloads/#java17)
2. Verifique a instalação: `java -version`
3. Adicione Java ao PATH do sistema operacional

### ❌ "Maven não encontrado"
**Solução:**
1. Instale [Apache Maven 3.6.0+](https://maven.apache.org/download.cgi)
2. Verifique a instalação: `mvn -version`
3. Adicione Maven ao PATH do sistema operacional

### ❌ "Porta 8080 já em uso"
**Solução:**

**Windows:**
```cmd
set SERVER_PORT=9090
mvn spring-boot:run
```

**Linux/Mac:**
```bash
export SERVER_PORT=9090
mvn spring-boot:run
```

Acesse: `http://localhost:9090`

### ❌ "Banco de dados indisponível"
**Solução:**
- O H2 em memória é padrão e não precisa de configuração
- Se usar MySQL, certifique-se de:
  - MySQL está rodando: `mysql -u root -p`
  - Banco existe: `CREATE DATABASE epidemia;`
  - Variáveis de ambiente estão definidas

### ❌ "Erro ao conectar ao MySQL"
**Solução:**
```bash
# Verifique MySQL status
mysql -u root -p -e "SELECT 1;"

# Recrie o banco
mysql -u root -p < database/schema.sql
```

### ❌ "Hot Reload não funciona"
**Solução:**
- Instale [Spring Boot DevTools](#tecnologias-stack)
- Rebuild do projeto: `mvn clean install`
- Reinicie a aplicação

---

## 📚 Documentação Adicional

### Para Desenvolvedores

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Leaflet.js API](https://leafletjs.com/reference.html)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)

### Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📝 Logs e Debug

### Ver logs detalhados
```bash
mvn -X spring-boot:run
```

### Ativar console H2
Acesse: `http://localhost:8080/h2-console`

**Credenciais padrão:**
- JDBC URL: `jdbc:h2:mem:testdb`
- User: `sa`
- Password: (deixe em branco)

---

## 💡 Dicas Úteis

### 1. Resetar dados
```bash
# H2: Reinicie a aplicação (dados em memória são perdidos)
mvn spring-boot:run

# MySQL: Execute o script SQL
mysql -u root -p < database/schema.sql
```

### 2. Adicionar mais cidades
Edite o array `cidades` em [src/main/resources/static/app.js](src/main/resources/static/app.js#L4):

```javascript
const cidades = [
    { nome: 'Nova Cidade', lat: -23.5, lng: -46.5, populacao: 1000000 },
    // ... mais cidades
];
```

### 3. Exportação de dados
Use a funcionalidade "Exportar em PDF" na interface ou acesse diretamente via API:

```bash
curl http://localhost:8080/api/casos > dados.json
```

### 4. Monitoramento de performance
Adicione ao `application.properties`:

```properties
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

---

## ✅ Checklist de Verificação

Antes de fazer deploy:

- [ ] Java 17+ está instalado
- [ ] Maven 3.6.0+ está instalado
- [ ] Porta 8080 está disponível (ou configure outra)
- [ ] Banco de dados está acessível (H2 ou MySQL)
- [ ] Aplicação inicia sem erros: `mvn spring-boot:run`
- [ ] Interface carrega em `http://localhost:8080`
- [ ] API responde: `curl http://localhost:8080/api/casos`
- [ ] Tema claro/escuro alterna corretamente
- [ ] Mapa carrega e mostra marcadores
- [ ] CRUD completo funciona (criar, ler, atualizar, deletar)
- [ ] Exportação PDF funciona

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique o [Troubleshooting](#-troubleshooting)
2. Revise os [Logs e Debug](#-logs-e-debug)
3. Consulte a [Documentação Adicional](#-documentação-adicional)
4. Abra uma [Issue](https://github.com/seu-usuario/vigilanciaEpidemiologica/issues)

---

## 📄 Licença

Este projeto é fornecido como está, sem garantias. Use livremente para desenvolvimento e aprendizado.
