import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore';
import axios from '@/assets/js/services/axios';

export const useNewsStore = defineStore('news', {
  state: () => {
    return {
      newsList: [
        {
          id: 'sfexce234fsf',
          imageUrl: 'https://picsum.photos/id/1015/600/400',
          headline: 'Test headline',
          lead: 'Test lead',
          date: new Date(),
          author: 'John Snow',
          content: 'Test content',
          conclusion: 'Test conclusion',
          isBookmarked: true,
          viewCount: 400,
          __typename: 'News',
        },
        {
          id: 'vb23rd234fdsfsdferbertdg',
          imageUrl: 'https://picsum.photos/id/1015/600/400',
          headline: 'Test headline',
          lead: 'Test lead',
          date: new Date(),
          author: 'John Snow',
          content: 'Test content',
          conclusion: 'Test conclusion',
          isBookmarked: true,
          viewCount: 500,
          __typename: 'News',
        },
      ],
      bookmarks: {},
    };
  },
  actions: {
    async toggleBookmark(id, isBookmarked) {
      const userStore = useUserStore();
      const news = this.getNewsById(id);
      try {
        if (isBookmarked) {
          // const r = await axios.get(`/news/${id}.json`);
          const deletedBookmark = await axios.delete(
            `/users/${userStore.walletId}/bookmarks.json`,
            {
              equalTo: id,
            }
          );
          console.log(deletedBookmark);
          news.isBookmarked = false;
        } else {
          const data = await axios.post(
            `/users/${userStore.walletId}/bookmarks.json`,
            id
          );
          console.log(data);
          news.isBookmarked = true;
        }
      } catch (error) {
        console.error('Error bookmarking: ', error);
      }
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
