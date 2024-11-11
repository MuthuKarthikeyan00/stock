import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { EmployeeRole as EmployeeRoleModel } from "@src/models/EmployeeRole";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { employeeRoleValidationSchema } from "@src/validator/schema";
import { Op } from "sequelize";



export default class EmployeeRole {
  public static async render(req: Request, res: Response) {
    return res.status(200).render('employeeRole', {});
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
      const args = await EmployeeRole.handleData(body);

      const data = await EmployeeRoleModel.create({
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
      const args = await EmployeeRole.handleData(body);
      args.updatedAt = new Date().toISOString();

      const isValid = await EmployeeRoleModel.findOne({
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

      const updated_id = await EmployeeRoleModel.update(args, {
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

      const isValid = await EmployeeRoleModel.findOne({
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

      const updated_id = await EmployeeRoleModel.update({isDeleted: 1}, {
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

  public static async fetch(req: Request, res: Response) {

    try{

      const { offset , limit , draw , search} = req.body;
      const searchValue = search?.value || ''; // Access the search value
  
      const whereClause = searchValue
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${searchValue}%` } },
            ],
          }
        : {};
    
      const data = await EmployeeRoleModel.findAndCountAll({
        where: whereClause,
      offset: offset,
      limit: limit,
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


}
