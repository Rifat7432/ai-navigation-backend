import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IVenueContribution } from './contribution.interface';
import { VenueContribution } from './contribution.model';
import { DataCoverage } from '../dataCoverage/dataCoverage.model';

const createContributionInDB = async (payload: Partial<IVenueContribution>) => {
  // If frontend says it's potentially a new place, we check our DB coverage too
  if (payload.isNewPlace) {
    // Logic to check if we have coverage in our DB could go here
    // For now, we trust the payload but we can refine it
  }
  
  const result = await VenueContribution.create(payload);
  return result;
};

const getAllContributionsFromDB = async (query: any) => {
  const result = await VenueContribution.find(query).populate('contributor').populate('venue');
  return result;
};

const getContributionByIdFromDB = async (id: string) => {
  const result = await VenueContribution.findById(id).populate('contributor').populate('venue').populate('mediaAssets');
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Contribution not found');
  }
  return result;
};

const reviewContributionInDB = async (id: string, adminId: string, payload: any) => {
  const result = await VenueContribution.findByIdAndUpdate(
    id,
    {
      ...payload,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
    { new: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Contribution not found');
  }
  return result;
};

export const ContributionService = {
  createContributionInDB,
  getAllContributionsFromDB,
  getContributionByIdFromDB,
  reviewContributionInDB,
};
