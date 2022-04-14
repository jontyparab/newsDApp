<template>
  <div class="container">
    <div class="news__form">
      <h1 class="mb-sm">Register as a Journalist</h1>
      <FormKit
        type="form"
        name="journalistRegisterForm"
        incomplete-message="Please enter correct details and try again."
        submit-label="Register"
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
import { FormKitSchema } from '@formkit/vue';
import { useUserStore } from '@/stores/useUserStore';
import { useMainStore } from '@/stores/useMainStore';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();
const userStore = useUserStore();
const mainStore = useMainStore();
const { registerJournalist } = userStore;
const { uploadFbFile } = mainStore;

const schema = [
  {
    $formkit: 'text',
    name: 'firstName',
    label: 'First Name',
    validation: [['required'], ['length', 1, 75]],
  },
  {
    $formkit: 'text',
    name: 'lastName',
    label: 'Last Name',
    validation: [['required'], ['length', 1, 75]],
  },
  {
    $formkit: 'file',
    name: 'photoIdentity',
    label: 'Photo identity',
    accept: '.jpg,.png,.webp',
    validation: [['required']],
    help: 'Example: Aadhar card, driving license, PAN card etc.',
  },
  {
    $formkit: 'file',
    name: 'video',
    label: 'Video',
    accept: '.mp4, .webm, .avi',
    // validation: [['required']],
    help: 'Upload a short video (2-3 minutes) specifying your full name, age, birth date. Hold your photo identity such that it is clearly visible in the video.',
  },
  {
    $formkit: 'textarea',
    name: 'about',
    label: 'About',
    validation: [['required']],
    help: 'Describe your work to other interested users.',
  },
  {
    $formkit: 'textarea',
    name: 'subjectsOfInterest',
    label: 'Subjects of Interest',
    help: 'Give your areas of interest.',
  },
];

let journalistRegisterForm;
const setNode = (n) => {
  journalistRegisterForm = n;
};

async function submitForm() {
  const photoIdentityUrls = await uploadFbFile(
    journalistRegisterForm.value.photoIdentity,
    '/kyc/photoIdentities'
  );
  const videoUrls = await uploadFbFile(
    journalistRegisterForm.value.video,
    '/kyc/videos'
  );
  // eslint-disable-next-line no-unused-vars
  const requiredData = (({ photoIdentity, video, ...o }) => o)(
    journalistRegisterForm.value
  );
  Object.assign(requiredData, { photoIdentityUrls, videoUrls });
  try {
    await registerJournalist(requiredData);
    router.push({ name: 'NewsList' });
    // TODO: allow journalist to manage news permission in CASL
  } catch (e) {
    console.log(e);
  }
}
</script>
