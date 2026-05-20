# Guia ESP32 - Monitora UTI

Este arquivo explica como montar o hardware do ESP32, como cadastrar cada placa como uma cama no backend e como configurar o código do microcontrolador para enviar alertas de umidade.

## 1. Conceito

Cada ESP32 representa uma cama hospitalar.

Fluxo recomendado:

1. Cadastrar a cama no sistema usando a API ou o frontend.
2. Anotar o `id` retornado pela API.
3. Gravar esse `id` no código do ESP32 como `bedId`.
4. Quando o sensor detectar umidade, o ESP32 envia `POST /api/alerts` com:

```json
{
  "bedId": 1,
  "humidityValue": 82
}
```

## 2. Endpoint correto do ESP32

Use este endpoint para cada leitura enviada pelo dispositivo:

`POST /api/alerts`

Exemplo de URL completa em ambiente local:

`http://SEU_IP:5000/api/alerts`

Se estiver testando no mesmo PC do backend:

`http://localhost:5000/api/alerts`

## 3. Como cadastrar cada cama

Antes de programar o ESP32, crie a cama no backend:

`POST /api/beds`

Body exemplo:

```json
{
  "name": "Cama 01",
  "room": "A1",
  "patientName": "João da Silva",
  "admissionReason": "Pós-operatório"
}
```

O retorno terá o `id` da cama. Esse `id` é o valor que você coloca no código do ESP32.

## 4. Componentes recomendados

Componentes mínimos:

- 1x ESP32 DevKit
- 1x sensor de umidade capacitivo ou sensor analógico de umidade apropriado para o projeto
- Jumpers macho-macho
- Protoboard ou base de fixação
- 1x LED opcional para sinal visual
- 1x buzzer opcional para alarme sonoro
- Fonte 5V estável para o ESP32

Observação importante:

- Prefira sensor capacitivo, porque ele costuma ser mais estável para leituras contínuas.
- Se o sensor tiver saída analógica, use um pino ADC do ESP32.

## 5. Montagem sugerida

Ligação base para sensor analógico:

- VCC do sensor -> 3.3V do ESP32
- GND do sensor -> GND do ESP32
- AO do sensor -> GPIO34 do ESP32

Se usar buzzer opcional:

- VCC do buzzer -> 3.3V ou 5V conforme o modelo
- GND do buzzer -> GND
- IN do buzzer -> GPIO26

Se usar LED opcional:

- Anodo -> GPIO2 com resistor de 220 ohms
- Catodo -> GND

## 6. Ajuste da calibração

No código do ESP32 há dois valores para calibrar:

- `DRY_VALUE`: leitura quando a fralda/sensor está seca
- `WET_VALUE`: leitura quando a fralda/sensor está molhada

Esses valores variam conforme o sensor e a instalação.

Exemplo:

- seco = 3200
- molhado = 1400

O código converte a leitura em porcentagem de umidade.

## 7. Lógica visual esperada no sistema

Faixas usadas no projeto:

- 0% a 40% -> Normal
- 41% a 70% -> Atenção
- 71%+ -> Alerta

Ao limpar o alerta na interface:

- o status volta para Normal
- a porcentagem de umidade é zerada na tela
- o ESP32 continua enviando novas leituras normalmente

## 8. Arquivo de código do ESP32

O sketch pronto está em:

`esp32/monitora_uti.ino`

Ele já vem com:

- conexão Wi-Fi
- leitura analógica do sensor
- cálculo de porcentagem
- envio via HTTP REST para a API
- uso de `bedId` fixo por placa

## 9. Como usar na prática

Para cada placa:

1. Cadastre uma cama no backend.
2. Pegue o `id` da cama.
3. Abra o sketch do ESP32.
4. Troque o valor de `BED_ID`.
5. Ajuste `WIFI_SSID`, `WIFI_PASSWORD` e `API_URL`.
6. Grave no ESP32.

## 10. Recomendações finais

- Mantenha um `bedId` único por ESP32.
- Se a cama for trocada de paciente, atualize apenas os dados da cama no frontend/backend.
- Se for testar em rede local, garanta que o ESP32 consiga alcançar o IP do computador do backend.
