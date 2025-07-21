import { Request, Response } from 'express';
import * as yup from 'yup';
import UserModel from '../models/user.model';

type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const registerValidationSchema = yup.object().shape({
    fullName: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup.string().min(6).required().oneOf([yup.ref('password'), ""], 'Passwords must match'),
})

export default {
    async register(req: Request, res: Response) {
        const {
            fullName,
            username,
            email,
            password,
            confirmPassword
        } = req.body as unknown as TRegister;

        try {
            await registerValidationSchema.validate({
                fullName,
                username,
                email,
                password,
                confirmPassword
            });

            const result = await UserModel.create({
                fullName,
                username,
                email,
                password,
            });

            res.status(200).json({
                message: "Success registering user",
                data: result,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    }, 
};