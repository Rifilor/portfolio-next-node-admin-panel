// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const app = express();
// const { Pool } = require('pg');
// const dbConfig = require('./modules/dbConfig');

// // Create a new pool instance
// const pool = new Pool(dbConfig);

// const port = 8080;


// app.use(express.json());
// app.use(cors()); // Включаем CORS

// // Данные пользователей

// // Получение всех пользователей
// app.get('/users', async (req, res) => {
//   const {
//     id, first_name, last_name, avatar_url, born_date, start_work, created_at, updated_at, email, city,
//     phone_number, position, type_work, vacation_days, description,
//     sort_by, sort_order = 'ASC', search
//   } = req.query;

//   let query = `
//     SELECT u.*, COALESCE(array_remove(array_agg(pe.project_id), NULL), ARRAY[]::int[]) as project_ids
//     FROM users u
//     LEFT JOIN project_employees pe ON u.id = pe.employee_id
//     WHERE 1=1
//   `;
//   let queryParams = [];

//   if (id) {
//     queryParams.push(`%${id}%`);
//     query += ` AND u.id ILIKE $${queryParams.length}`;
//   }

//   if (first_name) {
//     queryParams.push(`%${first_name}%`);
//     query += ` AND u.first_name ILIKE $${queryParams.length}`;
//   }
//   if (last_name) {
//     queryParams.push(`%${last_name}%`);
//     query += ` AND u.last_name ILIKE $${queryParams.length}`;
//   }
//   if (avatar_url) {
//     queryParams.push(`%${avatar_url}%`);
//     query += ` AND u.avatar_url ILIKE $${queryParams.length}`;
//   }
//   if (born_date) {
//     queryParams.push(born_date);
//     query += ` AND u.born_date = $${queryParams.length}`;
//   }
//   if (start_work) {
//     queryParams.push(start_work);
//     query += ` AND u.start_work = $${queryParams.length}`;
//   }
//   if (created_at) {
//     queryParams.push(created_at);
//     query += ` AND u.created_at = $${queryParams.length}`;
//   }
//   if (updated_at) {
//     queryParams.push(updated_at);
//     query += ` AND u.updated_at = $${queryParams.length}`;
//   }
//   if (email) {
//     queryParams.push(`%${email}%`);
//     query += ` AND u.email ILIKE $${queryParams.length}`;
//   }
//   if (city) {
//     queryParams.push(`%${city}%`);
//     query += ` AND u.city ILIKE $${queryParams.length}`;
//   }
//   if (phone_number) {
//     queryParams.push(`%${phone_number}%`);
//     query += ` AND u.phone_number ILIKE $${queryParams.length}`;
//   }
//   if (position) {
//     queryParams.push(position);
//     query += ` AND u.position = $${queryParams.length}`;
//   }
//   if (type_work) {
//     queryParams.push(type_work);
//     query += ` AND u.type_work = $${queryParams.length}`;
//   }
//   if (vacation_days) {
//     queryParams.push(vacation_days);
//     query += ` AND u.vacation_days = $${queryParams.length}`;
//   }
//   if (description) {
//     queryParams.push(`%${description}%`);
//     query += ` AND u.description ILIKE $${queryParams.length}`;
//   }

//   if (search) {
//     const searchColumns = ['u.first_name', 'u.last_name', 'u.avatar_url', 'u.email', 'u.city', 'u.phone_number', 'u.position', 'u.type_work', 'u.description'];
//     const searchConditions = searchColumns.map(col => `${col} ILIKE $${queryParams.length + 1}`);
//     query += ` AND (${searchConditions.join(' OR ')})`;
//     queryParams.push(`%${search}%`);
//   }

//   query += ` GROUP BY u.id`;

//   if (sort_by) {
//     const validSortFields = ['u.id', 'u.first_name', 'u.last_name', 'u.avatar_url', 'u.born_date', 'u.start_work', 'u.created_at', 'u.updated_at', 'u.email', 'u.city', 'u.phone_number', 'u.position', 'u.type_work', 'u.vacation_days', 'u.description'];
//     if (validSortFields.includes(sort_by)) {
//       query += ` ORDER BY ${sort_by} ${sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
//     }
//   }

//   try {
//     const result = await pool.query(query, queryParams);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });


// app.get('/users/:id', async (req, res) => {
//   const id = req.params.id;

//   let query = `
//     SELECT 
//       u.*, 
//       array_remove(array_agg(pe.project_id), NULL) as project_ids
//     FROM 
//       users u
//       LEFT JOIN project_employees pe ON u.id = pe.employee_id
//     WHERE 
//       u.id = $1
//     GROUP BY
//       u.id
//   `;
//   let queryParams = [id];

//   try {
//     const result = await pool.query(query, queryParams);
//     if (result.rows.length > 0) {
//       res.json(result.rows[0]);  // Возвращаем первый (и единственный) объект
//     } else {
//       res.json(null);  // Возвращаем null, если пользователь не найден
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });



// // Добавление нового пользователя
// app.post('/users', async (req, res) => {
//   const { first_name, last_name, avatar_url, born_date, start_work, email, city, phone_number, position, type_work, vacation_days, description } = req.body;
//   try {
//     const result = await pool.query(
//       `INSERT INTO users (first_name, last_name, avatar_url, born_date, start_work, created_at, updated_at, email, city, phone_number, position, type_work, vacation_days, description) 
//           VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7, $8, $9, $10, $11, $12, $13) 
//           RETURNING *`,
//       [first_name, last_name, avatar_url, born_date, start_work, email, city, phone_number, position, type_work, vacation_days, description]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // Обновление данных пользователя
// app.put('/users/:id', async (req, res) => {
//   const id = parseInt(req.params.id);
//   const { first_name, last_name, avatar_url, born_date, start_work, email, city, phone_number, position, type_work, vacation_days, description } = req.body;

//   try {
//     const result = await pool.query(
//       `UPDATE users SET 
//               first_name = $1, 
//               last_name = $2, 
//               avatar_url = $3, 
//               born_date = $4, 
//               start_work = $5, 
//               updated_at = NOW(), 
//               email = $6, 
//               city = $7, 
//               phone_number = $8, 
//               position = $9, 
//               type_work = $10, 
//               vacation_days = $11, 
//               description = $12 
//           WHERE id = $13 
//           RETURNING *`,
//       [first_name, last_name, avatar_url, born_date, start_work, email, city, phone_number, position, type_work, vacation_days, description, id]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // Удаление пользователя
// app.delete('/users/:id', async (req, res) => {
//   const id = parseInt(req.params.id);

//   try {
//     await pool.query('BEGIN'); // Начинаем транзакцию

//     // Удаляем пользователя из таблицы users
//     await pool.query('DELETE FROM users WHERE id = $1', [id]);

//     // Удаляем все записи связанные с этим пользователем из таблицы project_employees
//     await pool.query('DELETE FROM project_employees WHERE employee_id = $1', [id]);

//     await pool.query('COMMIT'); // Фиксируем изменения
//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });



// // GET /clients - фильтрация, сортировка и поиск
// app.get('/clients', async (req, res) => {
//   const {
//     id, first_name, last_name, avatar_url, born_date, created_at, updated_at,
//     city, phone_number, email, description, sort_by, sort_order = 'ASC', search
//   } = req.query;

//   let query = `
//     SELECT 
//       c.*, 
//       ARRAY_REMOVE(ARRAY_AGG(pc.project_id), NULL) AS project_ids
//     FROM 
//       clients c
//     LEFT JOIN 
//       project_clients pc ON c.id = pc.client_id
//     WHERE 
//       1=1
//   `;
//   let queryParams = [];

//   if (id) {
//     queryParams.push(id);
//     query += ` AND c.id = $${queryParams.length}`;
//   }
//   if (first_name) {
//     queryParams.push(`%${first_name}%`);
//     query += ` AND c.first_name ILIKE $${queryParams.length}`;
//   }
//   if (last_name) {
//     queryParams.push(`%${last_name}%`);
//     query += ` AND c.last_name ILIKE $${queryParams.length}`;
//   }
//   if (avatar_url) {
//     queryParams.push(`%${avatar_url}%`);
//     query += ` AND c.avatar_url ILIKE $${queryParams.length}`;
//   }
//   if (born_date) {
//     queryParams.push(born_date);
//     query += ` AND c.born_date = $${queryParams.length}`;
//   }
//   if (created_at) {
//     queryParams.push(created_at);
//     query += ` AND c.created_at = $${queryParams.length}`;
//   }
//   if (updated_at) {
//     queryParams.push(updated_at);
//     query += ` AND c.updated_at = $${queryParams.length}`;
//   }
//   if (city) {
//     queryParams.push(`%${city}%`);
//     query += ` AND c.city ILIKE $${queryParams.length}`;
//   }
//   if (phone_number) {
//     queryParams.push(`%${phone_number}%`);
//     query += ` AND c.phone_number ILIKE $${queryParams.length}`;
//   }
//   if (email) {
//     queryParams.push(`%${email}%`);
//     query += ` AND c.email ILIKE $${queryParams.length}`;
//   }
//   if (description) {
//     queryParams.push(`%${description}%`);
//     query += ` AND c.description ILIKE $${queryParams.length}`;
//   }
//   if (search) {
//     queryParams.push(`%${search}%`);
//     query += ` AND (c.first_name ILIKE $${queryParams.length} OR c.last_name ILIKE $${queryParams.length} OR c.email ILIKE $${queryParams.length})`;
//   }
  
//   query += ' GROUP BY c.id';

//   if (sort_by) {
//     const validSortFields = [
//       'id', 'first_name', 'last_name', 'avatar_url', 'born_date', 'created_at',
//       'updated_at', 'city', 'phone_number', 'email', 'description',
//     ];

//     if (validSortFields.includes(sort_by)) {
//       query += ` ORDER BY ${sort_by} ${sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
//     }
//   }

//   try {
//     const result = await pool.query(query, queryParams);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // GET /clients/:id - получение клиента по ID
// // app.get('/clients/:id', async (req, res) => {
// //   const id = req.params.id;

// //   try {
// //     const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
// //     if (result.rows.length === 0) {
// //       res.status(404).send('Client not found');
// //     } else {
// //       res.json(result.rows[0]);
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send('Server error');
// //   }
// // });
// app.get('/clients/:id', async (req, res) => {
//   const id = req.params.id;

//   let query = `
//     SELECT 
//       u.*, 
//       array_remove(array_agg(pe.project_id), NULL) as project_ids
//     FROM 
//       clients u
//       LEFT JOIN project_clients pe ON u.id = pe.client_id
//     WHERE 
//       u.id = $1
//     GROUP BY
//       u.id
//   `;
//   let queryParams = [id];

//   try {
//     const result = await pool.query(query, queryParams);
//     if (result.rows.length > 0) {
//       res.json(result.rows[0]);  // Возвращаем первый (и единственный) объект
//     } else {
//       res.json(null);  // Возвращаем null, если пользователь не найден
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });



// // POST /clients - создание нового клиента
// app.post('/clients', async (req, res) => {
//   const {
//     avatar_url, first_name, last_name, born_date, created_at, updated_at,
//     city, phone_number, email, description
//   } = req.body;

//   try {
//     const result = await pool.query(
//       `INSERT INTO clients (avatar_url, first_name, last_name, born_date, created_at, updated_at, city, phone_number, email, description) 
//       VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6, $7, $8, $9) RETURNING *`,
//       [avatar_url, first_name, last_name, born_date, city, phone_number, email, description]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // PUT /clients/:id - обновление информации о клиенте
// app.put('/clients/:id', async (req, res) => {
//   const id = req.params.id;
//   const {
//     avatar_url, first_name, last_name, born_date, created_at, updated_at,
//     city, phone_number, email, description
//   } = req.body;

//   try {
//     const result = await pool.query(
//       `UPDATE clients SET 
//         avatar_url = $1, 
//         first_name = $2, 
//         last_name = $3, 
//         born_date = $4, 
//         updated_at = NOW(), 
//         city = $5, 
//         phone_number = $6, 
//         email = $7, 
//         description = $8, 
//       WHERE id = $10 RETURNING *`,
//       [avatar_url, first_name, last_name, born_date, city, phone_number, email, description, id]
//     );

//     if (result.rows.length === 0) {
//       res.status(404).send('Client not found');
//     } else {
//       res.json(result.rows[0]);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // Delete
// app.delete('/clients/:id', async (req, res) => {
//   const id = parseInt(req.params.id);

//   try {
//     await pool.query('BEGIN'); // Начинаем транзакцию

//     // Удаляем пользователя из таблицы users
//     await pool.query('DELETE FROM clients WHERE id = $1', [id]);

//     // Удаляем все записи связанные с этим пользователем из таблицы project_employees
//     await pool.query('DELETE FROM project_clients WHERE client_id = $1', [id]);

//     await pool.query('COMMIT'); // Фиксируем изменения
//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });







// //PROJECTS


// app.get('/projects', async (req, res) => {
//   const { name, description, start_date, end_date, status, budget, sort_by, sort_order = 'ASC', search } = req.query;

//   let query = `SELECT p.*, 
//                       COALESCE(array_agg(DISTINCT pc.client_id) FILTER (WHERE pc.client_id IS NOT NULL), '{}') as client_ids, 
//                       COALESCE(array_agg(DISTINCT pe.employee_id) FILTER (WHERE pe.employee_id IS NOT NULL), '{}') as employee_ids 
//                FROM projects p
//                LEFT JOIN project_clients pc ON p.id = pc.project_id
//                LEFT JOIN project_employees pe ON p.id = pe.project_id
//                WHERE 1=1`;
//   let queryParams = [];

//   if (name) {
//     queryParams.push(`%${name}%`);
//     query += ` AND p.name ILIKE $${queryParams.length}`;
//   }
//   if (description) {
//     queryParams.push(`%${description}%`);
//     query += ` AND p.description ILIKE $${queryParams.length}`;
//   }
//   if (start_date) {
//     queryParams.push(start_date);
//     query += ` AND p.start_date = $${queryParams.length}`;
//   }
//   if (end_date) {
//     queryParams.push(end_date);
//     query += ` AND p.end_date = $${queryParams.length}`;
//   }
//   if (status) {
//     queryParams.push(status);
//     query += ` AND p.status = $${queryParams.length}`;
//   }
//   if (budget) {
//     queryParams.push(budget);
//     query += ` AND p.budget = $${queryParams.length}`;
//   }

//   if (search) {
//     const searchColumns = ['p.name', 'p.description', 'p.status'];
//     const searchConditions = searchColumns.map((col) => `${col} ILIKE $${queryParams.length + 1}`);
//     query += ` AND (${searchConditions.join(' OR ')})`;
//     queryParams.push(`%${search}%`);
//   }

//   query += ` GROUP BY p.id`;

//   if (sort_by) {
//     const validSortFields = ['name', 'description', 'start_date', 'end_date', 'status', 'budget', 'created_at', 'updated_at'];
//     if (validSortFields.includes(sort_by)) {
//       query += ` ORDER BY ${sort_by} ${sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
//     }
//   }

//   try {
//     const result = await pool.query(query, queryParams);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });



// // GET /projects/:id
// app.get('/projects/:id', async (req, res) => {
//   const projectId = req.params.id;

//   const query = `SELECT p.*, 
//                         COALESCE(array_agg(DISTINCT pc.client_id) FILTER (WHERE pc.client_id IS NOT NULL), '{}') as client_ids, 
//                         COALESCE(array_agg(DISTINCT pe.employee_id) FILTER (WHERE pe.employee_id IS NOT NULL), '{}') as employee_ids 
//                  FROM projects p
//                  LEFT JOIN project_clients pc ON p.id = pc.project_id
//                  LEFT JOIN project_employees pe ON p.id = pe.project_id
//                  WHERE p.id = $1
//                  GROUP BY p.id`;

//   try {
//     const result = await pool.query(query, [projectId]);
//     if (result.rows.length === 0) {
//       res.status(404).send('Project not found');
//     } else {
//       res.json(result.rows[0]);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });


// // POST /projects
// app.post('/projects', async (req, res) => {
//   const { name, description, start_date, end_date, status, budget, client_ids, employee_ids } = req.body;

//   const insertProjectQuery = `
//     INSERT INTO projects (name, description, start_date, end_date, status, budget, created_at, updated_at)
//     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
//     RETURNING id
//   `;

//   try {
//     const projectResult = await pool.query(insertProjectQuery, [name, description, start_date, end_date, status, budget]);
//     const projectId = projectResult.rows[0].id;

//     if (client_ids && client_ids.length > 0) {
//       const clientValues = client_ids.map(clientId => `(${projectId}, ${clientId})`).join(',');
//       const insertClientsQuery = `
//         INSERT INTO project_clients (project_id, client_id)
//         VALUES ${clientValues}
//       `;
//       await pool.query(insertClientsQuery);
//     }

//     if (employee_ids && employee_ids.length > 0) {
//       const employeeValues = employee_ids.map(employeeId => `(${projectId}, ${employeeId})`).join(',');
//       const insertEmployeesQuery = `
//         INSERT INTO project_employees (project_id, employee_id)
//         VALUES ${employeeValues}
//       `;
//       await pool.query(insertEmployeesQuery);
//     }

//     res.status(201).send('Project created successfully');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // PUT /projects/:id
// app.put('/projects/:id', async (req, res) => {
//   const projectId = req.params.id;
//   const { name, description, start_date, end_date, status, budget, client_ids, employee_ids } = req.body;

//   const clientValues = client_ids ? client_ids.map(clientId => `(${projectId}, ${clientId})`).join(',') : '';
//   const employeeValues = employee_ids ? employee_ids.map(employeeId => `(${projectId}, ${employeeId})`).join(',') : '';

//   const updateProjectQuery = `UPDATE projects
//                               SET name = $1,
//                                   description = $2,
//                                   start_date = $3,
//                                   end_date = $4,
//                                   status = $5,
//                                   budget = $6,
//                                   updated_at = NOW()
//                               WHERE id = $7`;

//   try {
//     await pool.query(updateProjectQuery, [name, description, start_date, end_date, status, budget, projectId]);

//     // Delete existing client and employee associations
//     const deleteClientsQuery = `DELETE FROM project_clients WHERE project_id = $1`;
//     const deleteEmployeesQuery = `DELETE FROM project_employees WHERE project_id = $1`;

//     await pool.query(deleteClientsQuery, [projectId]);
//     await pool.query(deleteEmployeesQuery, [projectId]);

//     // Insert new client and employee associations
//     if (client_ids && client_ids.length > 0) {
//       const insertClientsQuery = `INSERT INTO project_clients (project_id, client_id)
//                                   VALUES ${clientValues}`;

//       await pool.query(insertClientsQuery);
//     }

//     if (employee_ids && employee_ids.length > 0) {
//       const insertEmployeesQuery = `INSERT INTO project_employees (project_id, employee_id)
//                                     VALUES ${employeeValues}`;

//       await pool.query(insertEmployeesQuery);
//     }

//     res.status(200).send('Project updated successfully');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // DELETE /projects/:id
// app.delete('/projects/:id', async (req, res) => {
//   const projectId = req.params.id;

//   const deleteProjectQuery = `DELETE FROM projects WHERE id = $1`;
//   const deleteClientsQuery = `DELETE FROM project_clients WHERE project_id = $1`;
//   const deleteEmployeesQuery = `DELETE FROM project_employees WHERE project_id = $1`;

//   try {
//     await pool.query(deleteClientsQuery, [projectId]);
//     await pool.query(deleteEmployeesQuery, [projectId]);
//     await pool.query(deleteProjectQuery, [projectId]);

//     res.status(200).send('Project deleted successfully');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // Удаление связи между проектом и сотрудником с использованием POST-запроса
// app.post('/projects/remove-employee', async (req, res) => {
//   const { projectId, employeeId } = req.body;

//   if (!projectId || !employeeId) {
//     return res.status(400).send('Both projectId and employeeId are required');
//   }

//   const deleteQuery = `
//     DELETE FROM project_employees
//     WHERE project_id = $1 AND employee_id = $2
//   `;

//   try {
//     const result = await pool.query(deleteQuery, [projectId, employeeId]);
//     if (result.rowCount === 0) {
//       res.status(404).send('No such association found');
//     } else {
//       res.status(200).send('Association deleted successfully');
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });
// app.post('/projects/remove-client', async (req, res) => {
//   const { projectId, clientId } = req.body;

//   if (!projectId || !clientId) {
//     return res.status(400).send('Both projectId and clientId are required');
//   }

//   const deleteQuery = `
//     DELETE FROM project_clients
//     WHERE project_id = $1 AND client_id = $2
//   `;

//   try {
//     const result = await pool.query(deleteQuery, [projectId, clientId]);
//     if (result.rowCount === 0) {
//       res.status(404).send('No such association found');
//     } else {
//       res.status(200).send('Association deleted successfully');
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// app.post('/projects/add-employees', async (req, res) => {
//   const { projectId, employeeIds } = req.body;

//   if (!projectId || !employeeIds || !Array.isArray(employeeIds)) {
//     return res.status(400).json({ error: 'Invalid input' });
//   }

//   // Подготовка запроса для добавления связей
//   const values = employeeIds.map(employeeId => `(${projectId}, ${employeeId})`).join(',');
//   const query = `INSERT INTO project_employees (project_id, employee_id) VALUES ${values} ON CONFLICT DO NOTHING`;

//   try {
//     await pool.query(query);
//     res.status(201).json({ message: 'Employees added to project successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.post('/projects/add-clients', async (req, res) => {
//   const { projectId, clientIds } = req.body;

//   if (!projectId || !clientIds || !Array.isArray(clientIds)) {
//     return res.status(400).json({ error: 'Invalid input' });
//   }

//   // Подготовка запроса для добавления связей
//   const values = clientIds.map(clientId => `(${projectId}, ${clientId})`).join(',');
//   const query = `INSERT INTO project_clients (project_id, client_id) VALUES ${values} ON CONFLICT DO NOTHING`;

//   try {
//     await pool.query(query);
//     res.status(201).json({ message: 'Clients added to project successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// const app = require('./app');

// const port = 8080;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// server.js
const { app, server } = require('./app');

const port = 8080;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
