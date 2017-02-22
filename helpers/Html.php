<?php
namespace app\helpers;

/**
 * Description of Html
 *
 * @author mateusz
 */
class Html extends \yii\helpers\Html
{
	public static function errorSummary($models, $options = array()) {
		$newOptions = [
			'class' => 'alert alert-danger'
		];
		$options = array_merge($options, $newOptions);
		$html = parent::errorSummary($models, $options);
		return $html;
	}
}

?>
