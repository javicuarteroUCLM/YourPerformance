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
    const { cantidadCursos, ...asignaturas } = req.body;

    // Procesa los datos recibidos
    const datosGrafico = {
      labels: [],
      values: []
    };

    for (let i = 1; i <= cantidadCursos; i++) {
      const notasCurso = [];
      Object.keys(asignaturas).forEach(key => {
        if (key.startsWith(`curso${i}Asignatura`)) {
          notasCurso.push(parseFloat(asignaturas[key]));
        }
      });
      const promedio = notasCurso.reduce((a, b) => a + b, 0) / notasCurso.length;
      datosGrafico.labels.push(`Curso ${i}`);
      datosGrafico.values.push(promedio);
    }

    res.status(201).json(datosGrafico);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
  /*try {
    const newRendimiento = await Rendimiento.create(req.body);
    res.json(newRendimiento);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }*/

 
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