/// <reference path="../Interfaces/IPipelineModule.ts" />

module ex {
   export class MovementModule implements IPipelineModule { 
      public update(actor: Actor, engine: Engine, delta: number){
         // Update placements based on linear algebra
         actor.x += actor.dx * delta / 1000;
         actor.y += actor.dy * delta / 1000;

         actor.dx += actor.ax * delta / 1000;
         actor.dy += actor.ay * delta / 1000;

         actor.rotation += actor.rx * delta / 1000;

         actor.scaleX += actor.sx * delta / 1000;
         actor.scaleY += actor.sy * delta / 1000;

         
      }
   }
}