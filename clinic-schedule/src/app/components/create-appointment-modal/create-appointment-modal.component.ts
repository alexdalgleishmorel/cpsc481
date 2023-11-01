import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-appointment-modal',
  templateUrl: './create-appointment-modal.component.html',
  styleUrls: ['./create-appointment-modal.component.scss'],
})
export class CreateAppointmentModalComponent implements OnInit {

  @Input() date?: Date;
  @Input() startTime?: Date;
  public endTime?: Date;

  public dateString: string = '';
  public startTimeString: string = '';
  public endTimeString: string = '';

  constructor(private dataService: DataService, private modalCtrl: ModalController, private toastController: ToastController) {}

  ngOnInit() {
    this.dateString = this.date ? this.date.toLocaleDateString() : '';
    this.startTimeString = this.startTime ? this.dataService.getHourRepresentation(this.startTime.getHours() + this.startTime.getMinutes()/60) : '';
    this.endTime = this.startTime ? new Date(this.startTime) : new Date();
    if (this.endTime.getMinutes() === 30) {
      this.endTime.setHours(this.endTime.getHours() + 1);
      this.endTime.setMinutes(0);
    } else {
      this.endTime.setMinutes(30)
    }
    this.endTimeString = this.endTime ? this.dataService.getHourRepresentation(this.endTime.getHours() + this.endTime.getMinutes()/60) : '';
  }

  cancel() {    
    this.modalCtrl.dismiss();
  }

  async confirm() {
    const toast = await this.toastController.create({
      message: 'Appointment has been successfully created',
      duration: 3000,
      position: 'top',
      color: 'success',
      cssClass: 'centeredToast'
    });

    await toast.present();
    this.modalCtrl.dismiss();
  }
}
