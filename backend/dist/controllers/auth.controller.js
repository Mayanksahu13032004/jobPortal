"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.employerLogin = exports.jobseekerLogin = exports.employerSignup = exports.jobseekerSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
};
const signup = async (req, res, role) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res
                .status(400)
                .json({ message: 'Name, email and password are required' });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'Email already in use' });
            return;
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            role
        });
        const token = createToken(user);
        res.status(201).json({
            message: `${role} registered successfully`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during signup' });
    }
};
const login = async (req, res, role) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const user = await User_1.default.findOne({ email, role });
        if (!user) {
            res.status(400).json({ message: `Invalid credentials for ${role}` });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const token = createToken(user);
        res.status(200).json({
            message: `${role} logged in successfully`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};
const jobseekerSignup = (req, res) => signup(req, res, 'jobseeker');
exports.jobseekerSignup = jobseekerSignup;
const employerSignup = (req, res) => signup(req, res, 'employer');
exports.employerSignup = employerSignup;
const jobseekerLogin = (req, res) => login(req, res, 'jobseeker');
exports.jobseekerLogin = jobseekerLogin;
const employerLogin = (req, res) => login(req, res, 'employer');
exports.employerLogin = employerLogin;
const getMe = (req, res) => {
    const authReq = req;
    if (!authReq.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    res.status(200).json({
        user: authReq.user
    });
};
exports.getMe = getMe;
