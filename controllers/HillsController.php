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
                        'actions' => ['index','hill'],
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
        $hills = \app\models\Hills::find()->all();
        return $this->render('index', compact('hills'));
    }
    
    public function actionHill($id)
    {
        $hill = \app\models\Hills::findOne(compact('id'));
        return $this->render('hill', compact('hill'));
    }
}
