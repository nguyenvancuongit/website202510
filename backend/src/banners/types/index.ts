import { Banner, Media } from '@prisma/client';

export interface BannerWithMedia extends Banner {
  webMedia?: Media;
  mobileMedia?: Media;
}
