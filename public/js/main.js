// Handles Menu collapsing
const coll = document.getElementsByClassName("btn-collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {

        this.classList.toggle("active");

        let panel = this.nextElementSibling;
        //let content = panel.firstElementChild;
        if (panel.style.maxHeight){
            console.log('OFF');
            panel.style.maxHeight = null;
        } else {
            console.log('ON');
            panel.style.maxHeight = panel.scrollHeight + "px";
        }

        // Collapse the rest so only one is active at most. Can't ref with this, since this = coll[i]
        for (let j = 0; j < coll.length; j++) {
            if (j !== i) {
                coll[j].classList.remove("active");
                coll[j].nextElementSibling.style.maxHeight = null;
            }
        }
  });
}

document.addEventListener("THING FOR WINDOW RESIZE", function() {
    //Adjust max height to grow with text...OR turn on overflow? which I think auto-happens if I just turn it on anyway...figure out later.
});



// Handles secret menu message
const intro = document.getElementById("guilty");

gsap.delayedCall(4.5, () => {
    intro.innerText = 'shhhhhhhhhh';
});

gsap.delayedCall(5, function(){
    gsap.to("#guilty", {height: 0, marginBottom: 0, duration: 1.25, ease: "bounce.out"});
    //gsap.to("#guilty.botMar")
});



// Handles menu mouse dragging
const slider = document.querySelector('.drag-grid');
const lightbox = document.getElementById('video-lightbox');
const lightboxTarget = document.getElementById('lightbox-video-target');
const closeBtn = document.getElementById('close-lightbox-btn');
const backdropCloseBtn = document.getElementById('lightbox-backdrop-close');

let isDown = false;
let startX, scrollLeft, hasMoved = false;


slider.addEventListener("mousedown", (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.menu')) return;

    isDown = true;
    hasMoved =false;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX;

    if (Math.abs(walk) > 5) {
        hasMoved = true;
        slider.classList.add('is-dragging');
        e.preventDefault();
        slider.scrollLeft = scrollLeft - walk;
    }
});

slider.addEventListener("mouseup", (e) => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('is-dragging');

    if (!hasMoved && e.target.classList.contains('video-shield')) {
        const wrapper = e.target.closest('.video-wrapper');
        const originalIframe = wrapper.querySelector('iframe');

        if (originalIframe && lightbox) {
            const currentWidth = wrapper.offsetWidth;
            const currentHeight = wrapper.offsetHeight;
            const contentBox = document.querySelector('.lightbox-content-box');

            if (currentHeight > currentWidth) {
                contentBox.style.setProperty('--lightbox-ratio', '9/16');
            } else {
                contentBox.style.setProperty('--lightbox-ratio', '16/9');
            }

            let videoSrc = originalIframe.getAttribute('src');

            if (!videoSrc.includes('autoplay=1')) {
                videoSrc += (videoSrc.includes('?') ? '&' : '?') + 'autoplay=1';
            }

            lightboxTarget.innerHTML = `<iframe src="${videoSrc}" allow="autoplay" allowfullscreen></iframe>`;

            document.body.style.overflow = 'hidden';

            lightbox.showModal();
        }
    }
});

const closeVideoLightbox = () => {
    if (lightbox) {
        lightbox.close();
        lightboxTarget.innerHTML = '';
        document.body.style.overflow = '';
    }
};

closeBtn.addEventListener('click', closeVideoLightbox);
backdropCloseBtn.addEventListener('click', closeVideoLightbox);

slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('is-dragging');
});
