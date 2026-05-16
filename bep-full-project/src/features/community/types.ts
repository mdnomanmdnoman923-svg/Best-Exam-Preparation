// bep-full-project/src/features/community/types.ts

export type CommunityPostCategory =
  | 'general'
  | 'question'
  | 'discussion'
  | 'study-tip'
  | 'announcement';

export type CommunityPostVisibility =
  | 'public'
  | 'private'
  | 'premium';

export type CommunityReactionType =
  | 'like'
  | 'love'
  | 'helpful'
  | 'insightful';

export type CommunityMemberRole =
  | 'student'
  | 'mentor'
  | 'moderator'
  | 'admin';

export interface CommunityAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: CommunityMemberRole | string;
  premium?: boolean;
  verified?: boolean;
  institution?: string;
  bio?: string;
}

export interface CommunityTag {
  id: string;
  label: string;
  slug: string;
  color?: string;
}

export interface CommunityReaction {
  type: CommunityReactionType;
  count: number;
  reacted?: boolean;
}

export interface CommunityReply {
  id: string;
  postId: string;
  parentReplyId?: string | null;
  author: CommunityAuthor;
  content: string;
  anonymous?: boolean;
  likes?: number;
  liked?: boolean;
  highlighted?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  children?: CommunityReply[];
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: CommunityPostCategory;
  visibility?: CommunityPostVisibility;
  author: CommunityAuthor;
  tags?: string[];
  imageUrl?: string;
  linkUrl?: string;
  anonymous?: boolean;
  featured?: boolean;
  trending?: boolean;
  pinned?: boolean;
  locked?: boolean;
  solved?: boolean;
  likes?: number;
  comments?: number;
  shares?: number;
  bookmarks?: number;
  views?: number;
  liked?: boolean;
  bookmarked?: boolean;
  reactions?: CommunityReaction[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface CreateCommunityPostInput {
  title: string;
  content: string;
  category: CommunityPostCategory;
  tags?: string[];
  imageUrl?: string;
  linkUrl?: string;
  anonymous?: boolean;
  visibility?: CommunityPostVisibility;
}

export interface UpdateCommunityPostInput
  extends Partial<CreateCommunityPostInput> {
  featured?: boolean;
  pinned?: boolean;
  locked?: boolean;
  solved?: boolean;
}

export interface CreateReplyInput {
  postId: string;
  parentReplyId?: string | null;
  content: string;
  anonymous?: boolean;
}

export interface CommunityLeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  streak?: number;
  rank: number;
  repliesCount?: number;
  helpfulAnswers?: number;
}

export interface CommunityTopic {
  id: string;
  name: string;
  slug: string;
  postsCount: number;
  followersCount?: number;
  featured?: boolean;
}

export interface CommunityPollOption {
  id: string;
  label: string;
  votes: number;
}

export interface CommunityPoll {
  id: string;
  question: string;
  options: CommunityPollOption[];
  expiresAt?: string | Date;
  voted?: boolean;
}

export interface CommunityNotification {
  id: string;
  type:
    | 'reply'
    | 'mention'
    | 'reaction'
    | 'announcement';
  title: string;
  description: string;
  read: boolean;
  createdAt: string | Date;
  relatedPostId?: string;
}

export interface CommunitySearchFilters {
  query?: string;
  category?: CommunityPostCategory | 'all';
  tags?: string[];
  featured?: boolean;
  solved?: boolean;
  trending?: boolean;
}

export interface CommunityAnalytics {
  totalPosts: number;
  totalReplies: number;
  activeMembers: number;
  engagementRate: number;
  trendingTags?: string[];
}

export interface CommunityStoreState {
  posts: CommunityPost[];
  activePost: CommunityPost | null;
  replies: CommunityReply[];
  loading: boolean;
  error: string | null;
}

export interface CommunityStoreActions {
  setPosts: (
    posts: CommunityPost[],
  ) => void;

  addPost: (
    post: CommunityPost,
  ) => void;

  updatePost: (
    id: string,
    data: Partial<CommunityPost>,
  ) => void;

  removePost: (
    id: string,
  ) => void;

  setActivePost: (
    post: CommunityPost | null,
  ) => void;

  setReplies: (
    replies: CommunityReply[],
  ) => void;

  addReply: (
    reply: CommunityReply,
  ) => void;

  updateReply: (
    id: string,
    data: Partial<CommunityReply>,
  ) => void;

  removeReply: (
    id: string,
  ) => void;

  setLoading: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  reset: () => void;
}
