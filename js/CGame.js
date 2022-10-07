function CGame(oData){
    
    var _bFrozen = false; // true while a tween is running
    var _b2Players; // if false AI plays. AI (if plays) is always player 2.
    var _iMatrixSize;
    var _iActivePlayer = 1; // 1 or 2; 0 if draw at endgame.
    var _iTurnsPlayed = 0;
    var _iBusyWinningCells = 0;

    var _aWinningCells = [];
    var _aCellStates = []; // Matrix that records cell states
    var _oMatrix = []; // Matrix that contains CCell obj instances
    var _oEndPanel;
    var _oInterface;
    
    this._init = function(oData){
        _b2Players = oData.b2Players;
        _iMatrixSize = oData.iMatrixSize;

        _oInterface = new CInterface(_iMatrixSize);

        this.initMatrix();
        this._initWinCellsArray();
        
        $(s_oMain).trigger("start_level");
    };

    this.unload = function(){
        for (var y = 0; y < _iMatrixSize; y++) {
            for (var x = 0; x < _iMatrixSize; x++) {
                _oMatrix[y][x].unload();
            };
        };

        _oInterface.unload();
        s_oMain.gotoMenu();
    };

    this.initMatrix = function(){
        for (var y = 0; y < _iMatrixSize; y++) {
            _oMatrix[y] = [];
            _aCellStates[y] = [];
            for (var x = 0; x < _iMatrixSize; x++) {
                var iX;
                var iY;
                var fScaling;
                var iXOffset;
                var iYOffset = MATRIX_YOFFSET;

                if (_iMatrixSize === 3) {fScaling = CELL_SCALING_3x3;} 
                else if (_iMatrixSize === 5) {fScaling = CELL_SCALING_5x5;}
                else if (_iMatrixSize === 7) {fScaling = CELL_SCALING_7x7;};

                iX = x*(CELL_SIZE + CELL_PADDING)*fScaling;
                iY = Y_START_GRID + (y*(CELL_SIZE + CELL_PADDING)*fScaling);

                iXOffset = (CANVAS_WIDTH - (CELL_SIZE*fScaling*_iMatrixSize))/2 - 30*fScaling;

                iX += iXOffset;
                iY += iYOffset;
                
                _oMatrix[y][x] = new CCell(iX ,iY ,fScaling,x,y);
                _aCellStates[y][x] = 0;
            };
        };
    };

    this._initWinCellsArray = function(){
        if (_iMatrixSize === 3) {
            for (var i = 0; i < 3; i++) {
                _aWinningCells[i] = {x:0,y:0};
            };
        } else {
            for (var i = 0; i < 4; i++) {
                _aWinningCells[i] = {x:0,y:0};
            };
        };
    };

    this.getActivePlayer = function(){
        return _iActivePlayer;
    };

    this.updateGameStatus = function(x,y){
        if (!_bFrozen) {
            _aCellStates[y][x] = _iActivePlayer;
            _iTurnsPlayed++;

            if (_iMatrixSize === 3) {
                if (_iTurnsPlayed >= 5) {
                    this.checkTris();
                } else {
                    this._switchPlayer();
                };
            };
            if (_iMatrixSize === 5 || _iMatrixSize === 7) {
                if (_iTurnsPlayed >= 7) {
                    this.checkQuad();
                } else {
                    this._switchPlayer();
                };
            };

            _oInterface.update();
        };
    };

    this._switchPlayer = function(){
        if (_iActivePlayer === 1) {

            if (_b2Players === true) {
                _iActivePlayer = 2;
            } else {
                _iActivePlayer = 2;
                this._AINext();
            };
            
        } else {
            _iActivePlayer = 1;
        };
    };

    // to be used by AI
    // returns the coords of the missing cell for a tris
    this._checkWinningCouples = function(iToken){
        var oCell = {x:undefined,y:undefined};

        for (var y = 0; y < _iMatrixSize; y++) {
            for (var x = 0; x < _iMatrixSize; x++) {

                //
                // XXempty    
                if (_aCellStates[y][x] === iToken) {
                    // check vert
                    if (y <= _iMatrixSize - 3) {
                        if (_aCellStates[y][x] === _aCellStates[y+1][x] && 0 === _aCellStates[y+2][x]) {
                            oCell.x = x;
                            oCell.y = y + 2;
                            return oCell;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 3) {
                        if (_aCellStates[y][x] === _aCellStates[y][x+1] && 0 === _aCellStates[y][x+2]) {
                            oCell.x = x + 2;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {
                        if (_aCellStates[y][x] === _aCellStates[y+1][x+1] && 0 === _aCellStates[y+2][x+2]) {
                            oCell.x = x + 2;
                            oCell.y = y + 2;
                            return oCell;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {                 
                    if (_aCellStates[y+2][x] === iToken) {
                        if (_aCellStates[y+2][x] === _aCellStates[y+1][x+1] && 0 === _aCellStates[y][x+2]) {
                            oCell.x = x + 2;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                };

                //
                // emptyXX
                if (_aCellStates[y][x] === 0) {
                    // check vert
                    if (y <= _iMatrixSize - 3) {
                        if (iToken === _aCellStates[y+1][x] && iToken === _aCellStates[y+2][x]) {
                            oCell.x = x;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 3) {
                        if (iToken === _aCellStates[y][x+1] && iToken === _aCellStates[y][x+2]) {
                            oCell.x = x;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {
                        if (iToken === _aCellStates[y+1][x+1] && iToken === _aCellStates[y+2][x+2]) {
                            oCell.x = x;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {                 
                    if (_aCellStates[y+2][x] === 0) {
                        if (iToken === _aCellStates[y+1][x+1] && iToken === _aCellStates[y][x+2]) {
                            oCell.x = x;
                            oCell.y = y + 2;
                            return oCell;
                        };
                    };
                };

                //
                // XemptyX
                if (_aCellStates[y][x] === iToken) {
                    // check vert
                    if (y <= _iMatrixSize - 3) {
                        if (0 === _aCellStates[y+1][x] && iToken === _aCellStates[y+2][x]) {
                            oCell.x = x;
                            oCell.y = y + 1;
                            return oCell;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 3) {
                        if (0 === _aCellStates[y][x+1] && iToken === _aCellStates[y][x+2]) {
                            oCell.x = x + 1;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {
                        if (0 === _aCellStates[y+1][x+1] && iToken === _aCellStates[y+2][x+2]) {
                            oCell.x = x + 1;
                            oCell.y = y + 1;
                            return oCell;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {                 
                    if (_aCellStates[y+2][x] === iToken) {
                        if (0 === _aCellStates[y+1][x+1] && iToken === _aCellStates[y][x+2]) {
                            oCell.x = x + 1;
                            oCell.y = y + 1;
                            return oCell;
                        };
                    };
                };

                // End checks
            };
        };

        // No winning couples found -- end nested for
        return oCell;
    };

    // to be used by AI
    // returns the coords of the missing cell for a quad
    this._checkWinningTriples = function(iToken){
        var oCell = {x:undefined,y:undefined};

        for (var y = 0; y < _iMatrixSize; y++) {
            for (var x = 0; x < _iMatrixSize; x++) {

                //
                // XXXempty    
                if (_aCellStates[y][x] === iToken) {
                    // check vert
                    if (y <= _iMatrixSize - 4) {
                        if (_aCellStates[y][x] === _aCellStates[y+1][x] &&
                            _aCellStates[y][x] === _aCellStates[y+2][x] && 
                            0 === _aCellStates[y+3][x]) {
                            oCell.x = x;
                            oCell.y = y + 3;
                            return oCell;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 4) {
                        if (_aCellStates[y][x] === _aCellStates[y][x+1] &&
                            _aCellStates[y][x] === _aCellStates[y][x+2] &&
                            0 === _aCellStates[y][x+3]) {
                            oCell.x = x + 3;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 4 && y <= _iMatrixSize - 4) {
                        if (_aCellStates[y][x] === _aCellStates[y+1][x+1] &&
                            _aCellStates[y][x] === _aCellStates[y+2][x+2] &&
                            0 === _aCellStates[y+3][x+3]) {
                            oCell.x = x + 3;
                            oCell.y = y + 3;
                            return oCell;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 4 && y <= _iMatrixSize - 4) {                 
                    if (_aCellStates[y+3][x] === iToken) {
                        if (_aCellStates[y+3][x] === _aCellStates[y+2][x+1] && 
                            _aCellStates[y+3][x] === _aCellStates[y+1][x+2] &&
                            0 === _aCellStates[y][x+3]) {
                            oCell.x = x + 3;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                };

                //
                // emptyXXX
                if (_aCellStates[y][x] === 0) {
                    // check vert
                    if (y <= _iMatrixSize - 4) {
                        if (iToken === _aCellStates[y+1][x] && 
                            iToken === _aCellStates[y+2][x] &&
                            iToken === _aCellStates[y+3][x]) {
                            oCell.x = x;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 4) {
                        if (iToken === _aCellStates[y][x+1] && 
                            iToken === _aCellStates[y][x+2] &&
                            iToken === _aCellStates[y][x+3]) {
                            oCell.x = x;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 4 && y <= _iMatrixSize - 4) {
                        if (iToken === _aCellStates[y+1][x+1] && 
                            iToken === _aCellStates[y+2][x+2] &&
                            iToken === _aCellStates[y+3][x+3]) {
                            oCell.x = x;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 4 && y <= _iMatrixSize - 4) {                 
                    if (_aCellStates[y+3][x] === 0) {
                        if (iToken === _aCellStates[y+2][x+1] && 
                            iToken === _aCellStates[y+1][x+2] &&
                            iToken === _aCellStates[y][x+3]) {
                            oCell.x = x;
                            oCell.y = y + 3;
                            return oCell;
                        };
                    };
                };

                //
                // XemptyXX
                if (_aCellStates[y][x] === iToken) {
                    // check vert
                    if (y <= _iMatrixSize - 4) {
                        if (0 === _aCellStates[y+1][x] && 
                            iToken === _aCellStates[y+2][x] &&
                            iToken === _aCellStates[y+3][x]) {
                            oCell.x = x;
                            oCell.y = y + 1;
                            return oCell;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 4) {
                        if (0 === _aCellStates[y][x+1] && 
                            iToken === _aCellStates[y][x+2] &&
                            iToken === _aCellStates[y][x+3]) {
                            oCell.x = x + 1;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 4 && y <= _iMatrixSize - 4) {
                        if (0 === _aCellStates[y+1][x+1] && 
                            iToken === _aCellStates[y+2][x+2] &&
                            iToken === _aCellStates[y+3][x+3]) {
                            oCell.x = x + 1;
                            oCell.y = y + 1;
                            return oCell;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 4 && y <= _iMatrixSize - 4) {                 
                    if (_aCellStates[y+3][x] === iToken) {
                        if (0 === _aCellStates[y+2][x+1] &&
                            iToken === _aCellStates[y+1][x+2] &&
                            iToken === _aCellStates[y][x+3]) {
                            oCell.x = x + 1;
                            oCell.y = y + 2;
                            return oCell;
                        };
                    };
                };

                // End checks
            };
        };

        // No winning triples found -- end nested for
        return oCell;
    };

    // to be used by AI
    this._checkForks = function(){
        var oCell = {x:undefined,y:undefined};

        for (var y = 0; y < _iMatrixSize; y++) {
            for (var x = 0; x < _iMatrixSize; x++) {
                // SE forks
                if (y <= _iMatrixSize -3 && x <= _iMatrixSize -3 &&
                    _aCellStates[y+2][x] === 2 && _aCellStates[y][x+2] === 2 &&
                    _aCellStates[y+1][x] === 0 && _aCellStates[y][x+1] === 0) {
                    oCell.x = x;
                    oCell.y = y;
                    return oCell;
                };
                // NE forks
                if (y >= 2 && x <= _iMatrixSize -3 &&
                    _aCellStates[y-2][x] === 2 && _aCellStates[y][x+2] === 2 &&
                    _aCellStates[y-1][x] === 0 && _aCellStates[y][x+1] === 0) {
                    oCell.x = x;
                    oCell.y = y;
                    return oCell;
                };
                // NW forks
                if (y >= 2 && x >= 2 &&
                    _aCellStates[y-2][x] === 2 && _aCellStates[y][x-2] === 2 &&
                    _aCellStates[y-1][x] === 0 && _aCellStates[y][x-1] === 0) {
                    oCell.x = x;
                    oCell.y = y;
                    return oCell;
                };
                // SW forks
                if (y <= _iMatrixSize -3 && x >= 2 &&
                    _aCellStates[y+2][x] === 2 && _aCellStates[y][x-2] === 2 &&
                    _aCellStates[y+1][x] === 0 && _aCellStates[y][x-1] === 0) {
                    oCell.x = x;
                    oCell.y = y;
                    return oCell;
                };
            };
        };

        // no potential forks found
        return oCell;
    };

    // to be used by AI
    // if possible plays a couple
    this._checkWinningSingletons = function(iToken){
        var oCell = {x:undefined,y:undefined};

        for (var y = 0; y < _iMatrixSize; y++) {
            for (var x = 0; x < _iMatrixSize; x++) {

                //
                // Xempty    
                if (_aCellStates[y][x] === iToken) {
                    // check vert
                    if (y <= _iMatrixSize - 3) {
                        if (0 === _aCellStates[y+1][x]) {
                            oCell.x = x;
                            oCell.y = y + 1;
                            return oCell;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 3) {
                        if (0 === _aCellStates[y][x+1]) {
                            oCell.x = x + 1;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {
                        if (0 === _aCellStates[y+1][x+1]) {
                            oCell.x = x + 1;
                            oCell.y = y + 1;
                            return oCell;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {                 
                    if (_aCellStates[y+1][x] === iToken) {
                        if (0 === _aCellStates[y][x+1]) {
                            oCell.x = x + 1;
                            oCell.y = y;
                            return oCell;
                        };
                    };
                };

                // End checks
            };
        };

        // No winning couples found -- end nested for
        return oCell;
    };

    this.checkTris = function(){
        for (var y = 0; y < _iMatrixSize; y++) {
            for (var x = 0; x < _iMatrixSize; x++) {
                if (_aCellStates[y][x] !== 0) {
                    // check vert
                    if (y <= _iMatrixSize - 3) {
                        if (_aCellStates[y][x] === _aCellStates[y+1][x] && _aCellStates[y][x] === _aCellStates[y+2][x]) {
                            
                            _aWinningCells[0].x = x; _aWinningCells[0].y = y;
                            _aWinningCells[1].x = x; _aWinningCells[1].y = y + 1;
                            _aWinningCells[2].x = x; _aWinningCells[2].y = y + 2;

                            this.endGame();
                            return;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 3) {
                        if (_aCellStates[y][x] === _aCellStates[y][x+1] && _aCellStates[y][x] === _aCellStates[y][x+2]) {
                            
                            _aWinningCells[0].x = x; _aWinningCells[0].y = y;
                            _aWinningCells[1].x = x + 1; _aWinningCells[1].y = y;
                            _aWinningCells[2].x = x + 2; _aWinningCells[2].y = y;

                            this.endGame();
                            return;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {
                        if (_aCellStates[y][x] === _aCellStates[y+1][x+1] && _aCellStates[y][x] === _aCellStates[y+2][x+2]) {
                            
                            _aWinningCells[0].x = x; _aWinningCells[0].y = y;
                            _aWinningCells[1].x = x + 1; _aWinningCells[1].y = y + 1;
                            _aWinningCells[2].x = x + 2; _aWinningCells[2].y = y + 2;

                            this.endGame();
                            return;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 3 && y <= _iMatrixSize - 3) {                 
                    if (_aCellStates[y+2][x] !== 0) {
                        if (_aCellStates[y+2][x] === _aCellStates[y+1][x+1] && _aCellStates[y+2][x] === _aCellStates[y][x+2]) {
                            
                            _aWinningCells[0].x = x; _aWinningCells[0].y = y + 2;
                            _aWinningCells[1].x = x + 1; _aWinningCells[1].y = y + 1;
                            _aWinningCells[2].x = x + 2; _aWinningCells[2].y = y;

                            this.endGame();
                            return;
                        };
                    };
                };
            };
        };
        if (_iTurnsPlayed === _iMatrixSize*_iMatrixSize) {
            _iActivePlayer = 0; // draw
            this.showEndPanel();
        };

        // if no tris found:
        this._switchPlayer();
    };

    this.checkQuad = function(){
        for (var y = 0; y < _iMatrixSize; y++) {
            for (var x = 0; x < _iMatrixSize; x++) {
                if (_aCellStates[y][x] !== 0) {
                    // check vert
                    if (y <= _iMatrixSize - 4) {
                        if (_aCellStates[y][x] === _aCellStates[y+1][x] &&
                            _aCellStates[y][x] === _aCellStates[y+2][x] &&
                            _aCellStates[y][x] === _aCellStates[y+3][x]) {

                            _aWinningCells[0].x = x; _aWinningCells[0].y = y;
                            _aWinningCells[1].x = x; _aWinningCells[1].y = y + 1;
                            _aWinningCells[2].x = x; _aWinningCells[2].y = y + 2;
                            _aWinningCells[3].x = x; _aWinningCells[3].y = y + 3;                            

                            this.endGame();
                            return;
                        };
                    };
                    // check horiz
                    if (x <= _iMatrixSize - 4) {
                        if (_aCellStates[y][x] === _aCellStates[y][x+1] &&
                            _aCellStates[y][x] === _aCellStates[y][x+2] &&
                            _aCellStates[y][x] === _aCellStates[y][x+3]) {

                            _aWinningCells[0].x = x; _aWinningCells[0].y = y;
                            _aWinningCells[1].x = x + 1; _aWinningCells[1].y = y;
                            _aWinningCells[2].x = x + 2; _aWinningCells[2].y = y;
                            _aWinningCells[3].x = x + 3; _aWinningCells[3].y = y;

                            this.endGame();
                            return;
                        };
                    };
                    // check SE
                    if (x <= _iMatrixSize - 4 && y <= _iMatrixSize - 4) {
                        if (_aCellStates[y][x] === _aCellStates[y+1][x+1] &&
                            _aCellStates[y][x] === _aCellStates[y+2][x+2] &&
                            _aCellStates[y][x] === _aCellStates[y+3][x+3]) {

                            _aWinningCells[0].x = x; _aWinningCells[0].y = y;
                            _aWinningCells[1].x = x + 1; _aWinningCells[1].y = y + 1;
                            _aWinningCells[2].x = x + 2; _aWinningCells[2].y = y + 2;
                            _aWinningCells[3].x = x + 3; _aWinningCells[3].y = y + 3;

                            this.endGame();
                            return;
                        };
                    };
                };
                // check NE
                if (x <= _iMatrixSize - 4 && y <= _iMatrixSize - 4) {                 
                    if (_aCellStates[y+3][x] !== 0) {
                        if (_aCellStates[y+3][x] === _aCellStates[y+2][x+1] &&
                            _aCellStates[y+3][x] === _aCellStates[y+1][x+2] &&
                            _aCellStates[y+3][x] === _aCellStates[y][x+3]) {

                            _aWinningCells[0].x = x; _aWinningCells[0].y = y + 3;
                            _aWinningCells[1].x = x + 1; _aWinningCells[1].y = y + 2;
                            _aWinningCells[2].x = x + 2; _aWinningCells[2].y = y + 1;
                            _aWinningCells[3].x = x + 3; _aWinningCells[3].y = y;

                            this.endGame();
                            return;
                        };
                    };
                };
            };
        };
        if (_iTurnsPlayed === _iMatrixSize*_iMatrixSize) {
            _iActivePlayer = 0; // draw
            this.showEndPanel();
        };

        // if no quad found:
        this._switchPlayer();
    };

    this._AINext = function(){
        var oAINext = {};

        if (_iMatrixSize === 3) {
            oAINext = this._checkWinningCouples(2);
            if (oAINext.x === undefined) {
                oAINext = this._checkWinningCouples(1);
                if (oAINext.x === undefined) {
                    oAINext = this._checkForks();
                };
            };
        };

        if (_iMatrixSize === 5 || _iMatrixSize === 7) {
            oAINext = this._checkWinningTriples(2);
            if(oAINext.x === undefined) {           
                
                oAINext = this._checkWinningTriples(1);
                if (oAINext.x === undefined) {
                    
                    oAINext = this._checkWinningCouples(2);
                    if (oAINext.x === undefined) {
                        oAINext = this._checkWinningCouples(1);
                        if (oAINext.x === undefined) {
                            oAINext = this._checkWinningSingletons(2);
                        };
                    };
                };
            };
        };

        if (oAINext.x === undefined) {
            while(true){
                var iAIx = Math.floor(Math.random()*(_iMatrixSize));
                var iAIy = Math.floor(Math.random()*(_iMatrixSize));
                if (_aCellStates[iAIy][iAIx] === 0) {
                    oAINext.x = iAIx;
                    oAINext.y = iAIy;
                    break;
                };
            };
        };

        _oMatrix[oAINext.y][oAINext.x].AIMove();
    };

    this.endGame = function(){
        for (var i = 0; i < _aWinningCells.length; i++) {
            _oMatrix[_aWinningCells[i].y][_aWinningCells[i].x].EndAnim();
            _iBusyWinningCells ++;
        };   
    };

    this.showEndPanel = function(){
        // _iBusyWinningCells > 1 when there is a winning tris or quad
        // _iBusyWinningCells = 1 when last cell complete its animation
        // _iActivePlayer = 0 when it's a draw

        if (_iBusyWinningCells > 1) {
            _iBusyWinningCells--;
        } else if (_iBusyWinningCells === 1 || _iActivePlayer === 0) {
            _oEndPanel = new CEndPanel(_iActivePlayer);
            if(_b2Players){
                    if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                            createjs.Sound.play("win");
                    }
            }else{
                    if(_iActivePlayer === 0){
                            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                                    createjs.Sound.play("draw");
                            }
                    }else if(_iActivePlayer === 1){
                            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                                    createjs.Sound.play("win");
                            }
                    }else{
                            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                                    createjs.Sound.play("gameover");
                            }
                    }
            }
            
            $(s_oMain).trigger("end_level");
        };
    };

    this.onExit = function(){
        this.unload();
        $(s_oMain).trigger("end_level");
        $(s_oMain).trigger("end_session");
        
        s_oMain.gotoMenu();
    };

    // flow control methods
	this.isFrozen = function(){
		return _bFrozen;
	};

	this.freeze = function(){
		_bFrozen = true;
	};

	this.unFreeze = function(){
		_bFrozen = false;
	};
    // end flow control methods
    
    s_oGame = this;
	
    this._init(oData);
}

var s_oGame;