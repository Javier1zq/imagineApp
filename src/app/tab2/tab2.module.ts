import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ChartsModule } from 'ng2-charts';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { TabsPage } from './../tabs/tabs.page';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    ChartsModule,
    TabsPage
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
