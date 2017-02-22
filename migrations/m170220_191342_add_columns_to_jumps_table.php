<?php

use yii\db\Migration;

class m170220_191342_add_columns_to_jumps_table extends Migration
{
    public function up()
    {
        $this->addColumn('jumps', 'distance_y', $this->float());
        $this->addColumn('jumps', 'iter', $this->float());
    }

    public function down()
    {
        $this->dropColumn('jumps', 'distance_y');
        $this->dropColumn('jumps', 'iter');
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
