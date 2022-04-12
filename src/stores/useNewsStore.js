import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore';
import { fbAxios } from '@/assets/js/services/axios';

export const useNewsStore = defineStore('news', {
  state: () => {
    return {
      newsList: [
        {
          id: 'sfexce234fsf',
          imageUrl: 'https://picsum.photos/id/1015/600/400',
          headline: 'Test headline',
          lead: 'Test lead',
          date: new Date().toISOString(),
          author: 'John Snow',
          content: 'Test content',
          conclusion: 'Test conclusion',
          isBookmarked: true,
          viewCount: 400,
          __typename: 'News',
        },
        {
          id: 'vsdf32490ssd',
          imageUrl: 'https://picsum.photos/id/1015/600/400',
          headline: 'Test headline',
          lead: 'Test lead',
          date: new Date().toISOString(),
          author: 'John Snow',
          content: 'Test content',
          conclusion: 'Test conclusion',
          isBookmarked: true,
          viewCount: 500,
          __typename: 'News',
        },
      ],
    };
  },
  actions: {
    async toggleBookmark(id, isBookmarked) {
      const userStore = useUserStore();
      const news = this.getNewsById(id);
      try {
        if (isBookmarked) {
          const deletedBookmark = await fbAxios.delete(
            `/users/${userStore.userId}/bookmarks.json`,
            {
              equalTo: id,
            }
          );
          console.log(deletedBookmark);
          news.isBookmarked = false;
        } else {
          const data = await fbAxios.post(
            `/users/${userStore.userId}/bookmarks.json`,
            id
          );
          console.log(data);
          news.isBookmarked = true;
        }
      } catch (error) {
        console.error('Error bookmarking: ', error);
      }
    },
    async createNews(news) {
      // TODO: update blockchain as well as news node in firebase
    },
  },
  getters: {
    getNewsById: (state) => {
      return (id) => {
        const news = state.newsList.find((n) => n.id === id);
        if (!news) {
          // TODO: should retrieve specific news from blockchain
        }
        return news;
      };
    },
  },
});
