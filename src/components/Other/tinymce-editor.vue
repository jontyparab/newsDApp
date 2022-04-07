<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <tinymce-editor
      :init="{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace fullscreen',
          'insertdatetime paste help wordcount',
        ],
        toolbar: 'undo redo | bold italic |',
      }"
    />
    <!-- 
        cloud-channel="5"
        :disabled=false
        id="uuid"
        initial-value=""
        :inline=true
        model-events= ""
        plugins=""
        tag-name="div"
        toolbar=""
        value=""
     -->
  </div>
</template>

<script setup>
import TinymceEditor from '@tinymce/tinymce-vue';
</script>
