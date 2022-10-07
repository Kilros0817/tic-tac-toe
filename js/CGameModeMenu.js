function CGameModeMenu(){

    var _oBg;
    var _oSprite3x3;
    var _oSprite5x5;
    var _oSprite7x7;
    var _oFade;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_mode_menu'));
        s_oStage.addChild(_oBg);
	
        var oChooseText = createBitmap(s_oSpriteLibrary.getSprite('choose_text'));
        oChooseText.x = 40;
        oChooseText.y = 240;
        s_oStage.addChild(oChooseText);
	
	var oSprite = s_oSpriteLibrary.getSprite('but_3x3');
        _oSprite3x3 = createBitmap(oSprite);
        _oSprite3x3.x = (CANVAS_WIDTH/2) - (oSprite.width/2);
        _oSprite3x3.y = 440;
        _oSprite3x3.cursor = "pointer";
        s_oStage.addChild(_oSprite3x3);
        _oSprite3x3.on("click", function(){
			if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
				createjs.Sound.play("press_but");
			}
            this._onBut3x3();
        },this);

        _oSprite5x5 = createBitmap(s_oSpriteLibrary.getSprite('but_5x5'));
        _oSprite5x5.x = (CANVAS_WIDTH/2) - (oSprite.width/2);
        _oSprite5x5.y = 880;
        _oSprite5x5.cursor = "pointer";
        s_oStage.addChild(_oSprite5x5);
        _oSprite5x5.on("click", function(){
			if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
				createjs.Sound.play("press_but");
			}
            this._onBut5x5();
        },this);

        _oSprite7x7 = createBitmap(s_oSpriteLibrary.getSprite('but_7x7'));
        _oSprite7x7.x = (CANVAS_WIDTH/2) - (oSprite.width/2);
        _oSprite7x7.y = 1320;
        _oSprite7x7.cursor = "pointer";
        s_oStage.addChild(_oSprite7x7);
        _oSprite7x7.on("click", function(){
			if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
				createjs.Sound.play("press_but");
			}
            this._onBut7x7();
        },this);
        
        
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 500).call(function(){_oFade.visible = false;});  
    };
    
    this.unload = function(){
        _oSprite3x3.removeAllEventListeners();
        _oSprite5x5.removeAllEventListeners();
        _oSprite7x7.removeAllEventListeners();
        
        s_oStage.removeAllChildren();
        s_oGameMode = null;
    };
    
    
    
    this._onBut3x3 = function(){
        this.unload();

        s_oMain.gotoGame(3);
    };

    this._onBut5x5 = function(){
        this.unload();
        
        s_oMain.gotoGame(5);
    };

    this._onBut7x7 = function(){
        this.unload();

        s_oMain.gotoGame(7);
    };
    
    s_oGameMode = this;
    
    this._init();
}

var s_oGameMode = null;