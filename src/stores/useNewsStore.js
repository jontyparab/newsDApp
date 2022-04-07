import { defineStore } from 'pinia';

export const useNewsStore = defineStore('news', {
  state: () => {
    return {
      newsList: [
        {
          id: 'sdinv9ewgn83vsd9n23inv9n23r',
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
    };
  },
  actions: {
    toggleBookmark(id) {
      const news = this.getNewsById(id);
      news.isBookmarked = !news.isBookmarked;
    },
  },
  getters: {
    getNewsById: (state) => {
      console.log('getNews Ran');
      return (id) => state.newsList.find((n) => n.id === id);
    },
  },
});
