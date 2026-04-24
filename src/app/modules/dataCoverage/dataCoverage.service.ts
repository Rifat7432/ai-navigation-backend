import { DataCoverage } from './dataCoverage.model';
import { VenueContribution } from '../contribution/contribution.model';

const checkCoverage = async (lng: number, lat: number) => {
  // Find if there's any coverage circle at this location
  const coverage = await DataCoverage.findOne({
    center: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: 50, // within 50 meters
      },
    },
  });

  return coverage;
};

const getAllCoverage = async () => {
  return await DataCoverage.find({});
};

export const DataCoverageService = {
  checkCoverage,
  getAllCoverage,
};
