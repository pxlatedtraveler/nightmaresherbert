const coll = document.getElementsByClassName("collapsible");

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
  });
}

//document.getElementById("");