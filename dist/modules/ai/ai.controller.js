"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const ai_service_1 = require("./ai.service");
const analyze = async (req, res, next) => {
    try {
        const userId = req.userId;
        // This returns the full AIAnalysisResult object
        const analysis = await (0, ai_service_1.analyzeUserFinances)(userId);
        // Return the full analysis object, not just insight
        res.json(analysis);
    }
    catch (err) {
        next(err);
    }
};
exports.analyze = analyze;
