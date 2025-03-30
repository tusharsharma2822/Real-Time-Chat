import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({ errors: errors.array() });
    }

    try {

        const user = await userService.creteUser(req.body);
        
        const token = await user.generateToken();

        return res.status(201).json({user, token});
        
    } catch(err) {
        return res.status(401).send(err.message);
    }
}

export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({
                errors: 'Invalid Credentials'
            })
        }

        const isMatch = await user.isValidPassword(password);

        if(!isMatch){
            return res.status(401).json({
                errors: "Invalid Credentials"
            })
        }

        const token = await user.generateToken()

        return res.status(200).json({user, token});
        
    } catch(err) {
        return res.status(400).send(err.message);
    }
}

export const profileController = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
}

export const logoutController = async (req, res) => {
    try {

        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        redisClient.set(token, 'logout', 'EX', 60*60*24);

        return res.status(200).json({
            message: "Logged Out Successfully"
        })
        
    } catch (error) {
        return res.status(400).send(err.message);
    }
}