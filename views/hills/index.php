<ul>
    <?php foreach ($hills as $hill): ?>
    <li><?=  \yii\helpers\Html::a($hill->title, ['hills/hill','id'=>$hill->id])?></li>
    <?php endforeach; ?>
</ul>