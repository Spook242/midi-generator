import { Injectable } from '@angular/core';
import { PatternType } from '../models/pattern-types';

@Injectable({
  providedIn: 'root'
})
export class PatternGeneratorService {

  public generateGrid(type: PatternType): number[][] {
    const grid = [Array(16).fill(0)];
    
    switch (type) {
      case 'Industrial Bassline':
        return this.generateIndustrialBassline();
      case 'EBM Sequence':
        return this.generateEBMSequence();
        case 'Dark Techno Arp':
        return this.generateDarkTechnoArp();
      case 'Atmospheric Pad':
        return this.generateAtmosphericPad();
      default:
        return grid;
    }
  }

  private generateIndustrialBassline(): number[][] {
    const grid = [Array(16).fill(0)];
    [0, 4, 8, 12].forEach(step => grid[0][step] = 1);
    return grid;
  }

  private generateEBMSequence(): number[][] {
    const grid = [Array(16).fill(0)];
    for(let i = 0; i < 16; i += 2) grid[0][i] = 1;
    return grid;
  }

  private generateDarkTechnoArp(): number[][] {
    const grid = [Array(16).fill(0)];
    [0, 3, 6, 9, 12, 14].forEach(step => grid[0][step] = 1);
    return grid;
  }

  private generateAtmosphericPad(): number[][] {
    const grid = [Array(16).fill(0)];
    [0, 8].forEach(step => grid[0][step] = 1);
    return grid;
  }
}