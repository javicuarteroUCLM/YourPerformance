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
    console.log("Datos recibidos del frontend:", req.body);

    const { cantidadCursos, ...asignaturas } = req.body;

    const numCursos = parseInt(cantidadCursos, 10);
    console.log("Cantidad de cursos:", numCursos);

    const datosGrafico = {
      //labels: ["Curso más reciente","3º","2º", "Curso más antiguo"], /*Me lo he llevado a public/scritps.js para poder manejar el texto según el dispositivo*/
      values: [],
    };

    for (let i = 1; i <= cantidadCursos; i++) {
      const notasCurso = [];
      Object.keys(asignaturas).forEach((key) => {
        if (key.startsWith(`curso${i}Asignatura`)) {
          notasCurso.push(parseFloat(asignaturas[key]));
        }
      });
      const promedio =
        notasCurso.reduce((a, b) => a + b, 0) / notasCurso.length;
      datosGrafico.values.push(promedio);
    }

    //datosGrafico.labels.reverse();
    datosGrafico.values.reverse();
    console.log("Datos enviados al frontend:", datosGrafico);

    res.status(201).json(datosGrafico);
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
    const rendimientoDelete = await Rendimiento.findByIdAndDelete(
      req.params.rendimientoId
    );
    res.json(rendimientoDelete);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

module.exports = router;
