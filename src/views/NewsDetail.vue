<template>
    <div class="container">
        <div class="news-detail">
            <div class="news-detail__figure">
                <div class="news-detail__options px-sm">
                    <round-button icon="share" class="ms-auto" :size="1" color="white" title="Share"></round-button>
                    <round-button icon="bookmark_border" class="ms-sm" :size="1" color="white" title="Save"></round-button>
                </div>
                <img src="https://picsum.photos/id/1015/600/400" alt="" class="news-detail__image">
                <div class="news-detail__info px-sm">
                    <div class="news-detail__info--time">2 hours ago</div>
                    <round-button class="ms-auto" icon="visibility" :size="1" color="white" title="Views"></round-button>
                    <div class="news-detail__info--views">9845</div>
                </div>
            </div>
            <div class="news-detail__content px-sm">
                <h1 class="news-detail__title my-sm px-xs">A ruggedly beautiful quarantine site</h1>
                <div class="news-detail__text mt-sm">
                    <p class="news-detail__text--para">
                    Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                    <p class="news-detail__text--para">
                    Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel ilium qui dolorem eum fugiat quo voluptas nulla pariatur amet, consectetu lorem ipsom dolor accusantium doloremaue
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>