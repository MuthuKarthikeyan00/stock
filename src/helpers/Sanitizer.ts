import sanitizer from 'sanitizer';

export default class Sanitizer {

    public static  escape(text: string) : string {
        return sanitizer.escape(text);
    }

    public static  sanitize(text: string ) : string {
        return sanitizer.sanitize(text);
    }

    public static  sanitizeString(text: string ) : string {
        return Sanitizer.sanitize(Sanitizer.escape(String(text)))
    }
    public static  async sanitizeHtml(params: any , exclude : string[] = []) : Promise<any> {

        Object.keys(params).forEach((key) => {
            if(params.hasOwnProperty(key) &&  typeof params[key] === 'string' && !exclude.includes(key))  params[key] = Sanitizer.sanitizeString(params[key]);
        });
        return params;
    }
}