import styles from '../styles/SearchLoading.module.css';
import ProductSmLoading from './ProductSmLoading';

export default function SearchLoading() {
  return (
    <div className={styles.loadingContainer}>
      <ProductSmLoading />
      <ProductSmLoading />
      <ProductSmLoading />
      <ProductSmLoading />
      <ProductSmLoading />
    </div>
  )
}