<?php
namespace app\assets\ski;

use yii\web\View;
use Yii;

class SkiEngineAsset extends \app\assets\PackerAssetBundle
{
    /* http://gromo.github.io/jquery.scrollbar/ */
    public $sourcePath = '@app/assets/ski/scripts/ski_engine/';
    public $js = [
        'ski.js',
    ];
    public $css = [
        'main.css',
        /* @todo: map-time */
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
    public $jsOptions = [
        'position' => View::POS_HEAD,
    ];
    
    public function init()
    {
        parent::init();
        $this->publishOptions['forceCopy'] = Yii::$app->params['assetsForceCopy'];
    }
}