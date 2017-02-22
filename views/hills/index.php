<ul>
    <?php foreach ($hills as $hill): ?>
    <li><?=  \yii\helpers\Html::a($hill->title, ['hills/hill','id'=>$hill->id])?>; 
        <b>Rekord:</b> <?=round($hill->getHillRecord()->distance,2)?>;
        <?=  \app\modules\user\models\User::findIdentity($hill->getHillRecord()->user_id)->getDisplayName()?>
    </li>
    <?php endforeach; ?>
</ul>