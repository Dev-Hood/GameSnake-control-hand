postMessage(start())

    
function start(){
    var x;
    var y;
    var stage = document.getElementById('stage');
    var ctx = stage.getContext("2d");
    //document.addEventListener("keydown", keyPush);
    setInterval(game, 160);

    const vel = 1;

    var vx = vy = 0;
    var px =10;
    var py = 10;
    var tp = 40;
    var qp = 15;
    var ax=ay=5;
    
    var trail = [];
    tail = 5;

    function game(){
        px += vx;
        py += vy;
        if (px <0) {
            px = qp-1;
        }
        if (px > qp-1) {
            px = 0;
        }
        if (py < 0) {
            py = qp-1;
        }
        if (py > qp-1) {
            py = 0;
        }

        ctx.fillStyle = "grey";
        ctx.fillRect(0,0, stage.width, stage.height);

        ctx.fillStyle = "red";
        ctx.fillRect(ax*tp, ay*tp, tp,tp);

        ctx.fillStyle = "blue";
        for (var i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x*tp, trail[i].y*tp, tp-1,tp-1);
            //if (trail[i].x == px && trail[i].y == py)
            //{
            //    vx = vy=0;
            //    tail =5;
            // }
        }

        trail.push({x:px,y:py })
        while (trail.length > tail) {
            trail.shift();
        }

        if (ax==px && ay==py){
            tail++;
            ax = Math.floor(Math.random()*qp);
            ay = Math.floor(Math.random()*qp);
        }

    }

    const modelParams = {
        flipHorizontal: false,
        outputStride: 16,
        imageScaleFactor: 1,
        maxNumBoxes: 20,
        iouThreshold: 0.2,
        scoreThreshold: 0.6,
        modelType: "ssd320fpnlite",
        modelSize: "large",
        bboxLineWidth: "2",
        fontSize: 17,
    };

    navigator.getUserMedia = 
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
       
    const video = document.querySelector('#video')
    const canvas = document.querySelector('#canvas')
    const context = canvas.getContext('2d')
    let model
    handTrack.startVideo(video).then( status =>{
        if(status){
            navigator.getUserMedia({video:{}}, 
            stream =>{
                video.srcObject = stream
                setInterval(rundetection,200)
            },
            err =>{

            }
            )
        }
    })
    function rundetection(){
        model.detect(video)
        .then(predections => {
            if(x != 0 && y!= 0){
                if(x-parseInt(predections[1].bbox[0])>30){
                    keyPush(39)
                }
                if(x-parseInt(predections[1].bbox[0])<-30){
                    keyPush(37)
                }
                if(y-parseInt(predections[1].bbox[1])>30){
                    keyPush(38)
                }
                if(y-parseInt(predections[1].bbox[1])<-30){
                    keyPush(40)
                } 
            }
            x = Number((predections[1].bbox[0]).toFixed())
            y = Number((predections[1].bbox[1]).toFixed())
            
        })
    }

    handTrack.load(modelParams).then(lmodel => {
        model = lmodel
    })

    function keyPush(key){

        switch (key) {
            case 37: // Left
                vx = -vel;
                vy = 0 
                break;
            case 38: // up
                vx = 0;
                vy = -vel;
                break;
            case 39: // right
                vx = vel;
                vy = 0;
                break;
            case 40: // down
                vx = 0;
                vy = vel;
                break;          
            default:
                
                break;
        }


    }

}


