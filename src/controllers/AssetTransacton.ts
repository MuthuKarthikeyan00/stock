import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { Asset as AssetModel } from "@src/models/Asset";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { Employee as EmployeeModel } from "@src/models/Employee";
import { EmployeeRole as EmployeeRoleModel } from "@src/models/EmployeeRole";
import { Op } from "sequelize";
import { AssetCategory } from "@src/models/AssetCategory";
import { AssetType } from "@src/models/AssetType";




export default class AssetTransaction {

  public static async IssueRender(req: Request, res: Response) {
    const employeeRoles = await EmployeeRoleModel.findAll({
      where: {
        isDeleted: null, 
      },
    });
    
    let data;
    let id = Utils.convertTONumber(req.params.id);
    if (Utils.isGraterthenZero(id)) {
      data = await EmployeeModel.findOne({
        where: {
          id
        },
      })
    }

    return res.status(200).render('assetIssue', {
      data,
      employeeRoles
    });

  }

  public static async scrapRender(req: Request, res: Response) {

    const assetCategories = await AssetCategory.findAll({
      where: {
        isDeleted: null, 
      },
    });
    const assetTypes = await AssetType.findAll({
      where: {
        isDeleted: null, 
      },
    });
    
    let data;
    let id = Utils.convertTONumber(req.params.id);
    if (Utils.isGraterthenZero(id)) {
      data = await AssetModel.findOne({
        where: {
          id
        },
      })
    }

    return res.status(200).render('assetScrap', {
      data,
      assetCategories,
      assetTypes
    });
  }


  public static async returnRender(req: Request, res: Response) {

    const assetCategories = await AssetCategory.findAll({
      where: {
        isDeleted: null, 
      },
    });
    const assetTypes = await AssetType.findAll({
      where: {
        isDeleted: null, 
      },
    });
    
    let data;
    let id = Utils.convertTONumber(req.params.id);
    if (Utils.isGraterthenZero(id)) {
      data = await AssetModel.findOne({
        where: {
          id
        },
      })
    }

    return res.status(200).render('assetReturn', {
      data,
      assetCategories,
      assetTypes
    });
  }


  private static async handleData(body: any) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
      serialNumber: String(body.serialNumber),
      model: String(body.model),
      status: Number(body.status),
      typeId: Number(body.typeId),
      categoryId: Number(body.categoryId),
    });
  }

  

}
