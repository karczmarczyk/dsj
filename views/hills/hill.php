<?php
/* Laduję skrypty skoczni */
$className = 'app\assets\ski\SkiHill'.$hill->id.'Asset';
$className::register($this);
?>

<div class="panel-top">
    <div style="float: right"></div>
    <div id="distance" style="float:left">0</div>
    <span style="margin-left: 150px" class="best_distance">0</span>
    <span style="margin-left:10px; color: red" class="best_user"></span>
    <!--<button style="float:right" id="reset">Dalej</button>-->
</div>
<div id="wind-panel">
    <img id="wind_img" src="/images/ski/wind.png" alt="wiatr"/>
    <div id="wind_power"> <span id="wind-power-value">0.0</span> m/s</div>
</div>
<div style="clear:both"></div>
<div id="container" class='noselect' style="background-image: url('/images/ski/hill_<?=$hill->id?>/bg.jpg');">
    <div id="map-time" class="map-time"></div>
    <canvas id="skocznia" width="4000" height="1500"></canvas>
    <div id="skoczek">
        <img id="skoczek_img" src="/images/ski/jumper/jumper_1.png" alt="skoczek"/>
    </div>
    <img id="crash_img" src="/images/ski/crash.png" alt="crash"/>
    <div id="cien_skoczka"></div>
    <div id="punkt-ladowania"></div>
    <div id="punkt-ladowania-rekord"><div class="best_point best_distance"></div></div>
</div>
<script>
    $(document).ready(function(){
        Hill_<?=$hill->id?>.prototype = new SkiEngine;
        Ski = new Hill_<?=$hill->id?>();
        Ski.iniWind();
        Ski.listenMousePosition();
        var p = [0,0];
        s = Ski.rysujSkocznie(p[0],p[1]);
        p = Ski.rysujZeskok(s[0],s[1]);
        Ski.rysujPlaskie(p[0],p[1]);
        Ski.ustawRekord (<?=$hill->getHillRecord()->distance?>,<?=$hill->getHillRecord()->distance_y?>);
        Ski.ustawRekordziste('<?=\app\modules\user\models\User::findIdentity($hill->getHillRecord()->user_id)->getDisplayName()?>');
        Ski.ustawMojeImie('<?=Yii::$app->user->displayName?>');
        $('#skocznia').click(function () {
            if (!Ski.odNowa()) {
                Ski.laduj();
                Ski.odbicie();
                Ski.start();
            }
        });
        $('#reset').click(function(){
            Ski.odNowa();
        });


    });
</script>
<div style="display: none" id="cache-container">
    <img src="/images/ski/jumper/jumper_1.png" alt="skoczek"/>
    <img src="/images/ski/jumper/jumper_2.png" alt="skoczek"/>
    <img src="/images/ski/jumper/jumper_3.png" alt="skoczek"/>
    <img src="/images/ski/jumper/jumper_4.png" alt="skoczek"/>
    <img src="/images/ski/jumper/jumper_5.png" alt="skoczek"/>
    <img src="/images/skiimages/jumper/jumper_1.png" alt="skoczek"/>/jumper/jumper_6.png" alt="skoczek"/>
    <img src="/images/ski/jumper/jumper_7.png" alt="skoczek"/>
</div>