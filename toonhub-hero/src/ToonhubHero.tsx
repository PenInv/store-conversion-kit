import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type ImageItem = {
  src: string;
  bg: string;
  panel: string;
  /** Overrides the desktop centre scale for artwork that is not a standing figure. */
  desktopScale?: number;
};

const IMAGES: ImageItem[] = [
  {
    src: '/bota.png',
    bg: '#A8825C',
    panel: '#BF9E7C',
    desktopScale: 1,
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0814/9454/0514/files/55ac546d-0372-4c41-8a76-bd356c298d0a_1.png?v=1787856307',
    bg: '#1F7A52',
    panel: '#289F6B',
    desktopScale: 1,
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0814/9454/0514/files/ChatGPT_Image_27_de_ago._de_2026_15_52_14.png?v=1787856795',
    bg: '#C4A574',
    panel: '#D2BA94',
    desktopScale: 1,
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0814/9454/0514/files/ChatGPT_Image_27_de_ago._de_2026_16_50_10.png?v=1787860276',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    desktopScale: 1.2,
  },
];

const DURATION = 650;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const MOBILE_BREAKPOINT = 640;
const CENTER_SCALE_DESKTOP = 1.68;
const CENTER_SCALE_MOBILE = 1.25;

const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
  "<filter id='grain'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/>" +
  '</filter>' +
  "<rect width='200' height='200' filter='url(#grain)' opacity='0.08'/>" +
  '</svg>';

const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

type Role = 'center' | 'left' | 'right' | 'back';

function roleFor(index: number, activeIndex: number): Role {
  if (index === activeIndex) return 'center';
  if (index === (activeIndex + 3) % IMAGES.length) return 'left';
  if (index === (activeIndex + 1) % IMAGES.length) return 'right';
  return 'back';
}

/** Where each role sits, in viewport units — the geometry the original layout described. */
type RoleTarget = {
  height: number;
  bottom: number;
  centerX: number;
  blur: number;
  opacity: number;
  zIndex: number;
};

/** The box every item actually occupies; roles are reached from here by transform alone. */
const BASE_BOX = {
  desktop: { height: 92, bottom: 0 },
  mobile: { height: 60, bottom: 22 },
};

const ROLE_TARGETS: Record<'desktop' | 'mobile', Record<Role, RoleTarget>> = {
  desktop: {
    center: { height: 92, bottom: 0, centerX: 50, blur: 0, opacity: 1, zIndex: 20 },
    left: { height: 28, bottom: 12, centerX: 30, blur: 2, opacity: 0.85, zIndex: 10 },
    right: { height: 28, bottom: 12, centerX: 70, blur: 2, opacity: 0.85, zIndex: 10 },
    back: { height: 22, bottom: 12, centerX: 50, blur: 4, opacity: 1, zIndex: 5 },
  },
  mobile: {
    center: { height: 60, bottom: 22, centerX: 50, blur: 0, opacity: 1, zIndex: 20 },
    left: { height: 16, bottom: 32, centerX: 20, blur: 2, opacity: 0.85, zIndex: 10 },
    right: { height: 16, bottom: 32, centerX: 80, blur: 2, opacity: 0.85, zIndex: 10 },
    back: { height: 13, bottom: 32, centerX: 50, blur: 4, opacity: 1, zIndex: 5 },
  },
};

function itemStyle(role: Role, isMobile: boolean, desktopScale: number): CSSProperties {
  const mode = isMobile ? 'mobile' : 'desktop';
  const box = BASE_BOX[mode];
  const target = ROLE_TARGETS[mode][role];

  // Size and position never change: only transform/filter/opacity animate, so the
  // browser keeps the whole crossfade on the compositor instead of relaying out.
  const scale =
    role === 'center'
      ? isMobile
        ? CENTER_SCALE_MOBILE
        : desktopScale
      : target.height / box.height;
  const offsetX = target.centerX - 50;
  const offsetY = box.bottom + box.height / 2 - (target.bottom + target.height / 2);

  return {
    position: 'absolute',
    left: '50%',
    bottom: `${box.bottom}%`,
    height: `${box.height}%`,
    aspectRatio: '0.6 / 1',
    transform: `translateX(calc(-50% + ${offsetX}vw)) translateY(${offsetY}vh) scale(${scale})`,
    // The centre grows upward from the floor, so scaling it up never pushes the
    // product out of frame; the other roles keep scaling about their own middle.
    transformOrigin: role === 'center' ? 'bottom center' : 'center',
    // The blur is rasterised before the scale, so divide it to keep the on-screen radius.
    filter: `blur(${(target.blur / scale).toFixed(2)}px)`,
    opacity: target.opacity,
    zIndex: target.zIndex,
    transition: `transform ${DURATION}ms ${EASE}, filter ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}`,
    willChange: 'transform, filter, opacity',
  };
}

type NavButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function NavButton({ label, onClick, children }: NavButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16"
      style={{
        backgroundColor: hovered ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
        border: '2px solid #ffffff',
        color: '#ffffff',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 150ms, background-color 150ms',
      }}
    >
      {children}
    </button>
  );
}

export default function ToonhubHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    IMAGES.forEach(({ src }) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) =>
        direction === 'next'
          ? (prev + 1) % IMAGES.length
          : (prev + IMAGES.length - 1) % IMAGES.length,
      );
      window.setTimeout(() => setIsAnimating(false), DURATION);
    },
    [isAnimating],
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: `background-color ${DURATION}ms ${EASE}`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 50,
            backgroundImage: GRAIN_URL,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.4,
          }}
        />

        {/* Giant ghost text */}
        <div
          className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center"
          style={{ zIndex: 2, top: '18%' }}
        >
          <span
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(80px, 23vw, 380px)',
              fontWeight: 900,
              color: '#ffffff',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            Go Farther
          </span>
        </div>

        {/* Brand label */}
        <div
          className="absolute left-4 top-6 text-xs font-semibold uppercase sm:left-8"
          style={{ zIndex: 60, color: '#ffffff', opacity: 0.9, letterSpacing: '0.18em' }}
        >
          NORTIV 8
        </div>

        {/* Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, index) => (
            <div
              key={item.src}
              style={itemStyle(
                roleFor(index, activeIndex),
                isMobile,
                item.desktopScale ?? CENTER_SCALE_DESKTOP,
              )}
            >
              <img
                src={item.src}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom-left copy + nav */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <p
            className="mb-2 text-base font-bold uppercase tracking-widest sm:mb-3 sm:text-[22px]"
            style={{ color: '#ffffff', opacity: 0.95, letterSpacing: '0.02em' }}
          >
            NORTIV 8 METROSTRIKE
          </p>
          <p
            className="mb-4 hidden text-xs sm:mb-5 sm:block sm:text-sm"
            style={{ color: '#ffffff', opacity: 0.85, lineHeight: 1.6 }}
          >
            Built tough for every adventure. Rugged traction, all-day comfort and a look that keeps
            working long past the trailhead. Go farther in the Metrostrike.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <NavButton label="Previous boot" onClick={() => navigate('prev')}>
              <ArrowLeft size={26} strokeWidth={2.25} />
            </NavButton>
            <NavButton label="Next boot" onClick={() => navigate('next')}>
              <ArrowRight size={26} strokeWidth={2.25} />
            </NavButton>
          </div>
        </div>

        {/* Bottom-right link */}
        <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10" style={{ zIndex: 60 }}>
          <a
            href="#"
            className="flex items-center"
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              color: '#ffffff',
              opacity: linkHovered ? 1 : 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 200ms',
            }}
          >
            Shop now
            <ArrowRight className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </div>
  );
}
