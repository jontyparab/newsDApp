import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore';
import { fbAxios, nodeAxios } from '@/assets/js/services/axios';

export const useNewsStore = defineStore('news', {
  state: () => {
    return {
      // newsUrlsList: [
      //   {
      //     tokenId: '1',
      //     url_link:
      //       'https://ipfs.infura.io/ipfs/QmRQ2aDRNwdJS3guXo8rdQrttuCBAdfn96MC3gVg6qyUqm',
      //   },
      //   {
      //     tokenId: '2',
      //     url_link:
      //       'https://ipfs.infura.io/ipfs/QmRQ2aDRNwdJS3guXo8rdQrttuCBAdfn96MC3gVg6qyUqm',
      //   },
      // ],
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
      authoredNewsList: [],
      ownedNewsList: [],
      bookmarkedNewsList: [],
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
      const userStore = useUserStore();
      try {
        // TODO: update blockchain as well as news node in firebase
        const res = await nodeAxios.post('/meta-ipfs', {
          ...news,
          date: new Date().toISOString(),
          author: userStore.getFullName,
          journalistId: userStore.journalistId,
        });
        console.log(res.status, res.data.url_link);
        return res.data.url_link;
      } catch (error) {
        console.log('Error createNews: ', error);
      }
    },

    async fetchNewsById(id) {
      try {
        let news = this.getNewsById(id);
        if (!news) {
          // TODO: should retrieve specific news from ipfs
          const url = await this.fetchNewsUrlById(id);
          console.log(url);
          // Note: The parentheses ( ... ) around the assignment statement are required when using object literal destructuring assignment without a declaration.
          ({ data: news } = await nodeAxios.get(url));
        }
        return Object.assign(news, { id });
      } catch (error) {
        console.log('Error fetchNewsById: ', error);
      }
    },

    async fetchNewsList(type = 'all') {
      const userStore = useUserStore();
      let nl, tempData;

      try {
        switch (type) {
          case 'all':
            tempData = await nodeAxios.get(''); // get all news urls list
            nl = this.newsList;
            break;
          case 'authored':
            tempData = await nodeAxios.get(''); // get my news urls list
            nl = this.authoredNewsList;
            break;
          case 'owned':
            tempData = await nodeAxios.get(''); // get owned news urls list
            nl = this.ownedNewsList;
            break;
          case 'bookmarked':
            async () => {
              console.log(userStore.bookmarks);
              // fetchNewsById i guess
              return [];
            };
            break;
          default:
            break;
        }

        nl.length = 0;
        const newsArr = tempData?.map(async (urlObj) => {
          const { data: news } = await nodeAxios.get(urlObj.url_link);
          return {
            ...news,
            id: urlObj.id,
          };
        });
        Object.assign(nl, newsArr);
      } catch (error) {
        console.log(`Error fetchNewsList(${type}): `, error);
      }
    },

    async fetchNewsUrlById(id) {
      try {
        // const {
        //   data: { url_link },
        // } = await nodeAxios.get('/');
        const url_link =
          'https://ipfs.infura.io/ipfs/QmRQ2aDRNwdJS3guXo8rdQrttuCBAdfn96MC3gVg6qyUqm';
        return url_link;
      } catch (error) {
        console.log('Error fetchNewsUrlById', error);
      }
    },
  },

  getters: {
    getNewsById(state) {
      return (id) => state.newsList.find((n) => n.id === id);
    },
  },
});
