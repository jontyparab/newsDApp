<template>
  <div class="container">
    <div class="news-owned-list__wrapper pt-sm">
      <div class="news-owned-list__tabs mb-sm">
        <!-- <h2 class="news-owned-list__tab is-active">Authored</h2>
        <h2 class="news-owned-list__tab">Owned Stakes</h2>
        <h2 class="news-owned-list__tab">Saved</h2> -->
        <div v-dragscroll class="news-owned-list__tabs" @click="setTab">
          <h2
            :class="{ 'is-active': currTab === 'authored' }"
            class="news-owned-list__tab"
            data-tab="authored"
          >
            Authored
          </h2>
          <!-- <h2
            :class="{ 'is-active': currTab === 'owned' }"
            class="news-owned-list__tab"
            data-tab="owned"
          >
            Owned
          </h2> -->
          <h2
            :class="{ 'is-active': currTab === 'bookmarks' }"
            class="news-owned-list__tab"
            data-tab="bookmarks"
          >
            Bookmarks
          </h2>
        </div>
      </div>
      <div class="news__list">
        <template v-for="news in setList" :key="news.id">
          <router-link
            v-slot="{ navigate }"
            :to="{ name: 'NewsDetail', params: { id: Number(news.id) } }"
            custom
          >
            <news-list-item
              :id="news.id"
              :key="news.id"
              :image-url="news.imageUrl"
              :headline="news.headline"
              :lead="news.lead"
              :date="news.date"
              @click="navigate"
            ></news-list-item>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNewsStore } from '@/stores/useNewsStore';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

const newsStore = useNewsStore();
const { newsList, authoredNewsList, ownedNewsList, bookmarkedNewsList } =
  storeToRefs(newsStore);
const currTab = ref('authored');
const setTab = (e) => {
  // event delegation
  if (e.target.classList.contains('news-owned-list__tab')) {
    const n = e.target.dataset.tab;
    currTab.value = n;
  }
};

const setList = computed(() => {
  if (currTab.value === 'authored') {
    return authoredNewsList.value;
  }
  // else if (currTab.value === 'owned') {
  //   return ownedNewsList.value;
  // }
  else if (currTab.value === 'bookmarks') {
    return bookmarkedNewsList.value;
  } else {
    return newsList.value;
  }
});
</script>
