import { Request, Response } from "express";
import { UserService } from "./user.service";

const service = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { user, token } = await service.createUser(req.body);
    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const { user, token } = await service.loginUser(email);
    res.json({ user, token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await service.getUser(id);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};


