const router = require("express").Router();

const Rendimiento = require("../../models/performance.model");

router.get("/", async (req, res) => {
  try {
    const rendimientos = await Rendimiento.find();
    res.json(rendimientos);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newRendimiento = await Rendimiento.create(req.body);
    res.json(newRendimiento);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.put("/:rendimientoId", async (req, res) => {
  try {
    const rendimientoEdit = await Rendimiento.findByIdAndUpdate(
      req.params.rendimientoId,
      req.body,
      { new: true }
    );
    res.json(rendimientoEdit);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.delete("/:rendimientoId", async (req, res) => {
    try {
        const rendimientoDelete = await Rendimiento.findByIdAndDelete(req.params.rendimientoId);
        res.json(rendimientoDelete);
        
    } catch (error) {
        res.status(500).json({ error: "Ha ocurrido un error" });
        
    }
});

module.exports = router;