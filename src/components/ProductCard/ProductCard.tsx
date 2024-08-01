import Image from 'next/image'

import styles from './ProductCard.module.scss'
// import { Product } from '../../hooks/interfaces/Products'

const ProductCard = ({ imageUrl, name, description, price }: any) => {
  return (
    <div className={styles.container}>
      <Image src={imageUrl} alt={name} className={styles.logo} width={150} height={300} priority />
      <h1>
        {name}
        {price}
      </h1>
      <p>{description}</p>
    </div>
  )
}

export default ProductCard
