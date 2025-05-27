const endpoints = require('../data/testdata/api.json')
import { Request, Response, NextFunction } from "express";


export const getApi = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(endpoints);
    } catch (err) {
      next(err);
    }
  };


