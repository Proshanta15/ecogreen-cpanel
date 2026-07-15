import express from 'express';
import authControllers from '../controllers/auth-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import { validate } from '../middlewares/validate-middleware.js';
import { loginSchema, signupSchema } from '../validators/auth-validator.js';

const router = express.Router();

router.route('/').get(authControllers.home);

router.route('/register').post(validate(signupSchema), authControllers.register);

router.route('/login').post(validate(loginSchema), authControllers.login);

router.route('/user').get(authMiddleware, authControllers.user);

export default router;
