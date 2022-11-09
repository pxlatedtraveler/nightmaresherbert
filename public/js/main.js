const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        console.log(coll);
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
  });
}

const intro = document.getElementById("guilty");

gsap.delayedCall(4.5, () => {
    intro.innerText = 'shhhhhhhhhh';
})

gsap.delayedCall(5, function(){
    gsap.to("#guilty", {height: 0, marginBottom: 0, duration: 1.25, ease: "bounce.out"});
    //gsap.to("#guilty.botMar")
})