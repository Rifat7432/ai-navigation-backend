import express from 'express';
import { DataCoverageController } from './dataCoverage.controller';

const router = express.Router();

router.get('/', DataCoverageController.getAllCoverage);
router.get('/check', DataCoverageController.checkCoverage);

export const DataCoverageRoutes = router;
