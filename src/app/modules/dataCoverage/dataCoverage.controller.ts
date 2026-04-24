import { Request, Response } from 'express';
import { DataCoverageService } from './dataCoverage.service';

const getAllCoverage = async (req: Request, res: Response) => {
  try {
    const result = await DataCoverageService.getAllCoverage();
    res.status(200).json({
      success: true,
      message: 'Data coverage retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkCoverage = async (req: Request, res: Response) => {
  try {
    const { lng, lat } = req.query;
    const result = await DataCoverageService.checkCoverage(Number(lng), Number(lat));
    res.status(200).json({
      success: true,
      message: 'Coverage check completed',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const DataCoverageController = {
  getAllCoverage,
  checkCoverage,
};
