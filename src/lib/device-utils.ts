
export const vibrate = (ms: number | number[] = 50) => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(ms);
    } catch (e) {
      // Ignore
    }
  }
};

export const requestNotification = () => {
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
};

export const sendNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
};

let currentAudioSource: AudioBufferSourceNode | null = null;
let audioCtx: AudioContext | null = null;

export const playBase64PCM = async (base64: string, sampleRate = 24000) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Stop previous voice to avoid overlap
    if (currentAudioSource) {
      try {
        currentAudioSource.stop();
      } catch (e) {
        // Already stopped
      }
    }

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Int16Array(len / 2);
    
    for (let i = 0; i < len; i += 2) {
      const byte1 = binaryString.charCodeAt(i);
      const byte2 = binaryString.charCodeAt(i + 1);
      bytes[i / 2] = (byte2 << 8) | byte1;
    }

    const floatData = new Float32Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      floatData[i] = bytes[i] / 32768;
    }

    const buffer = audioCtx.createBuffer(1, floatData.length, sampleRate);
    buffer.copyToChannel(floatData, 0);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
    currentAudioSource = source;

    source.onended = () => {
      if (currentAudioSource === source) {
        currentAudioSource = null;
      }
    };
  } catch (error) {
    console.error("Error playing PCM audio:", error);
  }
};
