import AuthForm from '@/views/auth-form.vue';
import VideoRoom from '@/views/video-room.vue';
import VideoRoomV2 from '@/views/video-room-v2.vue';
import { useUserStore } from '../../../stores/useUserStore';

const routes = [
  {
    path: '/user/auth',
    name: 'AuthForm',
    component: AuthForm,
  },
  {
    path: '/user/auth/finishSignUp',
    name: 'AuthFinish',
    redirect: (to) => {
      const userStore = useUserStore();
      userStore.login();
      return { name: 'NewsList', query: { ...to.params } };
    },
  },
  {
    path: '/user/video/room',
    name: 'VideoRoom',
    component: VideoRoom,
  },
  {
    path: '/user/video/room/v2',
    name: 'VideoRoom2',
    component: VideoRoomV2,
  },
];

export default routes;
