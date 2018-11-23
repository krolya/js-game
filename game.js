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
        let check = object.bottomleft.isSctrictlyInside(this) ||
                object.bottomright.isSctrictlyInside(this) ||  
                object.topleft.isSctrictlyInside(this) || 
                object.topright.isSctrictlyInside(this);

        if (check) {return true};

        // Теперь посчитаем количество пересечений вершин одного объекта в другом, если объекты не СМЕЖНЫЕ , то количество пересечений будет больше или равно четырём
        let number_of_intersections_А = 
            object.bottomleft.isInside(this) + 
            object.bottomright.isInside(this) +  
            object.topleft.isInside(this) + 
            object.topright.isInside(this);

        let number_of_intersections_B =
            this.bottomleft.isInside(object) + 
            this.bottomright.isInside(object) +
            this.topleft.isInside(object) +
            this.topright.isInside(object);

        return ((number_of_intersections_А + number_of_intersections_B)) >= 4 ? true : false;

    }

} 


