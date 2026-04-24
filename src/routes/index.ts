import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import { VenueRoutes } from '../app/modules/venue/venue.route';
import { VenueZoneRoutes } from '../app/modules/venueZone/venueZone.route';
import { VisualLandmarkRoutes } from '../app/modules/visualLandmark/visualLandmark.route';
import { MediaAssetRoutes } from '../app/modules/mediaAsset/mediaAsset.route';
import { ChatSessionRoutes } from '../app/modules/chat/chat.route';
import { LocationRoutes } from '../app/modules/location/location.route';
import { NavigationSessionRoutes } from '../app/modules/navigation/navigation.route';
import { SearchHistoryRoutes } from '../app/modules/searchHistory/searchHistory.route';
import { VenueContributionRoutes } from '../app/modules/contribution/contribution.route';
import { WalletTransactionRoutes } from '../app/modules/walletTransaction/wallet.route';

const router = express.Router();
const routes = [
     {
          path: '/auth',
          route: AuthRouter,
     },
     {
          path: '/users',
          route: UserRouter,
     },
     {
          path: '/venues',
          route: VenueRoutes,
     },
     {
          path: '/venue-zones',
          route: VenueZoneRoutes,
     },
     {
          path: '/visual-landmarks',
          route: VisualLandmarkRoutes,
     },
     {
          path: '/media-assets',
          route: MediaAssetRoutes,
     },
     {
          path: '/chat-sessions',
          route: ChatSessionRoutes,
     },
     {
          path: '/locations',
          route: LocationRoutes,
     },
     {
          path: '/navigation-sessions',
          route: NavigationSessionRoutes,
     },
     {
          path: '/search-history',
          route: SearchHistoryRoutes,
     },
     {
          path: '/venue-contributions',
          route: VenueContributionRoutes,
     },
     {
          path: '/wallet-transactions',
          route: WalletTransactionRoutes,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
