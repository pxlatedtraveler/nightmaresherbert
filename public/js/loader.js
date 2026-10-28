const ImageGallery = [
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/caydesHoard.png', name: 'Stash' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/Sawatwuwn.png', name: 'Savathun' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/maraThrone.png', name: 'Throne' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/Xenos-1_BetterWorlds.png', name: 'Better Worlds' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/geneticist.png', name: 'Portrait' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/Comic_One_Exile_to_Another_PG3.png', name: 'One Exile to Another p3' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/ScornAlien3.png', name: 'Scorn3' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/Comic_One_Exile_to_Another_PG4.png', name: 'One Exile to Another p4' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/LonelyDragons.png', name: 'Lonely Dragons' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/BlackThunder.jpg', name: 'Black Thunder' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/AdventureCat.jpg', name: 'PSA - Black Cats' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/EliksniCritters2.jpg', name: 'Eliksni 2' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/Rushed.jpg', name: 'Rushed' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/FatFingerLotle.jpg', name: 'Lotle' },
    { src: 'https://pxlatedtraveler.github.io/images/2DArt/Pokedoodles.jpg', name: 'Pokedoodles' },

];

for (let i = 0; i < ImageGallery.length; i++) {
    
    const imgEle = document.createElement('img');

    imgEle.src = ImageGallery[i].src;
    imgEle.alt = `Art-${i}`;

    imgEle.classList.add('gallery-img');

    ImageGallery[i].img = imgEle;
}