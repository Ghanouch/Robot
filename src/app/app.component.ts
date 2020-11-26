import { Component, VERSION } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Used for post processing for the grid initial making
  colArray = [];
  rowArray = [];



  // first setup
  dimensionX: number;
  dimensionY: number;
  firstOrientation = 'N';
  axeX: number;
  axeY: number;

  instruction:string;

  orientations = ['N','S','E','W'];


  currentOrientation: string;


  checkRequiredDimension= true;
  checkRequiredinstruction= true;
  // Used to hide the previous position of the Aspirateur
  preveiousX: number;
  preveiousY: number;

  // Form Control
  submitted= false;
  showTable= false;
  notLunched=true;
  // Initial config for the Orentations ( example: if orientation N and we submit the action D, we will have a new orientation which is E
  myMapInitialConfig: Map<string, string> = new Map([
    ['N->D', 'E'],
    ['N->G', 'W'],
    ['E->D', 'S'],
    ['E->G', 'N'],
    ['S->D', 'W'],
    ['S->G', 'E'],
    ['W->D', 'N'],
    ['W->G', 'S']
  ]);

  setDimension() {

    this.preveiousX = this.axeX;
    this.preveiousY = this.axeY;

    this.colArray = [];
    this.rowArray = [];
    for (let i = 0; i < this.dimensionX; i++) {
      this.colArray.push('O');
    }
    for (let i = 0; i < this.dimensionY; i++) {
      this.rowArray.push('O');
    }
    this.notLunched=false;
    setTimeout( () => document.getElementById(this.axeX + ',' + this.axeY).innerHTML = 'X');

  }



  public ProcessAction() {
    this.showTable = true;
    this.notLunched=true;
    this.moveState(this.instruction, this.axeX, this.axeX, this.firstOrientation);

    // console.log('axeX : ' + this.axeX);
    // console.log('axeY : ' + this.axeY);
    // console.log('currentOrientation : ' + this.currentOrientation);
  }

  moveState(
    actionSequence: string,
    initialX: number,
    initialY: number,
    initialcurrentOrientation: string
  ): void {

    this.currentOrientation = initialcurrentOrientation;

    this.displayCurrentPlace();

    actionSequence.split('')
      .forEach(actionSequence => {
        this.updateNewState(actionSequence);
        this.displayCurrentPlace();
      });
  }

  updateNewState(action: string): void {
    if (action == 'A') {
      this.updateAxesForAvance(action);
    } else if (action == 'G' || action == 'D') {
      this.updatecurrentOrientation(action);
    } else {
      console.error('Error Move');
    }
  }

  updatecurrentOrientation(action: string) {
    this.currentOrientation = this.myMapInitialConfig.get(
      this.currentOrientation + '->' + action
    );
  }

  updateAxesForAvance(action: string) {
    this.preveiousX = this.axeX;
    this.preveiousY = this.axeY;
    switch (this.currentOrientation) {
      case 'N':
        if (this.axeY < this.dimensionY) {
          this.axeY++;
        }
        break;

      case 'S':
        if (this.axeY > 0) {
          this.axeY--;
        }
        break;

      case 'E':
        if (this.axeX < this.dimensionX) {
          this.axeX++;
        }
        break;

      case 'W':
        if (this.axeX > 0) {
          this.axeX--;
        }
        break;
      default:
        break;
    }
  }


  onSubmit() {
    if ((this.axeX > this.dimensionX) || this.axeY > this.dimensionY || this.axeX <= 0  || this.axeY <= 0 )
    {
      this.checkRequiredDimension = false;
    }else{
      this.checkRequiredDimension = true;
    }
    if (this.instructionNotValid()){
      this.checkRequiredinstruction = false;
    }else{
      this.checkRequiredinstruction = true;
    }
     if (this.checkRequiredDimension && this.checkRequiredinstruction) {
       this.submitted = true;
       this.setDimension();
     }

  }

  instructionNotValid() : boolean
  {
    let isMet = false;
    this.instruction.split('')
      .forEach(action => {
        if (action != 'D' && action != 'G' && action != 'A'){
          isMet = true;
        }
      });
    return isMet;
  }

  initialConfig() {
    this.submitted= false;
    this.showTable= false;
    this.notLunched=true;
    this.colArray = [];
    this.rowArray = [];
    this.dimensionX = null;
    this.dimensionY = null;
    this.firstOrientation = 'N';
    this.axeX = null;
    this.axeY = null;
    this.instruction = null;
    this.checkRequiredDimension= true;
    this.checkRequiredinstruction= true;  }

  // Utils for the mouvements of the aspirator
  waitSeconds(iMilliSeconds) {
    var counter = 0,
      start = new Date().getTime(),
      end = 0;
    while (counter < iMilliSeconds) {
      end = new Date().getTime();
      counter = end - start;
    }
  }

  // wait(ms: any) {
  //   var start = new Date().getTime();
  //   var end = start;
  //   while (end < start + ms) {
  //     end = new Date().getTime();
  //   }
  // }

  constructor(@Inject(DOCUMENT) document) {}
  //
  displayCurrentPlace() {

    document.getElementById(this.preveiousX + ',' + this.preveiousY).innerHTML =
      'O';
    document.getElementById(this.axeX + ',' + this.axeY).innerHTML = 'X';
  }
  //
  // sleep(milliseconds) {
  //   var start = new Date().getTime();
  //   for (var i = 0; i < 1e7; i++) {
  //     if (new Date().getTime() - start > milliseconds) {
  //       break;
  //     }
  //   }
  // }


}
