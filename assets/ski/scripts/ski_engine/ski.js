function SkiEngine()
{
    /* ID skoczni - do nadpisania*/
    this.id = 0;
    this.lockAfterLand = 1;
    this.type = 0; //0 - trening, 1 - konkurs
    
    this.zeskokStartX = 0;
    this.zeskokStartY = 0;
    
    /* elementy - id */
    var idContainer = 'container';
    var idSkocznia = 'skocznia';
    var idPunktLondowania = 'punkt-ladowania';
    var idPunktLondowaniaRekord = 'punkt-ladowania-rekord';
    var idPunktLondowaniaMyRekord = 'punkt-ladowania-my-rekord';
    var idDystans = 'distance';
    var idSkoczek = 'skoczek';
    var idSkoczekImg = 'skoczek_img';
    var idWiatr = 'wind_img';
    var idCien = 'cien_skoczka';

    this.currentBest = 0;
    this.currentMyBest = 0;

    var imgJumperImg = '/images/ski/jumper/jumper_';
    this.imgJumperImgNr = 1;

    /* skala */
    var osX = 20;
    var osXsign = 1;
    var osY = 1;
    var osYsign = -1;

    /* p */
    this.p = [0, 0];

    /* Max iter */
    this.maxIter = 500;
    /* Próg */
    this.iProg = 15;
    /* Płaskie */
    this.iConst = 93;
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
    this.wspolczynnikKary = 1/2;

    /* rzut ukośny */
    this.v0 = 6; //prędkość nominalna skocznii
    this.v = 0; //prędkość
    this.z0 = 0.3; //kąt nominalny
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
    this.przesuniecieY = 60;

    /* pozycja myszy */
    this.currentMouseX = 0;
    this.currentMouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.diffMouseX = 0;
    this.diffMouseY = 0;
    
    this.myName = '';

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
        PreloaderSave.hide();
    };

    this.ustawRekord = function (x,y)
    {
        this.currentBest = x;
        $("#" + idPunktLondowaniaRekord).animate({
            left: x + "px",
            top: y + "px"
        }, {
            duration: 0
            //queue: true,
        });
        $('.best_distance').text(x.toFixed(2));
        $("#" + idPunktLondowaniaRekord).effect('pulsate', 2000);
    };
    
    this.ustawMojRekord = function (x,y)
    {
        this.currentMyBest = x;
        $("#" + idPunktLondowaniaMyRekord).animate({
            left: x + "px",
            top: y + "px"
        }, {
            duration: 0
            //queue: true,
        });
        $('.best_mine').text(x.toFixed(2));
        $("#" + idPunktLondowaniaMyRekord).effect('pulsate', 2000);
    };
    
    this.ustawRekordziste = function (name)
    {
        $('.best_user').text(name);
    };
    
    this.ustawMojeImie = function (name)
    {
        this.myName = name;
    };

    this.iniWind = function ()
    {
        this.windDirection = this.randomFromInterval(0, 360);
        this.windPower = 0;

        var that = this;
        calcWind(0, that);
        var duration = 5000;
        calcWind(duration, that);
        setInterval(function () {
            calcWind(duration, that);
        }, duration);

        setInterval(function () {
            that.oporWiatru();
        }, 70);
    };

    var calcWind = function (duration, that)//private
    {
        var range = that.randomFromInterval(0, 20);
        var max = that.modulo360(that.windDirection + range);
        var min = that.modulo360(that.windDirection - range);

        that.windDirection = that.randomFromInterval(min, max);

        that.windPower = that.randomFromInterval(0, 2);

        //console.log('wind '+this.windDirection + 'sin '+Math.sin(this.windDirection) + ' power '+this.windPower);

        $("#" + idWiatr).animate({
            windDirection: that.windDirection,
            windPower: that.windPower
        }, {
            duration: duration,
            easing: 'linear',
            //queue: true,
            step: function (now, fx) {
                if (fx.prop === 'windDirection') {
                    that.windCurrentDirection = now;
                    k = now - 90;//przesunięcie fazy na rysunku
                    $('#' + idWiatr).css({'transform': 'rotate(' + k + 'deg)'});
                    //console.log(that.windCurrentDirection+ ' ' +Math.sin(that.windCurrentDirection*2*Math.PI/360));
                }
                if (fx.prop === 'windPower') {
                    that.windCurrentPower = now;
                    $('#wind-power-value').text(now.toFixed(2));
                }
            }
        });
    };

    this.modulo360 = function (number)
    {
        if (number > 360) {
            number = number - 360;
        } else if (number < 0) {
            number = number + 360;
        }
        return number;
    };

    this.stop = function ()
    {
        $('#' + idSkoczek).clearQueue();
        $('#' + idSkoczek).stop();
    };

    this.odNowa = function ()
    {
        if (this.land === 1 && this.isRun === 1
                && this.iter - this.landIter > 3 && this.lockAfterLand === 0) {
//            document.location.reload();
            this.stop();
            //this.siadzNaBelke();
            this.reset();
            //console.log('OD NOWA!!!');
            return true;
        }
        return false;
    };

    this.siadzNaBelke = function ()
    {
        $('#' + idSkoczek).attr('iter', '0');
        p = this.funSkocznia(0);
        $('#' + idSkoczek).css('top', p[1]);
        $('#' + idSkoczek).css('left', p[0]);
        $('#' + idPunktLondowania).css('top', 0);
        $('#' + idPunktLondowania).css('left', 0);
    };

    this.laduj = function ()
    {
        if (this.isRun === 1 && this.fly === 1 && this.iter - this.iProg > 3) {
            //console.log('LĄDOWANIE!!!');
            //this.v = this.v - 0.1;
            //this.z = this.z - 0.05;
            this.duringLand = 1;
            this.correctLand = 1;
        }
    };

    this.odbicie = function ()
    {
        var param1 = 1;
        var param2 = 0;
        if (this.isRun === 0)
            return;
        if (this.jump === 1)
            return;
        if (this.land === 1)
            return;

        this.setJumperImg(2);

        if (this.iter > this.iProg || this.iter < this.iProg / 2) {
            //console.log('Spóźnione wybicie');
            param1 = 3;//spóźnione odbicie
            param2 = 0.5;
        }

        //console.log('SKACZE!!!'+this.iter);
        this.jump = 1;
        this.jumpMoment = this.iter;
        this.v = this.v0 - (1 / param1) * Math.abs(this.iProg - this.iter) - param2;
        this.z = this.z0;
        //console.log('v='+this.v+'; z='+this.z+';');
    };

    /**
     * @returns {undefined}
     */
    this.ladowanie = function ()
    {
        if (this.isRun === 1 && this.land === 0)
            return;
        $("#" + idPunktLondowania).animate({
            left: this.landPoint[0] + "px",
            top: this.landPoint[1] + "px"
        }, {
            duration: 0
            //queue: true,
        });
        $("#" + idPunktLondowania).effect('pulsate', 2000);
        
        if (this.correctLand === 1) {
            if (this.landPoint[0] > this.currentBest) {
                this.ustawRekord(this.landPoint[0],this.landPoint[1]);
                this.ustawRekordziste(this.myName);
            }
            if (this.landPoint[0] > this.currentMyBest) {
                this.ustawMojRekord(this.landPoint[0],this.landPoint[1]);
            }
        }
    };
    
    this.zapiszOdleglosc = function ()
    {
        var that = this;
        
        setTimeout(function(){
            if (that.lockAfterLand === 1 && that.land===1) {
                PreloaderSave.show();
            }
        }, 1000);
        
        $.ajax({
            url: "/hills/save",
            type: 'post',
            data: {
                id: that.id,
                distance: that.landPoint[0],
                distance_y: that.landPoint[1],
                iter: that.landIter,
                correctLand: that.correctLand,
                type: that.type,
                '_csrf': csrf
            },
            success: function (data) {
                that.lockAfterLand = 0;
                PreloaderSave.hide();
            },
            error: function () {
                alert('Nieoczekiwany błąd podczas zapisu skoku.');
                that.lockAfterLand = 0;
            }
        });
    };

    this.moment = function (x)
    {
//        console.log(this.fly);
//        console.log(this);
//        console.log('moment iter: '+x);

        if (x < this.maxIter) {
            this.isRun = 1;
        } else {
            this.isRun = 0;
//            $('#'+idSkoczek).clearQueue();
//            $('#'+idSkoczek).stop();
        }

        if (this.isRun === 0) {
//            this.reset();
//            console.log(this);
            //console.log('Koniec');
            return true;
        }

        this.iter = x;

        zeskok = [0, 0];

        if (x <= this.iProg) {//skocznia, przed progiem

            p = this.funSkocznia(x);
        } else {//za progiem

            if (x >= this.iConst) {
                if (x >= this.iConst + 10) {
                    x = this.iConst + 10;
                }
                zeskok = this.funPlaskie(x);
            } else {
                zeskok = this.funZeskok(x);
            }
            skokOrig = this.funSkok(x, this.v, this.z);
            skok = this.przesuniecie(skokOrig[0], skokOrig[1]);

            if (this.land === 1 || skok[1] > zeskok[1]+10) {//lądowanie
                this.przesuniecieY = 55;
                p = zeskok;
                if (this.land === 0) {//wylądował
                    this.land = 1;
                    this.fly = 0;
                    $('#' + idDystans).text(p[0].toFixed(2));
                    this.landPoint = [p[0], p[1]];
                    this.landIter = x;
                    $('#' + idDystans).effect("pulsate", 'slow');
                    this.ladowanie();
                    if (this.correctLand === 1) {
                        //console.log('WYLĄDOWAŁ!!!');
                    } else {
                        //console.log('GLEBA!!!');
                        $('#' + idDystans).text("Gleba ;) " + p[0].toFixed(2));
                        $('#crash_img').show();
                        $('#crash_img').css('top', p[1]-50);
                        $('#crash_img').css('left',p[0]-20);
                        setTimeout(function(){
                            $('#crash_img').hide();
                        },150);
                    }
                    
                    this.zapiszOdleglosc();
                }
            } else {//w locie

                this.przesuniecieY = 55;
                this.fly = 1;
                this.aeroCalc();
                p = skok;
            }

        }
//        console.log('skok ['+x+']: '+p[0]+':'+p[1]);

        if (this.iter < this.maxIter - ((this.maxIter - this.iConst) / 2)) {
            $('#' + idSkoczek).css('top', p[1] - this.przesuniecieY);
            $('#' + idSkoczek).css('left', p[0]);
            this.p = p;
            this.cien(zeskok);
        } else {
            /* stop */
        }
        this.setJumperImg(0);
        this.scrollWindow(p);
    };

    this.cien = function (zeskok)
    {
        if (this.fly === 1) {
            this.nachylenie(2, idCien, 0);
            pY = zeskok[1] + (zeskok[1] - this.p[1]) + 15;
            if (pY<this.p[1]+4 || pY<zeskok[1]+4) {
                $('#' + idCien).hide();
            } else {
                $('#' + idCien).css('top', pY);
                $('#' + idCien).css('left', p[0]);
                $('#' + idCien).show();
            }
        } else {
            $('#' + idCien).hide();
        }
    };

    this.detectmob = function () {
//        if (navigator.userAgent.match(/Android/i)
//                || navigator.userAgent.match(/webOS/i)
//                || navigator.userAgent.match(/iPhone/i)
//                || navigator.userAgent.match(/iPad/i)
//                || navigator.userAgent.match(/iPod/i)
//                || navigator.userAgent.match(/BlackBerry/i)
//                || navigator.userAgent.match(/Windows Phone/i)
//                ) {
//            return true;
//        }
//        else {
//            return false;
//        }
        if (typeof window.orientation !== 'undefined') {
            return true;
        } else {
            return false;
        }
    };

    this.listenMousePosition = function ()
    {
        var that = this;

        function hasTouch() {
//            return (('ontouchstart' in window) || // html5 browsers
//                    (navigator.maxTouchPoints > 0) || // future IE
//                    (navigator.msMaxTouchPoints > 0));  // current IE10
            if (typeof window.orientation !== 'undefined') {
                return true;
            } else {
                return false;
            }
        }

        if (hasTouch()) {
            if (window.DeviceMotionEvent != undefined) {
                window.ondevicemotion = function (e) {
                    ax = event.accelerationIncludingGravity.x * 20;
                    ay = event.accelerationIncludingGravity.y * 20;
                    that.setMousePosition(ax, ay);
                };
            }
        } else {
            $('#' + idContainer).mousemove(function (event) {
                that.setMousePosition(event.pageX, event.pageY);
            });
        }

//        if (window.DeviceOrientationEvent) {
//            window.addEventListener("deviceorientation", function () {
//                //tilt([event.beta, event.gamma]);
//                that.setMousePosition(event.beta, event.gamma);
//            }, true);
//        } else if (window.DeviceMotionEvent) {
//            window.addEventListener('devicemotion', function () {
//                //tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
//                that.setMousePosition(event.acceleration.x * 2, event.acceleration.y * 2);
//            }, true);
//        } else {
//            window.addEventListener("MozOrientation", function () {
//                //tilt([orientation.x * 50, orientation.y * 50]);
//                that.setMousePosition(orientation.x * 50, orientation.y * 50);
//            }, true);
//        }

    };

    this.setMousePosition = function (x, y)
    {
        if (this.currentMouseX === 0 && this.currentMouseY === 0) {//niwelacja dużego przeskoku w pierwszym razie
            this.currentMouseX = x;
            this.currentMouseY = y;
        }
        this.prevMouseX = this.currentMouseX;
        this.prevMouseY = this.currentMouseY;
        this.currentMouseX = x;
        this.currentMouseY = y;
        this.diffMouseX = this.currentMouseX - this.prevMouseX;
        this.diffMouseY = this.currentMouseY - this.prevMouseY;
    };

    this.oporWiatru = function ()
    {
        if (this.fly === 1 && !(this.duringLand === 1 && this.land === 0)) {
            var that = this;

            this.silaNachylenia = this.silaNachylenia - 1.5 + this.diffMouseY * 2.5;
//            console.log(this.silaNachylenia);
            that.calcOporWiatru(this.silaNachylenia);
//            console.log(this.silaNachylenia);
//
//            $( "#"+idSkoczek ).animate({
//                silaNachylenia: that.silaNachylenia
//            }, {
//                duration: 70,
//                //queue: true
//                step: function(now, fx ) {
//                    that.calcOporWiatru(now);
//                }
//            });
        }
    };

    this.calcOporWiatru = function (silaNachylenia)
    {
        var poprawa = 0; //brak kary. powyżej 1 kara rośnie
        var rotate = silaNachylenia + 90;
        if (rotate < 60) {
            rotate = 60;
            this.idealFly = 0;
            poprawa = 0;
        } else if (rotate > 120) {
            rotate = 120;
            this.idealFly = 0;
            poprawa = 0;
        } else if (Math.abs(90 - rotate) < this.toleranceIdealFly) {
            this.idealFly = 1;
            poprawa = 1;
        } else {
            poprawa = 0;
            this.idealFly = 0;
        }
        rotate = this.modulo360(rotate - 90);
        $('#' + idSkoczek).css({'transform': 'rotate(' + rotate + 'deg)'});

        //console.log('rad '+rotate+' sin '+Math.sin(rotate*Math.PI/360));
        x = Math.abs(Math.sin(rotate * Math.PI / 360));
        
        console.log('kara: '+x);
        if (poprawa === 0) {
            this.v = this.v - (this.wspolczynnikKary * x);
        } else {
            this.v = this.v - (this.wspolczynnikKary * 1/2 * x);
        }
        console.log('v: '+this.v);
        
        this.opor = 0; //jeżeli minusowy to leci bliżej
    };

    this.aeroCalc = function ()
    {
        /* wpływ wiatru */
        this.aero = 1 / 2 * Math.sin(this.windCurrentDirection * 2 * Math.PI / 360) * this.windCurrentPower;
        
        /* podczas lądowania */
        if (this.duringLand === 1) {
            this.v = this.v - this.speedOfLand; //szybkość lądowania
        }
    };

    this.setJumperImg = function (hard)
    {
        //console.log('Wybieram obrazek');
        if (hard === 0) {
            if (this.duringLand === 1 && this.land === 0) { //w trakcie lądowania
                this.imgJumperImgNr = 5;
            } else if (this.fly === 1) { //lot
                if (this.idealFly) {
                    this.imgJumperImgNr = 4;
                } else {
                    this.imgJumperImgNr = 3;//3,4
                }
            } else if (this.fly === 0 && this.jump === 1 && this.land === 0) { //odbicie
                this.imgJumperImgNr = 2;
            } else if (this.land === 1 && this.correctLand === 1) { //wylądował poprawnie
                this.imgJumperImgNr = 6;
                this.nachylenie(2, idSkoczek, 0);
            } else if (this.land === 1 && this.correctLand === 0) { //wylądował niepoprawnie
                this.imgJumperImgNr = 7;
                this.nachylenie(2, idSkoczek, 0);
            } else { //zjazd po skoczni
                this.imgJumperImgNr = 1;
                this.nachylenie(1, idSkoczek, 0);
            }
        } else {
            this.imgJumperImgNr = hard;
        }
        //console.log(imgJumperImg+this.imgJumperImgNr+'.png');
        $('#' + idSkoczekImg).attr('src', imgJumperImg + this.imgJumperImgNr + '.png');
    };

    this.nachylenie = function (f, id, przesuniecie)
    {
        xn = this.iter - 0;
        xn_1 = this.iter - 1;
        if (f === 1) { //skocznia
            yn = fn_xn = this.funSkocznia(xn);
            yn_1 = fn_xn_1 = this.funSkocznia(xn_1);
        } else { //zeskok
            if (this.iter > this.iConst) {
                yn = fn_xn = this.funPlaskie(xn);
                yn_1 = fn_xn_1 = this.funPlaskie(xn_1);
            } else {
                yn = fn_xn = this.funZeskok(xn);
                yn_1 = fn_xn_1 = this.funZeskok(xn_1);
            }
        }
        //console.log('('+yn[3]+' - '+yn_1[3]+') / ('+xn+' - '+xn_1+')');
        ff = -2 * ((yn[3] - yn_1[3]) / (xn - xn_1));
        //console.log('pochodna ['+ff+'] -> atan(f\') '+Math.atan(ff));
        $('#' + id).css('top', this.p[1] - this.przesuniecieY + przesuniecie + ff / 4.8);
        $('#' + id).css({'transform': 'rotate(' + ff + 'deg)'});
    };

    this.scrollWindow = function (p)
    {
        var container = $('#container');
        var skoczek = $('#' + idSkoczek);
        container.scrollLeft(
                p[0] - 300
                );
        container.scrollTop(
                p[1] - 150
                );
    };

    this.skok = function (x)
    {
        var that = this;
        $("#" + idSkoczek).animate({
            iter: x
        }, {
            duration: 70,
            easing: 'linear',
            //queue: true
            step: function (now, fx) {
                if (fx.end === 0) {
                    now = 0;
                }
//                console.log('NOW');
//                console.log(now);
//                console.log('FX');
//                console.log(fx);
                that.moment(now);
            }
        });

        $("#" + idSkoczek).queue(function () {
//            console.log('kolejka');
            $(this).dequeue();
        });
    };

    this.start = function ()
    {
        if (this.isRun === 1) {
            return this;
        }

        //console.log('START');

        this.reset();

        /* Poruszanie się */
        var that = this;
        for (x = 0; x <= that.maxIter; x++) {
            that.skok(x);
        }
        return this;
    };

    /**
     * @param {type} min
     * @param {type} max
     * @returns {Number}
     */
    this.randomFromInterval = function (min, max)
    {
        return Math.random() * (max - min + 1) + min;
    };

    /**
     * @param {type} x
     * @param {type} v
     * @param {type} z
     * @returns {Array}
     */
    this.funSkok = function (x, v, z)
    {
//        console.log('v='+v+'; z='+z);
        x = x - this.iProg;
        var alfa = z * Math.PI / 2 - 0.001;
        var g = 9.80665 + this.aero;//grawitaja
        //console.log('Grawitacja '+ this.aero +'  ' +g);
        var v0 = v + this.opor;//3.5;//const
        y = x * Math.tan(alfa) - g / (2 * v0 * v0) * x * x;
        pX = osXsign * x * osX;
        pY = osYsign * osY * y;
        return [pX, pY, x, y];
    };

    /**
     * @returns {Array}
     */
    this.punktProg = function ()
    {
        return this.funSkocznia(this.iProg);
    };

    /**
     * @param {type} x
     * @param {type} y
     * @returns {Array}
     */
    this.przesuniecie = function (x, y)
    {
        prog = this.punktProg();
        return [x + prog[0], y + prog[1]];
    };

    /**
     * @param {type} startX
     * @param {type} startY
     * @returns {Array}
     */
    this.rysujSkok = function (startX, startY)
    {
        this.ctx.moveTo(0, 0);
        this.ctx.strokeStyle = '#ff0000';
        for (x = 0; x <= this.maxIter; x++) {
            if (x <= this.iProg) {
                p = this.funSkocznia(x);
            } else {
                zeskok = this.funZeskok(x);
                skokOrig = this.funSkok(x, 3.5, 0.9);
                skok = this.przesuniecie(skokOrig[0], skokOrig[1]);
                if (skok[1] > zeskok[1]) {
                    p = zeskok;
                } else {
                    p = skok;
                }
            }
            //console.log('skok ['+x+']: '+p[0]+':'+p[1]);
            this.ctx.lineTo(p[0], p[1]);
        }
        this.ctx.stroke();
        return [p[0], p[1]];
    };

    /**
     * @param {type} x
     * @returns {Array}
     */
    this.funZeskok = function (x)
    {
        y = Math.sin(1 / 25 * x + 1) * 250 - 410;
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
        pY = p[1];
        return [pX, pY, x, p[3]];
    };

    this.rysujPlaskie = function (startX, startY)
    {
        this.ctxZeskok.moveTo(startX, startY);
        for (x = this.iConst; x <= this.maxIter; x++) {
            p = this.funPlaskie(x);
            this.ctxZeskok.lineTo(p[0], p[1]);
        }
        this.ctxZeskok.stroke();
        this.ctxZeskok.lineTo(p[0], 10000);
        this.ctxZeskok.lineTo(x, 10000);
        this.ctxZeskok.lineTo(x, p[1]);
        this.ctxZeskok.fillStyle = "white";
        this.ctxZeskok.fill();
    };

    /**
     * @param {type} startX
     * @param {type} startY
     * @returns {Array}
     */
    this.rysujZeskok = function (startX, startY)
    {
        this.zeskokStartX = startX;
        this.zeskokStartY = startY;
        
        this.ctxZeskok.moveTo(startX, startY);
        this.ctxZeskok.stroke();
        this.ctxSkocznia.lineWidth = 1;

        for (x = this.iProg; x <= this.iConst; x++) {
            p = this.funZeskok(x);
            this.ctxZeskok.lineTo(p[0], p[1]);
        }
        this.ctxZeskok.strokeStyle = '#999';
        this.ctxZeskok.stroke();
        this.ctxZeskok.lineTo(p[0], 10000);
        this.ctxZeskok.lineTo(startX, 10000);
        this.ctxZeskok.lineTo(startX, startY);
        this.ctxZeskok.fillStyle = "white";
        this.ctxZeskok.fill();
        return [p[0], p[1]];
    };

    /**
     * @param {type} startX
     * @param {type} startY
     * @returns {Array}
     */
    this.rysujSkocznie = function (startX, startY)
    {
        this.ctxSkocznia.moveTo(startX, startY);
        this.ctxSkocznia.lineWidth = 3;
        for (x = 0; x <= this.iProg; x++) {
            p = this.funSkocznia(x);
            this.ctxSkocznia.lineTo(p[0], p[1]);
        }
        this.ctxSkocznia.stroke();
        /* dopełnienie kształtu */
        this.ctxSkocznia.lineTo(p[0], 10000);
        this.ctxSkocznia.lineTo(startX, 10000);
        this.ctxSkocznia.lineTo(startX, startY);
        this.ctxSkocznia.fillStyle = "brown";
        this.ctxSkocznia.fill();
        return [p[0], p[1]];
    };
    
    return this;
}