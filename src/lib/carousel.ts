const TOLERANCE = 1;

export interface CarouselState {
  start: boolean;
  end: boolean;
  progress: number;
}

export function carouselStops(offsets: number[], maximum: number) {
  const stops = [0];
  for (const offset of [...offsets, maximum]) {
    const position = Math.max(0, Math.min(offset, maximum));
    if (position - stops[stops.length - 1] > TOLERANCE) stops.push(position);
  }
  return stops;
}

export function adjacentStop(
  stops: number[],
  position: number,
  direction: number,
) {
  return direction > 0
    ? (stops.find((stop) => stop > position + TOLERANCE) ??
        stops[stops.length - 1])
    : ([...stops].reverse().find((stop) => stop < position - TOLERANCE) ?? 0);
}

export function carouselState(
  position: number,
  maximum: number,
): CarouselState {
  const left = Math.max(0, Math.min(position, maximum));
  const end = maximum - left <= TOLERANCE;
  return { start: left <= TOLERANCE, end, progress: end ? 1 : left / maximum };
}

export function connectCarousel(
  track: HTMLElement,
  update: (state: CarouselState) => void,
) {
  let stops: number[] = [];
  let maximum = 0;
  let viewport = 0;
  let destination: number | null = null;
  let frame = 0;
  const cards = Array.from(track.children) as HTMLElement[];
  const nearestIndex = (position: number) =>
    stops.reduce(
      (best, stop, index) =>
        Math.abs(stop - position) < Math.abs(stops[best] - position)
          ? index
          : best,
      0,
    );
  const sync = () => {
    update(carouselState(track.scrollLeft, maximum));
    if (
      destination !== null &&
      Math.abs(track.scrollLeft - destination) <= TOLERANCE
    )
      destination = null;
  };
  const measure = () => {
    const anchor = stops.length
      ? nearestIndex(destination ?? track.scrollLeft)
      : 0;
    const bounds = track.getBoundingClientRect();
    const nextMaximum = Math.max(0, track.scrollWidth - track.clientWidth);
    const nextStops = carouselStops(
      cards.map(
        (card) =>
          card.getBoundingClientRect().left -
          bounds.left -
          track.clientLeft +
          track.scrollLeft,
      ),
      nextMaximum,
    );
    const changed =
      viewport !== track.clientWidth ||
      maximum !== nextMaximum ||
      nextStops.length !== stops.length ||
      nextStops.some((stop, index) => Math.abs(stop - stops[index]) > 0.1);
    const initialized = stops.length > 0;
    stops = nextStops;
    maximum = nextMaximum;
    viewport = track.clientWidth;
    if (changed && initialized) {
      destination = null;
      track.scrollTo({
        left: stops[Math.min(anchor, stops.length - 1)],
        behavior: "instant",
      });
    }
    sync();
  };
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      sync();
    });
  };
  const manual = () => {
    destination = null;
  };
  const observer = new ResizeObserver(measure);
  observer.observe(track);
  cards.forEach((card) => observer.observe(card));
  track.addEventListener("scroll", onScroll, { passive: true });
  track.addEventListener("scrollend", manual);
  track.addEventListener("pointerdown", manual, { passive: true });
  track.addEventListener("touchstart", manual, { passive: true });
  track.addEventListener("wheel", manual, { passive: true });
  track.addEventListener("keydown", manual);
  window.addEventListener("resize", measure);
  measure();
  return {
    move(direction: number) {
      destination = adjacentStop(
        stops,
        destination ?? track.scrollLeft,
        direction,
      );
      track.scrollTo({
        left: destination,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    },
    dispose() {
      observer.disconnect();
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", manual);
      track.removeEventListener("pointerdown", manual);
      track.removeEventListener("touchstart", manual);
      track.removeEventListener("wheel", manual);
      track.removeEventListener("keydown", manual);
      window.removeEventListener("resize", measure);
    },
  };
}
