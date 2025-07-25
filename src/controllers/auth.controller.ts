import { Request, Response } from 'express';
import * as yup from 'yup';
import UserModel from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IReqUser } from '../middlewares/auth.middleware';

type TRegister = {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type TLogin = {
    identifier: string;
    password: string;
};

const registerValidationSchema = yup.object({
    fullName: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup.string().min(6).required().oneOf([yup.ref('password'), ""], 'Passwords must match'),
});

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
                email,
                username,
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
    async login(req: Request, res: Response) {
        const {identifier, password} = req.body as unknown as TLogin;
        try {
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        username: identifier,
                    },
                ],
            });

            if(!userByIdentifier){
                return res.status(403).json({
                    message: "user not found",
                    data: null
                });
            }

            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if(!validatePassword){
                return res.status(403).json({
                    message: "user not found",
                    data: null
                });
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            res.status(200).json({
                message: "Success login user",
                data: token,
            });

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
    async me(req: IReqUser, res: Response) {
        try {
            const user = req.user;
            const result = await UserModel.findById(user?.id);

            res.status(200).json({
                message: "Success get user data",
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