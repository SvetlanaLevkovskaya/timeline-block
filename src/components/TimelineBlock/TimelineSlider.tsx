import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useState } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from './TimelineBlock.module.scss';

interface Event {
  year: number;
  description: string;
}

interface Props {
  events: Event[];
}

export const TimelineSlider = ({ events }: Props) => {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const handleSlideChange = (swiper: any) => {
    setCanPrev(!swiper.isBeginning);
    setCanNext(!swiper.isEnd);
  };

  return (
    <div className={styles.sliderWrapper}>
      {canPrev && (
        <button
          className={`${styles.sliderArrow} ${styles.left}`}
          onClick={() => swiperInstance?.slidePrev()}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071"
              stroke="#3877EE"
              strokeWidth="2"
            />
          </svg>
        </button>
      )}

      {canNext && (
        <button
          className={`${styles.sliderArrow} ${styles.right}`}
          onClick={() => swiperInstance?.slideNext()}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071"
              stroke="#3877EE"
              strokeWidth="2"
            />
          </svg>
        </button>
      )}

      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1.5}
        spaceBetween={24}
        pagination={{ clickable: true }}
        breakpoints={{
          769: {
            slidesPerView: 3,
            pagination: { enabled: false },
          },
        }}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          handleSlideChange(swiper);
        }}
        onSlideChange={handleSlideChange}
      >
        {events.map((event, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div className={styles.slideInner}>
              <p className={styles.yearColor}>{event.year}</p>
              <p className={styles.slideText}>{event.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
