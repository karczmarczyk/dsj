<?php $this->beginContent('@app/views/layouts/main.php'); ?>

<?php
    /* ładuję skrypty JQuery */
    use app\assets\JqueryAsset;
    JqueryAsset::register($this);
    /* ładuję skrypty JQueryUI */
    use app\assets\JqueryUIAsset;
    JqueryUIAsset::register($this);
    
    /* ładuję skrypty SkiEngine */
    use app\assets\ski\SkiEngineAsset;
    SkiEngineAsset::register($this);
?>

<div oncontextmenu="return false" id="ski-container">
<?=$content?>
</div>

<?php $this->endContent(); ?>