// Handles menu button selection state style
const btnsMain = document.querySelectorAll('.btn-collapsible');

for (let i = 0; i < btnsMain.length; i++) {
    btnsMain[i].addEventListener('click', () => {
        if (btnsMain[i].classList.contains('selected')) {
            btnsMain[i].classList.remove('selected');
        }
        else {
            btnsMain[i].classList.add('selected');
        }
        
        for (let j = 0; j < btnsMain.length; j++) {
            if (j !== i) {
                btnsMain[j].classList.remove('selected');
            }
        }
        
    });
}

const btnsSub = document.querySelectorAll('.btn-sub-collapsible');

for (let i = 0; i < btnsSub.length; i++) {
    btnsSub[i].addEventListener('click', () => {
        if (btnsSub[i].classList.contains('selected')) {
            btnsSub[i].classList.remove('selected');
        }
        else {
            btnsSub[i].classList.add('selected');
        }
        
        for (let j = 0; j < btnsSub.length; j++) {
            if (j !== i) {
                btnsSub[j].classList.remove('selected');
            }
        }
        
    });
}



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
const dragHeader = document.getElementById("work-header");

for (let i = 0; i < collSubs.length; i++) {

    collSubs[i].addEventListener('click', function() {

        collSubs[i].classList.toggle('active');

        let panel = dragPanels[i]; //can't be next sibling; buttons in the way.

        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            document.getElementById("work").style.maxHeight = (panel.scrollHeight + dragHeader.scrollHeight + 40) + "px"; // 40 is padding of 20 on content class
        }

        for (let j = 0; j < collSubs.length; j++) {
            if (j !== i) {
                collSubs[j].classList.remove("active");
                dragPanels[j].style.maxHeight = null;
            }
        }

    });
}

// Start WORKS menu with Games selected
collSubs[1].classList.toggle('active');
collSubs[1].classList.add('selected');
dragPanels[1].style.maxHeight = dragPanels[1].scrollHeight + "px";




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
            const originalImage = wrapper.querySelector('a');
            const contentBox = document.querySelector('.lightbox-content-box');

            if (originalIframe && lightbox) {

                const currentWidth = wrapper.offsetWidth;
                const currentHeight = wrapper.offsetHeight;

                if (currentHeight > currentWidth) {
                    contentBox.style.setProperty('--lightbox-ratio', '9/16');
                } else {
                    contentBox.style.setProperty('--lightbox-ratio', '16/9');
                }
                
                let srcArt = originalIframe.getAttribute('src');

                if (srcArt) {
      
                    if (!srcArt.includes('api=1')) {
                        srcArt += (srcArt.includes('?') ? '&' : '?') + 'api=1';
                    }
                    if (!srcArt.includes('autoplay=1')) {
                        srcArt += '&autoplay=1';
                    }
        
                    lightboxTarget.innerHTML = `<iframe src="${srcArt}" 
                                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin">
                                                </iframe>`;
        
                    document.body.style.overflow = 'hidden';
        
                    lightbox.classList.add('is-active');
                }
    
            }
            else if (originalImage && lightbox) {

                contentBox.style.setProperty('--lightbox-ratio', '');

                let srcArt = originalImage.getAttribute('href');
                let imgData = ImageGallery.find(obj => obj.src == srcArt);
                
                if (imgData) {

                    lightboxTarget.innerHTML = '';
                    lightboxTarget.appendChild(imgData.img);

                    document.body.style.overflow = 'hidden';

                    lightbox.classList.add('is-active');
                }
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

