const express = require("express");
const app = express();
const jogos = require("./api/jogos");
app.use(express.json());

app.use("/api/jogos", jogos);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is in port ${PORT}`));