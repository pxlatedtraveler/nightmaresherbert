let renderer = new PIXI.Renderer({ width: 910, height: 411,  transparent: true, antialias: true, resolution: 1});
renderer.plugins.interaction.autoPreventDefault = false;
renderer.view.style.touchAction = 'auto';
//NEAREST for pixelating scaling //LINEAR for smooth scaling
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

let stage = new PIXI.Container();
const loader = PIXI.Loader.shared;

document.getElementById("pixiPlayground").appendChild(renderer.view);

let ratio;
let originalWormWidth, originalWormHeight;
let wormBoundaries;
let ticker;

let worm, worm_run, worm_turn;
let wormAnims = [];
let collider_left, collider_right, collider_top, collider_bot;
let colliding_left = false, colliding_right = false, colliding_top = false, colliding_bot = false;
let collision = new Bump();
let direction = 'left';
let turning = false;

let speed = {currentSpeed: 1, maxSpeed: 8};

const speedRate = 2;
const colliderThickness = 5;
const boundaryTolerance = 3;

initialize();

function initialize()
{
    load();
}

function load()
{
    loader.add('worm', '../src/wormfall_run_turn/wormfall_run-turn.json').load((loader, resource) => {
        setup(resource);
        window.addEventListener('resize', resize);
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
    turning = false;

    originalWormWidth = worm.width;
    originalWormHeight = worm.height;

    // Screen size setup
    let currentDivWidth = document.getElementById("pixiPlayground").clientWidth;
    let currentDivHeight = document.getElementById("pixiPlayground").clientHeight;

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
    if (!turning)
    {
        switch(direction)
        {
            case 'left':
                speedAcceleration()
                wormMoveRight(speed.currentSpeed);
                break;
    
            case 'right':
                speedAcceleration()
                wormMoveLeft(speed.currentSpeed);
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
            turning = true;
            
            TweenMax.to(worm, 1, {x: worm.x + colliderThickness});
            worm.addChild(worm_turn);
            worm_turn.x = worm_turn.width;
            worm.removeChild(worm_run);
            worm_turn.gotoAndPlay(0);
            direction = 'left';
            worm_run.scale.x = flipAxis(worm_run.scale.x);//1
    
            worm_turn.onComplete = () => {
                worm.addChild(worm_run);
                worm_run.x = 0;
                worm.removeChild(worm_turn);
                worm_run.gotoAndPlay(0);
                speed.currentSpeed = 1;
                turning = false;
                worm_turn.scale.x = flipAxis(worm_turn.scale.x);//-1
            }
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
            turning = true;

            TweenMax.to(worm, 1, {x: worm.x - colliderThickness});
            worm.addChild(worm_turn);
            worm_turn.x = 0;
            worm.removeChild(worm_run);
            worm_turn.gotoAndPlay(0);
            direction = 'right';
            worm_run.scale.x = flipAxis(worm_run.scale.x);//-1
    
            worm_turn.onComplete = () => {
                worm.addChild(worm_run);
                worm_run.x = worm_run.width;
                worm.removeChild(worm_turn);
                worm_run.gotoAndPlay(0);
                speed.currentSpeed = 1;
                turning = false;
                worm_turn.scale.x = flipAxis(worm_turn.scale.x);//1
            }
        }
    }
    if (!collision.hit(worm, collider_left))
    {
        colliding_left = false;
    }
}

function flipAxis(currentValue)
{
    return currentValue * (-1);
}

function wormMoveLeft(currentSpeed)
{
    worm.x += 1 * currentSpeed;
}
function wormMoveRight(currentSpeed)
{
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
    let newWidth = document.getElementById("pixiPlayground").clientWidth;
    let newHeight = document.getElementById("pixiPlayground").clientHeight;

    renderer.resize(newWidth, newHeight);

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