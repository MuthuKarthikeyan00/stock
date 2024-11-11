import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { Employee as EmployeeModel } from "@src/models/Employee";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { employeeValidationSchema } from "@src/validator/schema";
import { Op, where } from "sequelize";
import { EmployeeRole as EmployeeRoleModel } from "@src/models/EmployeeRole";



export default class Employee {
  public static async render(req: Request, res: Response) {


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

    return res.status(200).render('employee', {
      data,
      employeeRoles
    });
  }

  private static async handleData(body: any) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
      email: String(body.email),
      phone: Number(body.phone),
      status: Number(body.status),
      roleId: Number(body.roleId),
    });
  }

  public static async create(req: Request, res: Response) {

    try {
      const body = req.body;
      const args = await Employee.handleData(body);
      const status = await Validator.validate(args, employeeValidationSchema, res)

      const data = await EmployeeModel.create({
        name: args.name,
        email: args.email,
        phone: args.phone,
        roleId: args.roleId,
        status: args.status,
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


      const args = await Employee.handleData(body);


      const status = await Validator.validate(args, employeeValidationSchema, res)

      args.updatedAt = new Date().toISOString();

      const isValid = await EmployeeModel.findOne({
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

      const updated_id = await EmployeeModel.update(args, {
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

      const isValid = await EmployeeModel.findOne({
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

      const updated_id = await EmployeeModel.update({ isDeleted: 1 }, {
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


      const data = await EmployeeModel.findAndCountAll({
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

    } catch (error) {
    }
  }

}
