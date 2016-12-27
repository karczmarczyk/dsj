function DsjEngine()
{
    /* elementy - id */
    var idSkocznia = 'skocznia';
    var idPunktLondowania = 'punkt-ladowania';
    var idDystans = 'distance';
    var idSkoczek = 'skoczek';
    
    /* skala */
    var osX = 20;
    var osXsign = 1;
    var osY = 3/4;
    var osYsign = -1;
    
    /* Max iter */
    this.maxIter = 80;
    /* Próg */
    this.iProg = 15;
    /* Dystans */
    this.distance = 0;
    /* Czy wylondował */
    this.land = 0;
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
    
    this.reset = function ()
    {
        this.isRun = 0;
        this.distance = 0;
        this.fly = 0;
        this.land = 0;
        this.jump = 0;
        this.jumpMoment = 0;
        this.landPoint = [0,0];
        
        $('#'+idDystans).text(this.distance);
    };
    
    this.odbicie = function()
    {
        if (this.jump === 1) return;
        if (this.isRun === 0) return;
        this.jump = 1;
        this.jumpMoment = this.iter;
    };
    
    /**
     * @param {type} x
     * @param {type} y
     * @returns {undefined}
     */
    this.skacz = function(x,y)
    {
        var that = this;
        y = y-10;
        $( "#"+idSkoczek ).animate({
            left: x+"px",
            top: y+"px"
        }, {
            duration: 50,
            //queue: true
            step: function(now, fx ) {
//                console.log('animate');
//                console.log(now);
//                console.log(fx);
                console.log(that.jumpMoment);
                that.ladowanie ();
            }
        });
        
        $("#"+idSkoczek).queue(function() {
            console.log('kolejka');
            $(this).dequeue();
        });
    };

    /**
     * @param {type} x
     * @param {type} y
     * @returns {undefined}
     */
    this.ladowanie = function()
    {
        if (this.land === 0) return;
        $( "#"+idPunktLondowania ).animate({
            left: this.landPoint[0]+"px",
            top: this.landPoint[1]+"px"
        }, {
            duration: 0,
            //queue: true,
        });
    };

    /**
     * @param {type} x
     * @param {type} y
     * @returns {Array}
     */
    this.zaczynaj = function(x,y)
    {
        this.reset();
        
        if (this.isRun === 1) {
            return;
        }
        
        var v = this.randomFromInterval(3.4,3.5);
        var z = this.randomFromInterval(0.8,0.9);
        /* Poruszanie się */
        for (x=0;x<=this.maxIter;x++) {
            this.iter = x;
            if (x<=this.iProg) {//skocznia, przed progiem
                
                p = this.funSkocznia(x);
            } else {//za progiem
                
                zeskok = this.funZeskok(x);
                skokOrig = this.funSkok (x, v, z);
                skok = this.przesuniecie(skokOrig[0],skokOrig[1]);
                
                if (this.land===1 || skok[1]>zeskok[1]) {//lądowanie
                    p = zeskok;
                    if (this.land === 0) {//wylądował
                        this.land = 1;
                        this.fly = 0;
                        $('#'+idDystans).text(p[0]);
                        this.landPoint = [p[0],p[1]];
                        $('#distance').effect( "pulsate",'slow');
                    }
                } else {//w locie
                    
                    this.fly = 1;
                    p = skok;
                }
            }
            console.log('skok ['+x+']: '+p[0]+':'+p[1]);
            this.skacz(p[0],p[1]);
        }
        
        this.isRun = 0;
        return [p[0],p[1]];
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
        x = x-this.iProg;
        var alfa = z*Math.PI/2-0.001;
        var g = 9.80665;//grawitaja
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
        y = Math.sin(1/15*x + 0.5) * 250 - 410;
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

    /**
     * @param {type} startX
     * @param {type} startY
     * @returns {Array}
     */
    this.rysujZeskok = function(startX,startY)
    {
        this.ctx.moveTo(startX,startY);
        for (x=this.iProg;x<=this.maxIter;x++) {
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