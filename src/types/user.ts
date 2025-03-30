export interface UserPublicProfile {
  id: string;
  username: string | null;
  name: string | null;
  bio: string | null;
  image: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}
