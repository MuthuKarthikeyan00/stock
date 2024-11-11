import { Response } from 'express';
import JSONbig from 'json-bigint';


export default class ResponseHandler {

    public static success(res: Response, code: number = 200, data: any = {}, message: string = '') : Response {

        code = code || 200;
        message = message || '';
        data = data || [];

        res.status(code);
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSONbig.stringify({ success: true, message, data }));
    }

    

    public static error(res: Response, error: any = {}, code: number = 200, message: string = '') {

        console.log({ error: error });

        code = code || 200;
        message = message || '';
        
        return res.status(code).json({
            status: code,
            message,
            error
        });
    }



}