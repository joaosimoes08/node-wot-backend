const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\u{1F680} Backend da plataforma WOT iniciado na porta ${PORT}`);
});
