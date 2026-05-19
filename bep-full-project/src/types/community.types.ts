// bep-full-project/src/types/community.types.ts

export type CommunityPostType =
  | 'discussion'
  | 'question'
  | 'note'
  | 'resource'
  | 'announcement'
  | 'poll';

export type CommunityPostStatus =
  | 'published'
  | 'draft'
  | 'archived'
  | 'reported'
  | 'deleted';

export type CommunityReactionType =
  | 'like'
  | 'love'
  | 'helpful'
  | 'fire'
  | 'insightful';

export interface CommunityUser {
  id: string;

  uid?: string;

  fullName: string;
  username?: string;

  avatarUrl?: string;

  role?: 'student' | 'moderator' | 'admin';

  verified?: boolean;
  premium?: boolean;

  institution?: string;
  className?: string;

  bio?: string;

  createdAt?: string;
}

export interface CommunityPostAttachment {
  id: string;

  type:
    | 'image'
    | 'video'
    | 'pdf'
    | 'link'
    | 'document';

  url: string;

  name?: string;
  thumbnailUrl?: string;

  size?: number;
}

export interface CommunityPollOption {
  id: string;

  label: string;

  votes: number;
  voters?: string[];
}

export interface CommunityPost {
  id: string;

  authorId: string;
  author?: CommunityUser;

  title?: string;
  content: string;

  type: CommunityPostType;
  status?: CommunityPostStatus;

  tags?: string[];

  subjectId?: string;
  chapterId?: string;

  attachments?: CommunityPostAttachment[];

  pollOptions?: CommunityPollOption[];

  pinned?: boolean;
  featured?: boolean;
  locked?: boolean;

  reactionsCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  viewsCount?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityComment {
  id: string;

  postId: string;

  authorId: string;
  author?: CommunityUser;

  content: string;

  parentCommentId?: string;

  reactionsCount?: number;

  edited?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityReaction {
  id: string;

  userId: string;

  targetId: string;
  targetType: 'post' | 'comment';

  type: CommunityReactionType;

  createdAt?: string;
}

export interface CommunityReport {
  id: string;

  reporterId: string;

  targetId: string;
  targetType: 'post' | 'comment';

  reason:
    | 'spam'
    | 'harassment'
    | 'fake_information'
    | 'abuse'
    | 'copyright'
    | 'other';

  details?: string;

  resolved?: boolean;

  createdAt?: string;
}

export interface CommunityNotification {
  id: string;

  userId: string;

  type:
    | 'reaction'
    | 'comment'
    | 'reply'
    | 'mention'
    | 'follow'
    | 'announcement';

  title: string;
  message?: string;

  targetId?: string;
  targetType?: 'post' | 'comment' | 'profile';

  read?: boolean;

  createdAt?: string;
}

export interface CommunityLeaderboardUser {
  id: string;

  fullName: string;
  avatarUrl?: string;

  points: number;
  rank: number;

  postsCount?: number;
  commentsCount?: number;
  helpfulCount?: number;
}

export interface CommunityTag {
  id: string;

  name: string;
  slug?: string;

  color?: string;

  postsCount?: number;
}

export interface CommunitySearchFilters {
  query?: string;

  type?: CommunityPostType;
  status?: CommunityPostStatus;

  subjectId?: string;
  chapterId?: string;

  tags?: string[];

  authorId?: string;

  featured?: boolean;
  pinned?: boolean;
}

export interface CommunityFeedState {
  posts: CommunityPost[];

  loading: boolean;
  loadingMore?: boolean;

  hasMore?: boolean;

  error?: string | null;
}

export interface CommunityApiResponse<T = unknown> {
  success: boolean;

  data?: T;

  message?: string;
  error?: string;
}

export interface CommunityCreatePostPayload {
  title?: string;
  content: string;

  type?: CommunityPostType;

  tags?: string[];

  subjectId?: string;
  chapterId?: string;

  attachments?: CommunityPostAttachment[];

  pollOptions?: string[];
}

export interface CommunityCreateCommentPayload {
  postId: string;

  content: string;

  parentCommentId?: string;
}

export interface CommunityModerationAction {
  targetId: string;

  action:
    | 'delete'
    | 'hide'
    | 'lock'
    | 'pin'
    | 'feature'
    | 'ban_user';

  reason?: string;
}
