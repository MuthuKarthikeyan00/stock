import {NextFunction, Request} from "express";

export default class Utils {


    public static  isString(param : any) : boolean {
        return typeof param === 'string'
    }

    public static  isNumber(param : any) : boolean {
        return typeof param === 'number' || typeof param === 'bigint'
    }

    public static  isBoolean(param : any) : boolean {
        return typeof param === 'boolean'
    }

    public static  isArray(param : any) : boolean {
        return Array.isArray(param)
    }

    public static  isObject(param : any) : boolean {
        return typeof param === 'object'
    }

    public static  isEmpty(param : any) : boolean {
        return  param == ''
    }

    public static  isNull(param : any) : boolean {
        return  param == ''
    }

    public static  isUndefined(param : any) : boolean {
        return  param == undefined;
    }

    public static  isGraterthenZero(param : any) : boolean {
        return   this.isNumber(param) && Number(param) > 0;
    }

    public static  isValid(param : any) : boolean {
        return  this.isEmpty(param) && this.isNull(param) && this.isUndefined(param);
    }

    public static  toLowerCase(param : string) : string {
        return  param.toLowerCase() ;
    }

    public static  toUpperCase(param : string) : string {
        return  param.toUpperCase() ;
    }

    public static  checkRequestMethod(req : Request , method : string ) : boolean {
        return  req.method === this.toUpperCase(method)
    }

    public static getHttpParam(req : Request , key : string ,  method : string = 'PUT') : number {
         
        if(!this.checkRequestMethod(req,method) || !req.params[key] || !this.isGraterthenZero(req.params[key]) ) {
            return 0
        }   
        return Number(req.params[key])
    }

    public static convertTONumber(param : any) : | number {
        param = this.isNumber(param) ? param : Number(param) ;  
        return this.isNumber(param) ? Number(param) : 0 ;  
    }

    public static dateFormat(dateString : string) : string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); 
        
    }

    public static  removeNullPrototype(req : Request, res : Response, next :NextFunction) {
        req.body = Object.assign({}, req.body);
        next();
    }
}

export function removeNullPrototype(req: Request, res: Response, next: NextFunction): void {
    req.body = Object.assign({}, req.body);
    next();
  }