const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../utils/auth");

// ============================
// GET UN ESTUDIANTE
// ============================
router.get("/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM estudiantes WHERE id_estudiante = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al obtener el estudiante",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Estudiante no encontrado",
      });
    }

    res.json(results[0]);
  });
});

// ============================
// GET MULTIPLES ESTUDIANTES
// ============================
router.get("/", verifyToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const string = req.query.string;

  let whereClause = "";
  let queryParams = [];

  if (string) {
    whereClause = `
            WHERE nombre LIKE ?
            OR apellido LIKE ?
            OR correo LIKE ?
            OR cedula LIKE ?
            OR genero LIKE ?
        `;

    const searchTerm = `%${string}%`;
    queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  const countQuery = `
        SELECT COUNT(*) AS total
        FROM estudiantes
        ${whereClause}
    `;

  db.query(countQuery, queryParams, (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al obtener total de estudiantes",
      });
    }

    const totalEstudiantes = countResult[0].total;
    const totalPages = Math.ceil(totalEstudiantes / limit);

    const estudiantesQuery = `
            SELECT *
            FROM estudiantes
            ${whereClause}
            LIMIT ? OFFSET ?
        `;

    const finalParams = [...queryParams, limit, offset];

    db.query(estudiantesQuery, finalParams, (err, estudiantesResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error al obtener los estudiantes",
        });
      }

      res.json({
        totalItems: totalEstudiantes,
        totalPages: totalPages,
        currentPage: page,
        limit: limit,
        data: estudiantesResult,
      });
    });
  });
});

// ============================
// POST CREAR ESTUDIANTE
// ============================
router.post("/", (req, res) => {
  const { id_usuario, nombre, apellido, edad, correo, cedula, genero } = req.body;

  const query = `
        INSERT INTO estudiantes
        (id_usuario, nombre, apellido, edad, correo, cedula, genero)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [id_usuario || null, nombre, apellido, edad, correo, cedula, genero];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al registrar estudiante",
      });
    }

    res.json({
      message: "Estudiante registrado con éxito",
      id_estudiante: results.insertId,
    });
  });
});

// ============================
// PUT EDITAR ESTUDIANTE
// ============================
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { id_usuario, nombre, apellido, edad, correo, cedula, genero } = req.body;

  let query = `
            UPDATE estudiantes
            SET nombre = ?,
                apellido = ?,
                edad = ?,
                correo = ?,
                cedula = ?,
                genero = ?
        `;

  const values = [nombre, apellido, edad, correo, cedula, genero];

  if (typeof id_usuario !== "undefined") {
    query += ", id_usuario = ?";
    values.push(id_usuario);
  }

  query += " WHERE id_estudiante = ?";
  values.push(id);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al editar estudiante",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        message: "Estudiante no encontrado",
      });
    }

    res.json({
      message: "Estudiante actualizado correctamente",
    });
  });
});

// ============================
// DELETE ESTUDIANTE
// ============================
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = `
        DELETE FROM estudiantes
        WHERE id_estudiante = ?
    `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al eliminar estudiante",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        message: "Estudiante no encontrado",
      });
    }

    res.json({
      message: "Estudiante eliminado correctamente",
    });
  });
});

module.exports = router;
