
import { Router ,Request, Response} from 'express';
import Employee from './controllers/Employee';
import EmployeeRole from './controllers/EmployeeRole';
import AssetCategory from './controllers/AssetCategory';
import Asset from './controllers/Asset';
import AssetType from './controllers/AssetType';

export default class Routers {
    private static router = Router();

    public static init(): Router {
               
        if (!this.router) {
            throw new Error('This.router is null');
        }

        this.router.get('/employee',Employee.render);
        this.router.get('/employee/:id',Employee.render);
        this.router.post('/getEmployee',Employee.fetch);
        this.router.post('/employee',Employee.create);
        this.router.post('/employee/:id',Employee.update);
        this.router.get('/employeeDelete/:id',Employee.delete);

        this.router.get('/employeeRole',EmployeeRole.render);
        this.router.get('/employeeRole/:id',EmployeeRole.render);
        this.router.post('/getEmployeeRole',EmployeeRole.fetch);
        this.router.post('/employeeRole',EmployeeRole.create);
        this.router.post('/employeeRole/:id',EmployeeRole.update);
        this.router.get('/employeeRoleDelete/:id',EmployeeRole.delete);


        this.router.get('/asset',Asset.render);
        this.router.get('/asset/:id',Asset.render);
        this.router.post('/getAsset',Asset.fetch);
        this.router.post('/asset',Asset.create);
        this.router.post('/asset/:id',Asset.update);
        this.router.get('/assetDelete/:id',Asset.delete);

        this.router.get('/assetCategory',AssetCategory.render);
        this.router.get('/assetCategory/:id',AssetCategory.render);
        this.router.post('/getAssetCategory',AssetCategory.fetch);
        this.router.post('/assetCategory',AssetCategory.create);
        this.router.post('/assetCategory/:id',AssetCategory.update);
        this.router.get('/assetCategoryDelete/:id',AssetCategory.delete);

        this.router.get('/assetType',AssetType.render);
        this.router.get('/assetType/:id',AssetType.render);
        this.router.post('/getAssetType',AssetType.fetch);
        this.router.post('/assetType',AssetType.create);
        this.router.post('/assetType/:id',AssetType.update);
        this.router.get('/assetTypeDelete/:id',AssetType.delete);
        

        this.router.get('/', (req: Request, res: Response) => {
            res.status(200).render('index', {
              docTitle: "",
            });
          });

        return this.router;
    }
}