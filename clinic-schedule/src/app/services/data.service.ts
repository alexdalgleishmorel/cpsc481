import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public currentUser?: SystemUser;

  private loggedIn$ = new BehaviorSubject<boolean>(!!this.currentUser);
  public isLoggedIn$ = this.loggedIn$.asObservable();

  public dateRanges: DateRange[];
  public hourNumbers: number[] = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5];

  private schedule: {[date: string]: Appointment[]} = {
    '11/11/2023': [
      {
        id: '%*bvxdvb',
        date: '11/11/2023',
        physicianName: 'Dr. Dalgleish',
        patient: {
          firstName: 'Steven',
          lastName: 'Smith',
          phoneNumber: '(403)-123-4567'
        },
        startTime: 11,
        endTime: 12.5,
        notes: '',
        checkedIn: false
      }
    ],
    '11/13/2023': [
      {
        id: 'vskjvalse',
        date: '11/13/2023',
        physicianName: 'Dr. Beljic',
        patient: {
          firstName: 'Alex',
          lastName: 'Jameson',
          phoneNumber: '(403)-333-4537'
        },
        startTime: 10,
        endTime: 11.5,
        notes: '',
        checkedIn: false
      }
    ],
    '11/19/2023': [
      {
        id: '*(@!svsv',
        date: '11/19/2023',
        physicianName: 'Dr. Cameron',
        patient: {
          firstName: 'Lisa',
          lastName: 'Moss',
          phoneNumber: '(403)-123-9999'
        },
        startTime: 11,
        endTime: 13,
        notes: '',
        checkedIn: false
      }
    ],
    '11/25/2023': [
      {
        id: 'a%^7sgw',
        date: '11/25/2023',
        physicianName: 'Dr. Dalgleish',
        patient: {
          firstName: 'Brook',
          lastName: 'Lopez',
          phoneNumber: '(403)-321-7654'
        },
        startTime: 13,
        endTime: 15,
        notes: '',
        checkedIn: false
      }
    ],
    '11/29/2023': [
      {
        id: '&*23dvcv',
        date: '11/29/2023',
        physicianName: 'Dr. Dalgleish',
        patient: {
          firstName: 'Kyrie',
          lastName: 'Irving',
          phoneNumber: '(403)-777-1352'
        },
        startTime: 11.5,
        endTime: 14,
        notes: '',
        checkedIn: false
      }
    ]
  };

  private physicianNameList: string[] = [
    'Dr. Dalgleish',
    'Dr. Beljic',
    'Dr. Zhang',
    'Dr. Cameron',
    'Dr. Tariq'
  ];

  private twelveHourRepresentation: boolean = false;

  public dateRangeIndex: BehaviorSubject<number> = new BehaviorSubject<number>(52);
  public physicianName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public scheduleUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.dateRanges = this.getDateRanges();
  }

  public isTwelveHourRepresentation(): boolean {
    return this.twelveHourRepresentation;
  }

  public setTwelveHourRepresentation(value: boolean) {
    this.twelveHourRepresentation = value;
  }

  public getCurrentUser () {
    return this.currentUser;
  }

  public getRawHourRepresentations(): number[] {
    return this.hourNumbers;
  }

  /**
   * Returns the timelot hour labels
   * @returns {string[]} Each hour representation, not including the 30 minute marks
   */
  public getHourStringRepresentations(): string[] {
    return this.hourNumbers.map((number, index) => index % 2 === 0 ? this.getHourRepresentation(number) : '');
  }

  public getAllHourStringRepresentations(): string[] {
    return this.hourNumbers.map(number => this.getHourRepresentation(number));
  }

  public getPhysicianNameList(): string[] {
    return this.physicianNameList;
  }

  private getDateRanges(): DateRange[] {

    // ADDING FUTURE DATES
    let currentDate = new Date;
    const numOfWeeksToGenerate: number = 52;
    let futureDateRanges: DateRange[] = [];

    for (let i = 0; i < numOfWeeksToGenerate; i ++) {
      let mondayNumberValue = currentDate.getDate() - currentDate.getDay() + 1;
      let sundayNumberValue = mondayNumberValue + 6;
      
      let mondayDate = new Date(currentDate.setDate(mondayNumberValue));
      let sundayDate = new Date(currentDate.setDate(sundayNumberValue));

      futureDateRanges.push({ 
        startDate: mondayDate.toLocaleDateString('en-US'), 
        endDate: sundayDate.toLocaleDateString('en-US') 
      });
      currentDate.setDate(sundayDate.getDate()+1);
    }

    // ADDING PAST DATES
    currentDate = new Date;
    currentDate.setFullYear(currentDate.getFullYear()-1);
    let pastDateRanges: DateRange[] = [];

    for (let i = 0; i < numOfWeeksToGenerate; i ++) {
      let mondayNumberValue = currentDate.getDate() - currentDate.getDay() + 1;
      let sundayNumberValue = mondayNumberValue + 6;
      
      let mondayDate = new Date(currentDate.setDate(mondayNumberValue));
      let sundayDate = new Date(currentDate.setDate(sundayNumberValue));

      pastDateRanges.push({ 
        startDate: mondayDate.toLocaleDateString('en-US'), 
        endDate: sundayDate.toLocaleDateString('en-US') 
      });
      currentDate.setDate(sundayDate.getDate()+1);
    }

    return pastDateRanges.concat(futureDateRanges);
  }

  public getScheduleByDate(dateString: string) {
    return this.schedule[dateString] || [];
  }

  public getSchedule(): {[date: string]: Appointment[]} {
    return this.schedule;
  }

  public getHourRepresentation(hourNumber: number) {
    var date = new Date();
    let hours = Math.floor(hourNumber);
    let minutes = (hourNumber - hours)*60;
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString('en-US', { 
      hour12: this.twelveHourRepresentation, 
      hour: this.twelveHourRepresentation ? 'numeric' : '2-digit', 
      minute: '2-digit' 
    });
  }

  public getSystemUser(): SystemUser | null {
    return this.currentUser || null;
  }

  public updatePhysicanName(name: string) {
    this.physicianName.next(name);
  }

  public createAppointment(appointment: Appointment) {
    this.schedule[appointment.date] ? this.schedule[appointment.date].push(appointment) : this.schedule[appointment.date] = [appointment];
  }

  public updateAppointment(appointmentToUpdate: Appointment) {
    for (let day of Object.values(this.schedule)) {
      for (let appointment of day) {
        if (appointment.id === appointmentToUpdate.id) {
          // Now we need to access the actual object to update it
          let index = 0;
          for (let app of this.schedule[appointment.date]) {
            if (app.id === appointment.id) {
              this.schedule[appointment.date][index] = appointmentToUpdate;
              return;
            }
            index++;
          }
        }
      }
    }
  }

  public cancelAppointment(appointmentToUpdate: Appointment) {
    for (let day of Object.values(this.schedule)) {
      for (let appointment of day) {
        if (appointment.id === appointmentToUpdate.id) {
          // Now we need to access the actual object to update it
          let index = 0;
          for (let app of this.schedule[appointment.date]) {
            if (app.id === appointment.id) {
              delete this.schedule[appointment.date][index];
              return;
            }
            index++;
          }
        }
      }
    }
  }

  public generateRandomString(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=[]{}|;:,.<>?';
    let result = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }

  public timeLabelToRawHour(timeLabel: string): number {
    let index = 0;
    for (let label of this.getAllHourStringRepresentations()) {
      if (timeLabel === label) {
        return this.getRawHourRepresentations()[index];
      }
      index++;
    }
    return -1;
  }

  updateCurrentUser(enteredUsername: string, enteredPassword: string) {

    let updatedUser: SystemUser | undefined;
  
    if (enteredUsername === 'alex' && enteredPassword === 'qwerty') {
      updatedUser = {
        firstName: 'Alex',
        lastName: 'Dalgleish',
        role: UserRole.NURSE,
        email: 'alex@gmail.com'
      };
    } else if (enteredUsername === 'bryant' && enteredPassword === 'qwerty') {
      updatedUser = {
        firstName: 'Bryant',
        lastName: 'Zhang',
        role: UserRole.RECEPTIONIST,
        email: 'bryant@gmail.com'
      };
    } else if (enteredUsername === 'gabriel' && enteredPassword === 'qwerty') {
      updatedUser = {
        firstName: 'Gabriel',
        lastName: 'Cameron',
        role: UserRole.NURSE,
        email: 'gabriel@gmail.com'
      };
    } else if (enteredUsername === 'stevan' && enteredPassword === 'qwerty') {
      updatedUser = {
        firstName: 'Stevan',
        lastName: 'Beljic',
        role: UserRole.PHYSICIAN,
        email: 'stevan@gmail.com'
      };
    } else if (enteredUsername === 'umair' && enteredPassword === 'qwerty') {
      updatedUser = {
        firstName: 'Umair',
        lastName: 'Tariq',
        role: UserRole.RECEPTIONIST,
        email: 'umair@gmail.com'
      };
    }

    if (updatedUser) {
      this.currentUser = updatedUser;
      this.loggedIn$.next(true);
    }
  }

  public removeCurrentUser() {
    this.currentUser = undefined;
    this.loggedIn$.next(false);
  }
}

export enum UserRole {
  NURSE = 'NURSE',
  PHYSICIAN = 'PHYSICIAN',
  RECEPTIONIST = 'RECEPTIONIST',
  BLANK = ''
}

export interface SystemUser {
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
}

export interface Patient {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Appointment {
  id: string;
  date: string;
  startTime: number;
  endTime: number;
  physicianName: string;
  patient: Patient;
  notes: string;
  checkedIn: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
