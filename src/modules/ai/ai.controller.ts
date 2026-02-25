import { Request, Response, NextFunction } from "express";
import { analyzeUserFinances } from "./ai.service";

export const analyze = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    // This returns the full AIAnalysisResult object
    const analysis = await analyzeUserFinances(userId);
    
    // Return the full analysis object, not just insight
    res.json(analysis);
  } catch (err: any) {
    next(err);
  }
};