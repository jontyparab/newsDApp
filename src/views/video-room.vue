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

function init() {
  // document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
  // document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  // document.querySelector('#createBtn').addEventListener('click', createRoom);
  document.querySelector('#joinBtn').addEventListener('click', joinRoom);
}

async function createRoom() {
  console.log('RANNNNNNN');
  // document.querySelector('#createBtn').disabled = true;
  // document.querySelector('#joinBtn').disabled = true;

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
  // console.log('roomRef: ', roomRef);

  // Code for collecting ICE candidates below
  const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
  // console.log('callerCandidatesCollection: ', callerCandidatesCollection);

  peerConnection.addEventListener('icecandidate', async (event) => {
    if (!event.candidate) {
      // console.log('Got final candidate!');
      return;
    }
    // console.log('Got candidate: ', event.candidate);
    await addDoc(callerCandidatesCollection, event.candidate.toJSON());
  });

  // Code for creating a room below
  await peerConnection.setLocalDescription(offer);
  roomId.value = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomId.value}`);
  // console.log(`Current room is ${roomId.value} - You are the caller!`);

  peerConnection.addEventListener('track', (event) => {
    // console.log('Got remote track:', event.streams[0]);
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
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
      await createVideo(localStream);
    }
  });

  // Listen for remote ICE candidates below
  const unsubCalleeIce = onSnapshot(
    collection(roomRef, 'calleeCandidates'),
    (snapshot) => {
      console.log(snapshot);
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    },
    (error) => {
      console.log('Error: ', error);
    }
  );
}

async function joinRoom() {
  // document.querySelector('#createBtn').disabled = true;
  // document.querySelector('#joinBtn').disabled = true;

  console.log(`Current room is ${roomId.value} - You joined the call!`);
  // const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomsRef = collection(db, `rooms`);
  const roomRef = doc(roomsRef, roomId.value);
  const roomSnapshot = await getDoc(roomRef);
  console.log('Got room:', roomSnapshot.exists(), roomSnapshot);

  if (roomSnapshot.exists()) {
    // console.log('Create PeerConnection with configuration: ', configuration);
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
    // Code for collecting ICE candidates above

    peerConnection.addEventListener('track', (event) => {
      // console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        // console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });

    await createVideo(remoteStream);

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    // console.log('Got offer:', offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    // console.log('Created answer:', answer);
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    // change here for multi user room
    await setDoc(roomRef, roomWithAnswer);
    // Code for creating SDP answer above

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
  remoteStream = new MediaStream();

  // document.querySelector('#cameraBtn').disabled = true;
  // document.querySelector('#joinBtn').disabled = false;
  // document.querySelector('#createBtn').disabled = false;
  // document.querySelector('#hangupBtn').disabled = false;
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
  // document.querySelector('#remoteVideo').srcObject = remoteStream;
  console.log('LOCAL STREAM:', localStream, 'VIDEO ELEMENT:', playerEl);
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

  // document.querySelector('#localVideo').srcObject = null;
  // document.querySelector('#remoteVideo').srcObject = null;
  // document.querySelector('#cameraBtn').disabled = false;
  // document.querySelector('#joinBtn').disabled = true;
  // document.querySelector('#createBtn').disabled = true;
  // document.querySelector('#hangupBtn').disabled = true;
  // document.querySelector('#currentRoom').innerText = '';

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

  // document.location.reload(true);
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
    // let iceConnectionState = peerConnection.iceConnectionState;

    // if ( ['failed', 'disconnected', 'closed'].includes(iceConnectionState)) {
    //   delete mapPeers[peerUserName];

    //   if (iceConnectionState !== 'closed') {
    //     peerConnection.close();
    //   }

    //   deleteVideo();
    // }
  });
}

onBeforeUpdate(() => {
  videoEls.length = 0;
});

onUpdated(() => {
  console.log('After updating', videoEls);
});

// init();

// /*-------------------------------------------------*/
// /* Getting media stream */
// const openMediaDevices = async (constraints) => {
//   return await navigator.mediaDevices.getUserMedia(constraints);
// };

// try {
//   const stream = openMediaDevices({ video: true, audio: true });
//   console.log('Got MediaStream:', stream);
// } catch (error) {
//   console.error('Error accessing media devices.', error);
// }
// /* Querying device changes */
// // Updates the select element with the provided set of cameras
// function updateCameraList(cameras) {
//   const listElement = document.querySelector('select#availableCameras');
//   listElement.innerHTML = '';
//   cameras
//     .map((camera) => {
//       const cameraOption = document.createElement('option');
//       cameraOption.label = camera.label;
//       cameraOption.value = camera.deviceId;
//     })
//     .forEach((cameraOption) => listElement.add(cameraOption));
// }

// // Fetch an array of devices of a certain type
// async function getConnectedDevices(type) {
//   const devices = await navigator.mediaDevices.enumerateDevices();
//   return devices.filter((device) => device.kind === type);
// }

// // Get the initial set of cameras connected
// const videoCameras = getConnectedDevices('videoinput');
// updateCameraList(videoCameras);

// // Listen for changes to media devices and update the list accordingly
// navigator.mediaDevices.addEventListener('devicechange', (event) => {
//   const newCameraList = getConnectedDevices('video');
//   updateCameraList(newCameraList);
// });
// /* Media Constraints */
// // Open camera with at least minWidth and minHeight capabilities
// async function openCamera(cameraId, minWidth, minHeight) {
//   const constraints = {
//     audio: { echoCancellation: true },
//     video: {
//       deviceId: cameraId,
//       width: { min: minWidth },
//       height: { min: minHeight },
//     },
//   };

//   return await navigator.mediaDevices.getUserMedia(constraints);
// }

// const cameras = getConnectedDevices('videoinput');
// if (cameras && cameras.length > 0) {
//   // Open first available video camera with a resolution of 1280x720 pixels
//   const stream = openCamera(cameras[0].deviceId, 1280, 720);
// }
// /* Local playback */
// async function playVideoFromCamera() {
//   try {
//     const constraints = { video: true, audio: true };
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//     const videoElement = document.querySelector('video#localVideo');
//     // <video id="localVideo" autoplay playsinline controls="false"/>
//     videoElement.srcObject = stream;
//   } catch (error) {
//     console.error('Error opening video camera.', error);
//   }
// }
// // https://webrtc.org/getting-started/media-capture-and-constraints#near
// /* Initiating peer connections */
// const signalingChannel = undefined;
// async function makeCall() {
//   const configuration = {
//     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//   };
//   const peerConnection = new RTCPeerConnection(configuration);
//   signalingChannel.addEventListener('message', async (message) => {
//     if (message.answer) {
//       const remoteDesc = new RTCSessionDescription(message.answer);
//       await peerConnection.setRemoteDescription(remoteDesc);
//     }
//   });
//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);
//   signalingChannel.send({ offer: offer });
// }
// // Receiving call
// const peerConnection = new RTCPeerConnection(configuration);
// signalingChannel.addEventListener('message', async (message) => {
//   if (message.offer) {
//     peerConnection.setRemoteDescription(
//       new RTCSessionDescription(message.offer)
//     );
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
//     signalingChannel.send({ answer: answer });
//   }
// });
// /*
// Once the two peers have set both the local and remote session descriptions
// they know the capabilities of the remote peer. This doesn't mean that the
// connection between the peers is ready. For this to work we need to collect
// the ICE candidates at each peer and transfer (over the signaling channel)
// to the other peer.
// */
// /* ICE Candidates */
// // Listen for local ICE candidates on the local RTCPeerConnection
// peerConnection.addEventListener('icecandidate', (event) => {
//   if (event.candidate) {
//     signalingChannel.send({ 'new-ice-candidate': event.candidate });
//   }
// });
// /*
// The event icegatheringstatechange on RTCPeerConnection signals in what state the ICE gathering is (new, gathering or complete).
// */
// // Listen for remote ICE candidates and add them to the local RTCPeerConnection
// signalingChannel.addEventListener('message', async (message) => {
//   if (message.iceCandidate) {
//     try {
//       await peerConnection.addIceCandidate(message.iceCandidate);
//     } catch (e) {
//       console.error('Error adding received ice candidate', e);
//     }
//   }
// });

// // Listen for connectionstatechange on the local RTCPeerConnection
// peerConnection.addEventListener('connectionstatechange', (event) => {
//   if (peerConnection.connectionState === 'connected') {
//     // Peers connected!
//   }
// });

// /* Remote stream */
// // Adding local tracks
// const localStream = await getUserMedia({ vide: true, audio: true });
// const peerConnection = new RTCPeerConnection(iceConfig);
// localStream.getTracks().forEach((track) => {
//   peerConnection.addTrack(track, localStream);
// });

// // Adding remote tracks
// /* To receive the remote tracks that were added by the other peer, we register a listener on the local RTCPeerConnection listening for the track event. The RTCTrackEvent contains an array of MediaStream objects that have the same MediaStream.id values as the peer's corresponding local streams. In our example, each track is only associated with a single stream.
// Note that while MediaStream IDs match on both sides of the peer connection, the same is generally not true for MediaStreamTrack IDs.
// */
// const remoteVideo = document.querySelector('#remoteVideo');
// peerConnection.addEventListener('track', async (event) => {
//   const [remoteStream] = event.streams;
//   remoteVideo.srcObject = remoteStream;
// });

// /* Data channels */
// // The WebRTC standard also covers an API for sending arbitrary data over a RTCPeerConnection.
// const peerConnection = new RTCPeerConnection(configuration);
// const dataChannel = peerConnection.createDataChannel(); // RTCDataChannel obj
// // The remote peer can receive data channels by listening the datachannel event.
// // it is of the type RTCDataChannelEvent
// const peerConnection = new RTCPeerConnection(configuration);
// peerConnection.addEventListener('datachannel', (event) => {
//   const dataChannel = event.channel;
// });

// // Open and close events
// const messageBox = document.querySelector('#messageBox');
// const sendButton = document.querySelector('#sendButton');
// const peerConnection = new RTCPeerConnection(configuration);
// const dataChannel = peerConnection.createDataChannel();
// // Data channel can be used only after open event
// // Enable textarea and button when opened
// dataChannel.addEventListener('open', (event) => {
//   messageBox.disabled = false;
//   messageBox.focus();
//   sendButton.disabled = false;
// });
// // Disable input when closed
// dataChannel.addEventListener('close', (event) => {
//   messageBox.disabled = false;
//   sendButton.disabled = false;
// });

// /* Sending and receiving message */
// // Send a simple text message when we click the button

// const messageBox = document.querySelector('#messageBox');
// const sendButton = document.querySelector('#sendButton');
// sendButton.addEventListener('click', (event) => {
//   const message = messageBox.textContent;
//   dataChannel.send(message);
// });

// // Append new messages to the box of incoming messages
// const incomingMessages = document.querySelector('#incomingMessages');
// const peerConnection = new RTCPeerConnection(configuration);
// const dataChannel = peerConnection.createDataChannel();
// dataChannel.addEventListener('message', (event) => {
//   const message = event.data;
//   incomingMessages.textContent += message + '\n';
// });
// /* TURN Server */
// const iceConfiguration = {
//     iceServers: [
//         {
//             urls: 'turn:my-turn-server.mycompany.com:19403',
//             username: 'optional-username',
//             credentials: 'auth-token'
//         }
//     ]
// }
// const peerConnection = new RTCPeerConnection(iceConfiguration);
</script>
