// src/types.ts
export interface Post {
  id: number;
  user_id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  created_at: string;
  comments?: Comment[];      // ⬅️ ADD
  likes_data?: Like[];       // ⬅️ ADD (likes ke liye)
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  username: string;
  text: string;
  created_at: string;
}

export interface Like {
  id: number;
  post_id: number;
  user_id: string;
  created_at: string;
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  messages?: any[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Story {
  id: number;
  username: string;
  avatar: string;
  image: string;
  viewed: boolean;
}

export interface Reel {
  id: number;
  username: string;
  avatar: string;
  video: string;
  likes: number;
  caption: string;
}