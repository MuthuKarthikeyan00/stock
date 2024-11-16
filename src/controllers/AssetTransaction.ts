import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { Asset as AssetModel } from "@src/models/Asset";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { AssetTransaction as AssetTransactionModel } from "@src/models/AssetTransaction";
import { AssetStatus as AssetStatusModel } from "@src/models/AssetStatus";
import { AssetTransactionType as AssetTransactionTypeModel } from "@src/models/AssetTransactionType";
import Asset from "./Asset";
import { AssetTransactionValidationSchema } from "@src/validator/schema";
import {Employee as EmployeeModel} from "@src/models/Employee";
import AssetStatus from "./AssetStatus";
import AssetTransactionType from "./AssetTransactionType";
import { literal, Op, QueryTypes } from "sequelize";
import Employee from "./Employee";
import { create } from "domain";
import EmployeeBranch from "./EmployeeBranch";
import AssetCategory from "./AssetCategory";
import sequelize from "@src/config/database";





export default class AssetTransaction {


  public static async issueRender(req: Request, res: Response) {

    const employees = await Employee.fetch();
    const assets = await Asset.fetch({ assetStatusIds: [1, 3] });

    return res.status(200).render('assetIssue', {
      employees,
      assets
    });

  }

  public static async returnRender(req: Request, res: Response) {

    const assets = await Asset.fetch({ assetStatusIds: [2] });
    const assetTransactionIds = await AssetTransactionType.fetch({ assetTransactionIds: [2, 3, 4] });
    return res.status(200).render('assetReturn', {
      assets,
      assetTransactionIds
    });

  }

  public static async scrapRender(req: Request, res: Response) {

    const assets = await Asset.fetch({ assetStatusIds: [2, 3] });

    return res.status(200).render('assetScrap', {
      assets
    });
  }

  public static async assetsHistroyRender(req: Request, res: Response) {

    const assets = await Asset.fetch({});

    return res.status(200).render('assetsHistroy', {
      assets
    });
  }


  public static async stockViewRender(req: Request, res: Response) {

    const employees = await Employee.fetch();
    const assets = await Asset.fetch();
    const branches = await EmployeeBranch.fetch()   
    const assetCategories = await AssetCategory.fetch();
    const assetStatuses = await AssetStatus.fetch();
    

    return res.status(200).render('stockView', {
      employees,
      assets,
      assetCategories,
      branches,
      assetStatuses,
    });

  }


  private static async handleData(body: any) {

    return Sanitizer.sanitizeHtml({
      assetId: Number(body.assetId),
      assetStatusId: Number(body.assetStatusId),
      assetTransactionTypeId: body.assetTransactionTypeId ? Number(body.assetTransactionTypeId) : null,
      amount: body.amount ? Number(body.amount) : null,
      employeeId: body.employeeId ? Number(body.employeeId) : null,
    });
  }

  public static async create(req: Request, res: Response) {

    try {
      const body = req.body;
      const args = await AssetTransaction.handleData(body);
      const status = await Validator.validate(args, AssetTransactionValidationSchema, res)
      args.createdAt = new Date().toISOString();


      const data = await AssetTransactionModel.create(args);
      if (Utils.isGraterthenZero(data.id)) {
        const updated_id = await AssetModel.update({
          assetStatusId: data.assetStatusId,
          employeeId: ([2].includes(args.assetStatusId)) ? data.employeeId : null
        }, {
          where: {
            id: data.assetId,
          }
        });
        return ResponseHandler.success(res, 201, data);
      }

      return ResponseHandler.error(res);

    } catch (error) {
      return ResponseHandler.error(res, error);
    }

  }


  public static async getAssetsHistory(req: Request, res: Response) {
    try {
      let { offset, limit, draw, search, orderColumn, orderDir,args } = req.body;
      const searchValue = search?.value || '';
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = !String(orderBy) ||orderBy =='assetId' ? 'createdAt' : String(orderBy);
      orderDir = String(orderDir) || "asc";
      const assetId = args?.assetId ;

      if(!assetId ){
        return ResponseHandler.error(res,)
      }

      const { rows, count} = await AssetTransactionModel.findAndCountAll({
          attributes: [
            'id',
          'amount','createdAt',],
          where: {
            assetId:assetId
          },
  
          include: [
            {
              model: AssetModel,
              attributes: [['name', 'assetId']],
              required: false
            },
            {
              model: EmployeeModel,
              attributes: [['name', 'employeeId']],
              required: false
            },
            {
              model: AssetStatusModel,
              attributes: [['name', 'assetStatusId']],
              required: false
            },
            {
              model: AssetTransactionTypeModel,
              attributes: [['name', 'assetTransactionTypeId']],
              required: false
            }
          ],
          order: [
            [orderColumn, orderDir], 
          ],
          raw: true
        });

         const data =  rows.map((row : any) => {
          return {
            assetId: row['asset.assetId'],
            amount: row.amount,
            employeeId: row['employee.employeeId'],
            assetStatusId: row['assetStatus.assetStatusId'],
            assetTransactionTypeId: row['assetTransactionType.assetTransactionTypeId'],
            createdAt : Utils.dateFormat(row.createdAt)
          }
        })
      res.json({
        draw: draw,
        recordsTotal: count,
        recordsFiltered: count,
        data
      });

    } catch (error) {
      return ResponseHandler.error(res,)
    }
  }
  

  public static async getStockView(req: Request, res: Response) {
    try {
      let { offset, limit, draw, search, orderColumn, orderDir, args } = req.body;
      const searchValue = search?.value || '';
      const order = req.body.order;
      const orderBy = order?.columns[orderColumn]?.data;
      orderColumn = !String(orderBy) || orderBy == 'name' ? 'assets.createdAt' : String(orderBy);
      orderDir = String(orderDir) || "asc";

      const assetId = args?.assetId || null;
      const assetStatusId = args?.assetStatusId || null;
      const assetcategoryId = args?.assetcategoryId || null;
      const employeeId = args?.employeeId || null;
      const branchId = args?.branchId || null;
  
  
      let whereClause = `WHERE assets.id > 0`;
      if (assetId >0) {
        whereClause += ` AND assets.id = ${assetId}`;
      }
      if (assetStatusId >0) {
        whereClause += ` AND assets."assetStatusId" = ${assetStatusId}`;
      }
      if (assetcategoryId>0) {
        whereClause += ` AND assets."categoryId" = ${assetcategoryId}`;
      }
      if (employeeId>0) {
        whereClause += ` AND assets."employeeId" = ${employeeId}`;
      }
      if (branchId>0) {
        whereClause += ` AND employees."branchId" = ${branchId}`;
      }
      let orderByCon ='';

      if(orderByCon){
        orderByCon = `ORDER BY `;
      }
  
      const query = `
        SELECT 
          assets.name AS "assetName",
          assets.model AS "assetModel",
          asset_categories.name AS "categoryName",
          asset_statuses.name AS "statusName",
          employees.name AS "employeeName",
          employee_branches.name AS "branchName"
        FROM assets
        INNER JOIN asset_categories ON asset_categories.id = assets."categoryId"
        INNER JOIN asset_statuses ON asset_statuses.id = assets."assetStatusId"
        INNER JOIN employees ON employees.id = assets."employeeId"
        INNER JOIN employee_branches ON employee_branches.id = employees."branchId"
        ${whereClause}
      `;

      const countQuery = `
        SELECT COUNT(*) AS "count"
        FROM assets
        INNER JOIN asset_categories ON asset_categories.id = assets."categoryId"
        INNER JOIN asset_statuses ON asset_statuses.id = assets."assetStatusId"
        INNER JOIN employees ON employees.id = assets."employeeId"
        INNER JOIN employee_branches ON employee_branches.id = employees."branchId"
        ${whereClause};
      `;
  
      // Execute the main query
      const rows = await sequelize.query(query, {
        type: QueryTypes.SELECT,
      });

      const countResult = await sequelize.query(countQuery, {
        type: QueryTypes.SELECT,
      });
      
  
      const countObj : any = countResult[0];
      const count = countObj.count;
      // console.log(rows);
      // const data = rows.map((row: any) => {
      //   return {
      //     assetName: row.assetName,
      //     assetModel: row.assetModel,
      //     categoryName: row.categoryName,
      //     statusName: row.statusName,
      //     employeeName: row.employeeName,
      //     branchName: row.branchName,
      //   };
      // });

      res.json({
        draw: draw,
        recordsTotal: count,
        recordsFiltered: count,
        data:rows,
      });
  
    } catch (error) {
      console.error('Error fetching stock view:', error);
      return ResponseHandler.error(res, "Server error occurred while fetching stock view");
    }
  }
  

}
