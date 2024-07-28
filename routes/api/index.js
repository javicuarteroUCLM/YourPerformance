const router = require("express").Router();

router.use("/rendimientos", require("./rendimientos.route"));

router.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de informes sobre rendimiento académico",
  });
});

module.exports = router;
