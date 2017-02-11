<?php
namespace app\controllers;

/**
 * Skocznie
 *
 * @author mateusz
 */

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;

class HillsController extends Controller
{
   public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
//                    [
//                        'actions' => ['index', 'confirm', 'resend', 'logout'],
//                        'allow' => true,
//                        'roles' => ['?', '@'],
//                    ],
                    [
                        'actions' => ['index','jump'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
//                    [
//                        'actions' => ['index'],
//                        'allow' => true,
//                        'roles' => ['?'],
//                    ],
                ],
            ],
//            'verbs' => [
//                'class' => VerbFilter::className(),
//                'actions' => [
//                    'logout' => ['post'],
//                ],
//            ],
        ];
    }
    
    /**
         * Wyświetla listę skocznii
         *
         * @return string
         */
    public function actionIndex()
    {
        return $this->render('index');
    }
}
