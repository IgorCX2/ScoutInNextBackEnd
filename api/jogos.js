const { GoogleSpreadsheet } = require('google-spreadsheet');
const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
router.use(express.json());
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())
const cors = require('cors');
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
  router.use(cors());
  next();
});

router.post('/add-jogo', async (req, res) =>{
    const doc = new GoogleSpreadsheet(process.env.banco_dados);
    await doc.useServiceAccountAuth({
        client_email: process.env.client_email,
        private_key: process.env.private_key,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const new_idjogo = Number(rows[0].id_jogo) + 1;
    rows[0].id_jogo = new_idjogo;
    await rows[0].save();
    const larryRow = await sheet.addRow({ status: 'aberto', adversario:req.body.adversario, sexo:req.body.sexo, tempo:req.body.tempo, esporte:req.body.esporte});
    await larryRow.save()
    .then(()=>{
      return res.json({
        mensagem: "cadastrado"
      });
    }).catch(()=>{
      return res.json({
        mensagem: "erro"
      });
    });
});
router.post('/cad-001', async (req, res) =>{
  const doc = new GoogleSpreadsheet(process.env.banco_dados);
  await doc.useServiceAccountAuth({
      client_email: process.env.client_email,
      private_key: process.env.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const idlinha = req.body.id;
  const contadorarray = req.body.contador
  rows[idlinha].saques = contadorarray.toString()
  rows[idlinha].status = "espera"
  await rows[idlinha].save()
  .then(()=>{
    return res.json({
      mensagem: "cadastrado"
    });
  }).catch(()=>{
    return res.json({
      mensagem: "erro"
    });
  });
});
router.post('/cad-000', async (req, res) =>{
  const doc = new GoogleSpreadsheet(process.env.banco_dados);
  await doc.useServiceAccountAuth({
      client_email: process.env.client_email,
      private_key: process.env.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  console.log(req.body)
  const idlinha = req.body.id;
  rows[idlinha].pontos = req.body.pontos.toString()

  rows[idlinha].tcerto = req.body.apcerto.toString()
  rows[idlinha].terrado = req.body.aperrado.toString()
  rows[idlinha].mcerto = req.body.ascerto.toString()
  rows[idlinha].merrado = req.body.aserrado.toString()

  rows[idlinha].status = "fechado"
  await rows[idlinha].save()
  .then(()=>{
    return res.json({
      mensagem: "cadastrado"
    });
  }).catch(()=>{
    return res.json({
      mensagem: "erro"
    });
  });
});
router.get('/listar', async (req, res) =>{
  const doc = new GoogleSpreadsheet(process.env.banco_dados);
  await doc.useServiceAccountAuth({
      client_email: process.env.client_email,
      private_key: process.env.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const jogos = rows.map(({ status, adversario, id_jogo }) => {
    return{
      status,
      adversario
    }
  })
  const idjogo = rows[0].id_jogo
  res.send({
    mensagem: "cadastrado",
    jogos,
    idjogo
  })
});
router.get('/all', async (req, res) =>{
  const doc = new GoogleSpreadsheet(process.env.banco_dados);
  await doc.useServiceAccountAuth({
      client_email: process.env.client_email,
      private_key: process.env.private_key,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const jogos = rows.map(({ esporte, adversario, tempo, pontos, tcerto, terrado, mcerto, merrado, sexo, saques}) => {
    return{
      esporte,
      adversario,
      tempo,
      pontos,
      tcerto,
      terrado,
      mcerto,
      merrado,
      sexo,
      saques
    }
  })
  const idjogo = rows[0].id_jogo
  res.send({
    mensagem: "cadastrado",
    jogos,
    idjogo
  })
});
module.exports = router;
