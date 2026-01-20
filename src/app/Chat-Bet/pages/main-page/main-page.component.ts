import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import emailjs from '@emailjs/browser';
import { ToastrService } from 'ngx-toastr';
import { AnimationOptions } from 'ngx-lottie';
import { countries } from '../../../model/contry-data.store';
import { LanguageService } from '../../../lenguage/language.service';
import { validationInstitucional } from '../../../validators/validationInstitucional';

interface BestGradesSlider {
  description: string;
  imageUrl: string;
  title: string;
  url?: string;
  gallery?: GalleryModel[];
}

interface GalleryModel {
  img: string;
}

@Component({
  selector: 'app-chatbet-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  public countries: any = countries;
  public dialCode: string | null = null;
  public maxLength: number = 0;
  public minLength: number = 0;
  public operatorsType: 'operators' | 'players' = 'operators';
  public NewOperatorsType: 'operators' | 'players' = 'operators';
  public gallerySlider: Array<BestGradesSlider> = [];
  public showCarousel: boolean = true;
  isMenuOpen: boolean = false;
  isScrolled = false;

  public monthlyGgrOptions: string[] = [];
  public interestOptions: string[] = [];
  public regionOptions: string[] = [];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollPosition > 50;
  }
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoElementMobile') videoElementMobile!: ElementRef<HTMLVideoElement>;

  options: AnimationOptions = {
    path: '../../../../assets/animation/lottieesp.json',
    renderer: 'svg',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  secondoptions: AnimationOptions = {
    path: '../../../../assets/animation/Title_AnimationV2.json',
    renderer: 'svg',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    tname: 'ChatBet',
    email: ['', [Validators.required, Validators.email,
      validationInstitucional(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com','live.com','icloud.com','aol.com','protonmail.com','zoho.com','gmx.com','mail.com','yandex.com','tutanota.com','fastmail.com','hushmail.com','inbox.com','me.com','mac.com','msn.com','qq.com','naver.com','daum.net'])
    ]],
    monthlyGgr: ['', Validators.required],
    empresa: ['', Validators.required],
    interest: ['', Validators.required],
    interestOther: [''],
    region: ['', Validators.required],
    message: ['', Validators.required],
  });

  imagePaths: { [key: string]: { [key: string]: string } } = {
    es: {
      img1: '../../../../assets/img/NEnEsp.png',
      img2: './assets/img/incremento.png',
      img3: '../../../../assets/HomePage/miraen.png',
      img4: '../../../../assets/slider/sinfondo.png',
      img5: './assets/img/Frame1-es.svg',
      third: './assets/img/Frame5.png',
      second: './assets/img/second-phone.png',
      video: 'https://landing-page-chatbet.s3.us-east-1.amazonaws.com/assets/video/vid-es.mp4',
      footer: '../../../../assets/Background/footer.svg',
      footer2: '../../../../assets/Background/2footer.png',
      phoneimage: '../../../../assets/img/phone-es.png',
      Frame4: '../../../../assets/img/Frame4-es.png',
      reviewphone: 'j../../../../assets/slider/sinfondo-mob.png',
      homepage: '../../../../assets/HomePage/imagen-inicial-es.gif',
      whatischatbet: '../../../../assets/HomePage/whatischatbet-es.png',
      beneficios: '../../../../assets/HomePage/beneficios-es.png',
      howitswork: '../../../../assets/HomePage/howitswork-es.png',
      provensucces: '../../../../assets/HomePage/provensucces-es.png',
      inversionitas:'../../../../assets/HomePage/line.png',
      rev1: '../../../../assets/slider/rev-es.png',
      rev2: '../../../../assets/slider/rev-2-es.png',
    },
    en: {
      img1: '../../../../assets/img/NEnEsp.png',
      img2: './assets/img/increase.png',
      img3: '../../../../assets/Icon/video.png',
      img4: '../../../../assets/slider/sinfondo.png',
      img5: './assets/img/Frame1.svg',
      third: './assets/img/Frame5.2.png',
      second: './assets/img/guardar/second-phone.png',
      video: 'https://landing-page-chatbet.s3.us-east-1.amazonaws.com/assets/video/vid-es.mp4',
      footer: '../../../../assets/Background/footer-en.png',
      footer2: '../../../../assets/Background/2footer-en.png',
      phoneimage: '../../../../assets/img/phone-en.png',
      Frame4: '../../../../assets/img/Frame4.png',
      reviewphone: '../../../../assets/slider/sinfondo-mob.png',
      homepage: '../../../../assets/HomePage/imagen-inicial-en.gif',
      whatischatbet: '../../../../assets/HomePage/whatischatbet-en.png',
      beneficios: '../../../../assets/HomePage/beneficios-en.png',
      howitswork: '../../../../assets/HomePage/howitswork-en.png',
      provensucces: '../../../../assets/HomePage/provensucces-en.png',
      inversionitas:'../../../../assets/inversionistas.png',
      rev1: '../../../../assets/slider/rev-en.png',
      rev2: '../../../../assets/slider/rev-2-en.png',
    },
  };

  currentLanguage: string = 'es';
  currentImages = this.imagePaths[this.currentLanguage];

  currentIndex: number = 0;
  currentIndextwo: number = 0;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.languageService.getCurrentLang().subscribe(lang => {
      this.currentLanguage = lang;
      this.currentImages = this.imagePaths[lang];
      this.loadTranslatedOptions(lang);
      this.updateGallerySlider();
      this.updateVideoSource();
    });
  }

  private loadTranslatedOptions(lang: string): void {
    this.translate.get([
      'GGR_LESS_250K',
      'GGR_250K_1M',
      'GGR_1M_5M',
      'GGR_5M_10M',
      'GGR_MORE_10M'
    ]).subscribe(translations => {
      this.monthlyGgrOptions = [
        translations['GGR_LESS_250K'],
        translations['GGR_250K_1M'],
        translations['GGR_1M_5M'],
        translations['GGR_5M_10M'],
        translations['GGR_MORE_10M']
      ];
    });

    this.translate.get([
      'REGION_AFRICA',
      'REGION_ASIA',
      'REGION_EUROPE',
      'REGION_LATAM',
      'REGION_NORTH_AMERICA',
      'REGION_OTHER'
    ]).subscribe(translations => {
      this.regionOptions = [
        translations['REGION_AFRICA'],
        translations['REGION_ASIA'],
        translations['REGION_EUROPE'],
        translations['REGION_LATAM'],
        translations['REGION_NORTH_AMERICA'],
        translations['REGION_OTHER']
      ];
    });

    this.translate.get([
      'INTEREST_OPERATOR',
      'INTEREST_PLATFORM',
      'INTEREST_SELL',
      'INTEREST_VENDOR',
      'INTEREST_JOB',
      'INTEREST_OTHER'
    ]).subscribe(translations => {
      this.interestOptions = [
        translations['INTEREST_OPERATOR'],
        translations['INTEREST_PLATFORM'],
        translations['INTEREST_SELL'],
        translations['INTEREST_VENDOR'],
        translations['INTEREST_JOB'],
        translations['INTEREST_OTHER']
      ];
      
      this.form.get('interest')?.valueChanges.subscribe(value => {
        const interestOtherControl = this.form.get('interestOther');
        if (value === translations['INTEREST_OTHER']) { 
          interestOtherControl?.setValidators([Validators.required]);
        } else {
          interestOtherControl?.clearValidators();
        }
        interestOtherControl?.updateValueAndValidity();
      });
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault(); 
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
      const headerOffset = 150; 
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
  
  switchLanguage(language: string) {
    this.translate.use(language);
    this.languageService.setLanguage(language);
    this.currentLanguage = language;
    this.currentImages = this.imagePaths[language];
    this.loadTranslatedOptions(language);
    this.updateVideoSource();
    this.updateGallerySlider();
    this.isMenuOpen = false;
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
    if (!country) {
      console.error('No country selected');
      return;
    }
    
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
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastr.error(this.currentLanguage === 'es' ? 
        'Por favor, complete todos los campos requeridos' : 
        'Please fill all required fields');
      return;
    }

    try {
      emailjs.init('OGARtyjIOA2WPHZfL');

      const monthlyGgrValue = this.form.value.monthlyGgr;

      await emailjs.send("service_18pzode", "template_worpfzp", {
        from_name: this.form.value.name,
        from_email: this.form.value.email,
        from_contact: monthlyGgrValue,
        from_empresa: this.form.value.empresa,
        interest: this.form.value.interest,
        interest_other: this.form.value.interestOther,
        region: this.form.value.region,
        message: this.form.value.message,
      });

      this.toastr.success(this.currentLanguage === 'es' ? 
        'Mensaje enviado con éxito' : 
        'Message sent successfully');

      this.form.reset();
    } catch (error) {
      console.error('Error al enviar:', error);
      this.toastr.error(this.currentLanguage === 'es' ? 
        'Error al enviar el mensaje' : 
        'Error sending message');
    }
  }

  playVideo() {
    const gifImage = document.getElementById('gifImage');
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    if (gifImage) {
      gifImage.style.display = 'none';
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
          gifImage.style.display = 'block';
        }
      }
    });
  }

  playVideoMobile() {
    const gifImageMobile = document.getElementById('gifImageMobile');
    const video: HTMLVideoElement = this.videoElementMobile.nativeElement;

    if (gifImageMobile) {
      gifImageMobile.style.display = 'none';
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
          gifImageMobile.style.display = 'block';
        }
      }
    });
  }

  private updateGallerySlider(): void {
    this.gallerySlider = [
      {
        description: this.currentImages['slider1_desc'] || 'Default description 1',
        imageUrl: this.currentImages['rev1'],
        title: this.currentImages['slider1_title'] || 'Default title 1'
      },
      {
        description: this.currentImages['slider2_desc'] || 'Default description 2',
        imageUrl: this.currentImages['rev2'],
        title: this.currentImages['slider2_title'] || 'Default title 2'
      }
    ];
    this.showCarousel = false;
    setTimeout(() => {
      this.showCarousel = true;
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }
}