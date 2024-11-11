
import { Router ,Request, Response} from 'express';
import Employee from './controllers/Employee';
import EmployeeRole from './controllers/EmployeeRole';

export default class Routers {
    private static router = Router();

    public static init(): Router {
               
        if (!this.router) {
            throw new Error('This.router is null');
        }

        this.router.get('/employee',Employee.render);

        this.router.post('/employee',Employee.create);


        this.router.get('/employeeRole',EmployeeRole.render);
        this.router.post('/getEmployeeRole',EmployeeRole.fetch);
        this.router.post('/employeeRole',EmployeeRole.create);
        this.router.put('/employeeRole/:id',EmployeeRole.update);
        this.router.patch('/employeeRole/:id',EmployeeRole.delete);
        

        this.router.get('/', (req: Request, res: Response) => {
            res.status(200).render('index', {
              docTitle: "Welcome to JVLcode",
            });
          });

        return this.router;
    }
}