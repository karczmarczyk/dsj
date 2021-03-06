<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use app\assets\AppAsset;
use app\assets\PreloaderAsset;

AppAsset::register($this);
PreloaderAsset::register($this);

?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
    <script type="text/javascript">
        var csrf = '<?=Yii::$app->request->getCsrfToken()?>';
    </script>
</head>
<body>
<?php $this->beginBody() ?>

<div class="wrap">
    <?php
    NavBar::begin([
        'brandLabel' => 'SKOKI',
        'brandUrl' => Yii::$app->homeUrl,
        'options' => [
            'class' => 'navbar-inverse navbar-fixed-top',
        ],
    ]);
    echo Nav::widget([
        'options' => ['class' => 'navbar-nav navbar-right'],
        'items' => [
//            ['label' => 'Home', 'url' => ['/site/index']],
//            ['label' => 'About', 'url' => ['/site/about']],
//            ['label' => 'Contact', 'url' => ['/site/contact']],
            ['label' => 'Skocznie', 'url' => ['/hills/index']],
//            ['label' => 'User', 'url' => ['/user']],
            ['label' => 'Profil', 'url' => ['/user/account'], 'visible' => !Yii::$app->user->isGuest],
            Yii::$app->user->isGuest ?
                ['label' => 'Login', 'url' => ['/user/login']] : // or ['/user/login-email']
                ['label' => 'Logout (' . Yii::$app->user->displayName . ')',
                    'url' => ['/user/logout'],
                    'linkOptions' => ['data-method' => 'post']],
//            Yii::$app->user->isGuest ? (
//                ['label' => 'Login', 'url' => ['/site/login']]
//            ) : (
//                '<li>'
//                . Html::beginForm(['/site/logout'], 'post')
//                . Html::submitButton(
//                    'Logout (' . Yii::$app->user->identity->username . ')',
//                    ['class' => 'btn btn-link logout']
//                )
//                . Html::endForm()
//                . '</li>'
//            )
        ],
    ]);
    NavBar::end();
    ?>

    <?= $content ?>

</div>

<footer class="footer">
    <div class="container">
        <p class="pull-left">&copy; SKOKI <?= date('Y') ?></p>

        <!--<p class="pull-right"><?= Yii::powered() ?></p>-->
    </div>
</footer>

<?php $this->endBody() ?>
</body>
<div id="preloader">
    <div class="back"></div>
    <div class="label">
        <img src="/images/preloader.gif" alt="wczytywanie..." />
        <!--<span id="preloader-text">Wczytywanie..</span>-->
    </div>
</div>

</html>
<?php $this->endPage() ?>
