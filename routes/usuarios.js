const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../utils/auth");

// ============================
// GET UN SOLO USUARIO
// ============================
router.get("/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM usuarios WHERE id_usuario = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al obtener el usuario",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json(results[0]);
  });
});

// ============================
// GET MULTIPLES USUARIOS
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
            WHERE Usuario LIKE ?
            OR nombres LIKE ?
            OR cedula LIKE ?
            OR correo LIKE ?
        `;

    const searchTerm = `%${string}%`;

    queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  // total registros
  const countQuery = `
        SELECT COUNT(*) AS total
        FROM usuarios
        ${whereClause}
    `;

  db.query(countQuery, queryParams, (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al obtener total de usuarios",
      });
    }

    const totalUsuarios = countResult[0].total;
    const totalPages = Math.ceil(totalUsuarios / limit);

    // consulta paginada
    const usuariosQuery = `
            SELECT *
            FROM usuarios
            ${whereClause}
            LIMIT ? OFFSET ?
        `;

    const finalParams = [...queryParams, limit, offset];

    db.query(usuariosQuery, finalParams, (err, usuariosResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error al obtener los usuarios",
        });
      }

      res.json({
        totalItems: totalUsuarios,
        totalPages: totalPages,
        currentPage: page,
        limit: limit,
        data: usuariosResult,
      });
    });
  });
});

// ============================
// POST CREAR USUARIO
// ============================
router.post("/", async (req, res) => {
  try {
    const { Usuario, password, nombres, cedula, correo } = req.body;

    // encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
            INSERT INTO usuarios
            (Usuario, password, nombres, cedula, correo)
            VALUES (?, ?, ?, ?, ?)
        `;

    const values = [Usuario, hashedPassword, nombres, cedula, correo];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error al registrar usuario",
        });
      }

      res.json({
        message: "Usuario registrado con éxito",
        id_usuario: results.insertId,
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error del servidor",
    });
  }
});

// PUT EDITAR USUARIO

router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const { Usuario, password, nombres, cedula, correo } = req.body;

  let query = `
            UPDATE usuarios
            SET Usuario = ?,
                nombres = ?,
                cedula = ?,
                correo = ?
        `;

  let values = [Usuario, nombres, cedula, correo];

  // actualizar password solo si viene
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    query += `, password = ?`;

    values.push(hashedPassword);
  }

  query += ` WHERE id_usuario = ?`;

  values.push(id);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al editar usuario",
      });
    }

    const verifyToken_query =
      "select count (*) as total_usuarios from usuarios where id_usuario =?";
    db.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error al contar usuario",
        });
      }

      res.json({
        message: "Usuario actualizado correctamente",
      });
    });
  });
});

// DELETE USUARIO

router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = `
        DELETE FROM usuarios
        WHERE id_usuario = ?
    `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al eliminar usuario",
      });
    }

    res.json({
      message: "Usuario eliminado correctamente",
    });
  });
});

module.exports = router;
