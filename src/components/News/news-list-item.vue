<template>
  <article class="news-list-item my-xs p-sm" role="link">
    <div class="news-list-item__image-wrap">
      <img :src="imageUrl" alt="" class="news-list-item__image" />
    </div>
    <div class="news-list-item__details pt-xs">
      <h4 class="news-list-item__details--title">
        {{ headline }}
      </h4>
      <p class="news-list-item__details--summary my-xs">
        {{ lead }}
      </p>
    </div>
    <div class="news-list-item__meta">
      <div class="news-list-item__meta--time">{{ formatNewsDate(date) }}</div>
      <!-- <icon-button
        class="news-list-item__meta--bookmark"
        :icon="isBookmarked ? 'bookmark' : 'bookmark_border'"
        :color="isBookmarked ? 'var(--color-secondary)' : null"
        :size="0.8"
      ></icon-button> -->
    </div>
  </article>
</template>

<script setup>
import { toRefs } from 'vue';
import { urlValidator, isoDateValidator } from '@/assets/js/utils/validators';
import { formatNewsDate } from '@/assets/js/utils/formatters';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validator(value) {
      return urlValidator(value);
    },
  },
  headline: {
    type: String,
    required: true,
  },
  lead: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    validator(value) {
      return isoDateValidator(value);
    },
  },
  // isBookmarked: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
});
const { id, imageUrl, headline, lead, date } = toRefs(props);
</script>
