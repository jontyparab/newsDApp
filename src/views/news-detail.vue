<template>
  <div class="container">
    <div v-if="news" class="news-detail">
      <div class="news-detail__figure">
        <img
          :src="news.imageUrl"
          :alt="news.headline"
          class="news-detail__image"
        />
        <div class="news-detail__overlay" role="presentation"></div>
        <div class="news-detail__options">
          <icon-button
            icon="previous-button"
            class="me-auto"
            :size="1.3"
            color="var(--color-white)"
            title="Go back"
            @click="goBack"
          ></icon-button>
          <icon-button
            icon="protected"
            class="ms-auto"
            :size="1"
            color="var(--color-white)"
            title="Verify integrity"
            @click="openDialog('textVerifier')"
          ></icon-button>
          <icon-button
            v-if="can('authenticated')"
            icon="coins-line"
            class="ms-sm"
            :size="1"
            color="var(--color-white)"
            title="Purchase"
          ></icon-button>
          <icon-button
            icon="share"
            class="ms-sm"
            :size="1"
            color="var(--color-white)"
            title="Share"
            @click="openDialog('sharePanel')"
          ></icon-button>
          <icon-button
            v-if="can('authenticated')"
            :icon="news.isBookmarked ? 'bookmark' : 'bookmark_border'"
            class="ms-sm"
            :size="1"
            :color="
              news.isBookmarked
                ? 'var(--color-tertiary-light)'
                : 'var(--color-white)'
            "
            title="Bookmark"
            @click="updateBookmark"
          ></icon-button>
        </div>
        <div class="news-detail__info px-sm">
          <div class="news-detail__info--1 mb-xs">
            <p>{{ formatNewsDate(news.date) }}</p>
            <p class="">
              - By
              <b>
                <u>{{ news.author }}</u>
              </b>
            </p>
          </div>

          <!-- <div class="news-detail__info--2 ms-auto">
            <icon-button
              class=""
              icon="visibility"
              :size="1"
              color="var(--color-white)"
              title="Views"
            ></icon-button>
            {{ news.viewCount }}
          </div> -->
        </div>
      </div>
      <div class="news-detail__content px-sm">
        <h1 class="news-detail__title my-sm px-xs">
          {{ news.headline }}
        </h1>
        <div class="news-detail__text mt-sm" v-html="news.content"></div>
      </div>
    </div>
    <share-panel
      v-if="dialogs.sharePanel"
      :sharing="sharing"
      @close-dialog="closeDialog('sharePanel')"
    ></share-panel>
    <base-dialog
      v-if="dialogs.textVerifier"
      class="p-sm"
      @close-dialog="closeDialog('textVerifier')"
    >
      <template #header>
        <div class="dialog-header mb-sm">
          <h2>Check integrity</h2>
        </div>
      </template>
      <text-verifier :true-value="news.id"></text-verifier>
    </base-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { reactive, toRefs, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNewsStore } from '../stores/useNewsStore';
import { formatNewsDate } from '@/assets/js/utils/formatters';
import { useUserStore } from '../stores/useUserStore';
import { useAbility } from '@/assets/js/services/ability.js';

const router = useRouter();

const userStore = useUserStore();
const { getBookmarkStatus } = userStore;
const newsStore = useNewsStore();
const { toggleBookmark, fetchNewsById } = newsStore;
const { getNewsById } = storeToRefs(newsStore);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const { id } = toRefs(props);

const { can, cannot } = useAbility();

// managing dialogs
const dialogs = reactive({
  sharePanel: false,
  textVerifier: false,
});
const openDialog = (name) => {
  dialogs[name] = true;
};
const closeDialog = (name) => {
  dialogs[name] = false;
};

// web share feature
const currentPath = router.currentRoute.value.path;
const currentUrl = new URL(currentPath, location.origin).href;
const sharing = computed(() => {
  return {
    url: currentUrl,
    title: news.value.headline,
    description: news.value.lead,
    // quote: "The hot reload is so fast it's near instant. - Evan You",
    // hashtags: 'vuejs,vite,javascript',
    // twitterUser: 'youyuxi',}
  };
});

// icon-button actions
const goBack = () => {
  router.back();
};

// update bookmark icon
const updateBookmark = () => {
  toggleBookmark(news.value);
  // this.news.isBookmarked = !this.news.isBookmarked;
};

const news = computed(() => {
  return getNewsById.value(id.value);
});

onMounted(async () => {
  // you can show a spinner on v-if="dataReady" and set it to true after fetching.
  // https://stackoverflow.com/questions/53513538/is-async-await-available-in-vue-js-mounted
});
</script>
