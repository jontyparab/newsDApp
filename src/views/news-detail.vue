<template>
  <div class="container">
    <div class="news-detail">
      <div class="news-detail__figure">
        <img
          src="https://picsum.photos/id/1015/100/100"
          alt=""
          class="news-detail__image"
        />
        <div class="news-detail__overlay" role="presentation"></div>
        <div class="news-detail__options px-sm">
          <icon-button
            icon="share"
            class="ms-auto"
            :size="1"
            color="white"
            title="Share"
          ></icon-button>
          <icon-button
            icon="bookmark_border"
            class="ms-sm"
            :size="1"
            color="white"
            title="Save"
          ></icon-button>
        </div>
        <div class="news-detail__info px-sm">
          <div class="news-detail__info--time">2 hours ago</div>
          <icon-button
            class="ms-auto"
            icon="visibility"
            :size="1"
            color="white"
            title="Views"
          ></icon-button>
          <div class="news-detail__info--views">9845</div>
        </div>
      </div>
      <div class="news-detail__content px-sm">
        <h1 class="news-detail__title my-sm px-xs">
          A ruggedly beautiful quarantine site
        </h1>
        <div class="news-detail__text mt-sm">
          <p class="news-detail__text--para">
            Perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
            inventore veritatis et quasi architecto beatae vitae dicta sunt
            explicabo.
          </p>
          <p class="news-detail__text--para">
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
            quam nihil molestiae consequatur, vel ilium qui dolorem eum fugiat
            quo voluptas nulla pariatur amet, consectetu lorem ipsom dolor
            accusantium doloremaue
          </p>
        </div>
      </div>
    </div>
    <!-- <share-panel></share-panel> -->
    <text-verifier true-value="123123"></text-verifier>
  </div>
</template>
