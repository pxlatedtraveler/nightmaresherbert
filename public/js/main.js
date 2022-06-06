const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
      content.style.maxWidth = "none";
      content.style.minWidth = "none";
      //content.style.padding = "0";
    } else {
      //content.style.padding = "20px";
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.maxWidth = "30%";
      content.style.minWidth = "300px";
    }
  });
}