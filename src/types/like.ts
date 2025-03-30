import { UserPublicProfile } from "./user";
import { Tweet } from "../hooks/useTweets";

export interface LikeWithUser {
  userId: string;
  tweetId: string;
  createdAt: string;
  user: Pick<UserPublicProfile, "id" | "username" | "name" | "image">;
}

export interface LikeWithTweet {
  userId: string;
  tweetId: string;
  createdAt: string;
  tweet: Tweet;
}
