import { StatusCodes } from 'http-status-codes';
import { IVenueContribution } from './venueContribution.interface';
import { VenueContribution } from './venueContribution.model';
import AppError from '../../../errors/AppError';

// create venue contribution
const createVenueContributionToDB = async (payload: IVenueContribution): Promise<IVenueContribution> => {
     const venueContribution = await VenueContribution.create(payload);
     if (!venueContribution) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create venue contribution');
     }
     return venueContribution;
};

// get all venue contributions
const getVenueContributionsFromDB = async (query: any): Promise<IVenueContribution[]> => {
     const venueContributions = await VenueContribution.find(query).populate('contributor venue zone mediaAssets reviewedBy');
     return venueContributions;
};

// get single venue contribution
const getVenueContributionByIdFromDB = async (id: string): Promise<IVenueContribution | null> => {
     const venueContribution = await VenueContribution.findById(id).populate('contributor venue zone mediaAssets reviewedBy');
     return venueContribution;
};

// update venue contribution
const updateVenueContributionInDB = async (id: string, payload: Partial<IVenueContribution>): Promise<IVenueContribution | null> => {
     const venueContribution = await VenueContribution.findByIdAndUpdate(id, payload, { new: true });
     return venueContribution;
};

// delete venue contribution (soft delete)
const deleteVenueContributionFromDB = async (id: string): Promise<IVenueContribution | null> => {
     const venueContribution = await VenueContribution.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return venueContribution;
};

export const VenueContributionService = {
     createVenueContributionToDB,
     getVenueContributionsFromDB,
     getVenueContributionByIdFromDB,
     updateVenueContributionInDB,
     deleteVenueContributionFromDB,
};