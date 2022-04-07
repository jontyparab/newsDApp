<template>
  <div class="container">
    <news-swiper :news-list="newsList"></news-swiper>
    <h1 class="mt-sm">Latest news</h1>
    <div class="news__list">
      <news-list-item
        v-for="news in newsList"
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
</template>

<script setup>
import { useNewsStore } from '@/stores/useNewsStore';
import { storeToRefs } from 'pinia';
const newsStore = useNewsStore();
const { newsList } = storeToRefs(newsStore);
</script>
