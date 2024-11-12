import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";
import { Asset as AssetModel } from "@src/models/Asset";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/ResponseHandler";
import Validator from "@src/validator/Validator";
import { assetValidationSchema } from "@src/validator/schema";
import { Op } from "sequelize";
import { AssetCategory } from "@src/models/AssetCategory";
import { AssetType } from "@src/models/AssetType";




export default class Asset {
  public static async render(req: Request, res: Response) {


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

    return res.status(200).render('asset', {
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

  public static async create(req: Request, res: Response) {

    try {
      const body = req.body;
      const args = await Asset.handleData(body);
      const status = await Validator.validate(args, assetValidationSchema, res)

      const data = await AssetModel.create({
        name: args.name,
        serialNumber: args.serialNumber,
        model: args.model,
        typeId: args.typeId,
        categoryId: args.categoryId,
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


      const args = await Asset.handleData(body);
      const status = await Validator.validate(args, assetValidationSchema, res)
      args.updatedAt = new Date().toISOString();

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


      const data = await AssetModel.findAndCountAll({
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
