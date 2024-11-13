import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { Asset as AssetModel } from "@src/models/Asset";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { Employee as EmployeeModel } from "@src/models/Employee";
import { AssetTransaction as AssetTransactionModel } from "@src/models/AssetTransaction";
import { Op } from "sequelize";
import { AssetCategory } from "@src/models/AssetCategory";
import { AssetType } from "@src/models/AssetType";
import Asset from "./Asset";
import { number } from "zod";
import { AssetTransactionValidationSchema } from "@src/validator/schema";
import Employee from "./Employee";




export default class AssetTransaction {


  public static async IssueRender(req: Request, res: Response) {

    const employees = await Employee.fetch();
    const assets = await Asset.fetch({statusIds: [1,3]});
    
    return res.status(200).render('assetIssue', {
      employees,
      assets
    });

  }

  public static async returnRender(req: Request, res: Response) {

    const employees = await Employee.fetch();
    const assets = await Asset.fetch({statusIds: [2]});
    
    return res.status(200).render('assetReturn', {
      employees,
      assets
    });

  }

  public static async scrapRender(req: Request, res: Response) {

    const employees = await Employee.fetch();
    const assets = await Asset.fetch({statusIds: [2,3]});
    
    return res.status(200).render('assetScrap', {
      employees,
      assets
    });
  }


  private static async handleData(body: any) {

    return Sanitizer.sanitizeHtml({
      assetId: Number(body.assetId),
      transactionType: Number(body.transactionType),
      employeeId: Number(body.employeeId),
      reason: body.reason ? String(body.reason) : null,
    });
  }

  public static async create(req: Request, res: Response) {

    try {
      const body = req.body;
      const args = await AssetTransaction.handleData(body);
      const status = await Validator.validate(args, AssetTransactionValidationSchema, res)

      const data = await AssetTransactionModel.create(args);
      
      if (Utils.isGraterthenZero(data.id)){

        const updated_id = await AssetModel.update({
          statusId: data.transactionType,
          employeeId: data.employeeId
        }, {
          where: {
            id:data.assetId,
          }
        });

        return ResponseHandler.success(res, 201, data);

      } 
      return ResponseHandler.error(res);

    } catch (error) {
      return ResponseHandler.error(res, error);
    }

  }
  

}
