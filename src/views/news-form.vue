<template>
  <div class="container">
    <div class="news__form">
      <h1 class="mb-sm">News Article</h1>
      <FormKit
        type="form"
        name="newsForm"
        incomplete-message="Please fill all required sections."
        submit-label="Post Article"
        :submit-attrs="{
          wrapperClass: 'submit-wrapper mt-sm',
        }"
        @node="setNode"
        @submit="submitForm"
      >
        <FormKitSchema :schema="schema" :library="library"></FormKitSchema>
      </FormKit>
    </div>
  </div>
</template>
<script setup>
import { FormKitSchema } from '@formkit/vue';
import TiptapEditor from '../components/Other/tiptap-editor.vue';
import { markRaw } from 'vue';
import { useNewsStore } from '@/stores/useNewsStore';
import { useMainStore } from '@/stores/useMainStore';
import { reactive } from 'vue';
// import TinymceEditor from '../components/Other/tinymce-editor.vue';
// headline, $author, $date, $id, image, lead paragraph, content(rich text), conclusion,

const newsStore = useNewsStore();
const mainStore = useMainStore();
const { createNews } = newsStore;
const { uploadIpfsFile } = mainStore;

const library = markRaw({
  editor: TiptapEditor,
});
const schema = [
  {
    $formkit: 'text',
    name: 'headline',
    label: 'Headline ',
    validation: [['required'], ['length', 0, 110]],
    help: 'Short, informative and catchy for better SEO',
  },
  {
    $formkit: 'textarea',
    name: 'lead',
    label: 'Lead paragraph',
    validation: [['required'], ['length', 20, 70]],
    validationMessages: {
      length: (ctx) =>
        `${ctx.name} should be between ${ctx.args[0]} to ${ctx.args[1]} characters.`,
    },
    help: 'Short summary of event.',
  },
  {
    $formkit: 'file',
    name: 'image',
    label: 'Image',
    validation: [['required']],
    accept: '.jpg,.png,.webp',
  },
  {
    $cmp: 'editor',
    props: {
      limit: 2500,
      placeholder: 'Enter news content',
    },
    name: 'content',
    label: 'Content',
    validation: [['required'], ['length', 0, 2500]],
    validationMessages: {
      length: (ctx) =>
        `${ctx.name} should be less than ${ctx.args[0]} characters.`,
    },
    value: '<p>News Content</p>',
    help: 'Main body of the article.',
  },
  {
    $formkit: 'textarea',
    name: 'conclusion',
    label: 'Conclusion',
    help: '(Optional)',
  },
];

let newsForm;
const setNode = (n) => {
  newsForm = n;
};

async function submitForm() {
  const { url } = await uploadIpfsFile();
  await createNews({ ...newsForm.value, url });
}
</script>
