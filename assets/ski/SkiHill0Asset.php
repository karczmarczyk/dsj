<?php
namespace app\assets\ski;

use yii\web\AssetBundle;
use yii\web\View;
use Yii;

class SkiHill0Asset extends AssetBundle
{
    /* http://gromo.github.io/jquery.scrollbar/ */
    public $sourcePath = '@app/assets/ski/scripts/hill_0/';
    public $js = [
        'hill.js',
    ];
//    public $css = [
//        'main.css',
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