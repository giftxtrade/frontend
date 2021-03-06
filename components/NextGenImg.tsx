export interface INextGenSources {
  srcSet: string
  type: "image/avif" | "image/webp"
  orientation?: "landscape" | "portrait"
}

export interface INextGenImgProps {
  src: string
  className?: string
  id?: string
  alt?: string
  loading?: "lazy" | "eager"
  title?: string
  nextGenSources?: INextGenSources[]
}

const Source = ({ srcSet, type, orientation }: INextGenSources) => (
  <source
    srcSet={srcSet}
    type={type}
    media={`(orientation: ${orientation ? orientation : "landscape"})`}
  />
)

const NextGenImg = ({
  src,
  className,
  id,
  alt,
  loading,
  title,
  nextGenSources,
}: INextGenImgProps) => {
  return (
    <picture>
      {nextGenSources?.map((s, i) => (
        <Source
          srcSet={s.srcSet}
          type={s.type}
          orientation={s.orientation}
          key={`source#${i}`}
        />
      ))}

      <img
        src={src}
        className={className}
        id={id}
        alt={alt}
        title={title}
        loading={loading}
      />
    </picture>
  )
}

export default NextGenImg
