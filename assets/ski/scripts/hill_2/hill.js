function Hill_2()
{
    /* ID skoczni */
    this.id = 2;
    
    /* elementy - id */
    var idContainer = 'container';
    var idSkocznia = 'skocznia';
    var idPunktLondowania = 'punkt-ladowania';
    var idPunktLondowaniaRekord = 'punkt-ladowania-rekord';
    var idDystans = 'distance';
    var idSkoczek = 'skoczek';
    var idSkoczekImg = 'skoczek_img';
    var idWiatr = 'wind_img';
    var idCien = 'cien_skoczka';

    this.currentBest = 0;

    var imgJumperImg = 'images/jumper/jumper_';
    this.imgJumperImgNr = 1;

    /* skala */
    var osX = 20;
    var osXsign = 1;
    var osY = 1;
    var osYsign = -1;

    /* p */
    this.p = [0, 0];

    /* Max iter */
    this.maxIter = 220;
    /* Próg */
    this.iProg = 15;
    /* Płaskie */
    this.iConst = 170;
    /* Dystans */
    this.distance = 0;
    /* Czy wylondował */
    this.land = 0;
    this.correctLand = 0;
    this.landIter = 0;
    this.duringLand = 0;
    this.speedOfLand = 0.01;
    /* punkt londowania */
    this.landPoint = [0, 0];
    /* Czy leci */
    this.fly = 0;
    /* odbicie */
    this.jump = 0;
    this.jumpMoment = 0;
    /* aktualny krok */
    this.iter = 0;
    /* rozpoczęto */
    this.isRun = 0;

    /* Kontener skoczni */
    this.c = document.getElementById(idSkocznia);

    /* Rysowanie */
    this.ctxSkocznia = this.c.getContext("2d");
    this.ctxSkocznia.beginPath();

    this.ctxZeskok = this.c.getContext("2d");
    this.ctxZeskok.beginPath();
    
    /* idealny lot */
    this.idealFly = 0;
    /* tolerancja idealnego lotu */
    this.toleranceIdealFly = 10;
    /* współczynnik kary */
    this.wspolczynnikKary = 1/4;

    /* rzut ukośny */
    this.v0 = 8; //prędkość nominalna skocznii
    this.v = 0; //prędkość
    this.z0 = 0.5; //kąt nominalny
    this.z = 0; //kąt odbicia
    this.prevOpor = 0;
    this.opor = 0;
    this.silaNachylenia = 0;

    /* noszenie */
    this.aero = 0;

    /* wiatr */
    this.windDirection = 0;
    this.windCurrentDirection = 0;
    this.windPower = 0;
    this.windCurrentPower = 0;

    /* przesuniecie  */
    //this.przesuniecieY = 45;

    /* pozycja myszy */
    this.currentMouseX = 0;
    this.currentMouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.diffMouseX = 0;
    this.diffMouseY = 0;

    this.reset = function ()
    {
        //console.log('RESET');
        this.iter = 0;
        this.isRun = 0;
        this.distance = 0;
        this.fly = 0;
        this.land = 0;
        this.correctLand = 0;
        this.duringLand = 0;
        this.jump = 0;
        this.jumpMoment = 0;
        this.landPoint = [0, 0];
        this.landIter = 0;
        this.v = this.v0 - 3;//bez odbicia
        this.z = 0.2;//bez odbicia
        this.koniec = 0;
        this.siadzNaBelke();
        this.imgJumperImgNr = 1;
        this.aero = 0;
        this.opor = 0;
        this.prevOpor = 0;
        this.silaNachylenia = 0;
        this.przesuniecieY = 60;
        $('#' + idDystans).text(this.distance);
        $('#container').scrollLeft(0);
        $('#container').scrollTop(0);
        this.lockAfterLand = 1;
    };

    /**
     * @param {type} x
     * @returns {Array}
     */
    this.funZeskok = function (x)
    {
        y = Math.sin(1 / 50 * x + 1.3) * 550 - 720;
        pX = osXsign * x * osX;
        pY = osYsign * osY * y;
        return [pX, pY, x, y];
    };

    /**
     * @param {type} x
     * @returns {Array}
     */
    this.funSkocznia = function (x)
    {
        y = (1) * x * x - 30 * x + 75;
        pX = osXsign * x * osX;
        pY = osYsign * osY * y;
        return [pX, pY, x, y];
    };

    this.funPlaskie = function (x)
    {
        p = this.funZeskok(this.iConst);
        pX = osXsign * x * osX;
        pY = p[1]
        return [pX, pY, x, p[3]];
    };
    
    return this;
}