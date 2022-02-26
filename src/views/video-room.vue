<template>
  <div class="container"></div>
</template>

<script setup>
const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomDialog = null;
let roomId = null;

function init() {
  document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', createRoom);
  document.querySelector('#joinBtn').addEventListener('click', joinRoom);
  roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));
}

async function createRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;
  const db = firebase.firestore();
  const roomRef = await db.collection('rooms').doc();

  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Code for collecting ICE candidates below
  const callerCandidatesCollection = roomRef.collection('callerCandidates');

  peerConnection.addEventListener('icecandidate', (event) => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    callerCandidatesCollection.add(event.candidate.toJSON());
  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log('Created offer:', offer);

  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  await roomRef.set(roomWithOffer);
  roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
  document.querySelector(
    '#currentRoom'
  ).innerText = `Current room is ${roomRef.id} - You are the caller!`;
  // Code for creating a room above

  peerConnection.addEventListener('track', (event) => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach((track) => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  roomRef.onSnapshot(async (snapshot) => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log('Got remote description: ', data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  roomRef.collection('calleeCandidates').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  // Listen for remote ICE candidates above
}

function joinRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  document.querySelector('#confirmJoinBtn').addEventListener(
    'click',
    async () => {
      roomId = document.querySelector('#room-id').value;
      console.log('Join room: ', roomId);
      document.querySelector(
        '#currentRoom'
      ).innerText = `Current room is ${roomId} - You are the callee!`;
      await joinRoomById(roomId);
    },
    { once: true }
  );
  roomDialog.open();
}

async function joinRoomById(roomId) {
  const db = firebase.firestore();
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();
  console.log('Got room:', roomSnapshot.exists);

  if (roomSnapshot.exists) {
    console.log('Create PeerConnection with configuration: ', configuration);
    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
    peerConnection.addEventListener('icecandidate', (event) => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      calleeCandidatesCollection.add(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above

    peerConnection.addEventListener('track', (event) => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    console.log('Got offer:', offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log('Created answer:', answer);
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await roomRef.update(roomWithAnswer);
    // Code for creating SDP answer above

    // Listening for remote ICE candidates below
    roomRef.collection('callerCandidates').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listening for remote ICE candidates above
  }
}

async function openUserMedia(e) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  document.querySelector('#localVideo').srcObject = stream;
  localStream = stream;
  remoteStream = new MediaStream();
  document.querySelector('#remoteVideo').srcObject = remoteStream;

  console.log('Stream:', document.querySelector('#localVideo').srcObject);
  document.querySelector('#cameraBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = false;
  document.querySelector('#createBtn').disabled = false;
  document.querySelector('#hangupBtn').disabled = false;
}

async function hangUp(e) {
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });

  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  document.querySelector('#localVideo').srcObject = null;
  document.querySelector('#remoteVideo').srcObject = null;
  document.querySelector('#cameraBtn').disabled = false;
  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';

  // Delete room on hangup
  if (roomId) {
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(roomId);
    const calleeCandidates = await roomRef.collection('calleeCandidates').get();
    calleeCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });
    const callerCandidates = await roomRef.collection('callerCandidates').get();
    callerCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
  }

  document.location.reload(true);
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
      `ICE gathering state changed: ${peerConnection.iceGatheringState}`
    );
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`
    );
  });
}

init();

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
</script>
