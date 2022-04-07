<template>
  <div class="container">
    <div class="news-detail">
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
            icon="share"
            class="ms-sm"
            :size="1"
            color="var(--color-white)"
            title="Share"
            @click="openDialog('sharePanel')"
          ></icon-button>
          <icon-button
            :icon="news.isBookmarked ? 'bookmark' : 'bookmark_border'"
            class="ms-sm"
            :size="1"
            :color="
              news.isBookmarked
                ? 'var(--color-tertiary-light)'
                : 'var(--color-white)'
            "
            title="Bookmark"
            @click="toggleBookmark(news.id)"
          ></icon-button>
        </div>
        <div class="news-detail__info px-sm">
          <div class="news-detail__info--1 mb-xs">
            <span>{{ news.date }}</span>
            <span>{{ news.author }}</span>
          </div>

          <div class="news-detail__info--2 ms-auto">
            <icon-button
              class=""
              icon="visibility"
              :size="1"
              color="var(--color-white)"
              title="Views"
            ></icon-button>
            {{ news.viewCount }}
          </div>
        </div>
      </div>
      <div class="news-detail__content px-sm">
        <h1 class="news-detail__title my-sm px-xs">
          {{ news.headline }}
        </h1>
        <div class="news-detail__text mt-sm">
          <p class="news-detail__text--para">
            {{ news.content }}
          </p>
        </div>
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
import { ref, reactive, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNewsStore } from '../stores/useNewsStore';

const router = useRouter();

const newsStore = useNewsStore();
const { toggleBookmark } = newsStore;
const { getNewsById } = storeToRefs(newsStore);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { id } = toRefs(props);

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

const news = getNewsById.value(id.value);

// web share feature
const currentPath = router.currentRoute.value.path;
const currentUrl = new URL(currentPath, location.origin).href;
const sharing = {
  url: currentUrl,
  title: news.headline,
  description: news.lead,
  // quote: "The hot reload is so fast it's near instant. - Evan You",
  // hashtags: 'vuejs,vite,javascript',
  // twitterUser: 'youyuxi',
};

// icon-button actions
const goBack = () => {
  router.back();
};
</script>
