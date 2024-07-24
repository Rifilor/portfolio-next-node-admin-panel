const { pool } = require('../config/dbConfig');

const getAllUsers = async (req, res) => {
    const {
        id, first_name, last_name, avatar_url, born_date, start_work, created_at, updated_at, email, city,
        phone_number, position, type_work, vacation_days, description,
        sort_by, sort_order = 'ASC', search
      } = req.query;
    
      let query = `
        SELECT u.*, COALESCE(array_remove(array_agg(pe.project_id), NULL), ARRAY[]::int[]) as project_ids
        FROM users u
        LEFT JOIN project_employees pe ON u.id = pe.employee_id
        WHERE 1=1
      `;
      let queryParams = [];
    
      if (id) {
        queryParams.push(`%${id}%`);
        query += ` AND u.id ILIKE $${queryParams.length}`;
      }
    
      if (first_name) {
        queryParams.push(`%${first_name}%`);
        query += ` AND u.first_name ILIKE $${queryParams.length}`;
      }
      if (last_name) {
        queryParams.push(`%${last_name}%`);
        query += ` AND u.last_name ILIKE $${queryParams.length}`;
      }
      if (avatar_url) {
        queryParams.push(`%${avatar_url}%`);
        query += ` AND u.avatar_url ILIKE $${queryParams.length}`;
      }
      if (born_date) {
        queryParams.push(born_date);
        query += ` AND u.born_date = $${queryParams.length}`;
      }
      if (start_work) {
        queryParams.push(start_work);
        query += ` AND u.start_work = $${queryParams.length}`;
      }
      if (created_at) {
        queryParams.push(created_at);
        query += ` AND u.created_at = $${queryParams.length}`;
      }
      if (updated_at) {
        queryParams.push(updated_at);
        query += ` AND u.updated_at = $${queryParams.length}`;
      }
      if (email) {
        queryParams.push(`%${email}%`);
        query += ` AND u.email ILIKE $${queryParams.length}`;
      }
      if (city) {
        queryParams.push(`%${city}%`);
        query += ` AND u.city ILIKE $${queryParams.length}`;
      }
      if (phone_number) {
        queryParams.push(`%${phone_number}%`);
        query += ` AND u.phone_number ILIKE $${queryParams.length}`;
      }
      if (position) {
        queryParams.push(position);
        query += ` AND u.position = $${queryParams.length}`;
      }
      if (type_work) {
        queryParams.push(type_work);
        query += ` AND u.type_work = $${queryParams.length}`;
      }
      if (vacation_days) {
        queryParams.push(vacation_days);
        query += ` AND u.vacation_days = $${queryParams.length}`;
      }
      if (description) {
        queryParams.push(`%${description}%`);
        query += ` AND u.description ILIKE $${queryParams.length}`;
      }
    
      if (search) {
        const searchColumns = ['u.first_name', 'u.last_name', 'u.avatar_url', 'u.email', 'u.city', 'u.phone_number', 'u.position', 'u.type_work', 'u.description'];
        const searchConditions = searchColumns.map(col => `${col} ILIKE $${queryParams.length + 1}`);
        query += ` AND (${searchConditions.join(' OR ')})`;
        queryParams.push(`%${search}%`);
      }
    
      query += ` GROUP BY u.id`;
    
      if (sort_by) {
        const validSortFields = ['u.id', 'u.first_name', 'u.last_name', 'u.avatar_url', 'u.born_date', 'u.start_work', 'u.created_at', 'u.updated_at', 'u.email', 'u.city', 'u.phone_number', 'u.position', 'u.type_work', 'u.vacation_days', 'u.description'];
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

const getUserById = async (req, res) => {
    const id = req.params.id;

    let query = `
      SELECT 
        u.*, 
        array_remove(array_agg(pe.project_id), NULL) as project_ids
      FROM 
        users u
        LEFT JOIN project_employees pe ON u.id = pe.employee_id
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

const createUser = async (req, res) => {
    const { first_name, last_name, avatar_url, born_date, start_work, email, city, phone_number, position, type_work, vacation_days, description } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO users (first_name, last_name, avatar_url, born_date, start_work, created_at, updated_at, email, city, phone_number, position, type_work, vacation_days, description) 
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7, $8, $9, $10, $11, $12, $13) 
            RETURNING *`,
        [first_name, last_name, avatar_url, born_date, start_work, email, city, phone_number, position, type_work, vacation_days, description]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { first_name, last_name, avatar_url, born_date, start_work, email, city, phone_number, position, type_work, vacation_days, description } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE users SET 
                first_name = $1, 
                last_name = $2, 
                avatar_url = $3, 
                born_date = $4, 
                start_work = $5, 
                updated_at = NOW(), 
                email = $6, 
                city = $7, 
                phone_number = $8, 
                position = $9, 
                type_work = $10, 
                vacation_days = $11, 
                description = $12 
            WHERE id = $13 
            RETURNING *`,
        [first_name, last_name, avatar_url, born_date, start_work, email, city, phone_number, position, type_work, vacation_days, description, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      await pool.query('BEGIN'); // Начинаем транзакцию
  
      // Удаляем пользователя из таблицы users
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
  
      // Удаляем все записи связанные с этим пользователем из таблицы project_employees
      await pool.query('DELETE FROM project_employees WHERE employee_id = $1', [id]);
  
      await pool.query('COMMIT'); // Фиксируем изменения
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
