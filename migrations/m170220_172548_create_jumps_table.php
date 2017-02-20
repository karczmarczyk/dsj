<?php

use yii\db\Migration;

/**
 * Handles the creation of table `jumps`.
 */
class m170220_172548_create_jumps_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('jumps', [
            'id' => $this->primaryKey(),
            'hill_id' => $this->integer(),
            'user_id' => $this->integer(),
            'land' => $this->integer()->comment("czy wylądował"),
            'type' => $this->integer()->comment("0 - trening, 1 - konkurs"),
            'distance' => $this->float(),
            'date_created' => $this->dateTime(),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('jumps');
    }
}
