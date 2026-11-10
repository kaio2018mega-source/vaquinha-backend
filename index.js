const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let totalArrecadado = 0;
let doacoes = [];

// webhook da AtenásPay — avisa quando PIX foi pago
app.post('/webhook', (req, res) => {
  const body = req.body;
  // ajuste os campos conforme a AtenásPay retornar
  const status = body.status || body.payment_status || body.event;
  const amount = body.amount || body.value || 0;
  if (status === 'paid' || status === 'approved' || status === 'PAID') {
    const valor = parseFloat(amount) / 100; // converte centavos
    totalArrecadado += valor;
    doacoes.push({ valor, ts: Date.now() });
  }
  res.json({ ok: true });
});

// o site consulta esse endpoint pra pegar o total
app.get('/total', (req, res) => {
  res.json({ total: totalArrecadado, doacoes: doacoes.length });
});

app.get('/', (req, res) => res.send('vaquinha backend ok'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('rodando na porta', PORT));
