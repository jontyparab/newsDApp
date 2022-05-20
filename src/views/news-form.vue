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
        <FormKitSchema :schema="schema"></FormKitSchema>
      </FormKit>
    </div>
  </div>
</template>
<script setup>
import { FormKitSchema, createInput } from '@formkit/vue';
import TiptapEditor from '../components/Other/tiptap-editor.vue';
import { markRaw } from 'vue';
import { useNewsStore } from '@/stores/useNewsStore';
import { useMainStore } from '@/stores/useMainStore';
// import TinymceEditor from '../components/Other/tinymce-editor.vue';
// headline, $author, $date, $id, image, lead paragraph, content(rich text), conclusion,

const newsStore = useNewsStore();
const mainStore = useMainStore();
const { createNews } = newsStore;
const { uploadIpfsFile, uploadFbFile } = mainStore;

const editor = createInput(TiptapEditor, {
  props: ['limit', 'placeholder'],
});
// const library = markRaw({
//   editor: TiptapEditor,
// });

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
    validation: [['required'], ['length', 20, 250]],
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
    $formkit: editor,
    limit: 2500,
    placeholder: 'Write something...',
    outerClass: 'formkit-editor',
    name: 'content',
    label: 'Content',
    // validation: [['required'], ['length', 5, 2500]],
    // validationMessages: {
    //   length: (ctx) =>
    //     `${ctx.name} should be less than ${ctx.args[0]} characters.`,
    // },
  },
  {
    $formkit: 'textarea',
    name: 'conclusion',
    label: 'Conclusion',
    help: '(Optional)',
  },
  {
    $formkit: 'checkbox',
    name: 'saleable',
    id: 'id_saleable',
    label: 'Allow sale',
    help: 'Allow other users to purchase rights.',
  },
  {
    $formkit: 'number',
    if: '$get(id_saleable).value',
    name: 'price',
    validation: [['required'], ['min', 0]],
    label: 'Price',
    help: 'Enter the price for which it should be sold.',
  },
];

let newsForm;
const setNode = (n) => {
  newsForm = n;
};

async function submitForm() {
  if (confirm('You are about to publish the article. Continue?')) {
    const imageUrls = await uploadFbFile(newsForm.value.image, '/images');
    // eslint-disable-next-line no-unused-vars
    const requiredData = (({ image, ...o }) => {
      return { ...o, imageUrl: imageUrls[0] };
    })(newsForm.value);
    await createNews(requiredData);
  } else {
    console.log(newsForm.value);
  }
}
</script>
