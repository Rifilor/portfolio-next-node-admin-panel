const { pool } = require('../config/dbConfig');

const getAllClients = async (req, res) => {
  const {
    id, first_name, last_name, avatar_url, born_date, created_at, updated_at,
    city, phone_number, email, description, sort_by, sort_order = 'ASC', search
  } = req.query;

  let query = `
    SELECT 
      c.*, 
      ARRAY_REMOVE(ARRAY_AGG(pc.project_id), NULL) AS project_ids
    FROM 
      clients c
    LEFT JOIN 
      project_clients pc ON c.id = pc.client_id
    WHERE 
      1=1
  `;
  let queryParams = [];

  if (id) {
    queryParams.push(id);
    query += ` AND c.id = $${queryParams.length}`;
  }
  if (first_name) {
    queryParams.push(`%${first_name}%`);
    query += ` AND c.first_name ILIKE $${queryParams.length}`;
  }
  if (last_name) {
    queryParams.push(`%${last_name}%`);
    query += ` AND c.last_name ILIKE $${queryParams.length}`;
  }
  if (avatar_url) {
    queryParams.push(`%${avatar_url}%`);
    query += ` AND c.avatar_url ILIKE $${queryParams.length}`;
  }
  if (born_date) {
    queryParams.push(born_date);
    query += ` AND c.born_date = $${queryParams.length}`;
  }
  if (created_at) {
    queryParams.push(created_at);
    query += ` AND c.created_at = $${queryParams.length}`;
  }
  if (updated_at) {
    queryParams.push(updated_at);
    query += ` AND c.updated_at = $${queryParams.length}`;
  }
  if (city) {
    queryParams.push(`%${city}%`);
    query += ` AND c.city ILIKE $${queryParams.length}`;
  }
  if (phone_number) {
    queryParams.push(`%${phone_number}%`);
    query += ` AND c.phone_number ILIKE $${queryParams.length}`;
  }
  if (email) {
    queryParams.push(`%${email}%`);
    query += ` AND c.email ILIKE $${queryParams.length}`;
  }
  if (description) {
    queryParams.push(`%${description}%`);
    query += ` AND c.description ILIKE $${queryParams.length}`;
  }
  if (search) {
    queryParams.push(`%${search}%`);
    query += ` AND (c.first_name ILIKE $${queryParams.length} OR c.last_name ILIKE $${queryParams.length} OR c.email ILIKE $${queryParams.length})`;
  }
  
  query += ' GROUP BY c.id';

  if (sort_by) {
    const validSortFields = [
      'id', 'first_name', 'last_name', 'avatar_url', 'born_date', 'created_at',
      'updated_at', 'city', 'phone_number', 'email', 'description',
    ];

    if (validSortFields.includes(sort_by)) {
      query += ` ORDER BY ${sort_by} ${sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
    }
  }

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getClientById = async (req, res) => {
  const id = req.params.id;

  let query = `
    SELECT 
      u.*, 
      array_remove(array_agg(pe.project_id), NULL) as project_ids
    FROM 
      clients u
      LEFT JOIN project_clients pe ON u.id = pe.client_id
    WHERE 
      u.id = $1
    GROUP BY
      u.id
  `;
  let queryParams = [id];

  try {
    const result = await pool.query(query, queryParams);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);  // Возвращаем первый (и единственный) объект
    } else {
      res.json(null);  // Возвращаем null, если пользователь не найден
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const createClient = async (req, res) => {
  const {
    avatar_url, first_name, last_name, born_date, created_at, updated_at,
    city, phone_number, email, description
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO clients (avatar_url, first_name, last_name, born_date, created_at, updated_at, city, phone_number, email, description) 
      VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6, $7, $8, $9) RETURNING *`,
      [avatar_url, first_name, last_name, born_date, city, phone_number, email, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const updateClient = async (req, res) => {
  const id = req.params.id;
  const {
    avatar_url, first_name, last_name, born_date, created_at, updated_at,
    city, phone_number, email, description
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE clients SET 
        avatar_url = $1, 
        first_name = $2, 
        last_name = $3, 
        born_date = $4, 
        updated_at = NOW(), 
        city = $5, 
        phone_number = $6, 
        email = $7, 
        description = $8, 
      WHERE id = $10 RETURNING *`,
      [avatar_url, first_name, last_name, born_date, city, phone_number, email, description, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Client not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const deleteClient = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await pool.query('BEGIN'); // Начинаем транзакцию

    // Удаляем пользователя из таблицы users
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);

    // Удаляем все записи связанные с этим пользователем из таблицы project_employees
    await pool.query('DELETE FROM project_clients WHERE client_id = $1', [id]);

    await pool.query('COMMIT'); // Фиксируем изменения
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};