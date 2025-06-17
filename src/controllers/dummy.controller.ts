import {Request, Response} from 'express';

export default {
    dummy(req: Request, res: Response) {
        res.status(200).json({
            message: 'This is a dummy response',
            data : "OKS",
        });
    },
};