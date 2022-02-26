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
      <swiper-slide v-for="k in [1, 2, 3, 4, 5, 6, 7]" :key="k">
        <div class="news-swiper__figure">
          <img
            src="https://picsum.photos/id/1015/600/400"
            alt=""
            class="news-swiper__image"
          />
          <div class="news-swiper__overlay" role="presentation"></div>
          <div class="news-swiper__info">
            <div class="news-swiper__info--time px-sm">{{ k }} hours ago</div>
            <icon-button
              class="ms-auto"
              icon="bookmark_border"
              :size="1"
              color="white"
              title="Save"
            ></icon-button>
          </div>
          <h2 class="news-swiper__title px-sm">
            A ruggedly beautiful quarantine site A ruggedly beautiful quarantine
            site
          </h2>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

const modules = [Pagination, Autoplay];
</script>
