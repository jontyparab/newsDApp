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
          <h2
            :class="{ 'is-active': currTab === 'owned' }"
            class="news-owned-list__tab"
            data-tab="owned"
          >
            Owned Stakes
          </h2>
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
        <news-list-item
          v-for="news in dynamicList"
          :id="news.id"
          :key="news.id"
          :image-url="news.imageUrl"
          :headline="news.headline"
          :lead="news.lead"
          :date="news.date"
          :is-bookmarked="news.isBookmarked"
        ></news-list-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNewsStore } from '@/stores/useNewsStore';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';

const newsStore = useNewsStore();

const dynamicList = reactive([]);

const currTab = ref('authored');
const setTab = (e) => {
  // event delegation
  const n = e.target.dataset.tab;
  if (n) {
    currTab.value = n;
  }
  // TODO: change list based on clicks
  console.log(dynamicList.value);
};
</script>
