import { Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import emailjs from '@emailjs/browser';
import { ToastrService } from 'ngx-toastr';
import { AnimationOptions } from 'ngx-lottie';
import { countries } from '../../../model/contry-data.store';


@Component({
  selector: 'app-chatbet-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  public countries:any = countries
  public dialCode: string | null = null;
  public maxLength: number = 0;
  public minLength: number = 0;

 
    @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
    @ViewChild('videoElementMobile') videoElementMobile!: ElementRef<HTMLVideoElement>;

    
    options: AnimationOptions = {
      path: '../../../../assets/animation/lottieesp.json',
      renderer: 'svg',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    secondoptions: AnimationOptions = {
      path: '../../../../assets/animation/Title_AnimationV2.json',
      renderer: 'svg',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }
  
    form: FormGroup = this.fb.group({
      name: ['', Validators.required], 
      tname: 'ChatBet',
      email: ['', [Validators.required, Validators.email]], 
      contact: ['', Validators.required], 
      empresa: ['', Validators.required], 
      cargo: ['', Validators.required], 
      country: ['', Validators.required],
      message: ['', Validators.required] 
    });
  
    imagePaths: { [key: string]: { [key: string]: string } } = {
      es: {
        img1: '../../../../assets/img/Enespañol.png',
        img2: './assets/img/Frame7.png',
        img3: '../../../../assets/Icon/video.png',
        img4: '../../../../assets/Background/review2.svg',
        img5: './assets/img/Frame1-es.svg',
        third: './assets/img/Frame5.png',
        second: './assets/img/second-phone.png',
        video: 'https://landing-page-chatbet.s3.us-east-1.amazonaws.com/assets/video/vid-es.mp4',
        footer: '../../../../assets/Background/footer.svg',
        footer2: '../../../../assets/Background/2footer.svg',
        phoneimage: '../../../../assets/img/phone-es.png',
        Frame4: '../../../../assets/img/Frame4-es.png',
        reviewphone: '../../../../assets/Background/review-tlf2.svg'

      },
      en: {
        img1: '../../../../assets/img/Eningles.png',
        img2: './assets/img/Frame7.en.png',
        img3: '../../../../assets/Icon/video-en.png',
        img4: '../../../../assets/Background/review-en2.svg',
        img5: './assets/img/Frame1.svg',
        third: './assets/img/Frame5.2.png',
        second: './assets/img/guardar/second-phone.png',
        video: 'https://landing-page-chatbet.s3.us-east-1.amazonaws.com/assets/video/vid-es.mp4',
        footer: '../../../../assets/Background/footer.svg',
        footer2: '../../../../assets/Background/2footer.svg',
        phoneimage: '../../../../assets/img/phone-en.png',
        Frame4: '../../../../assets/img/Frame4.png',
        reviewphone: '../../../../assets/Background/review-en-tlf2.svg'

      }
    };
  
    currentLanguage: string = 'es';
    currentImages = this.imagePaths[this.currentLanguage];
  
    currentIndex: number = 0;
    currentIndextwo: number = 0;
  
    constructor(
      private translate: TranslateService, 
      private fb: FormBuilder, 
      private toastr: ToastrService
    ) {}

    switchLanguage(language: string) {
      this.translate.use(language);
      this.currentLanguage = language;
      this.currentImages = this.imagePaths[this.currentLanguage];
      this.updateVideoSource();
    }
  
    updateVideoSource() {
      const video: HTMLVideoElement = this.videoElement.nativeElement;
      const videoMobile: HTMLVideoElement = this.videoElementMobile.nativeElement;
      const sourceMobile = videoMobile.querySelector('source');
      const source = video.querySelector('source');
      if (source) {
        source.src = this.currentImages['video'];
        video.load(); 
      }
      if (sourceMobile) {
        sourceMobile.src = this.currentImages['video'];
        videoMobile.load(); 
      }
    }

    onCountrySelected(country: any) {
      console.log('Selected Country:', country);
      this.dialCode = country.dialCode;
      this.maxLength = country.maxLength;
      this.minLength = country.minLength;
    
    const contactControl = this.form.get('contact');

    if(contactControl) {
      contactControl.clearValidators();

      contactControl.setValidators([
        Validators.required,
        Validators.minLength(country.minLength),
        Validators.maxLength(country.maxLength)
      ]);

      contactControl.updateValueAndValidity();
    }
    
    console.log('Max Length:', country.maxLength, 'Min Length:', country.minLength);

    }

    async send() {
      if (this.form.invalid || !this.dialCode ) {
        if (this.currentLanguage === 'es') {
          this.toastr.error('Por favor, complete todos los campos antes de enviar');
        } else {
          this.toastr.error('Please fill in all fields before submitting');
        }
        return;
      }

      if (this.form.value.contact.length < this.minLength || this.form.value.contact.length > this.maxLength) {
        if (this.currentLanguage === 'es') {
          this.toastr.error('Por favor, introduzca un número de contacto válido');
        } else {
          this.toastr.error('Please enter a valid contact number');
        }
        return;
      }
  
      try {
        emailjs.init('OGARtyjIOA2WPHZfL');
        
        let response = await emailjs.send("service_c895d9m", "template_worpfzp", {
          from_name: this.form.value.name,
          from_email: this.form.value.email,
          from_contact: `${this.dialCode} ${this.form.value.contact}`,
          from_empresa: this.form.value.empresa,
          from_cargo: this.form.value.cargo,
          from_country: this.form.value.country,
          message: this.form.value.message,
        });
  
        if (this.currentLanguage === 'es') {
          this.toastr.success('Mensaje enviado con éxito');
          console.log('Response:', response);
          
        } else {
          this.toastr.success('Message sent successfully');
          console.log('Response:', response);
        }
  
        this.form.reset();
        this.dialCode = null;
      } catch (error) {
        if (this.currentLanguage === 'es') {
          this.toastr.error('Error al enviar el mensaje');
        } else {
          this.toastr.error('Error sending message');
        }
      }
    }
  
    playVideo() {
      const gifImage = document.getElementById('gifImage');
      const video: HTMLVideoElement = this.videoElement.nativeElement;
  
      if (gifImage) {
        gifImage.style.display = 'none'; // Oculta el GIF
      }
      video.style.display = 'block';
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } 
      video.play();
  
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          video.style.display = 'none';
          video.pause();
          video.currentTime = 0;
          if (gifImage) {
            gifImage.style.display = 'block'; // Muestra el GIF nuevamente
          }
        }
      });
    }

    playVideoMobile() {
      const gifImageMobile = document.getElementById('gifImageMobile');
      const video: HTMLVideoElement = this.videoElementMobile.nativeElement;
  
      if (gifImageMobile) {
        gifImageMobile.style.display = 'none'; // Oculta el GIF
      }
      video.style.display = 'block';
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } 
      video.play();
  
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          video.style.display = 'none';
          video.pause();
          video.currentTime = 0;
          if (gifImageMobile) {
            gifImageMobile.style.display = 'block'; // Muestra el GIF nuevamente
          }
        }
      });
    }
  
  }