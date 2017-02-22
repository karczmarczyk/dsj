<?php
namespace app\assets;

use yii\web\AssetBundle;
use yii\web\View;
use Yii;

class JqueryUIAsset extends AssetBundle
{
    /* http://gromo.github.io/jquery.scrollbar/ */
    public $sourcePath = '@app/assets/scripts/jquery-ui-1.12.1/';
    public $js = [
        'jquery-ui.min.js',
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