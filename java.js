
const videos = document.querySelectorAll("video");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
            video.play();
        } else {
            video.pause();
        }
    });
}, {
    threshold: 0.6
});

videos.forEach(video => {
    observer.observe(video);
});

document.querySelectorAll("video").forEach(video => {
    video.addEventListener("click", () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
});


