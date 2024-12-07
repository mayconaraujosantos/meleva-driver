# Estimate Ride - Backlog

## Funcionalidade: Calcular a estimativa de uma corrida

O endpoint **POST /ride/estimate** será responsável por calcular a rota entre dois pontos, listar motoristas disponíveis e retornar os valores estimados para a viagem.

---

## 📖 Histórias do Usuário

### 1. Validações de Entrada
**Como** sistema,
**Quero** validar que os dados recebidos na requisição são válidos,
**Para que** possa garantir a consistência e evitar erros durante o processamento.

#### Critérios de Aceitação:
- `origin` e `destination` não podem estar vazios.
- `origin` e `destination` não podem ser o mesmo endereço.
- `customer_id` não pode ser vazio.

#### Exceções:
- Retornar **400 (Bad Request)** com código de erro e descrição apropriada para entradas inválidas.

---

### 2. Calcular Rota com o Google Maps API
**Como** sistema,
**Quero** usar a API Routes do Google Maps para calcular a rota entre origem e destino,
**Para que** eu possa obter informações como distância e duração.

#### Critérios de Aceitação:
- Enviar `origin` e `destination` para a API do Google Maps.
- Obter a distância e duração do percurso em formato utilizável.
- Retornar erro **500 (Internal Server Error)** caso a integração com a API falhe.

---

### 3. Determinar Motoristas Disponíveis
**Como** sistema,
**Quero** listar motoristas disponíveis com base na distância mínima que aceitam,
**Para que** o usuário possa escolher o motorista mais adequado.

#### Critérios de Aceitação:
- Filtrar motoristas com base na quilometragem mínima aceita.
- Calcular o valor total da corrida para cada motorista.
- Ordenar os motoristas do mais barato para o mais caro.

---

### 4. Retornar os Dados da Estimativa
**Como** sistema,
**Quero** retornar os dados da estimativa ao cliente,
**Para que** o usuário possa ver todas as opções disponíveis para sua corrida.

#### Critérios de Aceitação:
- Incluir na resposta:
  - Latitude e longitude de origem e destino.
  - Distância e duração do percurso.
  - Lista de motoristas disponíveis (ID, nome, descrição, veículo, avaliação, valor total).
  - Resposta completa da API do Google Maps.
- Retornar **200 (OK)** em caso de sucesso.

#### Exceções:
- **400 (Bad Request)**:
  - Campos obrigatórios não foram fornecidos (ex.: `origin`, `destination`, ou `customer_id`).
  - `origin` e `destination` são iguais.
- **500 (Internal Server Error)**:
  - Erro ao acessar a API do Google Maps ou outra falha interna.

---

## ⚙️ Tarefas Técnicas

### 1. Configuração da API do Google Maps
- Obter chave de API.
- Criar módulo para integração com a API do Google Maps Routes.
- Implementar chamadas de teste para validação do módulo.

---

### 2. Implementar Endpoint **POST /ride/estimate**
- Criar a rota no servidor.
- Validar dados de entrada (campos obrigatórios e consistência).
- Chamar o módulo do Google Maps para obter distância e duração.
- Filtrar e ordenar motoristas disponíveis.
- Calcular o valor total da corrida para cada motorista.

---

### 3. Implementar Cálculos de Valores
- Criar lógica para calcular o custo baseado na quilometragem e taxa por motorista.

---

### 4. Testes
- Escrever testes unitários e de integração:
  - Validação de entradas.
  - Integração com a API do Google Maps.
  - Cálculo dos valores dos motoristas.
  - Formato da resposta.

---
## ✅ Resultados Esperados
- API funcional, validando entradas, processando a rota via Google Maps, listando motoristas disponíveis, e retornando uma estimativa completa com sucesso.

## 🌐 Estrutura de Resposta do Endpoint

### Exemplo de Resposta Bem-sucedida (**200 OK**):
```json
{
  "origin": {
    "latitude": -23.55052,
    "longitude": -46.633308
  },
  "destination": {
    "latitude": -23.682,
    "longitude": -46.876
  },
  "distance": "25.3 km",
  "duration": "35 min",
  "drivers": [
    {
      "id": "driver123",
      "name": "John Doe",
      "description": "Carro confortável, ar-condicionado",
      "vehicle": "Toyota Corolla",
      "rating": 4.9,
      "total_cost": 45.90
    },
    {
      "id": "driver456",
      "name": "Jane Smith",
      "description": "Econômico e rápido",
      "vehicle": "Honda Civic",
      "rating": 4.7,
      "total_cost": 42.50
    }
  ],
  "google_maps_response": {
    "status": "OK",
    "routes": [
      {
        "legs": [
          {
            "distance": {
              "text": "25.3 km",
              "value": 25300
            },
            "duration": {
              "text": "35 mins",
              "value": 2100
            }
          }
        ]
      }
    ]
  }
}
```
## Exemplo de Erro 400 (Bad Request):

```json
{
  "error_code": "INVALID_REQUEST",
  "message": "The 'origin' and 'destination' fields cannot be empty or the same."
}
```
## Exemplo de Erro 500 (Internal Server Error):
```json
{
  "error_code": "INTERNAL_SERVER_ERROR",
  "message": "Failed to connect to the Google Maps API. Please try again later."
}

```