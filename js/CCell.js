function CCell(iX,iY,fScaling,x,y){

	var _iState; // 0 = empty, 1 = X, 2 = O
	var _iMatrixX; // x coord on matrix
	var _iMatrixY; // y coord on matrix
	var _fScaling;

	var _oSprToken1;
	var _oSprToken2;
	var _oSprBack;
	var _oSprTop;
	var _oContainer;

	this._init = function(iX,iY,fScaling,x,y){
            _iState = 0;
            _iMatrixX = x;
            _iMatrixY = y;
            _fScaling = fScaling;

            var oSprite = s_oSpriteLibrary.getSprite('cell');
            _oSprBack = createBitmap(oSprite);
            _oSprBack.scaleX = _oSprBack.scaleY = fScaling;

            var oSpriteToken = s_oSpriteLibrary.getSprite('tokenX');
            _oSprToken1 = createBitmap(oSpriteToken);
            _oSprToken1.x = (oSprite.width/2) * fScaling;
            _oSprToken1.y = (oSprite.height/2) * fScaling;
            _oSprToken1.regX = oSpriteToken.width/2;
            _oSprToken1.regY = oSpriteToken.height/2;
            _oSprToken1.scaleX = _oSprToken1.scaleY = fScaling;
            _oSprToken1.alpha = 0;

            oSpriteToken = s_oSpriteLibrary.getSprite('tokenO');
            _oSprToken2 = createBitmap(oSpriteToken);
            _oSprToken2.x = (oSprite.width/2) * fScaling;
            _oSprToken2.y = (oSprite.height/2) * fScaling;
            _oSprToken2.regX = oSpriteToken.width/2;
            _oSprToken2.regY = oSpriteToken.height/2;
            _oSprToken2.scaleX = _oSprToken2.scaleY = fScaling;
            _oSprToken2.alpha = 0;

            _oSprTop = new createjs.Shape();
            _oSprTop.graphics.beginFill("black").drawRect(0, 0, CELL_SIZE * fScaling, CELL_SIZE * fScaling);
            _oSprTop.alpha = 0.05;

            _oContainer = new createjs.Container();
            _oContainer.x = iX;
            _oContainer.y = iY;
            _oContainer.cursor = "pointer";
            _oContainer.addChild(_oSprBack,_oSprToken1,_oSprToken2,_oSprTop);
            _oContainer.on("click", function(){
                    this.clicked();
            },this);

            s_oStage.addChild(_oContainer);
	};

	this.unload = function(){
		_oContainer.removeAllEventListeners();
		s_oStage.removeChild(_oContainer);
	};

	this.clicked = function(){
		if (!s_oGame.isFrozen()) {

            _oContainer.removeAllEventListeners();
            s_oGame.freeze();
            this.showToken();
		};
	};

	this.showToken = function(){
	
		if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
			createjs.Sound.play("place_mark");
		}
		if (s_oGame.getActivePlayer() === 1) {
			_iState = 1;
			_oSprToken1.scaleX = _oSprToken1.scaleY = 0.5;
			_oSprToken1.alpha = 0.1;
			_oSprToken1.visible = true;
			createjs.Tween.get(_oSprToken1).
                                        to({scaleX:1.2*_fScaling,scaleY:1.2*_fScaling,alpha:1}, 200,createjs.Ease.cubicOut).
                                        call(function(){
                                            createjs.Tween.get(_oSprToken1).
                                            to({scaleX:1*_fScaling,scaleY:1*_fScaling}, 200,createjs.Ease.cubicIn).
                                            call(function(){
                                                                s_oGame.unFreeze();
                                                                s_oGame.updateGameStatus(_iMatrixX,_iMatrixY);
                                    });
                                });
		} else {
			_iState = 2;
			_oSprToken2.scaleX = _oSprToken1.scaleY = 0.5;
			_oSprToken2.alpha = 0.1;
			_oSprToken2.visible = true;
			createjs.Tween.get(_oSprToken2).
                                    to({scaleX:1.2*_fScaling,scaleY:1.2*_fScaling,alpha:1}, 200,createjs.Ease.cubicOut).
                                    call(function(){
                                        createjs.Tween.get(_oSprToken2).
                                        to({scaleX:1*_fScaling,scaleY:1*_fScaling}, 200,createjs.Ease.cubicIn).
                                        call(function(){
                                                                s_oGame.unFreeze();
                                                                s_oGame.updateGameStatus(_iMatrixX,_iMatrixY);
                                        }); 
                                });
		};
	};

	this.AIMove = function(){
		_oContainer.removeAllEventListeners();
		s_oGame.freeze();

		_iState = 2;
		_oSprToken2.alpha = 0;
		createjs.Tween.get(_oSprToken2)
			.wait(1000)
                        .to({scaleX:1.2*_fScaling,scaleY:1.2*_fScaling,alpha:1}, 250,createjs.Ease.cubicOut)
                        .call(function(){
							if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
								createjs.Sound.play("place_mark");
							}
                            createjs.Tween.get(_oSprToken2).
                            to({scaleX:1*_fScaling,scaleY:1*_fScaling}, 250,createjs.Ease.cubicIn).
                                            call(function(){
                                            					s_oGame.unFreeze();
                                                                s_oGame.updateGameStatus(_iMatrixX,_iMatrixY);
                                                            }); 
                    });
	};

	this.EndAnim = function(){
		s_oGame.freeze();
		if (_iState === 1) {
			createjs.Tween.get(_oSprToken1).
	            to({scaleX:1.5*_fScaling,scaleY:1.5*_fScaling,alpha:0.8}, 1000,createjs.Ease.cubicInOut).
	            call(function(){
	                createjs.Tween.get(_oSprToken1).
	                to({scaleX:1*_fScaling,scaleY:1*_fScaling,alpha:1}, 1500,createjs.Ease.bounceOut).
	                call(function(){
						s_oGame.showEndPanel();
	                });
	        });
		} else {
			createjs.Tween.get(_oSprToken2).
	            to({ scaleX:1.5*_fScaling,scaleY:1.5*_fScaling,alpha:0.8}, 1000,createjs.Ease.cubicInOut).
	            call(function(){
	                createjs.Tween.get(_oSprToken2).
	                to({scaleX:1*_fScaling,scaleY:1*_fScaling,alpha:1}, 1500,createjs.Ease.bounceOut).
	                call(function(){
						s_oGame.showEndPanel();
	                });
		        });
			};
		};

	this._init(iX,iY,fScaling,x,y);
}