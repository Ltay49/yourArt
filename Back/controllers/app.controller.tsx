import { Request, Response, NextFunction } from "express";
import { fetchUserProfile, addToCollection, removeArtworkFromCollection, addNewUser } from "../models/model";
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

    res.status(200).send(userProfile);
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

    res.status(201).json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

export const removeArtwork = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, artTitle } = req.params;

    const removed = await removeArtworkFromCollection(username, artTitle);

    if (!removed) {
      res.status(404).json({ message: "Artwork not found or already removed" });
      return;
    }

    res.status(200).json({ message: "Artwork removed" });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser = req.body;

    const newUserAdded = await addNewUser(newUser);
    res.status(201).json(newUserAdded);
  } catch (error) {
    next(error);
  }
};






