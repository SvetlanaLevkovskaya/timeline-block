import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef, useState } from 'react';
import styles from './TimelineBlock.module.scss';

interface Event {
  year: number;
  description: string;
}

interface Props {
  events: Event[];
}

export const TimelineSlider = ({ events }: Props) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  return (
    <div className={styles.sliderWrapper}>
      {canPrev && (
        <button
          ref={prevRef}
          className={`${styles.sliderArrow} ${styles.left}`}
          onClick={() => swiperInstance?.slidePrev()}
        >
          <svg
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
          ref={nextRef}
          className={`${styles.sliderArrow} ${styles.right}`}
          onClick={() => swiperInstance?.slideNext()}
        >
          <svg
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071"
              stroke="#3877EE"
              strokeWidth="2"
            />
          </svg>
        </button>
      )}

      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        spaceBetween={24}
        breakpoints={{ 768: { slidesPerView: 3 } }}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
        }}
        onSlideChange={(swiper) => {
          setCanPrev(!swiper.isBeginning);
          setCanNext(!swiper.isEnd);
        }}
      >
        {events.map((event, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <p className={styles.yearColor}>{event.year}</p>
            <p>{event.description}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
