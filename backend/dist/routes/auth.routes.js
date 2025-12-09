"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
// Jobseeker auth
router.post('/jobseeker/signup', auth_controller_1.jobseekerSignup);
router.post('/jobseeker/login', auth_controller_1.jobseekerLogin);
// Employer auth
router.post('/employer/signup', auth_controller_1.employerSignup);
router.post('/employer/login', auth_controller_1.employerLogin);
// Current user
router.get('/me', auth_middleware_1.auth, auth_controller_1.getMe);
// Example role-protected routes
router.get('/jobseeker/only', auth_middleware_1.auth, (0, role_middleware_1.authorizeRoles)('jobseeker'), (req, res) => {
    res.json({ message: 'Hello Jobseeker, this is a protected route.' });
});
router.get('/employer/only', auth_middleware_1.auth, (0, role_middleware_1.authorizeRoles)('employer'), (req, res) => {
    res.json({ message: 'Hello Employer, this is a protected route.' });
});
exports.default = router;
