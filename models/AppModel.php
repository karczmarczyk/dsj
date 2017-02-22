<?php
namespace app\models;

use \Yii;
/**
 * Description of AppModel
 *
 * @author mateusz
 */
class AppModel extends \yii\db\ActiveRecord
{
	
	public function beforeValidate() 
	{
		$this->setDefaultValues();
		return parent::beforeValidate();
	}
	
	public function setDefaultValues () 
	{
		/* Dane dotyczące utworzenia */
		if ($this->isNewRecord) {
			if (!Yii::$app->user->isGuest && $this->hasAttribute('created_by')) {
				$this->created_by = Yii::$app->user->identity->id;
			}
			if ($this->hasAttribute('date_created')) {
				$this->date_created = \app\helpers\DateTime::now();
			}
		}
		/* Dane dotyczące ostatniej modyfikacji */
		if (!Yii::$app->user->isGuest && $this->hasAttribute('modified_by')) {
			$this->modified_by = Yii::$app->user->identity->id;
		}
		if ($this->hasAttribute('date_modified')) {
			$this->date_modified = \app\helpers\DateTime::now();
		}
	}
	
}

?>
