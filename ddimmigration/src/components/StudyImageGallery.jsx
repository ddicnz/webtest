import { useCallback, useEffect, useState } from 'react'

const VISIBLE_COUNT = 3

function Lightbox({ list, activeIndex, setActiveIndex, close, altFor, captions }) {
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? list.length - 1 : i - 1))
  }, [list.length, setActiveIndex])
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i >= list.length - 1 ? 0 : i + 1))
  }, [list.length, setActiveIndex])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [close, showPrev, showNext])

  return (
    <div
      className="study-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="图片浏览"
      onClick={close}
    >
      <button type="button" className="study-lightbox-close" onClick={close} aria-label="关闭">
        ×
      </button>
      <div className="study-lightbox-stage" onClick={(e) => e.stopPropagation()}>
        {list.length > 1 && (
          <button
            type="button"
            className="study-lightbox-nav study-lightbox-prev"
            onClick={showPrev}
            aria-label="上一张"
          >
            ‹
          </button>
        )}
        <img
          src={list[activeIndex]}
          alt={altFor(activeIndex)}
          className="study-lightbox-image"
        />
        {list.length > 1 && (
          <button
            type="button"
            className="study-lightbox-nav study-lightbox-next"
            onClick={showNext}
            aria-label="下一张"
          >
            ›
          </button>
        )}
        {list.length > 1 && (
          <span className="study-lightbox-counter">
            {activeIndex + 1} / {list.length}
          </span>
        )}
        {captions[activeIndex] && (
          <p className="study-lightbox-caption">{captions[activeIndex]}</p>
        )}
      </div>
    </div>
  )
}

/**
 * @param {{ images: string[], title?: string, captions?: string[], layout?: 'grid' | 'cover' | 'carousel', coverIndex?: number }} props
 */
function StudyImageGallery({
  images,
  title = '',
  captions = [],
  layout = 'grid',
  coverIndex = 0,
}) {
  const list = (images || []).filter(Boolean)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [carouselStart, setCarouselStart] = useState(() =>
    Math.min(Math.max(coverIndex, 0), Math.max(0, (images || []).filter(Boolean).length - 1)),
  )
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  if (list.length === 0) return null

  const altFor = (i) => captions[i] || (title ? `${title} ${i + 1}` : `图片 ${i + 1}`)

  const showCarouselPrev = () => {
    setCarouselStart((s) => (s <= 0 ? list.length - 1 : s - 1))
  }
  const showCarouselNext = () => {
    setCarouselStart((s) => (s >= list.length - 1 ? 0 : s + 1))
  }

  const visibleSlots = Math.min(VISIBLE_COUNT, list.length)
  const visibleIndices = Array.from({ length: visibleSlots }, (_, offset) =>
    (carouselStart + offset) % list.length,
  )
  if (layout === 'carousel') {
    const lastSlot = visibleIndices.length - 1
    return (
      <div className="study-gallery-carousel-block">
        <div className="study-gallery-carousel study-gallery-carousel--uniform" aria-label={`${title}照片浏览`}>
          <div className="study-gallery-carousel-track">
            {visibleIndices.map((imgIndex, slot) => (
              <div
                key={`${list[imgIndex]}-${imgIndex}-${slot}`}
                className={`study-gallery-carousel-item${imgIndex === coverIndex ? ' study-gallery-carousel-item--poster' : ''}`}
              >
                {list.length > 1 && slot === 0 && (
                  <button
                    type="button"
                    className="study-carousel-nav study-carousel-prev"
                    onClick={showCarouselPrev}
                    aria-label="上一张"
                  >
                    ‹
                  </button>
                )}
                <div className="study-gallery-carousel-media">
                  <img src={list[imgIndex]} alt={altFor(imgIndex)} loading={slot === 0 ? 'eager' : 'lazy'} />
                </div>
                {list.length > 1 && slot === lastSlot && (
                  <button
                    type="button"
                    className="study-carousel-nav study-carousel-next"
                    onClick={showCarouselNext}
                    aria-label="下一张"
                  >
                    ›
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const safeCover = Math.min(Math.max(coverIndex, 0), list.length - 1)

  if (layout === 'cover') {
    return (
      <div className="study-gallery-cover-block">
        <p className="study-gallery-hint">点击封面浏览全部照片，可使用左右按钮切换</p>
        <button
          type="button"
          className="study-gallery-cover"
          onClick={() => setLightboxIndex(safeCover)}
          aria-label={`浏览${title || ''}照片`}
        >
          <img src={list[safeCover]} alt={altFor(safeCover)} loading="eager" />
        </button>
        {lightboxIndex != null && (
          <Lightbox
            list={list}
            activeIndex={lightboxIndex}
            setActiveIndex={setLightboxIndex}
            close={closeLightbox}
            altFor={altFor}
            captions={captions}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <p className="study-gallery-hint">点击图片可放大浏览，支持左右切换</p>
      <div className="study-gallery-grid" role="list">
        {list.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            className="study-gallery-thumb"
            onClick={() => setLightboxIndex(i)}
            aria-label={`查看大图：${altFor(i)}`}
          >
            <img src={src} alt={altFor(i)} loading="lazy" />
          </button>
        ))}
      </div>
      {lightboxIndex != null && (
        <Lightbox
          list={list}
          activeIndex={lightboxIndex}
          setActiveIndex={setLightboxIndex}
          close={closeLightbox}
          altFor={altFor}
          captions={captions}
        />
      )}
    </>
  )
}

export default StudyImageGallery
