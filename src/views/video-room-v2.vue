<template>
  <div class="container">
    <base-video
      v-for="v in videoList"
      :key="v.key"
      :ref="setVideoEl"
      :options="videoOptions"
    ></base-video>
    <button class="mx-md" @click="openUserMedia">Start Camera</button>
    <button class="mx-md" @click="createRoom">Create Room</button>
    <button class="mx-md" @click="joinRoom">Join Room</button>
    <input v-model="roomId" />
    <!-- <base-video :options="videoOptions"></base-video> -->
  </div>
</template>

<script setup>
import { ref, reactive, toRef, nextTick, onBeforeUpdate, onUpdated } from 'vue';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
} from 'firebase/firestore';
import fbApp from '@/assets/js/services/firebase.js';

/*
{
  videoPlayer: ref,
  key: key,
}
*/
const db = getFirestore(fbApp);

const videoOptions = reactive({
  autoplay: true,
  sources: [],
  liveui: true,
  fluid: true,
});

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const videoList = reactive([]);
const videoEls = reactive([]);
const setVideoEl = (el) => {
  if (el.videoPlayer instanceof HTMLVideoElement) {
    videoEls.push(el.videoPlayer);
  }
};
let peerConnection = new RTCPeerConnection();
let localStream = new MediaStream();
let remoteStream = new MediaStream();
let roomId = ref('');

async function createRoom() {
  // Code for creating a room below
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Create offer or answer only after adding the stream/tracks
  const offer = await peerConnection.createOffer();
  console.log('Created offer:', offer);

  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  const roomsRef = collection(db, 'rooms');
  const roomRef = await addDoc(roomsRef, roomWithOffer);

  // Code for collecting ICE candidates below
  const callerCandidatesCollection = collection(roomRef, 'callerCandidates');

  peerConnection.addEventListener('icecandidate', async (event) => {
    if (!event.candidate) {
      // console.log('Got final candidate!');
      return;
    }
    // console.log('Got candidate: ', event.candidate);
    await addDoc(callerCandidatesCollection, event.candidate.toJSON());
  });

  // Code for creating a room below
  roomId.value = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomId.value}`);

  peerConnection.addEventListener('track', (event) => {
    event.streams[0].getTracks().forEach((track) => {
      // console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  const unsubRemoteSd = onSnapshot(roomRef, async (snapshot) => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log('Got remote description: ', data.answer);
      const rtcSessionDescription = data.answer;
      await peerConnection.setRemoteDescription(rtcSessionDescription);
      await createVideo(remoteStream);
    }
  });

  // Listen for remote ICE candidates below
  const unsubCalleeIce = onSnapshot(
    collection(roomRef, 'calleeCandidates'),
    (snapshot) => {
      //   console.log(snapshot);
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          let data = change.doc.data();
          //   console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    },
    (error) => {
      console.log('Error: ', error);
    }
  );

  await peerConnection.setLocalDescription(offer);
  await createVideo(localStream);
}

async function joinRoom() {
  const roomsRef = collection(db, `rooms`);
  const roomRef = doc(roomsRef, roomId.value);
  const roomSnapshot = await getDoc(roomRef);

  if (roomSnapshot.exists()) {
    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');
    peerConnection.addEventListener('icecandidate', async (event) => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      await addDoc(calleeCandidatesCollection, event.candidate.toJSON());
    });

    peerConnection.addEventListener('track', (event) => {
      event.streams[0].getTracks().forEach((track) => {
        // console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    await peerConnection.setRemoteDescription(offer);
    await createVideo(remoteStream);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    await createVideo(localStream);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    // change here for multi user room
    await setDoc(roomRef, roomWithAnswer);

    // Listening for remote ICE candidates below
    const unsubCallerIce = onSnapshot(
      collection(roomRef, 'callerCandidates'),
      (snapshot) => {
        console.log(snapshot);
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            let data = change.doc.data();
            // console.log(
            //   `Got new remote ICE candidate: ${JSON.stringify(data)}`
            // );
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      }
    );
  }
}

async function openUserMedia(e) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true },
    video: {
      width: 720,
      height: 1280,
    },
  });

  localStream = stream;
}

async function createVideo(stream) {
  videoList.push({
    key: 1,
  });
  // waiting for next refresh to access refs
  await nextTick();
  console.log(videoList.length, videoEls);
  const playerEl = videoEls[videoList.length - 1];
  playerEl.srcObject = stream;
  console.log('LOCAL STREAM:', localStream, 'VIDEO ELEMENT:', playerEl);
  return true;
}

async function destroyVideo(stream) {
  return true;
}

async function hangUp(e) {
  const playerEl = videoList.value[0].videoPlayer;
  const tracks = playerEl.srcObject.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });

  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  // Delete room on hangup // use_dispatch
  if (roomId.value) {
    const roomRef = collection(db, 'rooms').doc(roomId);
    const calleeCandidates = await collection(db, 'calleeCandidates').get();
    calleeCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });
    const callerCandidates = await collection(
      db,
      'rooms/callerCandidates'
    ).get();
    callerCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
  }
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    // console.log(
    //   `ICE gathering state changed: ${peerConnection.iceGatheringState}`
    // );
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    // console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    // console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`
    );
    let iceConnectionState = peerConnection.iceConnectionState;

    if (['failed', 'disconnected', 'closed'].includes(iceConnectionState)) {
      // delete mapPeers[peerUserName];

      if (iceConnectionState !== 'closed') {
        peerConnection.close();
      }

      destroyVideo();
    }
  });
}

onBeforeUpdate(() => {
  videoEls.length = 0;
});

onUpdated(() => {
  console.log('After updating', videoEls);
});
</script>
