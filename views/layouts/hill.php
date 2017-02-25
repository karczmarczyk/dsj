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
    
    /* ładuję skrypty PreloaderSaveAsset */
    use app\assets\PreloaderSaveAsset;
    PreloaderSaveAsset::register($this);
?>

<div oncontextmenu="return false" id="ski-container">
<?=$content?>
    <div id="preloader-save">
        <div class="back"></div>
        <div class="label">
            <img src="/images/preloader-save.gif" alt="zapisywaie..." /> <br/>
            <span id="preloader-save-text">Zapisywanie skoku..</span>
        </div>
    </div>
</div>

<?php $this->endContent(); ?>