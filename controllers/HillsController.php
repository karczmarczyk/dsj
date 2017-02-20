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
                        'actions' => ['index','hill','save'],
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
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'save' => ['post'],
                ],
            ],
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
        $this->layout = 'hill';
        $hill = \app\models\Hills::findOne(compact('id'));
        return $this->render('hill', compact('hill'));
    }
    
    public function actionSave()
    {
        $response = array(
            'success' => 0,
            'message' => 'Nieoczekiwany błąd'
        );
        
        if (Yii::$app->request->isAjax) {
            
            $jump = new \app\models\Jumps();
            $jump->setAttribute('hill_id', Yii::$app->request->post('id'));
            $jump->setAttribute('distance', Yii::$app->request->post('distance'));
            $jump->setAttribute('land', Yii::$app->request->post('correctLand'));
            $jump->setAttribute('type', Yii::$app->request->post('type'));
            $jump->setAttribute('distance_y', Yii::$app->request->post('distance_y'));
            $jump->setAttribute('iter', Yii::$app->request->post('iter'));
            $jump->setAttribute('user_id', Yii::$app->user->id);
            
            if ($jump->save()) {
                $response['success'] = 1;
                $response['message'] = 'Zapisano';
            } else {
                $response['success'] = 0;
                $response['message'] = 'Nie zapisano';
            }
        }
        
        Yii::$app->response->format = 'json';
        return $response;
    }
}
