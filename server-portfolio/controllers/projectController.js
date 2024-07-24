const { pool } = require('../config/dbConfig');

const getAllProjects = async (req, res) => {
  const { name, description, start_date, end_date, status, budget, sort_by, sort_order = 'ASC', search } = req.query;

  let query = `SELECT p.*, 
                      COALESCE(array_agg(DISTINCT pc.client_id) FILTER (WHERE pc.client_id IS NOT NULL), '{}') as client_ids, 
                      COALESCE(array_agg(DISTINCT pe.employee_id) FILTER (WHERE pe.employee_id IS NOT NULL), '{}') as employee_ids 
               FROM projects p
               LEFT JOIN project_clients pc ON p.id = pc.project_id
               LEFT JOIN project_employees pe ON p.id = pe.project_id
               WHERE 1=1`;
  let queryParams = [];

  if (name) {
    queryParams.push(`%${name}%`);
    query += ` AND p.name ILIKE $${queryParams.length}`;
  }
  if (description) {
    queryParams.push(`%${description}%`);
    query += ` AND p.description ILIKE $${queryParams.length}`;
  }
  if (start_date) {
    queryParams.push(start_date);
    query += ` AND p.start_date = $${queryParams.length}`;
  }
  if (end_date) {
    queryParams.push(end_date);
    query += ` AND p.end_date = $${queryParams.length}`;
  }
  if (status) {
    queryParams.push(status);
    query += ` AND p.status = $${queryParams.length}`;
  }
  if (budget) {
    queryParams.push(budget);
    query += ` AND p.budget = $${queryParams.length}`;
  }

  if (search) {
    const searchColumns = ['p.name', 'p.description', 'p.status'];
    const searchConditions = searchColumns.map((col) => `${col} ILIKE $${queryParams.length + 1}`);
    query += ` AND (${searchConditions.join(' OR ')})`;
    queryParams.push(`%${search}%`);
  }

  query += ` GROUP BY p.id`;

  if (sort_by) {
    const validSortFields = ['name', 'description', 'start_date', 'end_date', 'status', 'budget', 'created_at', 'updated_at'];
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

const getProjectById = async (req, res) => {
  const projectId = req.params.id;

  const query = `SELECT p.*, 
                        COALESCE(array_agg(DISTINCT pc.client_id) FILTER (WHERE pc.client_id IS NOT NULL), '{}') as client_ids, 
                        COALESCE(array_agg(DISTINCT pe.employee_id) FILTER (WHERE pe.employee_id IS NOT NULL), '{}') as employee_ids 
                 FROM projects p
                 LEFT JOIN project_clients pc ON p.id = pc.project_id
                 LEFT JOIN project_employees pe ON p.id = pe.project_id
                 WHERE p.id = $1
                 GROUP BY p.id`;

  try {
    const result = await pool.query(query, [projectId]);
    if (result.rows.length === 0) {
      res.status(404).send('Project not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const createProject = async (req, res) => {
  const { name, description, start_date, end_date, status, budget, client_ids, employee_ids } = req.body;

  const insertProjectQuery = `
    INSERT INTO projects (name, description, start_date, end_date, status, budget, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING id
  `;

  try {
    const projectResult = await pool.query(insertProjectQuery, [name, description, start_date, end_date, status, budget]);
    const projectId = projectResult.rows[0].id;

    if (client_ids && client_ids.length > 0) {
      const clientValues = client_ids.map(clientId => `(${projectId}, ${clientId})`).join(',');
      const insertClientsQuery = `
        INSERT INTO project_clients (project_id, client_id)
        VALUES ${clientValues}
      `;
      await pool.query(insertClientsQuery);
    }

    if (employee_ids && employee_ids.length > 0) {
      const employeeValues = employee_ids.map(employeeId => `(${projectId}, ${employeeId})`).join(',');
      const insertEmployeesQuery = `
        INSERT INTO project_employees (project_id, employee_id)
        VALUES ${employeeValues}
      `;
      await pool.query(insertEmployeesQuery);
    }

    res.status(201).send('Project created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const { name, description, start_date, end_date, status, budget, client_ids, employee_ids } = req.body;

  const clientValues = client_ids ? client_ids.map(clientId => `(${projectId}, ${clientId})`).join(',') : '';
  const employeeValues = employee_ids ? employee_ids.map(employeeId => `(${projectId}, ${employeeId})`).join(',') : '';

  const updateProjectQuery = `UPDATE projects
                              SET name = $1,
                                  description = $2,
                                  start_date = $3,
                                  end_date = $4,
                                  status = $5,
                                  budget = $6,
                                  updated_at = NOW()
                              WHERE id = $7`;

  try {
    await pool.query(updateProjectQuery, [name, description, start_date, end_date, status, budget, projectId]);

    // Delete existing client and employee associations
    const deleteClientsQuery = `DELETE FROM project_clients WHERE project_id = $1`;
    const deleteEmployeesQuery = `DELETE FROM project_employees WHERE project_id = $1`;

    await pool.query(deleteClientsQuery, [projectId]);
    await pool.query(deleteEmployeesQuery, [projectId]);

    // Insert new client and employee associations
    if (client_ids && client_ids.length > 0) {
      const insertClientsQuery = `INSERT INTO project_clients (project_id, client_id)
                                  VALUES ${clientValues}`;

      await pool.query(insertClientsQuery);
    }

    if (employee_ids && employee_ids.length > 0) {
      const insertEmployeesQuery = `INSERT INTO project_employees (project_id, employee_id)
                                    VALUES ${employeeValues}`;

      await pool.query(insertEmployeesQuery);
    }

    res.status(200).send('Project updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const deleteProject = async (req, res) => {
  const projectId = req.params.id;

  const deleteProjectQuery = `DELETE FROM projects WHERE id = $1`;
  const deleteClientsQuery = `DELETE FROM project_clients WHERE project_id = $1`;
  const deleteEmployeesQuery = `DELETE FROM project_employees WHERE project_id = $1`;

  try {
    await pool.query(deleteClientsQuery, [projectId]);
    await pool.query(deleteEmployeesQuery, [projectId]);
    await pool.query(deleteProjectQuery, [projectId]);

    res.status(200).send('Project deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const removeEmployeeFromProject = async (req, res) => {
  const { projectId, employeeId } = req.body;

  if (!projectId || !employeeId) {
    return res.status(400).send('Both projectId and employeeId are required');
  }

  const deleteQuery = `
    DELETE FROM project_employees
    WHERE project_id = $1 AND employee_id = $2
  `;

  try {
    const result = await pool.query(deleteQuery, [projectId, employeeId]);
    if (result.rowCount === 0) {
      res.status(404).send('No such association found');
    } else {
      res.status(200).send('Association deleted successfully');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const removeClientFromProject = async (req, res) => {
  const { projectId, clientId } = req.body;

  if (!projectId || !clientId) {
    return res.status(400).send('Both projectId and clientId are required');
  }

  const deleteQuery = `
    DELETE FROM project_clients
    WHERE project_id = $1 AND client_id = $2
  `;

  try {
    const result = await pool.query(deleteQuery, [projectId, clientId]);
    if (result.rowCount === 0) {
      res.status(404).send('No such association found');
    } else {
      res.status(200).send('Association deleted successfully');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const addEmpoloyeeToProject = async (req, res) => {
  const { projectId, employeeIds } = req.body;

  if (!projectId || !employeeIds || !Array.isArray(employeeIds)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Подготовка запроса для добавления связей
  const values = employeeIds.map(employeeId => `(${projectId}, ${employeeId})`).join(',');
  const query = `INSERT INTO project_employees (project_id, employee_id) VALUES ${values} ON CONFLICT DO NOTHING`;

  try {
    await pool.query(query);
    res.status(201).json({ message: 'Employees added to project successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const addClientToProject = async (req, res) => {
  const { projectId, clientIds } = req.body;

  if (!projectId || !clientIds || !Array.isArray(clientIds)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Подготовка запроса для добавления связей
  const values = clientIds.map(clientId => `(${projectId}, ${clientId})`).join(',');
  const query = `INSERT INTO project_clients (project_id, client_id) VALUES ${values} ON CONFLICT DO NOTHING`;

  try {
    await pool.query(query);
    res.status(201).json({ message: 'Clients added to project successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  removeEmployeeFromProject,
  removeClientFromProject,
  addEmpoloyeeToProject,
  addClientToProject,
};