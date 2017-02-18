<?php
namespace app\assets;

use yii\web\AssetBundle;
use yii\web\View;
use Yii;

class JqueryAsset extends AssetBundle
{
    /* http://gromo.github.io/jquery.scrollbar/ */
    public $sourcePath = '@app/assets/scripts/jquery/';
    public $js = [
        'jquery.js',
    ];
//    public $css = [
//        'jquery.scrollbar.css',
//    ];
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