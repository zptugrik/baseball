function CMenu(){
    var _oBg;
    var _oLogo;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oButInfo;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosInfo;
    var _pStartPosFullscreen;
    
    this._init = function(){
        s_bAudioActive = JSON.parse(typeof(localStorage.isMuted) === 'undefined' ? true : localStorage.isMuted);
        if(!s_bAudioActive){
            Howler.mute(!s_bAudioActive);
        }
        setVolume("soundtrack", 1);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
        
        _oLogo = createBitmap(s_oSpriteLibrary.getSprite('logo_menu'));
        _oLogo.x = 140;
        _oLogo.y = 20;
        s_oStage.addChild(_oLogo);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -225,oSprite);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
     
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
    var oSpriteFalgGb = s_oSpriteLibrary.getSprite('but_flag_gb');
        _oButFalgGb = new CGfxButton(0, 0, oSpriteFalgGb, s_oStage);
        _oButFalgGb.setScale(0.45);
        _oButFalgGb.setPosition(748, 200);
        _oButFalgGb.addEventListener(ON_MOUSE_UP, this._onFlagPressed, {lang: 'en'});

    var oSpriteFalgUa = s_oSpriteLibrary.getSprite('but_flag_ua');
        _oButFalgUa = new CGfxButton(0, 0, oSpriteFalgUa, s_oStage);
        _oButFalgUa.setScale(0.45);
        _oButFalgUa.setPosition(748, 275);
        _oButFalgUa.addEventListener(ON_MOUSE_UP, this._onFlagPressed, {lang: 'ua'});

	var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosInfo = {x: (oSprite.height/2) + 10, y: (oSprite.height/2) + 10}; 
        _oButInfo = new CGfxButton(_pStartPosInfo.x,_pStartPosInfo.y,oSprite,s_oStage);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onCredits, this);
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosInfo.x + oSprite.width/2 + 10,y:_pStartPosInfo.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButPlay = null;
        _oFade.visible = false;
		_oButInfo.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        s_oStage.removeAllChildren();
        s_oMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
	_oButInfo.setPosition(_pStartPosInfo.x + iNewX,iNewY + _pStartPosInfo.y);
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
        localStorage.setItem('isMuted', s_bAudioActive);
    };
	
    this._onCredits = function(){
        new CCreditsPanel();
    };

    this._onFlagPressed = function(){
        localStorage.setItem('lang', this.lang)
    }
    
    this._onButPlayRelease = function(){
        this.unload();
        
        $(s_oMain).trigger("start_session");
        s_oMain.gotoGame();
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };

    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;