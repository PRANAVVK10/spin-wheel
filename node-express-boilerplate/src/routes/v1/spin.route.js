const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const spinController = require('../../controllers/spin.controller');

const router = express.Router();

// router
//   .route('/')
//   .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

// router
//   .route('/:userId')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
//   .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

  // router.get('/find-active-chat/:id', spinController.findActiveChat);
  router.get('/find-active-chat/', spinController.findActiveChat);
  router.get('/clear-chat', spinController.clearChat);
  router.post('/create',auth(), spinController.createSpin);
  router.post('/start',auth(), spinController.startSpin);
  // router.post('/create', spinController.createSpin);
  // router.post('/start', spinController.startSpin);
  router.get('/get/:id', spinController.getSpinById);
  

module.exports = router;