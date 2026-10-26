// Handles Menu collapsing
const coll = document.getElementsByClassName("btn-collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {

        this.classList.toggle("active");

        let panel = this.nextElementSibling;

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



// Handles WORKS submenu collapsing
const collSubs = document.getElementsByClassName("btn-sub-collapsible");
const dragPanels = document.getElementsByClassName("drag-grid");
console.log('drags', dragPanels);
console.log('subs', collSubs)

for (let i = 0; i < collSubs.length; i++) {

    collSubs[i].addEventListener('click', function() {

        collSubs[i].classList.toggle('active');

        let panel = dragPanels[i]; //can't be next sibling; buttons in the way.

        if (panel.style.maxHeight){
            console.log('OFF');
            panel.style.maxHeight = null;
        } else {
            console.log('ON');
            panel.style.maxHeight = panel.scrollHeight + "px";
            if (panel.scrollHeight !== 0) {
                document.getElementById("work").style.maxHeight = panel.scrollHeight + "px";
            }
        }

        for (let j = 0; j < collSubs.length; j++) {
            if (j !== i) {
                collSubs[j].classList.remove("active");
                dragPanels[j].style.maxHeight = null;
            }
        }

    });
}


// Handles menu mouse dragging
const lightbox = document.getElementById('video-lightbox');
const lightboxTarget = document.getElementById('lightbox-video-target');
const closeBtn = document.getElementById('close-lightbox-btn');
const backdropCloseBtn = document.getElementById('lightbox-backdrop-close');

let isDown = false;
let startX, startY;
let scrollLeft, scrollTopParent;
let hasMoved = false;

for (let i = 0; i < dragPanels.length; i++) {
    dragPanels[i].addEventListener("mousedown", (e) => {
        //if (!collSubs[i].classList.contains('active')) return;
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.menu')) return;
        isDown = true;
        hasMoved =false;
    
        startX = e.pageX - dragPanels[i].offsetLeft;
        scrollLeft = dragPanels[i].scrollLeft;
    
        startY = e.clientY;
        scrollTopParent = window.scrollY || document.documentElement.scrollTop;
    });
    
    dragPanels[i].addEventListener("mousemove", (e) => {
        //if (!collSubs[i].classList.contains('active')) return;
        if (!isDown) return;
    
        const x = e.pageX - dragPanels[i].offsetLeft;
        const walkX = x - startX;
    
        const y = e.clientY;
        const walkY = y - startY;
    
        if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
            hasMoved = true;
            dragPanels[i].classList.add('is-dragging');
            e.preventDefault();
            dragPanels[i].scrollLeft = scrollLeft - walkX;
            window.scrollTo(0, scrollTopParent - walkY);
        }
    });
    
    dragPanels[i].addEventListener("mouseup", (e) => {
        //if (!collSubs[i].classList.contains('active')) return;
        if (!isDown) return;
        isDown = false;
        dragPanels[i].classList.remove('is-dragging');
    
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
    
                if (!videoSrc.includes('api=1')) {
                    videoSrc += (videoSrc.includes('?') ? '&' : '?') + 'api=1';
                }
                if (!videoSrc.includes('autoplay=1')) {
                    videoSrc += '&autoplay=1';
                }
    
                lightboxTarget.innerHTML = `<iframe src="${videoSrc}" 
                                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin">
                                            </iframe>`;
    
                document.body.style.overflow = 'hidden';
    
                lightbox.classList.add('is-active');
            }
        }
    });

    dragPanels[i].addEventListener('mouseleave', () => {
        //if (!collSubs[i].classList.contains('active')) return;
        isDown = false;
        dragPanels[i].classList.remove('is-dragging');
    });
}

const closeVideoLightbox = () => {
    if (lightbox) {
        lightbox.classList.remove('is-active');
        lightboxTarget.innerHTML = '';
        document.body.style.overflow = '';
    }
};

closeBtn.addEventListener('click', closeVideoLightbox);
backdropCloseBtn.addEventListener('click', closeVideoLightbox);

