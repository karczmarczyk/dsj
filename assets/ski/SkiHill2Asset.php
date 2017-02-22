<?php
namespace app\assets\ski;

use yii\web\AssetBundle;
use yii\web\View;
use Yii;

class SkiHill2Asset extends \app\assets\PackerAssetBundle
{
    /* http://gromo.github.io/jquery.scrollbar/ */
    public $sourcePath = '@app/assets/ski/scripts/hill_2/';
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