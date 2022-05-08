<template>
  <div class="container">
    <news-swiper :news-list="newsList"></news-swiper>
    <h1 class="mt-sm">Latest news</h1>
    <div class="news__list">
      <template v-for="news in newsList" :key="news.id">
        <router-link
          v-slot="{ navigate }"
          :to="{ name: 'NewsDetail', params: { id: news.id } }"
          custom
        >
          <news-list-item
            :id="news.id"
            :image-url="news.imageUrl"
            :headline="news.headline"
            :lead="news.lead"
            :date="news.date"
            :is-bookmarked="news.isBookmarked"
            @click="navigate"
          ></news-list-item>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useNewsStore } from '@/stores/useNewsStore';
import { storeToRefs } from 'pinia';
const newsStore = useNewsStore();
const { newsList } = storeToRefs(newsStore);
</script>
