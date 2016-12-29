function DsjEngine()
{
    /* elementy - id */
    var idSkocznia = 'skocznia';
    var idPunktLondowania = 'punkt-ladowania';
    var idDystans = 'distance';
    var idSkoczek = 'skoczek';
    var idSkoczekImg = 'skoczek_img';
    var idWiatr = 'wind_img';
    
    var imgJumperImg = 'images/jumper/jumper_';
    this.imgJumperImgNr = 1;
    
    /* skala */
    var osX = 20;
    var osXsign = 1;
    var osY = 1;
    var osYsign = -1;
    
    /* p */
    this.p = [0,0];
    
    /* Max iter */
    this.maxIter = 115;
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
    /* punkt londowania */
    this.landPoint = [0,0];
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
    this.c=document.getElementById(idSkocznia);
    
    /* Rysowanie */
    this.ctx=this.c.getContext("2d");
    this.ctx.beginPath();
    
    /* rzut ukośny */
    this.v0 = 5.8; //prędkość nominalna skocznii
    this.v = 0; //prędkość
    this.z0 = 0.3; //kąt nominalny
    this.z = 0; //kąt odbicia
    
    /* noszenie */
    this.aero = 0;
    
    /* wiatr */
    this.windDirection = 0;
    this.windCurrentDirection = 0;
    this.windPower = 0;
    this.windCurrentPower = 0;
    
    /* przesuniecie  */
    this.przesuniecieY = 45;
    
    this.reset = function ()
    {
        console.log('RESET');
        this.iter = 0;
        this.isRun = 0;
        this.distance = 0;
        this.fly = 0;
        this.land = 0;
        this.correctLand = 0;
        this.duringLand = 0;
        this.jump = 0;
        this.jumpMoment = 0;
        this.landPoint = [0,0];
        this.landIter = 0;
        this.v = this.v0 - 3;//bez odbicia
        this.z = 0.2;//bez odbicia
        this.koniec = 0;
        this.siadzNaBelke();
        this.imgJumperImgNr = 1;
        this.aero = 0;
        $('#'+idDystans).text(this.distance);
        $('#container').scrollLeft(0);
        $('#container').scrollTop(0);
    };
    
    this.iniWind = function ()
    {
        this.windDirection = this.randomFromInterval(0,360);
        this.windPower = 0;
        
        var that = this;
        that.calcWind(0);
        var duration = 5000;
        that.calcWind(duration);
        setInterval(function(){
            that.calcWind(duration);
        },duration);
    };
    
    this.calcWind = function (duration)
    {
        var that = this;
        
        var range = this.randomFromInterval(0,20);
        var max = this.modulo360(this.windDirection + range);
        var min = this.modulo360(this.windDirection - range);
        
        this.windDirection = this.randomFromInterval(min,max);
        
        this.windPower = this.randomFromInterval(0,3);
                
        console.log('wind '+this.windDirection + 'sin '+Math.sin(this.windDirection) + ' power '+this.windPower);
        
        $( "#"+idWiatr ).animate({
            windDirection: this.windDirection,
            windPower: this.windPower
        }, {
            duration: duration,
            easing: 'linear',
            //queue: true,
            step: function(now, fx ) {
                if (fx.prop === 'windDirection') {
                    that.windCurrentDirection = now;
                    k = now-90;//przesunięcie fazy na rysunku
                    $('#'+idWiatr).css({'transform' : 'rotate('+ k +'deg)'});
                    //console.log(that.windCurrentDirection+ ' ' +Math.sin(that.windCurrentDirection*2*Math.PI/360));
                }
                if (fx.prop === 'windPower') {
                    that.windCurrentPower = now;
                    $('#wind-power-value').text(now.toFixed(2));
                }
            }
        });
    };
    
    this.modulo360 = function(number)
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
        $('#'+idSkoczek).clearQueue();
        $('#'+idSkoczek).stop();
    };
    
    this.odNowa = function ()
    {
        if (this.land === 1 && this.iter > this.maxIter/3 && this.isRun === 1
                && this.iter-this.landIter > 3) {
//            document.location.reload();
            this.stop();
            //this.siadzNaBelke();
            this.reset();
            console.log('OD NOWA!!!');
            return true;
        }
        return false;
    };
    
    this.siadzNaBelke = function ()
    {
        $('#'+idSkoczek).attr('iter','0');
        p = this.funSkocznia(0);
        $('#'+idSkoczek).css('top',p[1]);
        $('#'+idSkoczek).css('left',p[0]);
        $('#'+idPunktLondowania).css('top',0);
        $('#'+idPunktLondowania).css('left',0);
    };
    
    this.laduj = function()
    {
        if (this.isRun === 1 && this.fly === 1 && this.iter-this.iProg > 3) {
            console.log('LĄDOWANIE!!!');
            this.v = this.v - 0.1;
            this.z = this.z - 0.05;
            this.duringLand = 1;
            this.correctLand = 1;
        }
    };
    
    this.odbicie = function()
    {
        var param1 = 1;
        var param2 = 0;
        if (this.isRun === 0) return;
        if (this.jump === 1) return;
        if (this.land === 1) return;
        
        this.setJumperImg(2);
        
        if (this.iter > this.iProg || this.iter<this.iProg/2){
            console.log('Spóźnione wybicie');
            param1 = 3;//spóźnione odbicie
            param2 = 0.5;
        }
        
        console.log('SKACZE!!!'+this.iter);
        this.jump = 1;
        this.jumpMoment = this.iter;
        this.v = this.v0 - (1/param1)*Math.abs(this.iProg - this.iter)-param2;
        this.z = this.z0;
        console.log('v='+this.v+'; z='+this.z+';');
    };

    /**
     * @param {type} x
     * @param {type} y
     * @returns {undefined}
     */
    this.ladowanie = function()
    {
        if (this.isRun === 1 && this.land === 0) return;
        $( "#"+idPunktLondowania ).animate({
            left: this.landPoint[0]+"px",
            top: this.landPoint[1]+"px"
        }, {
            duration: 0,
            //queue: true,
        });
        $( "#"+idPunktLondowania ).effect('pulsate',2000);
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
        
        if (this.isRun===0) {
//            this.reset();
//            console.log(this);
            console.log('Koniec');
            return true;
        }
        
        this.iter = x;
        if (x<=this.iProg) {//skocznia, przed progiem

            p = this.funSkocznia(x);
        } else {//za progiem

            if (x>=this.iConst) {
                zeskok = this.funPlaskie(x);
            } else {
                zeskok = this.funZeskok(x);
            }
            skokOrig = this.funSkok (x, this.v, this.z);
            skok = this.przesuniecie(skokOrig[0],skokOrig[1]);

            if (this.land===1 || skok[1]>zeskok[1]) {//lądowanie
                p = zeskok;
                if (this.land === 0) {//wylądował
                    this.land = 1;
                    this.fly = 0;
                    $('#'+idDystans).text(p[0]);
                    this.landPoint = [p[0],p[1]];
                    this.landIter = x;
                    $('#'+idDystans).effect( "pulsate",'slow');
                    this.ladowanie();
                    if (this.correctLand === 1) {
                        console.log('WYLĄDOWAŁ!!!');
                    } else {
                        console.log('GLEBA!!!');
                        $('#'+idDystans).text("Gleba ;)");
                    }
                }
            } else {//w locie

                this.fly = 1;
                this.aeroCalc();
                p = skok;
            }
        }
//        console.log('skok ['+x+']: '+p[0]+':'+p[1]);
        this.p = p;
        if (this.iter < this.maxIter-((this.maxIter-this.iConst)/2)) {
            $('#'+idSkoczek).css('top',p[1]-this.przesuniecieY);
            $('#'+idSkoczek).css('left',p[0]);
        } else {
            /* stop */
        }
        this.setJumperImg(0);
        this.scrollWindow(p);
    };
    
    this.aeroCalc = function ()
    {
        this.aero = 1 * Math.sin(this.windCurrentDirection*2*Math.PI/360) * this.windCurrentPower;
    };
    
    this.setJumperImg = function(hard)
    {
        console.log('Wybieram obrazek');
        if (hard === 0) {
            if (this.duringLand === 1 && this.land === 0) { //w trakcie lądowania
                this.imgJumperImgNr = 5;
            } else if (this.fly === 1) { //lot
                this.imgJumperImgNr = 3;//3,4
            } else if (this.fly === 0 && this.jump === 1 && this.land === 0) { //odbicie
                this.imgJumperImgNr = 2;
            } else if (this.land === 1 && this.correctLand === 1) { //wylądował poprawnie
                this.imgJumperImgNr = 6;
                this.nachylenie(2);
            } else if (this.land === 1 && this.correctLand === 0) { //wylądował niepoprawnie
                this.imgJumperImgNr = 7;
                this.nachylenie(2);
            } else { //zjazd po skoczni
                this.imgJumperImgNr = 1;
                this.nachylenie(1);
            }
        } else {
            this.imgJumperImgNr = hard;
        }
        console.log(imgJumperImg+this.imgJumperImgNr+'.png');
        $('#'+idSkoczekImg).attr('src',imgJumperImg+this.imgJumperImgNr+'.png');
    };
    
    this.nachylenie = function (f)
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
        ff = -2* ((yn[3] - yn_1[3]) / (xn - xn_1));
        //console.log('pochodna ['+ff+'] -> atan(f\') '+Math.atan(ff));
        $('#'+idSkoczek).css('top',this.p[1]-this.przesuniecieY+ff/4.8);
        $('#'+idSkoczek).css({'transform' : 'rotate('+ ff +'deg)'});
    };
    
    this.scrollWindow = function (p)
    {
        var container = $('#container');
        var skoczek = $('#'+idSkoczek);
        container.scrollLeft(
                p[0]-300
        );
        container.scrollTop(
                p[1]-200
        );
    };

    this.skok = function (x)
    {
        var that = this;
        $( "#"+idSkoczek ).animate({
            iter: x
        }, {
            duration: 70,
            //queue: true
            step: function(now, fx ) {
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
        
        $("#"+idSkoczek).queue(function() {
//            console.log('kolejka');
            $(this).dequeue();
        });
    };

    this.start = function ()
    {
        if (this.isRun === 1) {
            return this;
        }
        
        console.log('START');
        
        this.reset();
        
        /* Poruszanie się */
        var that = this;
        for (x=0;x<=that.maxIter;x++) {
            that.skok(x);
        }
        return this;
    };

    /**
     * @param {type} min
     * @param {type} max
     * @returns {Number}
     */
    this.randomFromInterval = function (min,max)
    {
        return Math.random()*(max-min+1)+min;
    };

    /**
     * @param {type} x
     * @param {type} v
     * @param {type} z
     * @returns {Array}
     */
    this.funSkok = function(x, v, z)
    {
//        console.log('v='+v+'; z='+z);
        x = x-this.iProg;
        var alfa = z*Math.PI/2-0.001;
        var g = 9.80665 + this.aero;//grawitaja
        console.log('Grawitacja '+ this.aero +'  ' +g);
        var v0 = v;//3.5;//const
        y = x * Math.tan(alfa) - g / (2 * v0*v0) * x*x;
        pX = osXsign*x*osX;
        pY = osYsign*osY*y;
        return [pX,pY,x,y];
    };

    /**
     * @returns {Array}
     */
    this.punktProg = function()
    {
        return this.funSkocznia(this.iProg);
    };

    /**
     * @param {type} x
     * @param {type} y
     * @returns {Array}
     */
    this.przesuniecie = function(x,y) 
    {
        prog = this.punktProg();
        return [x+prog[0],y+prog[1]];
    };

    /**
     * @param {type} startX
     * @param {type} startY
     * @returns {Array}
     */
    this.rysujSkok = function(startX,startY) 
    {
        this.ctx.moveTo(0,0);
        this.ctx.strokeStyle = '#ff0000';
        for (x=0;x<=this.maxIter;x++) {
            if (x<=this.iProg) {
                p = this.funSkocznia(x);
            } else {
                zeskok = this.funZeskok(x);
                skokOrig = this.funSkok (x, 3.5, 0.9);
                skok = this.przesuniecie(skokOrig[0],skokOrig[1]);
                if (skok[1]>zeskok[1]) {
                    p = zeskok;
                } else {
                    p = skok;
                }
            }
            console.log('skok ['+x+']: '+p[0]+':'+p[1]);
            this.ctx.lineTo(p[0],p[1]);
        }
        this.ctx.stroke();
        return [p[0],p[1]];
    };

    /**
     * @param {type} x
     * @returns {Array}
     */
    this.funZeskok = function(x)
    {
        y = Math.sin(1/25*x + 1) * 250 - 410;
        pX = osXsign*x*osX;
        pY = osYsign*osY*y;
        return [pX,pY,x,y];
    };

    /**
     * @param {type} x
     * @returns {Array}
     */
    this.funSkocznia = function(x) 
    {
        y = (1)*x*x - 30*x + 75;
        pX = osXsign*x*osX;
        pY = osYsign*osY*y;
        return [pX,pY,x,y];
    };

    this.funPlaskie = function(x)
    {
        p = this.funZeskok(this.iConst);
        pX = osXsign*x*osX;
        pY = p[1]
        return [pX,pY,x,p[3]];
    };

    this.rysujPlaskie = function(startX,startY)
    {
        this.ctx.moveTo(startX,startY);
        for (x=this.iConst;x<=this.maxIter;x++) {
            p = this.funPlaskie (x);
            this.ctx.lineTo(p[0],p[1]);
        }
        this.ctx.stroke();
    };

    /**
        * @param {type} startX
        * @param {type} startY
        * @returns {Array}
        */
    this.rysujZeskok = function(startX,startY)
    {
        this.ctx.moveTo(startX,startY);
        for (x=this.iProg;x<=this.iConst;x++) {
            p = this.funZeskok (x);
            this.ctx.lineTo(p[0],p[1]);
        }
        this.ctx.stroke();
        return [p[0],p[1]];
    };

    /**
     * @param {type} startX
     * @param {type} startY
     * @returns {Array}
     */
    this.rysujSkocznie = function(startX,startY)
    {
        this.ctx.moveTo(startX,startY);
        for (x=0;x<=this.iProg;x++) {
            p = this.funSkocznia (x);
            this.ctx.lineTo(p[0],p[1]);
        }
        this.ctx.stroke();
        return [p[0],p[1]];
    };
}