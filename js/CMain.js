function CMain(oData){
    var _bUpdate = false;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    
    var _oData = {};
    var _oPreloader;
    var _oMenu;
    var _oGameModeMenu;
    var _oHelp;
    var _oGame;

    var _b2Players = false;

    this.initContainer = function(){
        s_oStage = new createjs.Stage("canvas");       
        createjs.Touch.enable(s_oStage);
        
        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
        
        s_iPrevTime = new Date().getTime();

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this._update);
		
	if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
		
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };
	
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }

        this._loadImages();
        _bUpdate = true;
    };

    this.soundLoaded = function(){
         _iCurResource++;

         if(_iCurResource === RESOURCE_TO_LOAD){
             _oPreloader.unload();
            
            this.gotoMenu();
         }
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }

        if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/gameover.ogg", "gameover");
                createjs.Sound.registerSound("./sounds/place_mark.ogg", "place_mark");
                createjs.Sound.registerSound("./sounds/press_but.ogg", "press_but");
                createjs.Sound.registerSound("./sounds/win.ogg", "win");
		createjs.Sound.registerSound("./sounds/draw.ogg", "draw");
        }else{
                createjs.Sound.alternateExtensions = ["ogg"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/gameover.mp3", "gameover");
                createjs.Sound.registerSound("./sounds/place_mark.mp3", "place_mark");
                createjs.Sound.registerSound("./sounds/press_but.mp3", "press_but");
                createjs.Sound.registerSound("./sounds/win.mp3", "win");
		createjs.Sound.registerSound("./sounds/draw.mp3", "draw");
        }
        RESOURCE_TO_LOAD += 5;
        
    };
    
    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("but_box_1","./sprites/but_box_1.png");
        s_oSpriteLibrary.addSprite("but_box_2","./sprites/but_box_2.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("cell","./sprites/cell.png");
        s_oSpriteLibrary.addSprite("choose_text","./sprites/choose_text.png");
        s_oSpriteLibrary.addSprite("but_3x3","./sprites/layout_3x3.png");
        s_oSpriteLibrary.addSprite("but_5x5","./sprites/layout_5x5.png");
        s_oSpriteLibrary.addSprite("but_7x7","./sprites/layout_7x7.png");
        s_oSpriteLibrary.addSprite("panel","./sprites/panel.png");
        s_oSpriteLibrary.addSprite("tokenX","./sprites/player_1.png");
        s_oSpriteLibrary.addSprite("tokenO","./sprites/player_2.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("tris_line","./sprites/tris_line.png");
	s_oSpriteLibrary.addSprite("bg_mode_menu","./sprites/bg_mode_menu.jpg");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("logo_credits","./sprites/logo_credits.png");
        s_oSpriteLibrary.addSprite("logo","./sprites/logo.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();
            
            this.gotoMenu();
        };
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoGameModeMenu = function(b2Players){
        if (b2Players) {
            _b2Players = true;
        } else {
            _b2Players = false;
        };

        _oGameModeMenu = new CGameModeMenu();
    }
    
    this.gotoGame = function(iGridWidth){

        _oData.iMatrixSize = iGridWidth;
        _oData.b2Players = _b2Players;

        _oGame = new CGame(_oData);
			
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
    };
    
    this._update = function(event){
        if(_bUpdate === false){
            return;
        }
        
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }

        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    _oData = oData;

    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oGameSettings;