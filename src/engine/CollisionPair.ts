module ex {
   /**
    * Collision pairs are used internally by Excalibur to resolve collision between actors. The
    * Pair prevents collisions from being evaluated more than one time
    * @class CollisionPair
    * @constructor
    * @param left {Actor} The first actor in the collision pair
    * @param right {Actor} The second actor in the collision pair
    * @param intersect {Vector} The minimum translation vector to separate the actors from the perspective of the left actor
    * @param side {Side} The side on which the collision occured from the perspective of the left actor
    */
   export class CollisionPair {
      constructor(public left: Actor, public right: Actor, public intersect: Vector, public side: Side){}

      /**
       * Determines if this collision pair and another are equivalent.
       * @method equals
       * @param collisionPair {CollisionPair}
       * @returns boolean
       */
      public equals(collisionPair: CollisionPair): boolean{
         return (collisionPair.left === this.left && collisionPair.right === this.right) || (collisionPair.right === this.left && collisionPair.left === this.right);
      }

      /**
       * Evaluates the collision pair, performing collision resolution and event publishing appropriate to each collision type.
       * @method evaluate
       */
      public evaluate(){
         // todo fire collision events on left and right actor
         // todo resolve collisions                  
                  
         // Publish collision events on both participants
         this.left.eventDispatcher.publish('collision', new CollisionEvent(this.left, this.right, this.side, this.intersect));
         this.right.eventDispatcher.publish('collision', new CollisionEvent(this.right, this.left, ex.Util.getOppositeSide(this.side), this.intersect.scale(-1.0)));

         // If the actor is active push the actor out if its not passive
         var leftSide = this.side;
         if((this.left.collisionType === CollisionType.Active || 
            this.left.collisionType === CollisionType.Elastic) && 
            this.right.collisionType !== CollisionType.Passive){
            this.left.y += this.intersect.y;
            this.left.x += this.intersect.x;

            // Naive elastic bounce
            if(this.left.collisionType === CollisionType.Elastic){
               if(leftSide === Side.Left){
                  this.left.dx = Math.abs(this.left.dx);
               }else if(leftSide === Side.Right){
                  this.left.dx = -Math.abs(this.left.dx);
               }else if(leftSide === Side.Top){
                  this.left.dy = Math.abs(this.left.dy);
               }else if(leftSide === Side.Bottom){
                  this.left.dy = -Math.abs(this.left.dy);
               }
            }                 
         }

         var rightSide = ex.Util.getOppositeSide(this.side);
         var rightIntersect = this.intersect.scale(-1.0);
         if((this.right.collisionType === CollisionType.Active || 
            this.right.collisionType === CollisionType.Elastic) && 
            this.left.collisionType !== CollisionType.Passive){
            this.right.y += rightIntersect.y;
            this.right.x += rightIntersect.x;

            // Naive elastic bounce
            if(this.right.collisionType === CollisionType.Elastic){
               if(rightSide === Side.Left){
                  this.right.dx = Math.abs(this.right.dx);
               }else if(rightSide === Side.Right){
                  this.right.dx = -Math.abs(this.right.dx);
               }else if(rightSide === Side.Top){
                  this.right.dy = Math.abs(this.right.dy);
               }else if(rightSide === Side.Bottom){
                  this.right.dy = -Math.abs(this.right.dy);
               }
            }                 
         }
      }
   }
}