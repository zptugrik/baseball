function CCreditsPanel() {

  var _oBg;
  var _oButExit;
  var _oMsgText;

  var _oFade;
  var _oHitArea;

  var _oLink;
  var _oContainer;

  var _oListener;
  var _pStartPosExit;

  this._init = function () {

    _oContainer = new createjs.Container();
    s_oStage.addChild(_oContainer);

    var oBgMenu = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
    _oContainer.addChild(oBgMenu);

    _oFade = new createjs.Shape();
    _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oContainer.addChild(_oFade);

    var oSprite = s_oSpriteLibrary.getSprite('msg_box');
    _oBg = createBitmap(oSprite);
    _oBg.x = CANVAS_WIDTH / 2;
    _oBg.y = CANVAS_HEIGHT / 2;
    _oBg.regX = oSprite.width / 2;
    _oBg.regY = oSprite.height / 2;
    _oContainer.addChild(_oBg);

    _oHitArea = new createjs.Shape();
    _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    _oHitArea.alpha = 0.01;
    _oContainer.addChild(_oHitArea);

    var oSprite = s_oSpriteLibrary.getSprite('but_exit');
    _pStartPosExit = {
      x: CANVAS_WIDTH / 2 + 204,
      y: 264
    };
    _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
    _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
    
    _oMsgText = new createjs.Text(this.getTranslation('TEXT_CREDITS_DEVELOPED'), "26px Arial", "#ffffff");
    _oMsgText.x = CANVAS_WIDTH / 2;
    _oMsgText.y = 410;
    _oMsgText.textAlign = "center";
    _oContainer.addChild(_oMsgText);
  };

  this.getTranslation = function(string){
    var sLang = typeof(localStorage.lang) === 'undefined' ? 'en' : localStorage.lang;
    return DICTIONARY[sLang][string];
  }

  this.unload = function () {
    _oHitArea.off("click", _oListener);

    _oButExit.unload();
    _oButExit = null;

    s_oStage.removeChild(_oContainer);
  };



  this._init();


};