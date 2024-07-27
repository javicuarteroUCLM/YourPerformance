const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

const Rendimiento = require("../../models/performance.model");

//supertest('http://127.0.0.1/rendimientos')

describe("Pruebas sobre la API de rendimiento", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1/rendimientos");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("GET /api/rendimientos", () => {
    let response;
    beforeEach(async () => {
      response = await request(app).get("/api/rendimientos").send();
    });

    it("La ruta funciona correctamente", async () => {
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
    });

    it("La ruta devuelve un array de informes de rendimiento", async () => {
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("POST /api/rendimientos", () => {
    const newRendimiento = {
      years: [
        { year: 2020, asignaturas: [{ nota: 10, nota: 7, nota: 9, nota: 5 }] },
        { year: 2021, asignaturas: [{ nota: 9, nota: 6, nota: 4 }] },
      ],
      name: "test rendimiento",
    };
    const wrongRendimiento = {
      years: [{ hola: 2020 }, { year: 2021 }],
      name: "test rendimiento",
    };
    afterAll(async () => {
      await Rendimiento.deleteMany({ name: "test rendimiento" });
    });

    it("La ruta funciona correctamente", async () => {
      const response = await request(app)
        .post("/api/rendimientos")
        .send(newRendimiento);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
    });

    it("Se inserta correctamente datos para análisis de rendimiento", async () => {
      const response = await request(app)
        .post("/api/rendimientos")
        .send(newRendimiento);

      expect(response.body._id).toBeDefined();
      expect(response.body.years.length).toEqual(newRendimiento.years.length); // Se espera que el número de años sea igual
    });

    it("Pruebas para Error en la inserción de datos para análisis de rendimiento", async () => {
      const response = await request(app)
        .post("/api/rendimientos")
        .send(wrongRendimiento);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("PUT /api/rendimientos/", () => {
    let rendimiento;

    beforeEach(async () => {
      rendimiento = await Rendimiento.create({
        years: [{ year: 2018, asignaturas: [{ nota: 5 }] }],
        name: "test rendimiento",
      });
    });

    afterEach(async() => {
        await Rendimiento.findByIdAndDelete(rendimiento._id);
    });

    it("La ruta funciona correctamente", async () => {
      const response = await request(app)
        .put(`/api/rendimientos/${rendimiento._id}`)
        .send({ name: 'rendimiento updated' });

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
    });

    it ("Se actualiza correctamente el nombre del rendimiento", async () => {
        const response = await request(app)
        .put(`/api/rendimientos/${rendimiento._id}`)
        .send({ name: 'rendimiento updated' });

        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('rendimiento updated');
        
    });
  });

  describe("DELETE /api/rendimientos" , () => {

    beforeEach(async() => {
        rendimiento = await Rendimiento.create({
            years: [{ year: 2023, asignaturas: [{ nota: 8, nota: 10 }] }],
            name: "test rendimiento",
          });

        response = await request(app).delete(`/api/rendimientos/${rendimiento._id}`).send();
    });

    it("La ruta funciona correctamente", async () => {
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toContain("json");
    });

    it ("Se elimina correctamente el rendimiento/informe", async () => {
        expect(response.body._id).toBeDefined();
    
        const foundRedimiento = await Rendimiento.findById(rendimiento._id);
        expect(foundRedimiento).toBeNull();
      });
  });
});
