import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { Asset as AssetModel } from "@src/models/Asset";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { AssetLog as AssetLogModel } from "@src/models/AssetLog";
import Asset from "./Asset";
import { AssetLogValidationSchema } from "@src/validator/schema";
import Employee from "./Employee";
import AssetStatus from "./AssetStatus";
import AssetTransactionType from "./AssetTransactionType";
import { AssetTransaction } from "@src/models/AssetTransaction";




export default class AssetLog {


  public static async IssueRender(req: Request, res: Response) {

    const employees = await Employee.fetch();
    const assets = await Asset.fetch({assetStatusIds: [1,3]});
    
    return res.status(200).render('assetIssue', {
      employees,
      assets
    });

  }

  public static async returnRender(req: Request, res: Response) {

    const assets = await Asset.fetch({assetStatusIds: [2]});
    const assetTransactionIds = await AssetTransactionType.fetch({assetTransactionIds: [2,3,4]});
    return res.status(200).render('assetReturn', {
      assets,
      assetTransactionIds
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
      assetStatusId: Number(body.assetStatusId),
      assetTransactionTypeId : body.assetTransactionTypeId ? Number(body.assetTransactionTypeId) : null,
      amount : body.amount ? Number(body.amount) : null,
      employeeId: Number(body.employeeId),
    });
  }

  public static async create(req: Request, res: Response) {

    try {
      const body = req.body;
      const args = await AssetLog.handleData(body);
      const status = await Validator.validate(args, AssetLogValidationSchema, res)
      args.createdAt = new Date().toISOString();


      const data = await AssetLogModel.create(args);
      if (Utils.isGraterthenZero(data.id)){
        const updated_id = await AssetModel.update({
          assetStatusId: data.assetStatusId,
          employeeId: ([2].includes(args.assetStatusId)) ? data.employeeId : null
        }, {
          where: {
            id:data.assetId,
          }
        });

        if(args.assetStatusId == 3  && [2,3].includes(args.assetTransactionTypeId) ){
          const assetTransaction = await AssetTransaction.create({
          assetId: args.assetId,
          employeeId: args.employeeId,
          assetTransactionTypeId: args.assetTransactionTypeId,
          amount: args.amount,
          assetStatusId: args.assetStatusId,
          createdAt:  args.createdAt,
        })
      }
        return ResponseHandler.success(res, 201, data);
      } 
    
      return ResponseHandler.error(res);

    } catch (error) {
      return ResponseHandler.error(res, error);
    }

  }
  

}
