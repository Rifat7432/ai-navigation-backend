import { StatusCodes } from 'http-status-codes';
import { IMediaAsset } from './mediaAsset.interface';
import { MediaAsset } from './mediaAsset.model';
import AppError from '../../../errors/AppError';

// create media asset
const createMediaAssetToDB = async (payload: IMediaAsset): Promise<IMediaAsset> => {
     const mediaAsset = await MediaAsset.create(payload);
     if (!mediaAsset) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create media asset');
     }
     return mediaAsset;
};

// get all media assets
const getMediaAssetsFromDB = async (query: any): Promise<IMediaAsset[]> => {
     const mediaAssets = await MediaAsset.find(query).populate('user linkedVenue');
     return mediaAssets;
};

// get single media asset
const getMediaAssetByIdFromDB = async (id: string): Promise<IMediaAsset | null> => {
     const mediaAsset = await MediaAsset.findById(id).populate('user linkedVenue');
     return mediaAsset;
};

// update media asset
const updateMediaAssetInDB = async (id: string, payload: Partial<IMediaAsset>): Promise<IMediaAsset | null> => {
     const mediaAsset = await MediaAsset.findByIdAndUpdate(id, payload, { new: true });
     return mediaAsset;
};

// delete media asset (soft delete)
const deleteMediaAssetFromDB = async (id: string): Promise<IMediaAsset | null> => {
     const mediaAsset = await MediaAsset.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return mediaAsset;
};

export const MediaAssetService = {
     createMediaAssetToDB,
     getMediaAssetsFromDB,
     getMediaAssetByIdFromDB,
     updateMediaAssetInDB,
     deleteMediaAssetFromDB,
};