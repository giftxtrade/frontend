import styles from '../styles/PhoneHolder.module.css'

export interface IPhoneHolderProps {
  video: string
}

export default function PhoneHolder({ video }: IPhoneHolderProps) {
  return (
    <div className={styles.phoneHolder}>
      <video
        loop
        muted
        disablePictureInPicture
        disableRemotePlayback
        autoPlay
        playsInline
        preload="none"
      >
        <source src={video} />
      </video>
    </div>
  );
}