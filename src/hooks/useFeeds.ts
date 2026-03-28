import { useQuery } from '@tanstack/react-query';

export type FeedType = 'news' | 'community';

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  author?: string;
}

export const useFeeds = (type: FeedType) => {
  return useQuery({
    queryKey: ['feeds', type],
    queryFn: async (): Promise<FeedItem[]> => {
      // Mock fetch function, as we only need the architecture based on specs.
      // In a real app, this would be an actual fetch call.
      return new Promise((resolve) => {
        setTimeout(() => {
          if (type === 'news') {
            resolve([
              { id: '1', title: 'News 1', summary: 'Summary 1', createdAt: new Date().toISOString() },
            ]);
          } else {
            resolve([
              { id: '2', title: 'Community Post 1', summary: 'Community Summary 1', createdAt: new Date().toISOString(), author: 'User1' },
            ]);
          }
        }, 500);
      });
    },
  });
};
