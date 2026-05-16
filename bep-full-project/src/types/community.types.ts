import type { Timestamp } from 'firebase/firestore'

export interface CommunityPost {
  id: string
  uid: string
  authorName: string
  authorPhoto: string | null
  title: string
  content: string
  subjectId: string | null
  tags: string[]
  imageURL: string | null
  likeCount: number
  replyCount: number
  likedBy: string[]
  isPinned: boolean
  isApproved: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Reply {
  id: string
  postId: string
  uid: string
  authorName: string
  authorPhoto: string | null
  content: string
  likeCount: number
  likedBy: string[]
  parentReplyId: string | null
  createdAt: Timestamp
}

export interface Notification {
  id: string
  uid: string
  type: 'reply' | 'like' | 'announcement' | 'exam_result' | 'badge'
  title: string
  body: string
  link: string | null
  isRead: boolean
  createdAt: Timestamp
}
