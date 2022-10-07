function CMenu(){
    var _pStartPosAudio;
    var _pStartPosBut1;
    var _pStartPosBut2;
    var _pStartPosInfo;

    var _oBg;
    var _oBut1Player;
    var _oBut2Players;
    var _oAudioToggle;
    var _oButInfo;
    var _oFade;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
		
	_pStartPosBut1 = {x:(CANVAS_WIDTH/2),y:CANVAS_HEIGHT -340};
        var oSprite = s_oSpriteLibrary.getSprite('but_box_1');
        _oBut1Player = new CTextButton(_pStartPosBut1.x,_pStartPosBut1.y,oSprite,TEXT_BUT1PLAYER,FONT_GAME,"#ffffff",60,s_oStage);
        _oBut1Player.addEventListener(ON_MOUSE_UP, this._onBut1Player, this);

	_pStartPosBut2 = {x:(CANVAS_WIDTH/2),y:CANVAS_HEIGHT -150};
        _oBut2Players = new CTextButton(_pStartPosBut2.x,_pStartPosBut2.y,oSprite,TEXT_BUT2PLAYERS,FONT_GAME,"#ffffff",60,s_oStage);
        _oBut2Players.addEventListener(ON_MOUSE_UP, this._onBut2Players, this);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            var iX = CANVAS_WIDTH - (oSprite.width/4) -20;
            _pStartPosAudio = {x: iX, y: (oSprite.height/2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosInfo = {x: (oSprite.height/2) + 10, y: (oSprite.height/2) + 10}; 
        _oButInfo = new CGfxButton(_pStartPosInfo.x,_pStartPosInfo.y,oSprite,s_oStage);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onCredits, this);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 500).call(function(){_oFade.visible = false;});  
		
	this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        _oBut1Player.unload(); 
        _oBut1Player = null;
        _oButInfo.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oStage.removeAllChildren();
	s_oMenu = null;
    };
	
    this.refreshButtonPos = function(iNewX,iNewY){
        _oBut1Player.setPosition(_pStartPosBut1.x - iNewX, _pStartPosBut1.y - iNewY );
	_oBut2Players.setPosition(_pStartPosBut2.x - iNewX,_pStartPosBut2.y - iNewY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }    
        _oButInfo.setPosition(_pStartPosInfo.x + iNewX,iNewY + _pStartPosInfo.y);
    };
    
    this._onBut1Player = function(){
        this.unload();
        $(s_oMain).trigger("start_session");
        
        s_oMain.gotoGameModeMenu(false);
    };

    this._onBut2Players = function(){
        this.unload();
        $(s_oMain).trigger("start_session");
        
        s_oMain.gotoGameModeMenu(true);
    };
    
    this._onCredits = function(){
        new CCreditsPanel();
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(!s_bAudioActive);
    };
	
    s_oMenu = this;

    this._init();
}

var s_oMenu = null;