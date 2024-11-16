import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { Employee as EmployeeModel } from "@src/models/Employee";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { employeeValidationSchema } from "@src/validator/schema";
import { Op, where } from "sequelize";
import { EmployeeRole as EmployeeRoleModel } from "@src/models/EmployeeRole";
import { EmployeeBranch as EmployeeBranchModel } from "@src/models/EmployeeBranch";
import EmployeeBranch from "./EmployeeBranch";
import EmployeeRole from "./EmployeeRole";



export default class Employee {
  public static async render(req: Request, res: Response) {


    const roles = await EmployeeRole.fetch()
    const branches = await EmployeeBranch.fetch()

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
      roles,
      branches
    });
  }

  private static async handleData(body: any) {
    return Sanitizer.sanitizeHtml({
      name: String(body.name),
      email: String(body.email),
      phone: Number(body.phone),
      branchId: Number(body.branchId),
      roleId: Number(body.roleId),
    });
  }

  public static async create(req: Request, res: Response) {

    try {
      const body = req.body;
      const args = await Employee.handleData(body);
      const status = await Validator.validate(args, employeeValidationSchema, res)
      if(!status){
        return ResponseHandler.error(res);
      }
      const data = await EmployeeModel.create({
        name: args.name,
        email: args.email,
        phone: args.phone,
        roleId: args.roleId,
        branchId: args.branchId,
        createdAt: new Date().toISOString(),
      });

      if (Utils.isGraterthenZero(data.id)) return res.status(201).redirect('/employee'); 
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
      if(!status){
        return ResponseHandler.error(res);
      }
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

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/employee'); 
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

      if (Utils.isGraterthenZero(updated_id[0])) return res.status(201).redirect('/employee'); 
      return ResponseHandler.error(res);
    } catch (error) {
      return ResponseHandler.error(res, error);
    }
  }

  public static async getEmployees(req: Request, res: Response) {

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


      const { count, rows } = await EmployeeModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: limit,
        order: [[String(orderColumn), String(orderDir)]],
        include: [
          {
            model: EmployeeBranchModel,
            attributes: [ ['name', 'employeeBranchName']],
            required: false 
          },
          {
            model: EmployeeRoleModel,
            attributes: [ ['name', 'employeeRoleName']],
            required: false 
          }
        ],
        raw: true
      });


      const data =  rows.map((row : any) => {
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          roleId :row['employeeRole.employeeRoleName'],
          branchId : row['employeeBranch.employeeBranchName'],
        }
      })

      res.json({
        draw: draw,
        recordsTotal: count,
        recordsFiltered: count,
        data,
      })

    } catch (error) {
    }
  }

  public static async fetch(args: any = {}) {
    const search = args?.search || '';

    const assetCategories = await EmployeeModel.findAll({
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
