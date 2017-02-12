<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "hills".
 *
 * @property integer $id
 * @property string $title
 * @property string $description
 * @property string $class
 */
class Hills extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'hills';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title', 'description', 'class'], 'string'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Title',
            'description' => 'Description',
            'class' => 'Class',
        ];
    }
}
