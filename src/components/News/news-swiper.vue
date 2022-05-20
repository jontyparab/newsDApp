<template>
  <div class="news-swiper">
    <swiper
      :space-between="10"
      :centered-slides="true"
      :loop="true"
      :autoplay="{
        delay: 4000,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
      }"
      :modules="modules"
    >
      <swiper-slide v-for="news in newsList" :key="news.id">
        <router-link :to="{ name: 'NewsDetail', params: { id: news.id } }">
          <div class="news-swiper__figure">
            <img
              :src="news.imageUrl"
              alt=""
              class="news-swiper__image"
              @click="navigate"
            />
            <div class="news-swiper__overlay" role="presentation"></div>
            <div class="news-swiper__info">
              <div class="news-swiper__info--time pt-xs px-sm">
                {{ formatNewsDate(news.date) }}
              </div>
              <!-- <icon-button
                class="ms-auto"
                :icon="news.isBookmarked ? 'bookmark' : 'bookmark_border'"
                :size="1"
                :color="
                  news.isBookmarked
                    ? 'var(--color-tertiary-light)'
                    : 'var(--color-white)'
                "
                title="Save"
                @click.prevent="toggleBookmark(news.id, news.isBookmarked)"
              ></icon-button> -->
            </div>
            <h2 class="news-swiper__title px-sm">
              {{ news.headline }}
            </h2>
          </div>
        </router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper';
import { formatNewsDate } from '@/assets/js/utils/formatters';
// import { useNewsStore } from '@/stores/useNewsStore';
import 'swiper/css';
import 'swiper/css/pagination';

// const { toggleBookmark } = useNewsStore();

const props = defineProps({
  newsList: {
    type: Array,
    required: true,
  },
});

const modules = [Pagination, Autoplay];
</script>
