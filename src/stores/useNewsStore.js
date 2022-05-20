import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore';
import { fbAxios, nodeAxios } from '@/assets/js/services/axios';
import {
  publishNews,
  fetchMyNews,
  getURIById,
  fetchAllPublishedNews,
} from '@/assets/js/utils/contractUtils';

export const useNewsStore = defineStore('news', {
  state: () => {
    return {
      // newsUrlsList: [
      //   {
      //     tokenId: '1',
      //     url_link:
      //       'https://ipfs.infura.io/ipfs/QmRQ2aDRNwdJS3guXo8rdQrttuCBAdfn96MC3gVg6qyUqm',
      //   },
      // ],
      newsList: [
        // {
        //   id: 'sfexce234fsf',
        //   imageUrl: 'https://picsum.photos/id/1015/600/400',
        //   headline: 'Test headline',
        //   lead: 'Test lead',
        //   date: new Date().toISOString(),
        //   author: 'John Snow',
        //   content: 'Test content',
        //   conclusion: 'Test conclusion',
        //   isBookmarked: false,
        //   viewCount: 400,
        //   __typename: 'News',
        // },
        // {
        //   id: 'vsdf32490ssd',
        //   imageUrl: 'https://picsum.photos/id/1015/600/400',
        //   headline: 'Test headline',
        //   lead: 'Test lead',
        //   date: new Date().toISOString(),
        //   author: 'John Snow',
        //   content: 'Test content',
        //   conclusion: 'Test conclusion',
        //   isBookmarked: false,
        //   viewCount: 500,
        //   __typename: 'News',
        // },
      ],
      authoredNewsList: [],
      ownedNewsList: [],
      bookmarkedNewsList: [],
    };
  },

  actions: {
    async toggleBookmark(id, isBookmarked) {
      const userStore = useUserStore();
      // const news = this.fetchNewsById(id);
      // await createMarketSale();
      try {
        if (isBookmarked) {
          const deletedBookmark = await fbAxios.delete(
            `/users/${userStore.userId}/bookmarks.json`,
            {
              equalTo: id,
            }
          );
          console.log(deletedBookmark);
        } else {
          const data = await fbAxios.put(
            `/users/${userStore.userId}/bookmarks/${id}.json`,
            {
              bookmarkedOn: new Date().toISOString(),
            }
          );
          console.log(data);
        }
        const { data: bookmarks } = await fbAxios.get(
          `/users/${userStore.userId}/bookmarks.json`
        );
        userStore.$patch({ bookmarks });
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
        console.log(
          res.status,
          res.data.url_link,
          userStore.journalistId,
          news.price || 0
        );
        await publishNews(
          res.data.url_link,
          userStore.journalistId,
          news.price || 0
        );
        return res.data.url_link;
      } catch (error) {
        console.error('Error createNews: ', error);
      }
    },

    async fetchNewsById(id) {
      try {
        let news = this.getNewsById(id);
        if (!news) {
          // TODO: should retrieve specific news from ipfs
          const url = await getURIById(id);
          // Note: The parentheses ( ... ) around the assignment statement are required when using object literal destructuring assignment without a declaration.
          ({ data: news } = await nodeAxios.get(url));
          Object.assign(news, { id });
          this.newsList.push(news);
        }
        return news;
      } catch (error) {
        console.error('Error fetchNewsById: ', error);
      }
    },

    async fetchNewsList(type = null) {
      const userStore = useUserStore();
      let tempData;

      try {
        switch (type) {
          case 'all':
            tempData = await fetchAllPublishedNews(); // get all news urls list
            break;
          case 'authored':
            tempData = await fetchMyNews(); // get my news urls list
            break;
          case 'owned':
            tempData = await fetchMyNews(); // get owned news urls list
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
        this.updateNewsList(tempData, this.newsList);
      } catch (error) {
        console.error(`Error fetchNewsList(${type}): `, error);
      }
    },

    async updateNewsList(resArr, list) {
      // Parsing
      const objs = await Promise.all(
        resArr.map(async (r) => {
          const { owner, price, seller, sold, tokenId } = r;
          const id = parseInt(tokenId._hex);
          const uri = await getURIById(id);
          return { id, uri };
        })
      );
      const newsList = await Promise.all(
        objs
          .filter(({ uri }) => {
            return uri.startsWith('https://ipfs.infura.io');
          })
          .map(async ({ id, uri }) => {
            console.log(id, uri);
            const { data } = await nodeAxios(uri);
            return { ...data, id, uri };
          })
      );
      list.length = 0;
      Object.assign(list, newsList);
      console.log(list);
    },

    // async fetchNewsUrlById(id) {
    //   try {
    //     const {
    //       data: { url_link },
    //     } = await getURIById(id);
    //     // const url_link =
    //     //   'https://ipfs.infura.io/ipfs/QmRQ2aDRNwdJS3guXo8rdQrttuCBAdfn96MC3gVg6qyUqm';
    //     return url_link;
    //   } catch (error) {
    //     console.error('Error fetchNewsUrlById', error);
    //   }
    // },
  },

  getters: {
    getNewsById(state) {
      return (id) => state.newsList.find((n) => n.id === id);
    },
  },
});
