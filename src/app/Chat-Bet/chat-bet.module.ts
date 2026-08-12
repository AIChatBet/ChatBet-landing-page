import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule } from '@angular/forms';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { MatExpansionModule } from '@angular/material/expansion';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { SpotlightComponent } from './pages/spotlight/spotlight.component';
import { ChatBetRoutingModule } from './chat-bet-routing.module';
import { CarouselSliderComponent } from '../components/carousel-slider/carousel-slider.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    MainPageComponent,
    PhoneInputComponent,
    AboutusComponent,
    SpotlightComponent,
  ],
  imports: [
    MatExpansionModule,
    CommonModule,
    TranslateModule,
    SlickCarouselModule,
    LottieComponent,
    ReactiveFormsModule,
    ChatBetRoutingModule,
    CarouselSliderComponent,
   
  ],
  exports: [
    MainPageComponent
  ],
  providers: [
    provideLottieOptions({
      player: playerFactory,
    }),
  ],
})
export class ChatBetModule { }

