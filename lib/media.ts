// Derives a poster frame from a Cloudinary-hosted video URL via URL
// transformation, rather than storing a separate poster URL that could
// drift out of sync with the video. `so_<seconds>` picks a frame at that
// timestamp instead of frame zero, which sometimes lands on black/fade-in.
export function cloudinaryVideoPoster(videoUrl: string, offsetSeconds = 1): string {
  return videoUrl
    .replace('/upload/', `/upload/so_${offsetSeconds}/`)
    .replace(/\.[a-z0-9]+$/i, '.jpg');
}
