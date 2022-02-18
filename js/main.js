let renderer = new PIXI.Renderer({ width: 910, height: 411,  transparent: true, antialias: true, resolution: 1});
renderer.plugins.interaction.autoPreventDefault = false;
renderer.view.style.touchAction = 'auto';
//NEAREST for pixelating scaling //LINEAR for smooth scaling
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

let stage = new PIXI.Container();
const loader = PIXI.Loader.shared;

document.getElementById("pixiPlayground").appendChild(renderer.view);

// Screen Resizing
let ratio;
let originalWormWidth, originalWormHeight;
let wormBoundaries;

// Animations and Worm Container
let worm, worm_run, worm_turn;
let wormAnims = [];

// Collider Elements
let interactiveStage;
let collider_left, collider_right, collider_top, collider_bot;
let colliding_left = false, colliding_right = false, colliding_top = false, colliding_bot = false;
let collision = new Bump();
let direction = 'left';
let isTransitionPlaying = false;
let isTurning = false;
let startMove = false;

let speed = {currentSpeed: 1, maxSpeed: 8};

const speedRate = 2;
const colliderThickness = 5;
const boundaryTolerance = 3;

const functionComplete = new Event("functioncomplete");
const turningComplete = new Event("turnend");

initialize();

function initialize()
{
    load();
}

function load()
{
    loader.add('worm', '../src/wormfall_run_turn/wormfall_run-turn.json').load((loader, resource) => {
        setup(resource);

        addEvents();
    });
}

function setup(resource)
{
    wormBoundaries = {};
    worm = new PIXI.Container();
    worm.interactive = true;

    worm_run = new PIXI.AnimatedSprite(resource.worm.spritesheet.animations['Wormfall_run']);
    worm_turn = new PIXI.AnimatedSprite(resource.worm.spritesheet.animations['Wormfall_turn']);
    wormAnims = [worm_run, worm_turn];

    // Setup the position of the worm
    for (let i = 0; i < wormAnims.length; i++)
    {
        wormAnims[i].animationSpeed = 0.2;
    }

    // Animation settings
    worm_turn.loop = false;
    worm_run.loop = true;
    worm_run.play();

    // Add the worm to the scene we are building
    worm.addChild(worm_run);
    stage.addChild(worm);

    colliding_top = false;
    colliding_right = false;
    colliding_bot = false;
    colliding_left = false;
    isTransitionPlaying = false;
    isTurning = false;

    originalWormWidth = worm.width;
    originalWormHeight = worm.height;

    // Screen size setup
    let pixiPlaygroundBounds = getCurrentPixiBounds();
    let currentDivWidth = pixiPlaygroundBounds.width;
    let currentDivHeight = pixiPlaygroundBounds.height;

    // Creating render objects to act as collider detection (new Sprite > new GenerateTexture > new Graphics)
    collider_top = new PIXI.Sprite(renderer.generateTexture(new PIXI.Graphics().beginFill(0x00CCaFF, 1).drawRect(0, 0, currentDivWidth, colliderThickness).endFill()));
    collider_top.x = 0, collider_top.y = 0;

    collider_right = new PIXI.Sprite(renderer.generateTexture(new PIXI.Graphics().beginFill(0xCC00FF, 1).drawRect(0, 0, colliderThickness, currentDivHeight).endFill()));
    collider_right.x = currentDivWidth - colliderThickness, collider_right.y = 0;

    collider_bot = new PIXI.Sprite(renderer.generateTexture(new PIXI.Graphics().beginFill(0xf5f7df, 1).drawRect(0, 0, currentDivWidth, colliderThickness).endFill()));
    collider_bot.x = 0, collider_bot.y = currentDivHeight - colliderThickness;

    collider_left = new PIXI.Sprite(renderer.generateTexture(new PIXI.Graphics().beginFill(0x3300FF, 1).drawRect(0, 0, colliderThickness, currentDivHeight).endFill()));
    collider_left.x = 0, collider_left.y = 0;
    
    stage.addChild(collider_top, collider_right, collider_bot, collider_left);

    interactiveStage = new PIXI.Graphics().drawRect(colliderThickness, colliderThickness, currentDivWidth - (colliderThickness * 2), currentDivHeight - (colliderThickness * 2));
    interactiveStage.interactive = true;
    interactiveStage.buttonMode = true;
    interactiveStage.hitArea = new PIXI.Rectangle(colliderThickness, colliderThickness, interactiveStage.width, interactiveStage.height);
    stage.addChild(interactiveStage);

    direction = 'left';

    resize();

    animate();
}

function animate()
{
    requestAnimationFrame(animate);
    renderer.render(stage);

    colliderCheck();

    directionCheck();
}

function directionCheck()
{
    if (!isTurning && !isTransitionPlaying)
    {
        switch(direction)
        {
            case 'left':
                wormMoveRight(speed.currentSpeed);
                break;
    
            case 'right':
                wormMoveLeft(speed.currentSpeed);
                break;

            case 'up':
                break;

            case 'down':
                break;

            case 'front':
                break;

            case 'back':
                break;
        }
    }
}

function colliderCheck()
{
    if (!colliding_right && direction === 'right')
    {
        if (collision.hit(worm, collider_right))
        {
            colliding_right = true;
            //isTurning = true;
            
            fromRightToLeft();
        }
    }
    if (!collision.hit(worm, collider_right))
    {
        colliding_right = false;
    }

    if (!colliding_left && direction === 'left')
    {
        if (collision.hit(worm, collider_left))
        {
            colliding_left = true;
            //isTurning = true;

            fromLeftToRight();
        }
    }
    if (!collision.hit(worm, collider_left))
    {
        colliding_left = false;
    }
}

function fromRightToLeft()
{
    console.error('TURNING LEFT');
    direction = 'left';
    TweenMax.to(worm, 1, {x: worm.x + colliderThickness});
    worm.addChild(worm_turn);
    worm_turn.x = worm_turn.width;
    worm.removeChild(worm_run);
    isTurning = true;
    worm_turn.gotoAndPlay(0);
    worm_run.scale.x = flipAxis(worm_run.scale.x);//1
    document.dispatchEvent(functionComplete);
    worm_turn.onComplete = () => {
        worm.addChild(worm_run);
        worm_run.x = 0;
        worm.removeChild(worm_turn);
        worm_run.gotoAndPlay(0);
        speed.currentSpeed = 1;
        isTurning = false;
        worm_turn.scale.x = flipAxis(worm_turn.scale.x);//-1
        document.dispatchEvent(turningComplete);
    }
}

function fromLeftToRight()
{
    console.error('TURNING RIGHT');
    direction = 'right';
    TweenMax.to(worm, 1, {x: worm.x - colliderThickness});
    worm.addChild(worm_turn);
    worm_turn.x = 0;
    worm.removeChild(worm_run);
    isTurning = true;
    worm_turn.gotoAndPlay(0);
    worm_run.scale.x = flipAxis(worm_run.scale.x);//-1
    document.dispatchEvent(functionComplete);
    worm_turn.onComplete = () => {
        worm.addChild(worm_run);
        worm_run.x = worm_run.width;
        worm.removeChild(worm_turn);
        worm_run.gotoAndPlay(0);
        speed.currentSpeed = 1;
        isTurning = false;
        worm_turn.scale.x = flipAxis(worm_turn.scale.x);//1
        document.dispatchEvent(turningComplete);
    }
}

function wormMoveLeft(currentSpeed)
{
    speedAcceleration();
    worm.x += 1 * currentSpeed;
}
function wormMoveRight(currentSpeed)
{
    speedAcceleration();
    worm.x -= 1 * currentSpeed;
}

function speedAcceleration()
{
    if (speed.currentSpeed === 1)
    {
        TweenMax.to(speed, speedRate, {currentSpeed: speed.maxSpeed, ease: "power2.out"});
    }
}

function resize()
{
    let pixiPlaygroundBounds = getCurrentPixiBounds();
    let newWidth = pixiPlaygroundBounds.width;
    let newHeight = pixiPlaygroundBounds.height;

    renderer.resize(newWidth, newHeight);
    interactiveStage.width = newWidth - (colliderThickness * 2);
    interactiveStage.height = newHeight - (colliderThickness * 2);

    collider_right.x = newWidth - colliderThickness;
    collider_bot.y = newHeight - colliderThickness;
    collider_bot.width = newWidth;
    collider_top.width = newWidth;

    wormBoundaries.width = newWidth - (colliderThickness * boundaryTolerance);
    wormBoundaries.height = newHeight - (colliderThickness * boundaryTolerance);

    if (wormBoundaries.width < worm.width + 50 || worm.width < originalWormWidth)
    {
        ratio = Math.min(wormBoundaries.width / originalWormWidth, wormBoundaries.height / originalWormHeight);

        for (let i = 0; i < wormAnims.length; i++)
        {
            wormAnims[i].width = originalWormWidth * ratio;
            wormAnims[i].height = originalWormHeight * ratio;
        }

        worm.y = newHeight / 2 - worm.height / 2;
    }
}

function addEvents()
{
    window.addEventListener('resize', resize);
    interactiveStage.on('click', tapTank);
}

function tapTank(e){
    console.warn('TAP');
    let point = new PIXI.Point(e.data.global.x, e.data.global.y);

    isTransitionPlaying = true;

    reactionToPlay(point)

}

function reactionToPlay(point)
{
    if (isTurning)
    {
        document.addEventListener('turnend', function handler(){
            document.removeEventListener('turnend', handler);
            if (worm.children[0].containsPoint(point))
            {
                console.log(point, 'Worm Scared!'); //scareWorm();
            }
            else
            {
                TweenMax.killTweensOf(worm);
                detectDirection(point)
            }
        })
    }
    else
    {
        TweenMax.killTweensOf(worm);
        if (worm.children[0].containsPoint(point))
        {
            console.log(point, 'Worm Scared!'); //scareWorm();
        }
        else
        {
            detectDirection(point)
        }
    }



}

function moveToPos(point, delay)
{
    console.log('moveToPos START');
    let yDiff = worm.height / 2;
    let xDiff = 0;

    if (direction === 'right')
    {
        xDiff = worm.width;
        console.error(xDiff);
    }
    //need to calculate duration based on distance. Estimate how long a single step should take. Maybe start with assuming it's 50px?
    let duration = 2;
    TweenMax.to(worm, duration, {x: point.x - xDiff, y: point.y - yDiff, delay: delay, ease: "power2.out", onComplete: function (){
        speed.currentSpeed = 1;
        isTransitionPlaying = false;

        let yPos = getCurrentPixiBounds().height / 2 - worm.height / 2;
        TweenMax.to(worm, 2, {y: yPos, ease: "power2.out"});
        console.log('moveToPos END');
    }});
}

function detectDirection(point)
{
    console.log('detectDirection START');
    const turnDelay = 1;

    if (point.x < worm.x) //If click happens on left
    {
        console.log('Click happened Left, FACING:', direction);
        if (direction === 'right')
        {
            document.addEventListener("functioncomplete", function handler (){
                this.removeEventListener("functioncomplete", handler);
                moveToPos(point, turnDelay);
                console.log('detectDirection END 1-a');
            });
            fromRightToLeft();
            console.log('detectDirection END 1-b');
        }
        else
        {
            moveToPos(point, 0);
            console.log('detectDirection END 2');
        }
    }
    else if (point.x > worm.x) //If click happens on right
    {
        console.log('Click happened Right, FACING:', direction);
        if (direction === 'left')
        {
            document.addEventListener("functioncomplete", function handler (){
                this.removeEventListener("functioncomplete", handler);
                moveToPos(point, turnDelay);
                console.log('detectDirection END 3-a');
            });
            fromLeftToRight();
            console.log('detectDirection END 3-b');
        }
        else
        {
            moveToPos(point, 0);
            console.log('detectDirection END 4');
        }
    }

    // MUST CHECK IF THIS DELAY CALL ALREADY EXISTS - cancel if it does and restart new one. SAME WITH TWEENMAX.TO in moveToPost()!!!

}

function flipAxis(currentValue)
{
    return currentValue * (-1);
}

function grabPos(obj)
{
    return new PIXI.Point(obj.x, obj.y);
}

function getCurrentPixiBounds()
{
    let width = document.getElementById("pixiPlayground").clientWidth;
    let height = document.getElementById("pixiPlayground").clientHeight;

    return new PIXI.Rectangle(0, 0, width, height);
}