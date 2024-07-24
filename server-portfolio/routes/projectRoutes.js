const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/remove-employee', projectController.removeEmployeeFromProject);
router.post('/remove-client', projectController.removeClientFromProject);
router.post('/add-employees', projectController.addEmpoloyeeToProject);
router.post('/add-clients', projectController.addClientToProject);

module.exports = router;