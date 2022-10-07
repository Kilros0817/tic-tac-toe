function CInterface(iMatrixSize){
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosTextActivePl;
    var _pStartPosLogo;
	
    var _oAudioToggle;
    var _oBackground;
    var _oButExit;
    var _oTextActivePl;
    var _oTextHelp;
    var _oLogo;
    
    this._init = function(iMatrixSize){
        _oBackground = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBackground);

        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 20, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 175;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
		
	_pStartPosTextActivePl = {x:40,y:440};
        var szActivePl = TEXT_ACTIVEPLAYER.pt1 + s_oGame.getActivePlayer() + TEXT_ACTIVEPLAYER.pt2;
        _oTextActivePl = new createjs.Text(szActivePl, "100px "+FONT_GAME, "#008df0");
        _oTextActivePl.x = _pStartPosTextActivePl.x;
        _oTextActivePl.y = _pStartPosTextActivePl.y;
        _oTextActivePl.textBaseline = "alphabetic";
        _oTextActivePl.textAlign = "left";
        s_oStage.addChild(_oTextActivePl);
		
        var szTextHelp;
        if(iMatrixSize > 3){
                szTextHelp = TEXT_FOUR_IN_ROW;
        }else{
                szTextHelp = TEXT_THREE_IN_ROW;
        }

        _oTextHelp = new createjs.Text(szTextHelp, "60px "+FONT_GAME, "#008df0");
        _oTextHelp.x = CANVAS_WIDTH/2;
        _oTextHelp.y = CANVAS_HEIGHT - 300;
        _oTextHelp.textBaseline = "alphabetic";
        _oTextHelp.textAlign = "center";
        s_oStage.addChild(_oTextHelp);
		
        _pStartPosLogo = {x:20,y:20};
        _oLogo = createBitmap(s_oSpriteLibrary.getSprite('logo'));
        _oLogo.x = _pStartPosLogo.x;
        _oLogo.y = _pStartPosLogo.y;
        s_oStage.addChild(_oLogo);
        
	this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oBackground);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }

        _oButExit.unload();

        s_oStage.removeChild(_oTextActivePl);
    };
	
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }    
        _oLogo.x = _pStartPosLogo.x + iNewX;
        _oLogo.y = _pStartPosLogo.y + iNewY;
    };

    this.update = function(){
        var szActivePl = TEXT_ACTIVEPLAYER.pt1 + s_oGame.getActivePlayer() + TEXT_ACTIVEPLAYER.pt2;

        createjs.Tween.get(_oTextActivePl).
            to({scaleX:0.1,scaleY:1.2,alpha:0.5}, 250, createjs.Ease.cubicOut).
            call(function(){
                _oTextActivePl.text = szActivePl;
                createjs.Tween.get(_oTextActivePl).
                to({scaleX:1,scaleY:1,alpha:1}, 250, createjs.Ease.cubicIn);
        });
    };

    this._onExit = function(){
        this.unload();
        s_oGame.onExit();
    }
    
    s_oInterface = this;
	
    this._init(iMatrixSize);
    
    return this;
}

var s_oInterface = null;