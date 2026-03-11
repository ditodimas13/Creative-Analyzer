export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
export const MAX_VIDEOS = 20;
export const ACCEPTED_TYPES = ["video/mp4", "video/quicktime"]; // mp4, mov

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isValidVideoFile(file: File): boolean {
  const okType = ACCEPTED_TYPES.includes(file.type);
  const okSize = file.size <= MAX_FILE_SIZE;
  return okType && okSize;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

export function getVideoMetadata(video: HTMLVideoElement): VideoMetadata {
  return {
    duration: video.duration,
    width: video.videoWidth,
    height: video.videoHeight,
  };
}

const MAX_FRAME_WIDTH = 512;
const FRAME_QUALITY = 0.65;

/**
 * Extract 1-3 frames from video at 0%, 50%, 100% (or fewer if short).
 * Returns base64 data URLs (image/jpeg).
 */
export function extractFrames(
  video: HTMLVideoElement,
  count: number = 3
): Promise<string[]> {
  const duration = video.duration;
  const times: number[] = [];
  if (duration <= 0) {
    times.push(0);
  } else if (count >= 3) {
    times.push(0, duration * 0.5, duration * 0.95);
  } else {
    for (let i = 0; i < count; i++) {
      times.push((duration * i) / Math.max(1, count - 1));
    }
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve([]);

  const w = video.videoWidth;
  const h = video.videoHeight;
  const scale = w > MAX_FRAME_WIDTH ? MAX_FRAME_WIDTH / w : 1;
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);

  return new Promise((resolve) => {
    const results: string[] = [];
    let index = 0;

    function capture() {
      if (index >= times.length) {
        resolve(results);
        return;
      }
      const t = times[index];
      video.currentTime = t;
    }

    video.onseeked = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", FRAME_QUALITY);
      results.push(dataUrl);
      index++;
      if (index >= times.length) {
        video.onseeked = null;
        resolve(results);
        return;
      }
      video.currentTime = times[index];
    };

    capture();
  });
}



