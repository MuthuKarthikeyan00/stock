import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { Asset as AssetModel } from "@src/models/Asset";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { assetValidationSchema } from "@src/validator/schema";
import { literal, Op } from "sequelize";
import  AssetCategory  from "@src/controllers/AssetCategory";
import  AssetType  from "@src/controllers/AssetType";
import AssetStatus from "./AssetStatus";
import { Employee } from "@src/models/Employee";
import { AssetTransaction } from "@src/models/AssetTransaction";
import { AssetStatus as AssetStatusModel } from "@src/models/AssetStatus";
import { AssetCategory as AssetCategoryModel } from "@src/models/AssetCategory";
import { AssetType as AssetTypeModel } from "@src/models/AssetType";
import { Employee as EmployeeModel } from "@src/models/Employee";




export default class Asset {
  public static async render(req: Request, res: Response) {


    const assetCategories = await AssetCategory.fetch();
    const assetTypes = await AssetType.fetch();
    const assetStatuses = await AssetStatus.fetch();
    
    let data;
    let id = Utils.convertTONumber(req.params.id);
    if (Utils.isGraterthenZero(id)) {
      data = await AssetModel.findOne({
        where: {
          id
        },
      })
    }

    return res.status(200).render('asset', {
      data,
      assetCategories,
      assetTypes,
      assetStatuses
    });
  }

  private static async handleData(body: any) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
      serialNumber: String(body.serialNumber),
      model: String(body.model),
      typeId: Number(body.typeId),
      categoryId: Number(body.categoryId),
      amount: Number(body.amount),
    });
  }

  public static async create(req: Request, res: Response) {

    try {
      const body = req.body;
      const args = await Asset.handleData(body);
      const status = await Validator.validate(args, assetValidationSchema, res)
      if(!status){
        return ResponseHandler.error(res);
      }
      args.craetedAt = new Date().toISOString();
      args.assetStatusId =  1;
      args.assetTransactionTypeId =  1;
      const data = await AssetModel.create(args);

      if (Utils.isGraterthenZero(data.id)){

        const result = await AssetTransaction.create({
          assetId: data.id,
          assetTransactionTypeId: 1,
          amount: data.amount,
          assetStatusId: 1,
          createdAt: new Date().toISOString()
        })

        if (Utils.isGraterthenZero(result.id)) return res.status(201).redirect('/asset'); 

      }
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


      const args = await Asset.handleData(body);
      console.log(args);
      
      const status = await Validator.validate(args, assetValidationSchema, res)
      if(!status){
        return ResponseHandler.error(res);
      }
      args.updatedAt = new Date().toISOString();
      args.statusId =  1;

      const isValid = await AssetModel.findOne({
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

      const updated_id = await AssetModel.update(args, {
        where: {
          id,
        }
      });

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/asset'); 
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

      const isValid = await AssetModel.findOne({
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

      const updated_id = await AssetModel.update({ isDeleted: 1 }, {
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

  public static async getAssets(req: Request, res: Response) {

    try {

      let { offset, limit, draw, search, orderColumn, orderDir } = req.body;
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

      const { count, rows } = await AssetModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: limit,
        order: [[String(orderColumn), String(orderDir)]],

        include: [
          {
            model: AssetStatusModel,
            attributes: [ ['name', 'assetStatusName']],
            required: false 
          },
          {
            model: AssetCategoryModel,
            attributes: [ ['name', 'assetCategoryName']],
            required: false 
          },
          {
            model: AssetTypeModel,
            attributes: [ ['name', 'assetTypeName']],
            required: false 
          },
          {
            model: EmployeeModel,
            attributes: [ ['name', 'employeeName']],
            required: false 
          }
        ],
        raw: true
      });

      const data =  rows.map((row : any) => {
        return {
          id: row.id,
          name: row.name,
          serialNumber: row.serialNumber,
          model: row.model,
          categoryId :row['assetCategory.assetCategoryName'],
          typeId : row['assetType.assetTypeName'],
          assetStatusId : row['assetStatus.assetStatusName'],
          employeeId : row['employee.employeeName'],
          amount : row.amount,
        }
      })
    
      res.json({
        draw: draw,
        recordsTotal: count,
        recordsFiltered: count,
        data,
      });

    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  public static async fetch(args: any = {}) {
    const search = args?.search || '';
    const assetStatusIds = args?.assetStatusIds || [1, 2, 3, 4];
  
    const assets = await AssetModel.findAll({
      attributes: [
        [literal(`CONCAT("Asset"."model", '-', "Asset"."serialNumber", '-', "Asset"."name")`), 'name'],
        ['id', 'id'],
        ['employeeId', 'employeeId'],
        [literal(`Employee.name`), 'employeeName'],
      
      ],
      where: {
        isDeleted: {
          [Op.is]: null
        },
        [Op.or]: [
          { serialNumber: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } },
          { model: { [Op.like]: `%${search}%` } },
        ],
        assetStatusId: {
          [Op.in]:assetStatusIds
        }
      },
      include: [
        {
          model: Employee,
          attributes: [ ['name', 'employeeName']],
          required: false 
        }
      ],
      raw: true
    });

    const data =  assets.map((asset : any) => {
      return {
        label: asset.name,
        value: asset.id,
        employeeId: asset.employeeId,
        employeeName : asset.employeeName
      }
    })
    return data;
  }
  

}
