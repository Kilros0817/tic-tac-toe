function CEndPanel(iWinner){

    var _oSprPanel;
    var _oSprWinner;
    var _oTextWin;
    var _oButReplay;
    var _oFade;
    var _oAudioToggle;
    
    this._init = function(iWinner){
        _oSprPanel = createBitmap(s_oSpriteLibrary.getSprite('panel'));
        s_oStage.addChild(_oSprPanel);

        if (iWinner === 1) {
            _oSprWinner = createBitmap(s_oSpriteLibrary.getSprite('tokenX'));
            _oTextWin = new createjs.Text(TEXT_PL1_VICTORY, "100px "+FONT_GAME, "White");
            _oSprWinner.x = 150;
            _oSprWinner.y = 800;
            _oTextWin.x = CANVAS_WIDTH/2 + 70;
            _oTextWin.y = (CANVAS_HEIGHT/2) - 60;
            _oTextWin.textBaseline = "alphabetic";
            _oTextWin.textAlign = "center";
            _oTextWin.shadow = new createjs.Shadow("#000000", 6, 6, 2);

            s_oStage.addChild(_oSprWinner);
            s_oStage.addChild(_oTextWin);

        } else if (iWinner === 2) {
            _oSprWinner = createBitmap(s_oSpriteLibrary.getSprite('tokenO'));
            _oTextWin = new createjs.Text(TEXT_PL2_VICTORY, "100px "+FONT_GAME, "White");
            _oSprWinner.x = 150;
            _oSprWinner.y = 800;
            _oTextWin.x = CANVAS_WIDTH/2 + 70;
            _oTextWin.y = (CANVAS_HEIGHT/2) - 60;
            _oTextWin.textBaseline = "alphabetic";
            _oTextWin.textAlign = "center";
            _oTextWin.shadow = new createjs.Shadow("#000000", 6, 6, 2);

            s_oStage.addChild(_oSprWinner);
            s_oStage.addChild(_oTextWin);

        } else { // Draw
            _oTextWin = new createjs.Text(TEXT_DRAW, "100px "+FONT_GAME, "White");
            _oTextWin.x = CANVAS_WIDTH/2;
            _oTextWin.y = (CANVAS_HEIGHT/2) - 60;
            _oTextWin.textBaseline = "alphabetic";
            _oTextWin.textAlign = "center";
            _oTextWin.shadow = new createjs.Shadow("#000000", 6, 6, 2);

            s_oStage.addChild(_oSprWinner);
            s_oStage.addChild(_oTextWin);
        };
        
        var oSprite = s_oSpriteLibrary.getSprite('but_box_2');
        _oButReplay = new CTextButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 200,oSprite,TEXT_PLAYAGAIN,FONT_GAME,"#008df0",60,s_oStage);
        _oButReplay.addEventListener(ON_MOUSE_UP, this._onButPlayAgain, this);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(CANVAS_WIDTH - (oSprite.width/2) + 5,(oSprite.height/2) + 20,oSprite);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        };

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
		
        $(s_oMain).trigger("end_game",[iWinner]);
		
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;$(s_oMain).trigger("show_interlevel_ad");});  
    };
    
    this.unload = function(){
        _oButReplay.unload(); 
        _oButReplay = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oStage.removeChild(_oSprPanel,_oSprWinner,_oTextWin,_oFade);
    };
    
    this._onButPlayAgain = function(){
        this.unload();
        s_oGame.unload();
    };

    this._onAudioToggle = function(){
        createjs.Sound.setMute(!s_bAudioActive);
    };
    
    this._init(iWinner);
}