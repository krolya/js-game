'use strict';


//Реализовать базовые классы игры: Vector, Actor и Level.

class Vector {
    constructor (x=0,y=0) {
        this.x = x;
        this.y = y;
    }

    plus(vector) {
        if (!(vector instanceof Vector)) {
            throw (new Error('Можно прибавлять к вектору только вектор типа Vector'));
        }
        return new Vector(this.x + vector.x,this.y+vector.y);
    }

    times(time) {
        return new Vector(this.x*time,this.y*time);
    }

    //Принимает аргумент Actor, проверяет что текущий вектор находится в пределах объекта Actor СТРОГО не включая границы
    isSctrictlyInside(actor) {
        
        if (actor === undefined) {
            throw (new Error('Аргумент в методе isIntersect класса Vector не определен')); 
        }

        if (!(actor instanceof Actor)) {
            throw (new Error('Аргумент в методе isIntersect класса Vector не Actor')); 
        }
        
        if (actor.left < this.x && this.x < actor.right && actor.top < this.y && this.y < actor.bottom ) {
            return true;
        } else {
            return false;
        }

    }

    //Принимает аргумент Actor, проверяет что текущий вектор находится в пределах объекта Actor включая границы
    isInside(actor) {
        
        if (actor === undefined) {
            throw (new Error('Аргумент в методе isIntersect класса Vector не определен')); 
        }

        if (!(actor instanceof Actor)) {
            throw (new Error('Аргумент в методе isIntersect класса Vector не Actor')); 
        }
        
        if (actor.left <= this.x && this.x <= actor.right && actor.top <= this.y && this.y <= actor.bottom ) {
            return true;
        } else {
            return false;
        }

    }

} 

class Actor {
    
    //Принимает три аргумента: расположение, объект типа Vector, размер, тоже объект типа Vector и скорость, тоже объект типа Vector. 
    //Все аргументы необязательные. По умолчанию создается объект с координатами 0:0, размером 1x1 и скоростью 0:0.
    constructor (pos=new Vector(0,0),size=new Vector(1,1),speed=new Vector(0,0)) {

        if (!(pos instanceof Vector)) {
            throw (new Error('В конструкторе Actor параметр pos не Vector '));
        }

        if (!(size instanceof Vector)) {
            throw (new Error('В конструкторе Actor параметр size не Vector '));
        }

        if (!(speed instanceof Vector)) {
            throw (new Error('В конструкторе Actor параметр speed не Vector '));
        }


        this.pos = pos;
        this.size = size;
        this.speed = speed;
    }

    //Должен быть определен метод act, который ничего не делает.
    act() {}

    //Должны быть определены свойства только для чтения left, top, right, bottom, 
    //в которых установлены границы объекта по осям X и Y с учетом его расположения и размера.

    get left() {return this.pos.x}
    get top() {return this.pos.y}
    get right() {return this.pos.x+this.size.x}
    get bottom() {return this.pos.y+this.size.y}
    
    
    

    get topleft() {return new Vector(this.left,this.top)}
    get topright() {return new Vector(this.right,this.top)}
    get bottomleft() {return new Vector(this.left,this.bottom)}
    get bottomright() {return new Vector(this.right,this.bottom)}
    
    //Должен иметь свойство type — строку со значением actor, только для чтения.
    get type() {return 'actor'}

    //Метод проверяет, пересекается ли текущий объект с переданным объектом, и если да, возвращает true, иначе – false.
    //Принимает один аргумент — движущийся объект типа Actor. Если передать аргумент другого типа или вызвать без аргументов, то метод бросает исключение.
    isIntersect(object) {

        if (object === undefined) {
            throw (new Error('Аргумент в методе isIntersect класса Actor не определен')); 
        }

        if (!(object instanceof Actor)) {
            throw (new Error('Аргумент в методе isIntersect класса Actor не Actor')); 
        }

        //Если передать в качестве аргумента этот же объект, то всегда возвращает false. Объект не пересекается сам с собой.
        if (object === this) {
            return false
        }

        //Объекты, имеющие смежные границы, не пересекаются.
        
        // Проверим, что любая из вершин переданного объекта СТРОГО входит в наш объект (т.е. не лежит на границах)
        // Если так, то объекты ТОЧНО пересекаются
        const check = object.bottomleft.isSctrictlyInside(this) ||
                object.bottomright.isSctrictlyInside(this) ||  
                object.topleft.isSctrictlyInside(this) || 
                object.topright.isSctrictlyInside(this);

        if (check) {return true};

        // Теперь посчитаем количество пересечений вершин одного объекта в другом, если объекты не СМЕЖНЫЕ , то количество пересечений будет больше или равно четырём
        const number_of_intersections = 
            object.bottomleft.isInside(this) + 
            object.bottomright.isInside(this) +  
            object.topleft.isInside(this) + 
            object.topright.isInside(this) +
            this.bottomleft.isInside(object) + 
            this.bottomright.isInside(object) +
            this.topleft.isInside(object) +
            this.topright.isInside(object);

        return (number_of_intersections >= 4);

    }

} 

//Объекты класса Level реализуют схему игрового поля конкретного уровня, 
// контролируют все движущиеся объекты на нём и реализуют логику игры. 
// Уровень представляет собой координатное поле, имеющее фиксированную ширину и высоту.
class Level {

    //Конструктор
    // Принимает два аргумента: сетку игрового поля с препятствиями, массив массивов строк, и список движущихся объектов, массив объектов Actor. Оба аргумента необязательные.
    constructor(grid = undefined,actors=[]) {

        //Имеет свойство grid — сетку игрового поля. Двумерный массив строк.
        this.grid = grid ? grid : [['']];

        //Имеет свойство height — высоту игрового поля, равное числу строк в сетке из первого аргумента.
        this.height = grid ? this.grid.length : 0;

        //Имеет свойство width — ширину игрового поля, равное числу ячеек в строке сетки из первого аргумента. При этом, если в разных строках разное число ячеек, то width будет равно максимальному количеству ячеек в строке.
        this.width = grid ? Math.max(...this.grid.map(x => x.length)) : 0;

        //Имеет свойство actors — список движущихся объектов игрового поля, массив объектов Actor.
        this.actors = actors;

        //Имеет свойство player — движущийся объект, тип которого — свойство type — равно player. Игорок передаётся с остальными движущимися объектами.
        this.player = this.actors.find(item => item.type === 'player');

        //Имеет свойство status — состояние прохождения уровня, равное null после создания.
        this.status = null;

        //Имеет свойство finishDelay — таймаут после окончания игры, равен 1 после создания. Необходим, чтобы после выигрыша или проигрыша игра не завершалась мгновенно.
        this.finishDelay = 1;

    }

    //Имеет свойство height — высоту игрового поля, равное числу строк в сетке из первого аргумента.
    //get height() {return this.grid.length};

    //Имеет свойство width — ширину игрового поля, равное числу ячеек в строке сетки из первого аргумента. При этом, если в разных строках разное число ячеек, то width будет равно максимальному количеству ячеек в строке.
    //get width() {return Math.max(this.grid.map(x => x.length))}

    isFinished() {
        return this.status!==null && this.finishDelay <0;
    }

    actorAt(object) {

        if (object === undefined) {
            throw (new Error('Аргумент в методе actorAt класса Level не определен')); 
        }

        if (!(object instanceof Actor)) {
            throw (new Error('Аргумент в методе actorAt класса Level не Actor')); 
        }

        return this.actors.find(actor => actor.isIntersect(object));
    }

    obstacleAt(pos,size) {

        if (!(pos instanceof Vector)) {
            throw (new Error('В методе obstacleAt параметр pos не Vector '));
        }

        if (!(size instanceof Vector)) {
            throw (new Error('В методе obstacleAt параметр size не Vector '));
        }

        const object = new Actor(pos,size);
        
        if (object.left < 0) {return 'wall'};
        if (object.right > this.width) {return 'wall'};
        if (object.top <0) {return 'wall'};
        if (object.bottom > this.height) {return 'lava'};
        
        

        const pos_left = Math.ceil(object.left);
        const pos_top = Math.ceil(object.top);
                
        const field_item_at_topleft = this.grid[pos_top][pos_left];

        const pos_right = Math.floor(object.right);
        const pos_bottom = Math.floor(object.bottom);

        const field_item_at_bottomright = this.grid[pos_bottom][pos_right];

        console.log(object.left,object.top,object.right,object.bottom);
        console.log(pos_left,pos_top,pos_right,pos_bottom);

        console.log(field_item_at_topleft);
        console.log(field_item_at_bottomright);

        if (field_item_at_bottomright === 'wall' && Math.floor(object.bottom) === object.bottom ) {
            return undefined;
        } else {
            return field_item_at_topleft ? field_item_at_bottomright : field_item_at_topleft;
        }
    }


}


const grid = [
    Array(4),
    Array(4),
    Array(4),
    Array(4).fill('wall')
  ];
  const level = new Level(grid);
  const position = new Vector(2.1, 1.5);
  const size = new Vector(0.8, 1.5);
  const nothing = level.obstacleAt(position, size);
  console.log(nothing);


  const wallGrid = [
    Array(4).fill('wall'),
    Array(4).fill('wall'),
    Array(4).fill('wall'),
    Array(4).fill('wall')
  ];  
const level2 = new Level(wallGrid);
const position2 = new Vector(0, 0);
const size2 = new Vector(1, 1);
const wall = level2.obstacleAt(position2, size2);
console.log(wall);