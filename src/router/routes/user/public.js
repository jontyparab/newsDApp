import AuthForm from '@/views/auth-form.vue';
import VideoRoom from '@/views/video-room.vue';
const routes = [
  {
    path: '/user/auth',
    name: 'AuthForm',
    component: AuthForm,
  },
  {
    path: '/user/video/room',
    name: 'VideoRoom',
    component: VideoRoom,
  },
];

export default routes;
