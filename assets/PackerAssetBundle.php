<?php
namespace app\assets;

use yii\helpers\ArrayHelper;
use yii\helpers\Url;

/**
 * Description of PackerAssetBundle
 *
 * @author mateusz
 */
class PackerAssetBundle extends \yii\web\AssetBundle
{
    public function publish($am)
    {
        if ($this->sourcePath !== null && !isset($this->basePath, $this->baseUrl)) {
            list ($this->basePath, $this->baseUrl) = $am->publish($this->sourcePath, $this->publishOptions);
        }

        if (isset($this->basePath, $this->baseUrl) && ($converter = $am->getConverter()) !== null) {
            foreach ($this->js as $i => $js) {
                if (is_array($js)) {
                    $file = array_shift($js);
                    if (Url::isRelative($file)) {
                        $js = ArrayHelper::merge($this->jsOptions, $js);
                        array_unshift($js, $converter->convert($file, $this->basePath));
                        $this->js[$i] = $js;
                    }
                } elseif (Url::isRelative($js)) {
                    $js = $this->createPackerJsFile($js, $this->basePath);
                    $this->js[$i] = $converter->convert($js, $this->basePath);
                }
            }
            foreach ($this->css as $i => $css) {
                if (is_array($css)) {
                    $file = array_shift($css);
                    if (Url::isRelative($file)) {
                        $css = ArrayHelper::merge($this->cssOptions, $css);
                        array_unshift($css, $converter->convert($file, $this->basePath));
                        $this->css[$i] = $css;
                    }
                } elseif (Url::isRelative($css)) {
                    $this->css[$i] = $converter->convert($css, $this->basePath);
                }
            }
        }
    }
    
    /**
     * 
     * @param type $js
     * @return type
     */
    private function createPackerJsFile($js)
    {
        //return $js;
        $newJsName = str_replace('.js', '.hash.js', $js);
        $script = file_get_contents($this->sourcePath.DIRECTORY_SEPARATOR.$js);
        $packer = new \app\components\JavaScriptPacker($script, 62, false, false);
        $packed = $packer->pack();
        file_put_contents($this->sourcePath.DIRECTORY_SEPARATOR.$newJsName, $packed);
        return $newJsName;
    }
}
