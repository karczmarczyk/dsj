<?php

use yii\db\Migration;

/**
 * Handles the creation of table `hills`.
 */
class m170211_233232_create_hills_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('hills', [
            'id' => $this->primaryKey(),
            'title' => $this->text(),
            'description' => $this->text(),
            'class' => $this->text()
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('hills');
    }
}
