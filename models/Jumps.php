<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "jumps".
 *
 * @property integer $id
 * @property integer $hill_id
 * @property integer $user_id
 * @property integer $land
 * @property integer $type
 * @property double $distance
 * @property string $date_created
 * @property double $distance_y
 * @property double $iter
 */
class Jumps extends \app\models\AppModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'jumps';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['hill_id', 'user_id', 'land', 'type'], 'integer'],
            [['distance', 'distance_y', 'iter'], 'number'],
            [['date_created'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'hill_id' => 'Hill ID',
            'user_id' => 'User ID',
            'land' => 'Land',
            'type' => 'Type',
            'distance' => 'Distance',
            'date_created' => 'Date Created',
            'distance_y' => 'Distance Y',
            'iter' => 'Iter',
        ];
    }
}
