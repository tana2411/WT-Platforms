import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { register, SwiperContainer } from 'swiper/element/bundle';
// register Swiper custom elements
register();

@Component({
  selector: 'app-product-image',
  imports: [MatIconModule],
  templateUrl: './product-image.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './product-image.component.scss',
})
export class ProductImageComponent {
  @Input() images: string[] = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/201/300',
    'https://picsum.photos/202/300',
    'https://picsum.photos/203/300',
  ];

  swiperEl: SwiperContainer | undefined = undefined;

  slideIndex = signal(0);
  @ViewChild('swiperContainer') swiperContainer: ElementRef | undefined;

  ngAfterViewInit() {
    this.swiperEl = this.swiperContainer?.nativeElement;
    if (this.swiperEl) {
      this.swiperEl.swiper.on('realIndexChange', (e) => {
        this.slideIndex.set(e.activeIndex);
      });
      this.swiperEl.initialize();
    }
  }

  get fullSlideLength() {
    if (!this.swiperEl?.swiper?.slides?.length) {
      return 0;
    }

    return this.swiperEl.swiper.slides.length;
  }
}
