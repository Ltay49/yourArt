import { Request, Response, NextFunction } from "express";
import { fetchUserProfile, addToCollection } from "../models/model";
const endpoints = require('../data/testdata/api.json');

export const getApi = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(200).json(endpoints);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const username: string = req.params.username;
    const userProfile = await fetchUserProfile(username);

    if (!userProfile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).send(userProfile); // ✅ changed from `return res.status(...)`
  } catch (err) {
    next(err);
  }
};

export const addArtwork = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const username = req.params.username;
    const artwork = req.body;

    const userProfile = await fetchUserProfile(username);

    if (!userProfile) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedProfile = await addToCollection(username, artwork);

    res.status(201).json(updatedProfile); // or just res.status(201).json(artwork)
  } catch (error) {
    next(error);
  }
};





