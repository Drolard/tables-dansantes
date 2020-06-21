//Classe avec deux méthodes de calcul utilisé dans la classe CanvasDansingTable
class TableClass {

  static returnMultResult(valeur, nbPoint, mult){
    return valeur*mult%nbPoint;
  }

  static getStep(nbPoints){
    return 2*Math.PI/nbPoints;
  }

}

//Classe permettant d'enregitrer les coordonnées d'un point.
/* Le calcul des coordonnées d'un point sur un cercle étant asez gourmande cette classe permet d'enregistrer ces dernières
pour les récupérer plus tard sans refaire le caclul */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }
}

//Classe principale qui dessine les tables dansantes
class CanvasDansingTable{

  //Le constructeur calcule quelques informations utiles, il initialise aussi le tableau des points
  //Ce tableau enregristre lescoordonées des points à valeur entière (1, 2, 3, ... x) sans valeur décimale
  //Celapermet de récupérer les coordonnées de ces points sans avoir a refaire le calcul de coordonnées
  //
  //Finalement ce contructeur appelle la méthode DrawCircle pour dessiner toute la table
  constructor(ctx, nbPoints, mult, isInGallery=false) {
    this.margin = 20;

    //Attribut qui permet de savoir si le cercle est celui d'une gallerie ou non (utile pour modifier un peu l'affichage)
    this.isInGallery = isInGallery

    this.ctx = ctx;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.nbPoints = nbPoints;
    this.mult = mult;

    this.rayon = (this.ctx.canvas.clientWidth < this.ctx.canvas.clientHeight)?(this.ctx.canvas.clientWidth - this.margin*2)/2:(this.ctx.canvas.clientHeight - this.margin*2)/2;

    this.center = new Point(this.rayon+this.margin, this.rayon+this.margin);

    this.calcPoints(nbPoints);

    this.ctx.lineWidth = 0.8
    this.drawCircle();

    //Finalement on met les nouvelles valeur dans les input dans l'HTML si ce n'ets pas un cercle de gallery
    if (!this.isInGallery) {
      circleNbPointsInput.value = this.nbPoints;
      circleMultInput.value = this.mult;
    }
  }

  //Methode qui modifie et redessine le cerleen fonction d'un nouveau nombre de point et d'un nouveau multiplicateur
  update(nbPoints, multp){
    //On efface tout sur le canva et on récupère lesinfos passé en parametre
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    //Si le nombre de point change il faut tout redessiner Et recaulculer le tableau de point
    if (this.nbPoints != nbPoints) {
      this.calcPoints(nbPoints);
      this.mult = multp;
      this.nbPoints = nbPoints;
      this.drawCircle();
    } else {
      this.mult = multp;
      this.nbPoints = nbPoints;
      this.drawCircle();
    }



    //Finalement on met les nouvelles valeur dans les input dans l'HTML
    circleNbPointsInput.value = this.nbPoints;
    circleMultInput.value = this.mult;

  }

  //Methode qui dessine un cercle sur le canva, puis qui apelle la méthode pour dessiner les points
  drawCircle(){
    this.ctx.fillStroke = "rgb(255, 255, 255)";

    this.ctx.beginPath();
    this.ctx.arc(this.center.getX(), this.center.getY(), this.rayon, 0, Math.PI*2, true);
    this.ctx.stroke();
    this.ctx.closePath()

    this.drawPoints();
  }

  //Methode qui dessine sur le cercle tout les points entiers sans valeur décimale
  drawPoints(){
    let i = 0;
    for (var point of this.points) {
      //On fait un petit rectangle au bon endroit
      this.ctx.fillRect(point.getX()-1, point.getY()-1, 3, 3);

      //On écrit aussi un texte avec le n° du point
      //On ecrit pas le texte si c'est dans la gallerie
      if (!this.isInGallery) {
        this.ctx.font = '15px serif';
        this.ctx.fillStyle = 'purple';

        //If rapide juste pour qe les chiffre soit lisibles facilement
        let xChange = (point.getX() < this.center.getX())? -10 : 5 ;
        let yChange = (point.getY() < this.center.getY())? -8 : 15 ;
        this.ctx.fillText(i, point.getX()+xChange, point.getY()+yChange);
        i++;
        this.ctx.fillStyle = 'black';
      }
    }

    this.drawLines();
  }

  //Methode qui dessine une ligne entre chaque point et son résultat
  drawLines(){
    var pointResult = null;
    let resultX, resultY;
    let i = 0;
    for (var point of this.points) {
      //Si le résultat de la multiplication est un entier alors ont peut récupérer les coordonnées du point directement
      //Dans le tableau. Sinon il faut recaulculer lesbonnes coordonnées !
      if (this.points[TableClass.returnMultResult(i, this.nbPoints, this.mult)]) {
        pointResult = this.points[TableClass.returnMultResult(i, this.nbPoints, this.mult)];
        resultX = pointResult.getX();
        resultY = pointResult.getY();
      } else {
        let result = TableClass.returnMultResult(i, this.nbPoints, this.mult);
        resultX = this.center.getX() + this.rayon * Math.cos(result * TableClass.getStep(this.nbPoints));
        resultY = this.center.getY() + this.rayon * Math.sin(result * TableClass.getStep(this.nbPoints));
      }


      //On dessine ensuite le trait entre la source et la destination
      //Si c'est un cercle de la gallerie on change la taille du trait
      if (this.isInGallery) this.ctx.lineWidth = 0.3
      this.ctx.beginPath();
      this.ctx.moveTo(point.getX(), point.getY());
      this.ctx.lineTo(resultX, resultY);
      this.ctx.stroke();
      i++;
    }
    this.ctx.lineWidth = 0.8
  }

  //Methode qui calcule toute les coordonées des points entiers
  calcPoints(nbPoints){
    this.points = [];
    var point = null;
    var x = 0, y = 0;
    for (var i = 0; i < nbPoints; i++) {
      x = this.center.getX() + this.rayon * Math.cos(i * TableClass.getStep(nbPoints) - 0.5 * Math.PI) ;
      y = this.center.getY() + this.rayon * Math.sin(i * TableClass.getStep(nbPoints) - 0.5 * Math.PI);
      point = new Point(x, y);
      this.points.push(point);
    }
  }

}

//Classe qui permet d'afficher une gallerie et d'ajouter ou supprimer des élements
class TableGallery{

  constructor(element, array = null) {
    this.element = element;
    this.tables = {}

    //Si on a un tableau en parametre
    if (array != null) {
      for (let [key, value] of Object.entries(array)) {;
        this.ajouter(value.nbpoints, value.mult);
      }
    }
  }

  ajouter(nbpoints, mult){
    //Lors de l'ajout si il n'existe pas déja
    if (!this.tables[mult+'//'+nbpoints]) {
      //On récupère l'instance pour l'utiliser plus tard
      let tableGallery = this;

      //On crée les différents éléments
      let newDiv = document.createElement('div');
      newDiv.id = mult+'//'+nbpoints;
      newDiv.classList.add('singleTable');

      let texte = document.createElement('span');
      texte.innerHTML = "Nombre de points : "+nbpoints+" et multiplicateur :"+mult;

      let boutonAfficher = document.createElement('button');
      boutonAfficher.innerHTML="Afficher en grand";
      boutonAfficher.type="button";

      //On utilise l'instance que l'on a gardé plus tot pour ajouter directement la fonction sur le bouton
      boutonAfficher.addEventListener('click', function(){
        tableGallery.afficher(nbpoints, mult);
      });

      let boutonSuprimer = document.createElement('button');
      boutonSuprimer.innerHTML="Supprimer";
      boutonSuprimer.type="button";

      //On utilise l'instance que l'on a gardé plus tot pour ajouter directement la fonction sur le bouton
      boutonSuprimer.addEventListener('click', function(){
        tableGallery.supprimer(nbpoints, mult);
      });

      let newCanvas = document.createElement('canvas');
      newCanvas.width = window.innerWidth*0.30
      newCanvas.height = window.innerWidth*0.30
      let newCtx = newCanvas.getContext("2d");

      newDiv.appendChild(texte);
      newDiv.appendChild(boutonAfficher);
      newDiv.appendChild(newCanvas);
      newDiv.appendChild(boutonSuprimer);

      this.element.appendChild(newDiv);

      new CanvasDansingTable(newCtx, nbpoints, mult, true);

      this.tables[mult+'//'+nbpoints] = {
        'nbpoints': nbpoints,
        'mult': mult,
      };
    }

    this.mettreAJourLocalStorage();
  }

  afficher(nbPoints, mult){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext("2d");
    circle = new CanvasDansingTable(ctx, nbPoints, mult);
  }

  supprimer(nbPoints, mult){
    document.getElementById(mult+'//'+nbPoints).remove();
    delete this.tables[mult+'//'+nbPoints];

    this.mettreAJourLocalStorage();
  }

  mettreAJourLocalStorage(){
    localStorage.setItem('tableGallery', ''+JSON.stringify(this.tables)+'');
  }

}


//Fonction qui lance le programme
function init(){

  //On récupère le canva
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext("2d");

  //On récupère la taille et on rend le cavna carré
  let canvaWidth = window.innerWidth*0.65;
  let canvaHeigth = window.innerHeight*0.80;
  if (canvaWidth < canvaHeigth) {
    canvaHeigth = canvaWidth;
  } else {
    canvaWidth = canvaHeigth;
  }
  canvas.height = canvaHeigth;
  canvas.width = canvaWidth;

  //On crée le cercle, ce qui va le dessiner
  circle = new CanvasDansingTable(ctx, 10, 2);


  //On ajoute ensuite les évenements et comportement sur les différents boutons

  //Bouton qui lance ou arrete l'animation sur le multiplicateur
  let startMultAnimation = document.getElementById('startMultAnimation');
  startMultAnimation.addEventListener('click', function(){
    if (intervalMult) {
      clearInterval(intervalMult);
      intervalMult = null;
      startMultAnimation.innerHTML = "Play &#9658;";
    } else {
      intervalMult = setInterval(circleUpdateAutoMult, 200);
      startMultAnimation.innerHTML = "Stop &#9679;";
    }
  });

  //A chaque fois que l'input est directement modifier par l'utilisateur on modifie le cercle
  circleMultInput.addEventListener('change', function(){
    circleUpdate(0, circleMultInput.value - circle.mult);
  });


  //Bouton qui lance ou arrete l'animation sur le nombre de points
  let startNbPointsAnimation = document.getElementById('startNbPointsAnimation');
  startNbPointsAnimation.addEventListener('click', function(){
    if (intervalPoints) {
      clearInterval(intervalPoints);
      intervalPoints = null;
      startNbPointsAnimation.innerHTML = "Play &#9658;";
    } else {
      intervalPoints = setInterval(circleUpdateAutoNbPoints, 200);
      startNbPointsAnimation.innerHTML = "Stop &#9679;";
    }
  });

  //A chaque fois que l'input est directement modifier par l'utilisateur on modifie le cercle
  circleNbPointsInput.addEventListener('change', function(){
    circleUpdate(circleNbPointsInput.value - circle.nbPoints, 0);
  });


  //Fonction qui apelle la modifcation du cercle utilisé pour l'animation sur le multiplicateur
  //Ce qui est important est que cette fonction n'attend pas d'attributs, ce qui permet de l'appeller dans un setInterval
  function circleUpdateAutoMult(){
    circleUpdate(0, circleMultStepInput.value);
  }

  //Fonction qui apelle la modifcation du cercle utilisé pour l'animation sur le nombre de points
  //Ce qui est important est que cette fonction n'attend pas d'attriuts, ce qui permet de l'appeller dans un setInterval
  function circleUpdateAutoNbPoints(){
    circleUpdate(circleNbPointsStepInput.value, 0);
  }


  //On récupère la gallerie enregistrer dans le local Storage
  let listeInStorage = null;
  if (localStorage.getItem('tableGallery')) {
    listeInStorage = JSON.parse(localStorage.getItem('tableGallery'));
  }

  //On récupère l'élement ou on mettera les éléments et on crée la liste
  var galleryList = document.getElementById('galleryList');
  var myGallery = new TableGallery(galleryList, listeInStorage);

  //On ajoute finalement le comportement sur le bouton ajouter a la gallerie
  let saveInGallery = document.getElementById('saveInGallery');
  saveInGallery.addEventListener('click', function(){
    myGallery.ajouter(circleNbPointsInput.value, circleMultInput.value);
  })


  /*****************************************************/
  /*   Ajout de quelques tables intéressantes dans la  */
  /* gallerie a enlever quand ce sera en prod          */
  /*****************************************************/

  myGallery.ajouter(760, 41);
  myGallery.ajouter(993, 399);
  myGallery.ajouter(399, 399);
  myGallery.ajouter(500, 201);
  myGallery.ajouter(2902, 512);

}


//Fonction qui modifie les valeurs du cercle en fonction des attributs
//Le nombre de points est modifié de changeNbPoints et le multiplicateur est changé de changeMult
function circleUpdate(changeNbPoints, changeMult){
  //On calcule les nouvelels valeur x 10 / 10 pour réduire les erreur de javascript lors du calcul des petits nombres
  let newNbPoints = (circle.nbPoints*10+changeNbPoints*10)/10
  let newMult = (circle.mult*10+changeMult*10)/10;
  //Puis on modifie le cerle en arrondissant les valeurs à 1 chiffre apres la virgule
  circle.update(Math.round(newNbPoints * 10) / 10, Math.round(newMult * 10) / 10);
}


//On récupère tout les éléments importants
var circle = null;
var intervalMult, intervalPoints;

var circleMultInput = document.getElementById('multPlaceholder');
var circleMultStepInput = document.getElementById('multStep');

var circleNbPointsInput = document.getElementById('nbPointsPlaceholder');
var circleNbPointsStepInput = document.getElementById('nbPointsStep');

init()
