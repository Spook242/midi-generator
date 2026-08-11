import { Component } from '@angular/core';
import { LibraryItem } from '../../models/library-item';

@Component({
  selector: 'app-library',
  standalone: true,
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent {
  items: LibraryItem[] = [
    {
      id: '1',
      name: 'Industrial Bassline',
      bpm: 120,
      duration: '00:30',
      isActive: true
    },
    {
      id: '2',
      name: 'Ambient Synth',
      bpm: 90,
      duration: '03:38',
      isActive: false
    },
    {
      id: '3',
      name: 'EBM sequence',
      bpm: 128,
      duration: '02:44',
      isActive: false
    }
  ];
}