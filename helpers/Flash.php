<?php
namespace app\helpers;

use Yii;

/**
 * Description of Flash
 *
 * @author mateusz
 */
class Flash {
	
	const TYPE_ERROR = 'danger';
	const TYPE_SUCCESS = 'success';
	const TYPE_INFO = 'info';
	const TYPE_WARNING = 'warning';
	const TYPE_UNDISPLAYERROR = 'undisplayerror';
	
	public static function setError($message) {
		self::setFlash(static::TYPE_ERROR, $message);
	}
	
	public static function setInfo($message) {
		self::setFlash(static::TYPE_INFO, $message);
	}
	
	public static function setSuccess($message) {
		self::setFlash(static::TYPE_SUCCESS, $message);
	}
	
	public static function setWarning($message) {
		self::setFlash(static::TYPE_WARNING, $message);
	}
	
	public static function setUndisplayError($message) {
		self::setFlash(static::TYPE_UNDISPLAYERROR, $message);
	}
	
	public static function setFlash($type, $message) {
		Yii::$app->session->setFlash($type,$message);
	}
	
	public static function getAll() {
		foreach (Yii::$app->session->getAllFlashes() as $key => $message) {
			if ($key==self::TYPE_UNDISPLAYERROR) {
				continue;
			}
			echo '<div class="alert alert-' . $key . '">' . $message . ''; 
		}
	}
}

?>