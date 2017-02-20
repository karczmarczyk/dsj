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
    
    /**
     * Zwraca rekord skoczni
     * @return \app\models\Jumps
     */
    public function getHillRecord()
    {
        $record = Jumps::find()
                ->where(['hill_id' => $this->id, 'land' => 1])
                ->orderBy(['distance' => SORT_DESC])
                ->one();
        if (!is_object($record)) {
            $record = new Jumps();
            $record->distance = 0;
            $record->distance_y = 0;
            $record->user_id = 0;
        }
        
        return $record;
    }
}
