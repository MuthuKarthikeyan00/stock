import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { AssetStatus as AssetStatusModel } from "@src/models/AssetStatus";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { employeeRoleValidationSchema } from "@src/validator/schema";
import { Op } from "sequelize";



export default class AssetStatus {
  public static async render(req: Request, res: Response) {
   
     let data ;
     let id = Utils.convertTONumber(req.params.id);
     if (Utils.isGraterthenZero(id)) {
       data = await AssetStatusModel.findOne({
         where: {
           id
         },
       })
 
     }
    return res.status(200).render('assetStatus', {
      data
    });
  }

  private static async handleData(body: any) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
    });
  }

  public static async create(req: Request, res: Response) {

    try {

      const status = await Validator.validate(req.body, employeeRoleValidationSchema, res)
      const body = req.body;
      const args = await AssetStatus.handleData(body);

      const data = await AssetStatusModel.create({
        name: args.name,
        createdAt: new Date().toISOString(),
      });
      
      if (Utils.isGraterthenZero(data.id)) return ResponseHandler.success(res, 201, data);
      return ResponseHandler.error(res);

    } catch (error) {
      return ResponseHandler.error(res, error);
    }

  }

  public static async update(req: Request, res: Response) {
    try {

      const body = req.body;
      const id = Number(req.params.id);

      if (!Utils.isGraterthenZero(id)) {
        return ResponseHandler.error(
          res, {},
          400,
          "invalid id"
        );
      }
      const status = await Validator.validate(req.body, employeeRoleValidationSchema, res)
      const args = await AssetStatus.handleData(body);
      args.updatedAt = new Date().toISOString();

      const isValid = await AssetStatusModel.findOne({
        where: {
          id,
        },
      });
      if (!isValid) {
        return ResponseHandler.error(
          res, {},
          400,
          "invalid id"
        );
      }

      const updated_id = await AssetStatusModel.update(args, {
        where: {
          id,
        }
      });
     
      if (Utils.isGraterthenZero(updated_id[0])) return ResponseHandler.success(res, 200, {});
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  public static async delete(req: Request, res: Response) {
    try {

      const body = req.body;
      const id = Number(req.params.id);

      if (!Utils.isGraterthenZero(id)) {
        return ResponseHandler.error(
          res, {},
          400,
          "invalid id"
        );
      }

      const isValid = await AssetStatusModel.findOne({
        where: {
          id,
        },
      });
      if (!isValid) {
        return ResponseHandler.error(
          res, {},
          400,
          "invalid id"
        );
      }

      const updated_id = await AssetStatusModel.update({isDeleted: 1}, {
        where: {
          id,
        }
      });
     
      if (Utils.isGraterthenZero(updated_id[0])) return ResponseHandler.success(res, 200, {});
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  public static async getAssetStatus(req: Request, res: Response) {

    try{

      let { offset , limit , draw , search,orderColumn,orderDir} = req.body;
      const searchValue = search?.value || ''; 
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = orderBy || "id";
      orderDir = orderDir || "desc";
 
  
      const whereClause = {
        isDeleted: null,  
        ...(searchValue && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchValue}%` } },
          ],
        }),
      };
      
    
      const data = await AssetStatusModel.findAndCountAll({
        where: whereClause,
      offset: offset,
      limit: limit,
      order: [[String(orderColumn), String(orderDir)]], 
        
    });

    res.json({
        draw: draw,
        recordsTotal: data.count,
        recordsFiltered: data.count,
        data: data.rows,
    });

      

    }catch(error){

    }

  }

  public static async fetch(args: any = {}) {
    const search = args?.search || '';

    const assetCategories = await AssetStatusModel.findAll({
      attributes: [
        ['id', 'value'],
        ['name', 'label']
      ],
      where: {
        isDeleted: {
          [Op.is]: null
        },
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
        ]
      },
      raw: true
    });
   
    return   assetCategories;

  }


}
