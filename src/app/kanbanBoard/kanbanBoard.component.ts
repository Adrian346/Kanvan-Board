import {Component, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'kanban-board',
  templateUrl: './kanbanBoard.component.html',
  styleUrls: ['./kanbanBoard.component.scss']
})
export class KanbanBoard implements OnInit {
  tasks: Task[];
  stagesNames: string[];
  stagesTasks: any[]; //Only used for rendering purpose

  @ViewChild('myForm') myForm!:NgForm;

  ngOnInit() {
    // Each task is uniquely identified by its name.
    // Therefore, when you perform any operation on tasks, make sure you pick tasks by names (primary key) instead of any kind of index or any other attribute.
    this.tasks = [
      { name: '0', stage: 0 },
      { name: '1', stage: 0 },
    ];
    this.stagesNames = ['Backlog', 'To Do', 'Ongoing', 'Done'];
    this.configureTasksForRendering();
  }

  // this function has to be called whenever tasks array is changed to construct stagesTasks for rendering purpose
  configureTasksForRendering = () => {
    this.stagesTasks = [];
    for (let i = 0; i < this.stagesNames.length; ++i) {
      this.stagesTasks.push([]);
    }
    for (let task of this.tasks) {
      const stageId = task.stage;
      this.stagesTasks[stageId].push(task);
    }
  }

  generateTestId = (name:string) => {
    return name.split(' ').join('-');
  }

  // Salva la tarea que envió el formulario
  saveTask(){
    let tareaExistente = false;
    if( this.myForm.value.name.trim().length > 0 ) {
      this.tasks.find( task => {
        if( task.name === this.myForm.value.name ){ //Si la tarea con ese nombre existe pone la tareaExistente en true
          tareaExistente = true;
        }
      })
      if( !tareaExistente ){ // Si no encontró una tarea con el mismo nombre guarda la tarea
        this.tasks.push({ name: this.myForm.value.name, stage: 0 });
        this.configureTasksForRendering();
        this.myForm.resetForm();
      }
    }
  }

  // Mueve la tarea a la columna anterior
  backTask(name:string) {
    this.tasks.find( task => {
      if(task.name === name){ // Si encuentra la tarea con ese nombre le resta a stage 1
          return task.stage -= 1;
      }
    });
    this.configureTasksForRendering();
  }

  // Mueve la tarea a la columna siguiente
  forwardTask(name:string) {
    this.tasks.find( task => {
      if(task.name === name){ // Si encuentra la tarea con ese nombre le suma a stage 1
        return task.stage += 1;
      }
    });
    this.configureTasksForRendering();
  }

  // Elimina la tarea seleccionada
  deleteTask(task:Task) {
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
    this.configureTasksForRendering();
  }
}

interface Task {
  name: string;
  stage: number;
}
